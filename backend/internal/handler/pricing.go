package handler

import (
	"net/http"

	"github.com/czdev/sales-dashboard/backend/internal/store"
	"github.com/czdev/sales-dashboard/backend/pkg/response"
)

func Pricing(s store.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		insights := s.GetPricingInsights()
		response.JSON(w, http.StatusOK, insights)
	}
}
