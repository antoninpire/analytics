"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  PieLabelRenderProps,
  ResponsiveContainer,
} from "recharts";

type Props = {
  topDevices: { name: string; value: number }[];
};
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) => {
  // @ts-ignore
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  // @ts-ignore
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  // @ts-ignore
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      // @ts-ignore
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {/* @ts-ignore */}
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function TopDevicesChart(props: Props) {
  const { topDevices } = props;

  return (
    <ResponsiveContainer width="45%" height="100%">
      <PieChart width={400} height={400}>
        <Pie
          data={topDevices}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {topDevices.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
