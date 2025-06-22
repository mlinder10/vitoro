"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type QuestionChartProps = {
  dailyData: {
    date: string;
    count: number;
  }[];
};

export default function QuestionChart({ dailyData }: QuestionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={dailyData}
        margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
      >
        {/* Background Grid */}
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

        {/* Axes */}
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#cbd5e1" }}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#cbd5e1" }}
        />

        {/* Tooltip */}
        <Tooltip
          contentStyle={{ backgroundColor: "#fff", borderColor: "#e2e8f0" }}
          labelStyle={{ fontWeight: "bold" }}
          formatter={(value: number) => [`${value} questions`, "Count"]}
        />

        {/* Data Line */}
        <Line
          type="monotone"
          dataKey="count"
          stroke="#6366f1" // Indigo-500 (Tailwind)
          strokeWidth={2}
          dot={{ r: 4, stroke: "#4f46e5", strokeWidth: 1.5, fill: "#fff" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
