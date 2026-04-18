const sevColor = {
  High:   "text-rose-600",
  Medium: "text-amber-600",
  Low:    "text-emerald-600",
};

export default function RedFlags({ flags = [] }) {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between">
        <h2 className="text-base font-semibold text-slate-900">Red Flags</h2>
        <span className="text-xs text-slate-500">
          {flags.length} {flags.length === 1 ? "issue" : "issues"} detected
        </span>
      </div>

      <div className="rounded-2xl bg-white shadow-sm">
        {flags.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No red flags detected — metrics look clean across earnings, leverage,
            governance, profitability, and growth.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4 min-w-[140px]">Category</th>
                  <th className="px-6 py-4 min-w-[200px]">Issue</th>
                  <th className="px-6 py-4 min-w-[90px]">Severity</th>
                  <th className="px-6 py-4 min-w-[280px]">Explanation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {flags.map((f, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 align-top text-slate-600 whitespace-nowrap">{f.category}</td>
                    <td className="px-6 py-4 align-top font-medium text-slate-900">{f.title}</td>
                    <td className={`px-6 py-4 align-top font-semibold whitespace-nowrap ${sevColor[f.severity] ?? "text-slate-600"}`}>
                      {f.severity}
                    </td>
                    <td className="px-6 py-4 align-top text-slate-600 leading-relaxed">{f.explanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}