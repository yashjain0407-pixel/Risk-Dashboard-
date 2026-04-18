const avg = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const trend = (a) => {
  const n = a.length;
  const xm = (n - 1) / 2;
  const ym = avg(a);
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) {
    num += (i - xm) * (a[i] - ym);
    den += (i - xm) ** 2;
  }
  const slope = den ? num / den : 0;
  return ym === 0 ? 0 : slope / Math.abs(ym);
};

const earningsQuality = ({ cfo, profit }) => {
  const breaches = cfo.filter((c, i) => c < profit[i]).length;
  return clamp((breaches / cfo.length) * 20, 0, 20);
};

const leverage = ({ debt }) => {
  const t = trend(debt);
  return clamp(t * 100, 0, 20);
};

const promoterConfidence = ({ promoterHolding: p }) => {
  const drop = p[0] - p[p.length - 1];
  return drop <= 0 ? 0 : clamp(drop * 4, 0, 20);
};

const profitability = ({ profit }) => {
  const negShare = profit.filter((x) => x < 0).length / profit.length;
  let s = negShare * 15;
  const t = trend(profit);
  if (t < 0) s += clamp(Math.abs(t) * 50, 0, 5);
  return clamp(s, 0, 20);
};

const revenueGrowth = ({ revenue }) => {
  const t = trend(revenue);
  if (t >= 0.05) return 0;
  if (t >= 0) return 8;
  return clamp(15 + Math.abs(t) * 50, 0, 20);
};

const labelFor = (total) => {
  if (total <= 30) return "Low Risk";
  if (total <= 60) return "Medium Risk";
  return "High Risk";
};

const round1 = (x) => Math.round(x * 10) / 10;

export function scoreCompany(c) {
  const cat = {
    earningsQuality:    earningsQuality(c),
    leverage:           leverage(c),
    promoterConfidence: promoterConfidence(c),
    profitability:      profitability(c),
    revenueGrowth:      revenueGrowth(c),
  };
  const total = Object.values(cat).reduce((a, b) => a + b, 0);
  return {
    name: c.name,
    sector: c.sector,
    categoryScores: Object.fromEntries(
      Object.entries(cat).map(([k, v]) => [k, round1(v)])
    ),
    totalScore: round1(total),
    riskLabel: labelFor(total),
  };
}

export const scoreAll = (companies) => companies.map(scoreCompany);