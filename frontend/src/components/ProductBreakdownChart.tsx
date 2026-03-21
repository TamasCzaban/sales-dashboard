import Plot from "react-plotly.js";
import type { ProductTotal } from "../types/sales";

interface Props {
  data: ProductTotal[];
}

function ProductBreakdownChart({ data }: Props) {
  if (data.length === 0) {
    return <p className="text-gray-400 text-center py-8">No product data</p>;
  }

  return (
    <Plot
      data={[
        {
          labels: data.map((d) => d.product),
          values: data.map((d) => d.total_revenue),
          type: "pie",
          textinfo: "label+percent",
          hovertemplate: "%{label}<br>$%{value:.2f}<br>%{percent}<extra></extra>",
        },
      ]}
      layout={{
        autosize: true,
        margin: { l: 20, r: 20, t: 20, b: 20 },
        showlegend: true,
      }}
      useResizeHandler
      style={{ width: "100%", height: "300px" }}
    />
  );
}

export default ProductBreakdownChart;
