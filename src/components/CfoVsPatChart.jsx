import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { ChartCard } from "./CategoryScoreChart";

const fmtCr = (n) => `₹${(n / 1000).toFixed(1)}k Cr`;

export default function CfoVsPatChart({ years, cfo, profit }) {
  const data = years.map((y, i) => ({ year: y, CFO: cfo[i], PAT: profit[i] }));

  return (
    <ChartCard title="CFO vs PAT" subtitle="Operating cash flow vs reported profit">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickFormatter={fmtCr} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
            formatter={(v) => [`₹${v.toLocaleString("en-IN")} Cr`, ""]}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="line" />
          <Line type="monotone" dataKey="CFO" stroke="#475569" strokeWidth={1.5} dot={{ r: 2 }} />
          <Line type="monotone" dataKey="PAT" stroke="#94a3b8" strokeWidth={1.5} dot={{ r: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}