import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const LABELS = {
  earningsQuality:    "Earnings",
  leverage:           "Leverage",
  promoterConfidence: "Promoter",
  profitability:      "Profit",
  revenueGrowth:      "Revenue",
};

const barColor = (v) => (v <= 6 ? "#10b981" : v <= 13 ? "#f59e0b" : "#ef4444");

export default function CategoryScoreChart({ categoryScores }) {
  const data = Object.entries(categoryScores).map(([k, v]) => ({
    category: LABELS[k] ?? k, score: v,
  }));

  return (
    <ChartCard title="Risk by Category" subtitle="Score out of 20 (higher = riskier)">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 20]} tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
            formatter={(v) => [v, "Score"]}
          />
          <Bar dataKey="score" radius={[6, 6, 0, 0]}>
            {data.map((d, i) => <Cell key={i} fill={barColor(d.score)} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-4">
        <div className="text-base font-semibold text-slate-900">{title}</div>
        {subtitle && <div className="mt-0.5 text-xs text-slate-500">{subtitle}</div>}
      </div>
      <div className="h-60 sm:h-64">{children}</div>
    </div>
  );
}

export { ChartCard };