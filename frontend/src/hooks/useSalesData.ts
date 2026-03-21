import { useEffect, useState } from "react";
import { getRevenueTrend, getProductBreakdown, getChurnSignals } from "../api/client";
import type { RevenueData, ProductsData, ChurnData } from "../types/sales";

export function useSalesData() {
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [products, setProducts] = useState<ProductsData | null>(null);
  const [churn, setChurn] = useState<ChurnData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [revRes, prodRes, churnRes] = await Promise.all([
        getRevenueTrend(),
        getProductBreakdown(),
        getChurnSignals(),
      ]);
      setRevenue(revRes.data);
      setProducts(prodRes.data);
      setChurn(churnRes.data);
    } catch {
      setError("Failed to load analytics. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return { revenue, products, churn, loading, error, refetch: fetchAll };
}
