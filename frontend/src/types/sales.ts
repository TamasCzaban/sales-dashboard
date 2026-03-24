export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface SaleRecord {
  date: string;
  customer_id: string;
  product: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
}

export interface RevenuePeriod {
  period: string;
  revenue: number;
  order_count: number;
}

export interface RevenueData {
  periods: RevenuePeriod[];
  total_revenue: number;
}

export interface ProductTotal {
  product: string;
  total_revenue: number;
  total_quantity: number;
  percentage: number;
}

export interface ProductsData {
  products: ProductTotal[];
}

export interface CustomerWindow {
  period: string;
  purchases: number;
}

export interface CustomerFrequency {
  customer_id: string;
  windows: CustomerWindow[];
  trend: "declining" | "stable" | "growing";
}

export interface ChurnSummary {
  total_customers: number;
  declining: number;
  stable: number;
  growing: number;
}

export interface ChurnData {
  customers: CustomerFrequency[];
  summary: ChurnSummary;
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export interface UploadResult {
  rows_imported: number;
  rows_skipped: number;
  validation_errors: ValidationError[];
}

export interface KPISummary {
  total_revenue: number;
  total_orders: number;
  avg_order_value: number;
  unique_customers: number;
  revenue_this_month: number;
  revenue_last_month: number;
  revenue_growth: number;
}

export interface CustomerSummary {
  customer_id: string;
  total_revenue: number;
  order_count: number;
  avg_order_value: number;
  last_order_date: string;
}

export interface CustomerInsights {
  top_customers: CustomerSummary[];
  new_customers: number;
  returning_customers: number;
  total_customers: number;
}

export interface ProductPricing {
  product: string;
  avg_unit_price: number;
  min_unit_price: number;
  max_unit_price: number;
  total_revenue: number;
  total_orders: number;
  avg_discount: number;
}

export interface PricingInsights {
  products: ProductPricing[];
  avg_discount: number;
}
