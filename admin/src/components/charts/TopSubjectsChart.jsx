import { useMemo } from "react";

import { useData } from "../../store/dataContext";

const TOP = 6;

/**
 * Where each subject falls across the catalogue: assignments, past papers and
 * projects by `subject`, plus reviews by their `courseName`, counted and
 * ranked. The bar list mirrors the Overview's status bars — pure Tailwind, no
 * charting library.
 */
const SOURCES = [
  ["assignments", (item) => item.subject],
  ["papers", (item) => item.subject],
  ["projects", (item) => item.subject],
  ["reviews", (item) => item.courseName],
];

export default function TopSubjectsChart() {
  const { records, loading } = useData();

  const { subjects, distinct } = useMemo(() => {
    const totals = new Map();

    for (const [key, pick] of SOURCES) {
      for (const item of records[key]) {
        const label = String(pick(item) || "").trim();
        if (!label) continue;

        totals.set(label, (totals.get(label) ?? 0) + 1);
      }
    }

    const subjects = [...totals.entries()]
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))
      .slice(0, TOP);

    return { subjects, distinct: totals.size };
  }, [records]);

  const peak = Math.max(...subjects.map((item) => item.value), 1);

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3.5">
        <div>
          <h2 className="text-[13.5px] font-semibold text-slate-900">Top subjects</h2>
          <p className="mt-0.5 text-[12px] text-slate-500">
            Most frequent across the catalogue
          </p>
        </div>

        <div className="text-right">
          <p className="text-[19px] font-bold leading-tight text-slate-900">
            {loading && distinct === 0 ? "…" : distinct}
          </p>
          <p className="text-[11.5px] text-slate-500">distinct subjects</p>
        </div>
      </header>

      <div className="px-5 py-4">
        {subjects.length === 0 ? (
          <p className="py-6 text-center text-[12.5px] text-slate-500">
            {loading ? "Loading subjects…" : "No subjects recorded yet."}
          </p>
        ) : (
          <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
            {subjects.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between gap-3 text-[12.5px]">
                  <span className="truncate text-slate-600">{item.label}</span>
                  <span className="shrink-0 font-medium tabular-nums text-slate-900">
                    {item.value}
                  </span>
                </div>

                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${(item.value / peak) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
