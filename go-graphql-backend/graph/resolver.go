package graph

import "github.com/gorilla/sessions"

type Resolver struct {
	SessionStore sessions.Store
}
