import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Plot from "react-plotly.js";
import { getKPIs } from "../api/client";
import type { KPISummary } from "../types/sales";

function KpiCard({
  title,
  value,
  sub,
  badge,
  badgeColor,
}: {
  title: string;
  value: string;
  sub?: string;
  badge?: string;
  badgeColor?: string;
}) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {(badge || sub) && (
        <div className="mt-2 flex items-center gap-2">
          {badge && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeColor}`}>
              {badge}
            </span>
          )}
          {sub && <span className="text-xs text-gray-400">{sub}</span>}
        </div>
      )}
    </div>
  );
}

function KpiPage() {
  const [data, setData] = useState<KPISummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getKPIs()
      .then((res) => {
        if (res.error) setError(res.error);
        else setData(res.data);
      })
      .catch(() => setError("Failed to load KPIs"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-400 py-12 text-center">Loading...</p>;
  }
  if (error) {
    return <p className="text-red-500 py-12 text-center">{error}</p>;
  }
  if (!data || data.total_orders === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 mb-4">No data yet.</p>
        <Link to="/upload" className="text-blue-600 hover:underline text-sm">
          Upload a CSV to get started →
        </Link>
      </div>
    );
  }

  const growth = data.revenue_growth;
  const growthBadge = growth !== 0 ? `${growth > 0 ? "+" : ""}${growth}% MoM` : "No change MoM";
  const growthColor =
    growth > 0
      ? "bg-green-100 text-green-700"
      : growth < 0
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-500";

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">KPI Overview</h1>
        <p className="text-gray-500 text-sm mt-1">High-level snapshot across all uploaded data</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          title="Total Revenue"
          value={`$${data.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          badge={growthBadge}
          badgeColor={growthColor}
          sub="vs prev month"
        />
        <KpiCard
          title="Total Orders"
          value={data.total_orders.toLocaleString()}
        />
        <KpiCard
          title="Avg Order Value"
          value={`$${data.avg_order_value.toFixed(2)}`}
        />
        <KpiCard
          title="Unique Customers"
          value={data.unique_customers.toLocaleString()}
        />
      </div>

      {data.revenue_last_month > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Month-over-Month Revenue</h2>
          <Plot
            data={[
              {
                x: ["Previous Month", "Latest Month"],
                y: [data.revenue_last_month, data.revenue_this_month],
                type: "bar",
                marker: {
                  color: [
                    "#94a3b8",
                    growth >= 0 ? "#22c55e" : "#ef4444",
                  ],
                },
              },
            ]}
            layout={{
              autosize: true,
              margin: { l: 60, r: 20, t: 20, b: 40 },
              yaxis: { title: { text: "Revenue ($)" } },
              showlegend: false,
            }}
            useResizeHandler
            style={{ width: "100%", height: "260px" }}
          />
        </div>
      )}
    </div>
  );
}

export default KpiPage;
