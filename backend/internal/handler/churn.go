package handler

import (
	"net/http"
	"strconv"

	"github.com/czdev/sales-dashboard/backend/internal/store"
	"github.com/czdev/sales-dashboard/backend/pkg/response"
)

func Churn(s store.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		windowStr := r.URL.Query().Get("window_days")
		windowDays := 30
		if windowStr != "" {
			windowDays, _ = strconv.Atoi(windowStr)
		}

		customers, summary := s.GetChurnSignals(windowDays)

		response.JSON(w, http.StatusOK, map[string]interface{}{
			"customers": customers,
			"summary":   summary,
		})
	}
}
