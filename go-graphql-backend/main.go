package main

import (
	"context"
	"io/fs"

	"embed"
	"log"
	"net/http"
	"os"
	"time"

	"githib.com/tmc/d2lab/go-graphql-server/graph"
	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/gorilla/websocket"
	"github.com/joho/godotenv"
	"github.com/ravilushqa/otelgqlgen"
	"github.com/rs/cors"
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
)

//go:embed frontend-build
var assetsFS embed.FS

func main() {
	ctx := context.Background()
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	// load dotenv
	if err := godotenv.Load(); err != nil {
		log.Println("issue loading .env file:", err)
	}

	// init github oauth
	initializeGithubOauthConfig()

	// Set up tracing.
	shutdown, err := initOtelProvider()
	if err != nil {
		log.Fatal(err)
	}
	defer shutdown(ctx)

	router := chi.NewRouter()

	// Middleware setup
	router.Use(
		middleware.RequestID,
		middleware.RealIP,
		//middleware.Recoverer,
		middleware.Logger,
	)

	// GraphQL setup
	resolver := &graph.Resolver{
		SessionStore: sessionStore,
	}
	s := graph.NewExecutableSchema(graph.Config{Resolvers: resolver})
	srv := newServer(s)
	srv.Use(otelgqlgen.Middleware())

	assets, err := fs.Sub(assetsFS, "frontend-build")
	if err != nil {
		log.Println(err)
	}

	router.Handle("/graphql", reqctx(otelhttp.NewHandler(srv, "graphql")))

	router.HandleFunc("/render.png", handleRender)
	router.HandleFunc("/render.svg", handleRender)
	// github urls
	router.HandleFunc("/login/github", handleGitHubLogin)
	router.HandleFunc("/callback/github", handleGitHubCallback)
	router.HandleFunc("/auth/github", handleGitHubAuthCode)

	cors := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"*"},
		AllowedHeaders:   []string{"*"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		// Debug:            true,
	})

	log.Printf("Listening on localhost:%s", port)
	//log.Fatal(http.ListenAndServe(":"+port, http.FileServer(http.FS(assets))))

	router.NotFound(func(w http.ResponseWriter, r *http.Request) {
		http.FileServer(http.FS(assets)).ServeHTTP(w, r)
	})
	log.Fatal(http.ListenAndServe(":"+port, cors.Handler(router)))
}

// Largely copied from handler.NewDefaultServer but with relaxed CORS settings.
func newServer(es graphql.ExecutableSchema) *handler.Server {
	srv := handler.New(es)
	srv.AddTransport(&transport.Websocket{
		KeepAlivePingInterval: 10 * time.Second,
		Upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
	})
	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})
	srv.AddTransport(transport.MultipartForm{})

	srv.SetQueryCache(lru.New(1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New(100),
	})

	return srv
}

// reqctx puts the http request into the context
func reqctx(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		ctx = context.WithValue(ctx, "request", r)
		r = r.WithContext(ctx)
		h.ServeHTTP(w, r)
	})
}
