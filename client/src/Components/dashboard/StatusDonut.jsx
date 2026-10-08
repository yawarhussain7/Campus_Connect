import { PieChart } from 'lucide-react';

import { sharePercent, statusCounts } from '../../utils/assignment.js';

/**
 * Segment order and tones mirror the status pills used across the tables so
 * the legend reads the same everywhere.
 */
const SEGMENTS = [
  { status: 'Submitted', color: '#10b981' },
  { status: 'Pending', color: '#f59e0b' },
  { status: 'Overdue', color: '#f43f5e' },
];

/** Shown only when no assignment or project exists yet; tagged in the header. */
const SAMPLE_COUNTS = { Submitted: 5, Pending: 3, Overdue: 1 };

const SIZE = 148;
const CENTER = SIZE / 2;
const RADIUS = 54;
const STROKE = 15;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 2;

/**
 * Donut of the Pending / Submitted / Overdue split across the loaded
 * assignments and projects. Renders a tagged sample breakdown while both
 * collections are still empty so the card stays informative.
 */
export default function StatusDonut({ assignments = [], projects = [] }) {
  const counts = statusCounts([...assignments, ...projects]);
  const trackedTotal = SEGMENTS.reduce(
    (sum, segment) => sum + (counts[segment.status] || 0),
    0
  );

  const isSample = trackedTotal === 0;
  const totals = isSample ? SAMPLE_COUNTS : counts;
  const total = SEGMENTS.reduce(
    (sum, segment) => sum + (totals[segment.status] || 0),
    0
  );

  const arcData = SEGMENTS.filter(
    (segment) => totals[segment.status] > 0
  ).map((segment) => {
    const count = totals[segment.status];

    return {
      ...segment,
      count,
      length: (count / total) * CIRCUMFERENCE,
    };
  });

  // Each segment starts where the previous ones end; the offset is derived
  // from the data instead of accumulated, so a re-render cannot drift.
  const arcs = arcData.map((arc, index) => {
    const offset = arcData
      .slice(0, index)
      .reduce((sum, item) => sum + item.length, 0);

    return (
      <circle
        key={arc.status}
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        fill="none"
        stroke={arc.color}
        strokeWidth={STROKE}
        strokeDasharray={`${Math.max(0, arc.length - GAP)} ${
          CIRCUMFERENCE - Math.max(0, arc.length - GAP)
        }`}
        strokeDashoffset={-offset}
        transform={`rotate(-90 ${CENTER} ${CENTER})`}
      >
        <title>
          {`${arc.status}: ${arc.count} (${sharePercent(arc.count, total)})`}
        </title>
      </circle>
    );
  });

  return (
    <section className="surface-card overflow-hidden">
      <div className="surface-card-header">
        <div className="flex min-w-0 items-center gap-2.5">
          <PieChart className="h-4 w-4 shrink-0 text-slate-400" />

          <div className="min-w-0">
            <h2 className="text-[13px] font-semibold text-slate-900">
              Status breakdown
            </h2>

            <p className="mt-0.5 truncate text-[11.5px] text-slate-400">
              {isSample
                ? 'Sample data · assignments + projects'
                : `${total} tracked · assignments + projects`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 p-4">
        <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="h-full w-full"
            role="img"
            aria-label="Donut chart of the pending, submitted and overdue split"
          >
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth={STROKE}
            />

            {arcs}
          </svg>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[24px] font-semibold leading-none text-slate-900 tabular-nums">
              {total}
            </span>

            <span className="mt-1 text-[10.5px] font-medium text-slate-400">
              tracked
            </span>
          </div>
        </div>

        <ul className="min-w-[150px] flex-1 space-y-2.5">
          {SEGMENTS.map((segment) => {
            const count = totals[segment.status] || 0;

            return (
              <li
                key={segment.status}
                className="flex items-center justify-between gap-3"
              >
                <span className="flex items-center gap-2 text-[12px] font-medium text-slate-600">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  {segment.status}
                </span>

                <span className="text-[11.5px] text-slate-400 tabular-nums">
                  {count} · {sharePercent(count, total)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}