import { useSalesData } from "../hooks/useSalesData";
import RevenueTrendChart from "../components/RevenueTrendChart";
import ProductBreakdownChart from "../components/ProductBreakdownChart";
import ChurnSignalsChart from "../components/ChurnSignalsChart";

function DashboardPage() {
  const { revenue, products, churn, loading, error } = useSalesData();

  if (loading) {
    return <p className="text-gray-500">Loading analytics...</p>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>
    );
  }

  const hasData =
    (revenue?.periods.length ?? 0) > 0 ||
    (products?.products.length ?? 0) > 0;

  if (!hasData) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No data yet.</p>
        <p>Upload a CSV file to see your analytics.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Sales Analytics
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
          <RevenueTrendChart data={revenue?.periods ?? []} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Product Breakdown</h2>
          <ProductBreakdownChart data={products?.products ?? []} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Churn Signals</h2>
          <ChurnSignalsChart
            customers={churn?.customers ?? []}
            summary={churn?.summary ?? null}
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
