import { useMemo, useState } from "react";
import * as XLSX from "xlsx";

import data from "./data/sampleData.json";
import { scoreCompany } from "./utils/riskScoring";
import { getRedFlags } from "./utils/redFlags";

import Summary from "./components/Summary";
import CategoryScoreChart from "./components/CategoryScoreChart";
import CfoVsPatChart from "./components/CfoVsPatChart";
import DebtTrendChart from "./components/DebtTrendChart";
import RedFlags from "./components/RedFlags";

const CATEGORY_LABELS = {
  earningsQuality:    "Earnings Quality",
  leverage:           "Leverage",
  promoterConfidence: "Promoter Confidence",
  profitability:      "Profitability",
  revenueGrowth:      "Revenue Growth",
};

export default function App() {
  const [ticker, setTicker] = useState(data.companies[0].ticker);

  const company = useMemo(
    () => data.companies.find((c) => c.ticker === ticker),
    [ticker]
  );
  const scored = useMemo(() => scoreCompany(company), [company]);
  const flags  = useMemo(() => getRedFlags(company),  [company]);

  const handleDownload = () => {
    const wb = XLSX.utils.book_new();
    const last = (a) => a[a.length - 1];

    const summaryRows = [
      ["Company",          company.name],
      ["Ticker",           company.ticker],
      ["Sector",           company.sector],
      ["Period",           `${data.years[0]} – ${last(data.years)}`],
      [],
      ["Latest Revenue (₹ Cr)",  last(company.revenue)],
      ["Latest PAT (₹ Cr)",      last(company.profit)],
      ["Latest CFO (₹ Cr)",      last(company.cfo)],
      ["Latest Debt (₹ Cr)",     last(company.debt)],
      ["Promoter Holding (%)",   last(company.promoterHolding)],
      [],
      ["Risk Score (out of 100)", scored.totalScore],
      ["Risk Label",              scored.riskLabel],
      [],
      ["Category", "Score (out of 20)"],
      ...Object.entries(scored.categoryScores).map(([k, v]) => [
        CATEGORY_LABELS[k] ?? k, v,
      ]),
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
    wsSummary["!cols"] = [{ wch: 28 }, { wch: 22 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

    const flagRows = [
      ["Category", "Issue", "Severity", "Explanation"],
      ...(flags.length
        ? flags.map((f) => [f.category, f.title, f.severity, f.explanation])
        : [["—", "No red flags detected", "—", "All metrics within thresholds"]]),
    ];
    const wsFlags = XLSX.utils.aoa_to_sheet(flagRows);
    wsFlags["!cols"] = [{ wch: 20 }, { wch: 32 }, { wch: 10 }, { wch: 60 }];
    XLSX.utils.book_append_sheet(wb, wsFlags, "Red Flags");

    const metrics = [
      ["Revenue (₹ Cr)",       company.revenue],
      ["PAT (₹ Cr)",           company.profit],
      ["CFO (₹ Cr)",           company.cfo],
      ["Debt (₹ Cr)",          company.debt],
      ["Promoter Holding (%)", company.promoterHolding],
    ];
    const finRows = [
      ["Metric", ...data.years],
      ...metrics.map(([label, arr]) => [label, ...arr]),
    ];
    const wsFin = XLSX.utils.aoa_to_sheet(finRows);
    wsFin["!cols"] = [{ wch: 22 }, ...data.years.map(() => ({ wch: 12 }))];
    XLSX.utils.book_append_sheet(wb, wsFin, "Financial Data");

    const fileName = `${company.ticker}_Risk_Report_${new Date()
      .toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">

        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Risk Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500">Red Flag Analysis</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              {data.companies.map((c) => (
                <option key={c.ticker} value={c.ticker}>
                  {c.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleDownload}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              Download Report
            </button>
          </div>
        </header>

        <Summary
          company={company}
          totalScore={scored.totalScore}
          riskLabel={scored.riskLabel}
        />

        <section className="space-y-4">
          <h2 className="text-base font-semibold text-slate-900">Charts</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <CategoryScoreChart categoryScores={scored.categoryScores} />
            <CfoVsPatChart years={data.years} cfo={company.cfo} profit={company.profit} />
            <div className="lg:col-span-2">
              <DebtTrendChart years={data.years} debt={company.debt} />
            </div>
          </div>
        </section>

        <RedFlags flags={flags} />

        {/* Disclaimer */}
        <footer className="mt-8 border-t border-slate-200 pt-6">
          <p className="text-xs leading-relaxed text-slate-500">
            <span className="font-semibold text-slate-600">Disclaimer:</span>{" "}
            This dashboard has been built solely for educational and demonstration purposes
            as part of a personal portfolio project. The financial data shown is sourced
            from publicly available information and may contain errors, omissions, or
            outdated figures. Risk scores and red flags are generated by a simplified
            rule-based model and do not constitute investment advice, a recommendation
            to buy or sell any security, or a substitute for professional financial
            analysis. The author is not a registered investment advisor. Users should
            consult a qualified financial professional and verify all data independently
            before making any investment decisions. No liability is accepted for any
            loss arising from the use of this dashboard.
          </p>
        </footer>
      </div>
    </div>
  );
}