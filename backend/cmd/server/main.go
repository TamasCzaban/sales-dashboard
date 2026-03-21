package main

import (
	"fmt"
	"log"
	"net/http"

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

	port := ":8080"
	fmt.Printf("Server running on http://localhost%s\n", port)
	log.Fatal(http.ListenAndServe(port, r))
}
