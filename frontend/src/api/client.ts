import axios from "axios";
import type {
  ApiResponse,
  UploadResult,
  RevenueData,
  ProductsData,
  ChurnData,
  KPISummary,
  CustomerInsights,
  PricingInsights,
} from "../types/sales";

const api = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
});

export async function uploadCSV(file: File): Promise<ApiResponse<UploadResult>> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post<ApiResponse<UploadResult>>("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getRevenueTrend(params?: {
  from?: string;
  to?: string;
  group_by?: string;
}): Promise<ApiResponse<RevenueData>> {
  const { data } = await api.get<ApiResponse<RevenueData>>("/analytics/revenue", { params });
  return data;
}

export async function getProductBreakdown(params?: {
  top?: number;
  sort_by?: string;
}): Promise<ApiResponse<ProductsData>> {
  const { data } = await api.get<ApiResponse<ProductsData>>("/analytics/products", { params });
  return data;
}

export async function getChurnSignals(params?: {
  window_days?: number;
}): Promise<ApiResponse<ChurnData>> {
  const { data } = await api.get<ApiResponse<ChurnData>>("/analytics/churn", { params });
  return data;
}

export async function getKPIs(): Promise<ApiResponse<KPISummary>> {
  const { data } = await api.get<ApiResponse<KPISummary>>("/analytics/kpis");
  return data;
}

export async function getCustomerInsights(params?: {
  top?: number;
}): Promise<ApiResponse<CustomerInsights>> {
  const { data } = await api.get<ApiResponse<CustomerInsights>>("/analytics/customers", { params });
  return data;
}

export async function getPricingInsights(): Promise<ApiResponse<PricingInsights>> {
  const { data } = await api.get<ApiResponse<PricingInsights>>("/analytics/pricing");
  return data;
}
