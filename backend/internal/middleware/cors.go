package middleware

import (
	"net/http"
	"os"

	"github.com/go-chi/cors"
)

func CORS() func(http.Handler) http.Handler {
	origins := []string{"http://localhost:5173", "http://localhost:3000"}
	if extra := os.Getenv("ALLOWED_ORIGINS"); extra != "" {
		origins = append(origins, extra)
	}
	return cors.Handler(cors.Options{
		AllowedOrigins:   origins,
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type"},
		AllowCredentials: false,
		MaxAge:           300,
	})
}
