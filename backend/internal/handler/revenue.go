package handler

import (
	"net/http"

	"github.com/czdev/sales-dashboard/backend/internal/store"
	"github.com/czdev/sales-dashboard/backend/pkg/response"
)

func Revenue(s store.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		from := r.URL.Query().Get("from")
		to := r.URL.Query().Get("to")
		groupBy := r.URL.Query().Get("group_by")
		if groupBy == "" {
			groupBy = "month"
		}

		periods, total := s.GetRevenueTrend(from, to, groupBy)

		response.JSON(w, http.StatusOK, map[string]interface{}{
			"periods":       periods,
			"total_revenue": total,
		})
	}
}
