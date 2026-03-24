package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/czdev/sales-dashboard/backend/internal/handler"
	"github.com/czdev/sales-dashboard/backend/internal/middleware"
	"github.com/czdev/sales-dashboard/backend/internal/store"
	"github.com/czdev/sales-dashboard/backend/pkg/response"
	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
)

func main() {
	s := store.NewMemoryStore()

	r := chi.NewRouter()
	r.Use(chimw.Logger)
	r.Use(chimw.Recoverer)
	r.Use(middleware.CORS())

	r.Get("/api/v1/health", func(w http.ResponseWriter, r *http.Request) {
		response.JSON(w, http.StatusOK, map[string]string{"status": "ok"})
	})

	r.Post("/api/v1/upload", handler.Upload(s))
	r.Get("/api/v1/analytics/revenue", handler.Revenue(s))
	r.Get("/api/v1/analytics/products", handler.Products(s))
	r.Get("/api/v1/analytics/churn", handler.Churn(s))
	r.Get("/api/v1/analytics/kpis", handler.KPIs(s))
	r.Get("/api/v1/analytics/customers", handler.Customers(s))
	r.Get("/api/v1/analytics/pricing", handler.Pricing(s))

	// Serve frontend static files
	staticDir := os.Getenv("STATIC_DIR")
	if staticDir == "" {
		staticDir = "./static"
	}
	fileServer := http.FileServer(http.Dir(staticDir))
	r.Get("/*", func(w http.ResponseWriter, r *http.Request) {
		path := filepath.Join(staticDir, r.URL.Path)
		// If the file exists and isn't a directory, serve it directly
		if info, err := os.Stat(path); err == nil && !info.IsDir() {
			// Set cache headers for assets
			if strings.HasPrefix(r.URL.Path, "/assets/") {
				w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
			}
			fileServer.ServeHTTP(w, r)
			return
		}
		// SPA fallback: serve index.html for all other routes
		http.ServeFile(w, r, filepath.Join(staticDir, "index.html"))
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Printf("Server running on http://localhost:%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
