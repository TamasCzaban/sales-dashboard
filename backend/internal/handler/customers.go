package handler

import (
	"net/http"
	"strconv"

	"github.com/czdev/sales-dashboard/backend/internal/store"
	"github.com/czdev/sales-dashboard/backend/pkg/response"
)

func Customers(s store.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		top := 10
		if v := r.URL.Query().Get("top"); v != "" {
			if n, err := strconv.Atoi(v); err == nil && n > 0 {
				top = n
			}
		}
		insights := s.GetCustomerInsights(top)
		response.JSON(w, http.StatusOK, insights)
	}
}
