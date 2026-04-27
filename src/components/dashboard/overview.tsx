import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatPrice } from "@/lib/utils";

interface SalesData {
  name: string;
  total: number;
}

interface OverviewProps {
  data: Array<SalesData>;
}

export function Overview({ data }: OverviewProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        margin={{
          top: 8,
          right: 8,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid vertical={false} stroke="var(--color-border)" />
        <XAxis
          dataKey="name"
          stroke="var(--color-muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          stroke="var(--color-muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          cursor={{ fill: "var(--color-muted)" }}
          formatter={(value) => [formatPrice(Number(value)), "Revenue"]}
          labelClassName="text-foreground"
          contentStyle={{
            background: "var(--color-background)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.75rem",
            color: "var(--color-foreground)",
          }}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[6, 6, 0, 0]}
          barSize={36}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
