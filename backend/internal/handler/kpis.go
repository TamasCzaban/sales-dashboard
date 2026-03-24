package handler

import (
	"net/http"

	"github.com/czdev/sales-dashboard/backend/internal/store"
	"github.com/czdev/sales-dashboard/backend/pkg/response"
)

func KPIs(s store.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		kpis := s.GetKPIs()
		response.JSON(w, http.StatusOK, kpis)
	}
}
