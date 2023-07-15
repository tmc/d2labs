package main

import (
	"os"

	"github.com/gorilla/sessions"
)

// TODO: back with redis or db
var sessionStore = sessions.NewCookieStore([]byte(os.Getenv("SESSION_KEY")))
