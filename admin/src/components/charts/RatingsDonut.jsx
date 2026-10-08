import { useMemo } from "react";

import { useData } from "../../store/dataContext";

const SIZE = 176;
const RADIUS = 66;
const STROKE = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = SIZE / 2;

/** Star bands, best to worst — green through red, like a rating meter. */
const BUCKETS = [
  { stars: 5, color: "#10b981" },
  { stars: 4, color: "#38bdf8" },
  { stars: 3, color: "#f59e0b" },
  { stars: 2, color: "#f97316" },
  { stars: 1, color: "#f43f5e" },
];

/**
 * Donut of how students rated their teachers: the 5→1 star split as coloured
 * arcs, the overall average in the middle, and a legend with each band's
 * count, share and a mini bar. Plain SVG with `stroke-dasharray` segments —
 * no charting library.
 */
export default function RatingsDonut() {
  const { records, loading } = useData();

  const { counts, total, average, segments } = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    let valid = 0;

    for (const review of records.reviews) {
      const stars = Math.round(Number(review.rating));

      if (stars >= 1 && stars <= 5) {
        counts[stars] += 1;
        sum += stars;
        valid += 1;
      }
    }

    // Lay the arcs out around the ring, best band first, leaving a hairline
    // gap between neighbours so adjacent colours stay readable. Each arc's
    // offset is the prefix sum of the arcs before it — no mutation, so the
    // memo stays pure across renders.
    const shares = BUCKETS.map((bucket) =>
      valid > 0 ? counts[bucket.stars] / valid : 0
    );
    const lengths = shares.map((share) => share * CIRCUMFERENCE);

    const segments = BUCKETS.map((bucket, index) => {
      const length = lengths[index];
      const visible = length > 8 ? length - 3 : length;
      const dashLength = Math.max(visible, 0.01);
      const consumed = lengths
        .slice(0, index)
        .reduce((sum, value) => sum + value, 0);

      return {
        ...bucket,
        share: shares[index],
        dash: `${dashLength} ${CIRCUMFERENCE - dashLength}`,
        offset: -consumed,
      };
    });

    return {
      counts,
      total: valid,
      average: valid ? (sum / valid).toFixed(1) : "—",
      segments,
    };
  }, [records.reviews]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3.5">
        <div>
          <h2 className="text-[13.5px] font-semibold text-slate-900">
            Rating distribution
          </h2>
          <p className="mt-0.5 text-[12px] text-slate-500">
            How students scored their teachers
          </p>
        </div>

        <div className="text-right">
          <p className="text-[19px] font-bold leading-tight text-slate-900">
            {loading && total === 0 ? "…" : total}
          </p>
          <p className="text-[11.5px] text-slate-500">student reviews</p>
        </div>
      </header>

      <div className="px-5 py-4">
        <div className="relative mx-auto h-44 w-44">
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="h-full w-full"
            role="img"
            aria-label={`Donut chart of ${total} teacher reviews by star rating, average ${average} out of 5`}
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
                  key={segment.stars}
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
                    {segment.stars} star{segment.stars === 1 ? "" : "s"}:{" "}
                    {counts[segment.stars]} ({Math.round(segment.share * 100)}%)
                  </title>
                </circle>
              ))}
          </svg>

          {/* Average callout, layered over the ring's hole. */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[27px] font-bold leading-none tracking-tight text-slate-900">
              {loading && total === 0 ? "…" : average}
            </p>
            <p className="mt-1 text-[11.5px] text-slate-500">average / 5</p>
          </div>
        </div>

        {total === 0 ? (
          <p className="py-4 text-center text-[12.5px] text-slate-500">
            {loading ? "Loading reviews…" : "No reviews yet."}
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {BUCKETS.map((bucket) => {
              const count = counts[bucket.stars];
              const share = Math.round((count / total) * 100);

              return (
                <li key={bucket.stars} className="flex items-center gap-1.5 text-[11.5px]">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: bucket.color }}
                  />

                  <span className="w-[46px] shrink-0 text-slate-600">
                    {bucket.stars} star{bucket.stars === 1 ? "" : "s"}
                  </span>

                  <span className="h-1.5 min-w-4 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <span
                      className="block h-full rounded-full"
                      style={{ width: `${share}%`, backgroundColor: bucket.color }}
                    />
                  </span>

                  <span className="w-7 shrink-0 text-right font-semibold tabular-nums text-slate-900">
                    {count}
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
