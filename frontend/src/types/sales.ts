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
