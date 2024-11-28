import { Card, Title, AreaChart } from "@tremor/react";
import { format } from "date-fns";
import type { MonthlyStat } from "../../types";

interface ShipmentTrendsProps {
  data: MonthlyStat[];
}

export function ShipmentTrends({ data }: ShipmentTrendsProps) {
  const chartData = data.map(stat => ({
    date: format(new Date(stat.date), 'MMM yyyy'),
    "Air Freight": stat.airFreight || 0,
    "Sea Freight": stat.seaFreight || 0,
    "Total Shipments": stat.totalShipments || 0
  }));

  return (
    <Card>
      <Title>Shipment Trends</Title>
      <AreaChart
        className="h-72 mt-4"
        data={chartData}
        index="date"
        categories={["Air Freight", "Sea Freight", "Total Shipments"]}
        colors={["blue", "cyan", "indigo"]}
        valueFormatter={(value) => value.toString()}
        showLegend={true}
      />
    </Card>
  );
}