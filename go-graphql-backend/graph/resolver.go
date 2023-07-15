package graph

import "github.com/gorilla/sessions"

type Resolver struct {
	sessionStore sessions.Store
}
