import { useMemo } from "react";

import { useData } from "../../store/dataContext";

const SIZE = 176;
const RADIUS = 66;
const STROKE = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = SIZE / 2;

/** The four collections, in the tones the StatCards already use. */
const SEGMENTS = [
  { key: "assignments", label: "Assignments", color: "#6366f1" },
  { key: "papers", label: "Past papers", color: "#10b981" },
  { key: "projects", label: "Projects", color: "#8b5cf6" },
  { key: "reviews", label: "Reviews", color: "#f59e0b" },
];

/**
 * Donut of where the catalogue's rows live: each collection as a coloured arc
 * with its count and share, the largest collection called out in the middle,
 * and the record total in the header. Plain SVG with `stroke-dasharray`
 * segments — no charting library.
 */
export default function CatalogueDonut() {
  const { records, loading } = useData();

  const { total, entries, segments, leader } = useMemo(() => {
    const entries = SEGMENTS.map((segment) => ({
      ...segment,
      value: records[segment.key].length,
    }));

    const total = entries.reduce((sum, entry) => sum + entry.value, 0);

    // Lay the arcs out around the ring, largest first, leaving a hairline
    // gap between neighbours so adjacent colours stay readable. Each arc's
    // offset is the prefix sum of the arcs before it — no mutation, so the
    // memo stays pure across renders.
    const shares = entries.map((entry) => (total > 0 ? entry.value / total : 0));
    const lengths = shares.map((share) => share * CIRCUMFERENCE);

    const segments = entries.map((entry, index) => {
      const length = lengths[index];
      const visible = length > 8 ? length - 3 : length;
      const dashLength = Math.max(visible, 0.01);
      const consumed = lengths
        .slice(0, index)
        .reduce((sum, value) => sum + value, 0);

      return {
        ...entry,
        share: shares[index],
        dash: `${dashLength} ${CIRCUMFERENCE - dashLength}`,
        offset: -consumed,
      };
    });

    const leader = [...entries].sort((a, b) => b.value - a.value)[0];

    return { total, entries, segments, leader };
  }, [records]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3.5">
        <div>
          <h2 className="text-[13.5px] font-semibold text-slate-900">
            Catalogue mix
          </h2>
          <p className="mt-0.5 text-[12px] text-slate-500">
            Where the database rows live
          </p>
        </div>

        <div className="text-right">
          <p className="text-[19px] font-bold leading-tight text-slate-900">
            {loading && total === 0 ? "…" : total}
          </p>
          <p className="text-[11.5px] text-slate-500">records stored</p>
        </div>
      </header>

      <div className="px-5 py-4">
        <div className="relative mx-auto h-44 w-44">
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="h-full w-full"
            role="img"
            aria-label={`Donut chart of ${total} records split across ${SEGMENTS.length} collections`}
          >
            {/* Track. */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth={STROKE}
            />

            {segments
              .filter((segment) => segment.share > 0)
              .map((segment) => (
                <circle
                  key={segment.key}
                  cx={CENTER}
                  cy={CENTER}
                  r={RADIUS}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={STROKE}
                  strokeDasharray={segment.dash}
                  strokeDashoffset={segment.offset}
                  transform={`rotate(-90 ${CENTER} ${CENTER})`}
                >
                  <title>
                    {segment.label}: {segment.value} (
                    {Math.round(segment.share * 100)}%)
                  </title>
                </circle>
              ))}
          </svg>

          {/* Largest collection, layered over the ring's hole. */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6">
            <p className="text-[27px] font-bold leading-none tracking-tight text-slate-900">
              {loading && total === 0 ? "…" : leader?.value ?? 0}
            </p>
            <p className="mt-1 max-w-full truncate text-[11.5px] text-slate-500">
              {total === 0 ? "no records" : (leader?.label ?? "").toLowerCase()}
            </p>
          </div>
        </div>

        {total === 0 ? (
          <p className="py-4 text-center text-[12.5px] text-slate-500">
            {loading ? "Loading records…" : "No records yet."}
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {entries.map((entry) => {
              const share = Math.round((entry.value / total) * 100);

              return (
                <li key={entry.key} className="flex items-center gap-1.5 text-[11.5px]">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />

                  <span className="min-w-0 flex-1 truncate text-slate-600">
                    {entry.label}
                  </span>

                  <span className="w-7 shrink-0 text-right font-semibold tabular-nums text-slate-900">
                    {entry.value}
                  </span>

                  <span className="w-8 shrink-0 text-right tabular-nums text-slate-400">
                    {share}%
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
