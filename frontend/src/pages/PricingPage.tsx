import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Plot from "react-plotly.js";
import { getPricingInsights } from "../api/client";
import type { PricingInsights } from "../types/sales";

function PricingPage() {
  const [data, setData] = useState<PricingInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPricingInsights()
      .then((res) => {
        if (res.error) setError(res.error);
        else setData(res.data);
      })
      .catch(() => setError("Failed to load pricing insights"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-400 py-12 text-center">Loading...</p>;
  }
  if (error) {
    return <p className="text-red-500 py-12 text-center">{error}</p>;
  }
  if (!data || data.products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 mb-4">No data yet.</p>
        <Link to="/upload" className="text-blue-600 hover:underline text-sm">
          Upload a CSV to get started →
        </Link>
      </div>
    );
  }

  const products = data.products;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pricing Intelligence</h1>
        <p className="text-gray-500 text-sm mt-1">
          Price ranges, consistency, and discount patterns per product
        </p>
      </div>

      {/* Summary card */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-gray-900">{products.length}</p>
          <p className="text-sm text-gray-500 mt-1">Products</p>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 text-center">
          <p
            className={`text-3xl font-bold ${
              data.avg_discount > 0
                ? "text-amber-500"
                : data.avg_discount < 0
                ? "text-red-500"
                : "text-green-600"
            }`}
          >
            {data.avg_discount > 0 ? "-" : data.avg_discount < 0 ? "+" : ""}
            {Math.abs(data.avg_discount)}%
          </p>
          <p className="text-sm text-gray-500 mt-1">Avg Discount Applied</p>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-gray-900">
            $
            {Math.min(...products.map((p) => p.min_unit_price)).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-gray-500 mt-1">Lowest Unit Price</p>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 text-center">
          <p className="text-3xl font-bold text-gray-900">
            $
            {Math.max(...products.map((p) => p.max_unit_price)).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className="text-sm text-gray-500 mt-1">Highest Unit Price</p>
        </div>
      </div>

      {/* Price range chart */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">
          Unit Price Range by Product
        </h2>
        <Plot
          data={[
            {
              x: products.map((p) => p.product),
              y: products.map((p) => p.min_unit_price),
              type: "bar",
              name: "Min Price",
              marker: { color: "#bfdbfe" },
            },
            {
              x: products.map((p) => p.product),
              y: products.map((p) => p.avg_unit_price),
              type: "bar",
              name: "Avg Price",
              marker: { color: "#3b82f6" },
            },
            {
              x: products.map((p) => p.product),
              y: products.map((p) => p.max_unit_price),
              type: "bar",
              name: "Max Price",
              marker: { color: "#1d4ed8" },
            },
          ]}
          layout={{
            autosize: true,
            barmode: "group",
            margin: { l: 60, r: 20, t: 20, b: 80 },
            yaxis: { title: { text: "Unit Price ($)" } },
            xaxis: { tickangle: -30 },
            legend: { orientation: "h", y: -0.35 },
          }}
          useResizeHandler
          style={{ width: "100%", height: "320px" }}
        />
      </div>

      {/* Product pricing table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-700">Product Pricing Details</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Max
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Discount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.product} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{p.product}</td>
                  <td className="px-6 py-3 text-sm text-right text-gray-600">
                    ${p.min_unit_price.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-sm text-right font-medium text-gray-900">
                    ${p.avg_unit_price.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-gray-600">
                    ${p.max_unit_price.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-sm text-right">
                    <span
                      className={`font-medium ${
                        p.avg_discount > 0
                          ? "text-amber-600"
                          : p.avg_discount < 0
                          ? "text-red-600"
                          : "text-gray-400"
                      }`}
                    >
                      {p.avg_discount > 0 ? "-" : p.avg_discount < 0 ? "+" : ""}
                      {Math.abs(p.avg_discount)}%
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-gray-700">{p.total_orders}</td>
                  <td className="px-6 py-3 text-sm text-right text-gray-700">
                    $
                    {p.total_revenue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
