package handler

import (
	"net/http"

	csvparser "github.com/czdev/sales-dashboard/backend/internal/csv"
	"github.com/czdev/sales-dashboard/backend/internal/model"
	"github.com/czdev/sales-dashboard/backend/internal/store"
	"github.com/czdev/sales-dashboard/backend/pkg/response"
)

func Upload(s store.Store) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		r.Body = http.MaxBytesReader(w, r.Body, 10<<20) // 10MB

		file, _, err := r.FormFile("file")
		if err != nil {
			response.Error(w, http.StatusBadRequest, "missing or invalid file field")
			return
		}
		defer file.Close()

		records, validationErrors := csvparser.Parse(file)
		s.SaveRecords(records)

		response.JSON(w, http.StatusOK, model.UploadResult{
			RowsImported:     len(records),
			RowsSkipped:      len(validationErrors),
			ValidationErrors: validationErrors,
		})
	}
}
