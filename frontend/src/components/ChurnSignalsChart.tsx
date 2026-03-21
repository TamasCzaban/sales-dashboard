import Plot from "react-plotly.js";
import type { CustomerFrequency, ChurnSummary } from "../types/sales";

interface Props {
  customers: CustomerFrequency[];
  summary: ChurnSummary | null;
}

function ChurnSignalsChart({ customers, summary }: Props) {
  if (customers.length === 0) {
    return <p className="text-gray-400 text-center py-8">No churn data</p>;
  }

  const declining = customers.filter((c) => c.trend === "declining");

  return (
    <div>
      {summary && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-red-50 rounded">
            <p className="text-2xl font-bold text-red-600">{summary.declining}</p>
            <p className="text-sm text-red-500">Declining</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <p className="text-2xl font-bold text-gray-600">{summary.stable}</p>
            <p className="text-sm text-gray-500">Stable</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded">
            <p className="text-2xl font-bold text-green-600">{summary.growing}</p>
            <p className="text-sm text-green-500">Growing</p>
          </div>
        </div>
      )}
      {declining.length > 0 && (
        <Plot
          data={declining.map((customer) => ({
            x: customer.windows.map((w) => w.period),
            y: customer.windows.map((w) => w.purchases),
            type: "scatter" as const,
            mode: "lines+markers" as const,
            name: customer.customer_id,
          }))}
          layout={{
            autosize: true,
            margin: { l: 50, r: 20, t: 20, b: 40 },
            xaxis: { title: { text: "Period" } },
            yaxis: { title: { text: "Purchases" } },
            legend: { orientation: "h", y: -0.2 },
          }}
          useResizeHandler
          style={{ width: "100%", height: "300px" }}
        />
      )}
    </div>
  );
}

export default ChurnSignalsChart;
