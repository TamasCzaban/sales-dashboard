import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Plot from "react-plotly.js";
import { getCustomerInsights } from "../api/client";
import type { CustomerInsights } from "../types/sales";

function CustomerInsightsPage() {
  const [data, setData] = useState<CustomerInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCustomerInsights({ top: 15 })
      .then((res) => {
        if (res.error) setError(res.error);
        else setData(res.data);
      })
      .catch(() => setError("Failed to load customer insights"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-400 py-12 text-center">Loading...</p>;
  }
  if (error) {
    return <p className="text-red-500 py-12 text-center">{error}</p>;
  }
  if (!data || data.total_customers === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 mb-4">No data yet.</p>
        <Link to="/upload" className="text-blue-600 hover:underline text-sm">
          Upload a CSV to get started →
        </Link>
      </div>
    );
  }

  const topN = data.top_customers.slice(0, 10);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer Insights</h1>
        <p className="text-gray-500 text-sm mt-1">Who's buying — frequency, value, and loyalty</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-gray-900">{data.total_customers}</p>
          <p className="text-sm text-gray-500 mt-1">Total Customers</p>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-blue-600">{data.returning_customers}</p>
          <p className="text-sm text-gray-500 mt-1">Returning (2+ orders)</p>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-amber-500">{data.new_customers}</p>
          <p className="text-sm text-gray-500 mt-1">Single-Purchase</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* New vs Returning donut */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-700 mb-2">New vs Returning</h2>
          <Plot
            data={[
              {
                values: [data.returning_customers, data.new_customers],
                labels: ["Returning", "Single-Purchase"],
                type: "pie",
                hole: 0.5,
                marker: { colors: ["#3b82f6", "#f59e0b"] },
                textinfo: "label+percent",
              },
            ]}
            layout={{
              autosize: true,
              margin: { l: 20, r: 20, t: 20, b: 20 },
              showlegend: false,
            }}
            useResizeHandler
            style={{ width: "100%", height: "260px" }}
          />
        </div>

        {/* Top customers bar */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-700 mb-2">Top Customers by Revenue</h2>
          <Plot
            data={[
              {
                x: topN.map((c) => c.total_revenue),
                y: topN.map((c) => c.customer_id),
                type: "bar",
                orientation: "h",
                marker: { color: "#3b82f6" },
              },
            ]}
            layout={{
              autosize: true,
              margin: { l: 90, r: 20, t: 10, b: 40 },
              xaxis: { title: { text: "Revenue ($)" } },
              yaxis: { autorange: "reversed" },
              showlegend: false,
            }}
            useResizeHandler
            style={{ width: "100%", height: "260px" }}
          />
        </div>
      </div>

      {/* Customer table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-700">Top Customers</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer ID
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Revenue
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Order
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Order
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {data.top_customers.map((c) => (
                <tr key={c.customer_id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{c.customer_id}</td>
                  <td className="px-6 py-3 text-sm text-right text-gray-700">
                    ${c.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-gray-700">{c.order_count}</td>
                  <td className="px-6 py-3 text-sm text-right text-gray-700">
                    ${c.avg_order_value.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-gray-400">{c.last_order_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CustomerInsightsPage;
