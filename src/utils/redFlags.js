const last = (a) => a[a.length - 1];
const prev = (a) => a[a.length - 2];
const yoy  = (a) => (prev(a) ? (last(a) - prev(a)) / Math.abs(prev(a)) : 0);

const trend = (a) => {
  const n = a.length;
  const xm = (n - 1) / 2;
  const ym = a.reduce((s, x) => s + x, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - xm) * (a[i] - ym);
    den += (i - xm) ** 2;
  }
  const slope = den ? num / den : 0;
  return ym === 0 ? 0 : slope / Math.abs(ym);
};

const SEV_RANK = { High: 3, Medium: 2, Low: 1 };
const pct = (x) => `${(x * 100).toFixed(1)}%`;

const fCfoBelowPat = ({ cfo, profit }) => {
  if (last(cfo) >= last(profit)) return null;
  const gap = (last(profit) - last(cfo)) / Math.abs(last(profit));
  return {
    title: "CFO below PAT in latest year",
    category: "Earnings Quality",
    severity: gap > 0.25 ? "High" : "Medium",
    explanation: `Operating cash flow trailed reported profit by ${pct(gap)} — earnings not fully backed by cash.`,
  };
};

const fDebtRising = ({ debt }) => {
  const t = trend(debt);
  if (t <= 0.05) return null;
  return {
    title: "Debt on a rising trend",
    category: "Leverage",
    severity: t > 0.15 ? "High" : "Medium",
    explanation: `Debt has grown at ~${pct(t)} per year over the period — leverage is building.`,
  };
};

const fPromoterDrop = ({ promoterHolding: p }) => {
  const drop = p[0] - last(p);
  if (drop <= 0.5) return null;
  return {
    title: "Promoter holding has declined",
    category: "Governance",
    severity: drop > 3 ? "High" : drop > 1.5 ? "Medium" : "Low",
    explanation: `Promoter stake fell by ${drop.toFixed(2)} pp — possible dilution, sell-down, or pledging.`,
  };
};

const fLatestLoss = ({ profit }) => {
  if (last(profit) >= 0) return null;
  return {
    title: "Latest year reported a loss",
    category: "Profitability",
    severity: "High",
    explanation: `PAT was negative in the most recent year — review one-offs vs. structural pressure.`,
  };
};

const fRevenueDecline = ({ revenue }) => {
  const y = yoy(revenue);
  if (y >= 0) return null;
  return {
    title: "Revenue declined YoY",
    category: "Growth",
    severity: y < -0.05 ? "High" : "Medium",
    explanation: `Topline contracted ${pct(Math.abs(y))} versus the prior year — demand or pricing weakness.`,
  };
};

const fPatVolatile = ({ profit }) => {
  const y = yoy(profit);
  if (y >= -0.25) return null;
  return {
    title: "Sharp drop in PAT",
    category: "Profitability",
    severity: y < -0.5 ? "High" : "Medium",
    explanation: `Profit fell ${pct(Math.abs(y))} YoY — earnings volatility worth probing.`,
  };
};

export function getRedFlags(company) {
  const detectors = [
    fCfoBelowPat,
    fDebtRising,
    fPromoterDrop,
    fLatestLoss,
    fRevenueDecline,
    fPatVolatile,
  ];

  const flags = detectors
    .map((fn) => fn(company))
    .filter(Boolean)
    .sort((a, b) => SEV_RANK[b.severity] - SEV_RANK[a.severity]);

  return flags.slice(0, 5);
}