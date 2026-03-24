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

type KPISummary struct {
	TotalRevenue     float64 `json:"total_revenue"`
	TotalOrders      int     `json:"total_orders"`
	AvgOrderValue    float64 `json:"avg_order_value"`
	UniqueCustomers  int     `json:"unique_customers"`
	RevenueThisMonth float64 `json:"revenue_this_month"`
	RevenueLastMonth float64 `json:"revenue_last_month"`
	RevenueGrowth    float64 `json:"revenue_growth"`
}

type CustomerSummary struct {
	CustomerID    string  `json:"customer_id"`
	TotalRevenue  float64 `json:"total_revenue"`
	OrderCount    int     `json:"order_count"`
	AvgOrderValue float64 `json:"avg_order_value"`
	LastOrderDate string  `json:"last_order_date"`
}

type CustomerInsights struct {
	TopCustomers   []CustomerSummary `json:"top_customers"`
	NewCustomers   int               `json:"new_customers"`
	Returning      int               `json:"returning_customers"`
	TotalCustomers int               `json:"total_customers"`
}

type ProductPricing struct {
	Product      string  `json:"product"`
	AvgUnitPrice float64 `json:"avg_unit_price"`
	MinUnitPrice float64 `json:"min_unit_price"`
	MaxUnitPrice float64 `json:"max_unit_price"`
	TotalRevenue float64 `json:"total_revenue"`
	TotalOrders  int     `json:"total_orders"`
	AvgDiscount  float64 `json:"avg_discount"`
}

type PricingInsights struct {
	Products    []ProductPricing `json:"products"`
	AvgDiscount float64          `json:"avg_discount"`
}
