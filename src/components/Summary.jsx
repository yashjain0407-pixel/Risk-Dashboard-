const fmtCr = (n) =>
  `₹${Math.abs(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })} Cr${n < 0 ? " (loss)" : ""}`;

const fmtPct = (n) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;

const yoy = (a) => {
  const last = a[a.length - 1];
  const prev = a[a.length - 2];
  return prev ? ((last - prev) / Math.abs(prev)) * 100 : 0;
};

const riskColor = {
  "Low Risk":    "text-emerald-600",
  "Medium Risk": "text-amber-600",
  "High Risk":   "text-rose-600",
};

function Card({ children }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">{children}</div>
  );
}

function Stat({ label, value, sub, subTone = "neutral" }) {
  const subColor =
    subTone === "up"   ? "text-emerald-600" :
    subTone === "down" ? "text-rose-600"    :
                         "text-slate-500";
  return (
    <Card>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
      {sub && <div className={`mt-1 text-xs ${subColor}`}>{sub}</div>}
    </Card>
  );
}

export default function Summary({ company, totalScore, riskLabel }) {
  if (!company) return null;

  const revLast  = company.revenue[company.revenue.length - 1];
  const patLast  = company.profit[company.profit.length - 1];
  const promLast = company.promoterHolding[company.promoterHolding.length - 1];
  const revYoY   = yoy(company.revenue);
  const patYoY   = yoy(company.profit);
  const tone     = (n) => (n >= 0 ? "up" : "down");

  return (
    <section className="space-y-4">
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{company.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{company.sector}</p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Risk Score
            </div>
            <div className="mt-1 flex items-baseline gap-2 sm:justify-end">
              <span className="text-4xl font-bold text-slate-900">
                {totalScore?.toFixed(1)}
              </span>
              <span className="text-sm text-slate-400">/ 100</span>
            </div>
            <div className={`mt-1 text-sm font-semibold ${riskColor[riskLabel] ?? "text-slate-600"}`}>
              {riskLabel}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat
          label="Revenue (Latest)"
          value={fmtCr(revLast)}
          sub={`${fmtPct(revYoY)} YoY`}
          subTone={tone(revYoY)}
        />
        <Stat
          label="PAT (Latest)"
          value={fmtCr(patLast)}
          sub={`${fmtPct(patYoY)} YoY`}
          subTone={tone(patYoY)}
        />
        <Stat
          label="Promoter Holding"
          value={`${promLast.toFixed(2)}%`}
          sub="Latest filing"
        />
      </div>
    </section>
  );
}