import Plot from "react-plotly.js";
import type { RevenuePeriod } from "../types/sales";

interface Props {
  data: RevenuePeriod[];
}

function RevenueTrendChart({ data }: Props) {
  if (data.length === 0) {
    return <p className="text-gray-400 text-center py-8">No revenue data</p>;
  }

  return (
    <Plot
      data={[
        {
          x: data.map((d) => d.period),
          y: data.map((d) => d.revenue),
          type: "scatter",
          mode: "lines+markers",
          name: "Revenue",
          line: { color: "#3b82f6" },
        },
      ]}
      layout={{
        autosize: true,
        margin: { l: 50, r: 20, t: 20, b: 40 },
        xaxis: { title: { text: "Period" } },
        yaxis: { title: { text: "Revenue ($)" } },
      }}
      useResizeHandler
      style={{ width: "100%", height: "300px" }}
    />
  );
}

export default RevenueTrendChart;
