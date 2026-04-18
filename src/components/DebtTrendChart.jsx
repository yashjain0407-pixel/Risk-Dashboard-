import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { ChartCard } from "./CategoryScoreChart";

const fmtCr = (n) => `₹${(n / 1000).toFixed(1)}k Cr`;

export default function DebtTrendChart({ years, debt }) {
  const data = years.map((y, i) => ({ year: y, Debt: debt[i] }));

  return (
    <ChartCard title="Debt Trend" subtitle="Total debt over period">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={fmtCr} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
            formatter={(v) => [`₹${v.toLocaleString("en-IN")} Cr`, "Debt"]}
          />
          <Line type="monotone" dataKey="Debt" stroke="#475569" strokeWidth={1.5} dot={{ r: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}