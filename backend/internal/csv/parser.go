package csv

import (
	"encoding/csv"
	"fmt"
	"io"
	"strconv"
	"time"

	"github.com/czdev/sales-dashboard/backend/internal/model"
)

var expectedHeaders = []string{"date", "customer_id", "product", "quantity", "unit_price", "total_amount"}

func Parse(r io.Reader) ([]model.SaleRecord, []model.ValidationError) {
	reader := csv.NewReader(r)

	headers, err := reader.Read()
	if err != nil {
		return nil, []model.ValidationError{{Row: 0, Field: "headers", Message: "failed to read CSV headers"}}
	}

	if len(headers) != len(expectedHeaders) {
		return nil, []model.ValidationError{{Row: 0, Field: "headers", Message: fmt.Sprintf("expected %d columns, got %d", len(expectedHeaders), len(headers))}}
	}

	var records []model.SaleRecord
	var errors []model.ValidationError
	row := 1

	for {
		line, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			errors = append(errors, model.ValidationError{Row: row, Field: "row", Message: err.Error()})
			row++
			continue
		}

		record, parseErr := parseLine(line, row)
		if parseErr != nil {
			errors = append(errors, *parseErr)
		} else {
			records = append(records, *record)
		}
		row++
	}

	return records, errors
}

func parseLine(fields []string, row int) (*model.SaleRecord, *model.ValidationError) {
	if len(fields) != 6 {
		return nil, &model.ValidationError{Row: row, Field: "row", Message: fmt.Sprintf("expected 6 fields, got %d", len(fields))}
	}

	date, err := time.Parse("2006-01-02", fields[0])
	if err != nil {
		return nil, &model.ValidationError{Row: row, Field: "date", Message: "invalid date format, expected YYYY-MM-DD"}
	}

	quantity, err := strconv.Atoi(fields[3])
	if err != nil {
		return nil, &model.ValidationError{Row: row, Field: "quantity", Message: "invalid integer"}
	}

	unitPrice, err := strconv.ParseFloat(fields[4], 64)
	if err != nil {
		return nil, &model.ValidationError{Row: row, Field: "unit_price", Message: "invalid number"}
	}

	totalAmount, err := strconv.ParseFloat(fields[5], 64)
	if err != nil {
		return nil, &model.ValidationError{Row: row, Field: "total_amount", Message: "invalid number"}
	}

	return &model.SaleRecord{
		Date:        date,
		CustomerID:  fields[1],
		Product:     fields[2],
		Quantity:    quantity,
		UnitPrice:   unitPrice,
		TotalAmount: totalAmount,
	}, nil
}
