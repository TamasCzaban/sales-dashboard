package model

import "time"

type SaleRecord struct {
	Date        time.Time `json:"date"`
	CustomerID  string    `json:"customer_id"`
	Product     string    `json:"product"`
	Quantity    int       `json:"quantity"`
	UnitPrice   float64   `json:"unit_price"`
	TotalAmount float64   `json:"total_amount"`
}

type RevenuePeriod struct {
	Period     string  `json:"period"`
	Revenue    float64 `json:"revenue"`
	OrderCount int     `json:"order_count"`
}

type ProductTotal struct {
	Product       string  `json:"product"`
	TotalRevenue  float64 `json:"total_revenue"`
	TotalQuantity int     `json:"total_quantity"`
	Percentage    float64 `json:"percentage"`
}

type CustomerWindow struct {
	Period    string `json:"period"`
	Purchases int    `json:"purchases"`
}

type CustomerFrequency struct {
	CustomerID string           `json:"customer_id"`
	Windows    []CustomerWindow `json:"windows"`
	Trend      string           `json:"trend"`
}

type ChurnSummary struct {
	TotalCustomers int `json:"total_customers"`
	Declining      int `json:"declining"`
	Stable         int `json:"stable"`
	Growing        int `json:"growing"`
}

type UploadResult struct {
	RowsImported     int               `json:"rows_imported"`
	RowsSkipped      int               `json:"rows_skipped"`
	ValidationErrors []ValidationError `json:"validation_errors"`
}

type ValidationError struct {
	Row     int    `json:"row"`
	Field   string `json:"field"`
	Message string `json:"message"`
}
