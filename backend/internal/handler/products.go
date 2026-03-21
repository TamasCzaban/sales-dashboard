package handler

import (
	"net/http"
	"strconv"

	"github.com/czdev/sales-dashboard/backend/internal/store"
	"github.com/czdev/sales-dashboard/backend/pkg/response"
)

func Products(s store.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		topStr := r.URL.Query().Get("top")
		top := 0
		if topStr != "" {
			top, _ = strconv.Atoi(topStr)
		}

		sortBy := r.URL.Query().Get("sort_by")
		if sortBy == "" {
			sortBy = "revenue"
		}

		products := s.GetProductBreakdown(top, sortBy)

		response.JSON(w, http.StatusOK, map[string]interface{}{
			"products": products,
		})
	}
}
