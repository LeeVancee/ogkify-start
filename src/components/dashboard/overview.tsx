import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

interface SalesData {
  name: string
  total: number
}

interface OverviewProps {
  data?: Array<SalesData>
}

export function Overview({ data }: OverviewProps) {
  // If no data is provided, use default sample data
  const chartData = data || [
    { name: 'Jan', total: 1250 },
    { name: 'Feb', total: 3200 },
    { name: 'Mar', total: 2900 },
    { name: 'Apr', total: 4100 },
    { name: 'May', total: 4800 },
    { name: 'Jun', total: 3800 },
    { name: 'Jul', total: 5200 },
    { name: 'Aug', total: 6100 },
    { name: 'Sep', total: 4800 },
    { name: 'Oct', total: 5600 },
    { name: 'Nov', total: 6800 },
    { name: 'Dec', total: 7900 },
  ]

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
