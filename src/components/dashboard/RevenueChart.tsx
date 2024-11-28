import { Card, Title, AreaChart } from "@tremor/react";
import { format } from "date-fns";
import type { MonthlyStat } from "../../types";

interface RevenueChartProps {
  data: MonthlyStat[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map(stat => ({
    date: format(new Date(stat.date), 'MMM yyyy'),
    "Revenue (EUR)": Math.round(stat.revenue.EUR) || 0,
    "Revenue (XOF)": Math.round(stat.revenue.XOF / 1000) || 0 // Display in thousands
  }));

  return (
    <Card>
      <Title>Monthly Revenue</Title>
      <AreaChart
        className="h-72 mt-4"
        data={chartData}
        index="date"
        categories={["Revenue (EUR)", "Revenue (XOF)"]}
        colors={["emerald", "indigo"]}
        valueFormatter={(value) => {
          return value.toLocaleString();
        }}
        showLegend={true}
      />
    </Card>
  );
}