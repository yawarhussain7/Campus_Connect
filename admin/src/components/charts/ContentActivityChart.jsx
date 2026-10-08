import { useMemo, useState } from "react";

import { cx } from "../../lib/format";
import { areaPath, monthKeyOf, monthWindow, niceScale, smoothPath } from "../../lib/charts";
import { useData } from "../../store/dataContext";

const WINDOW_MONTHS = 6;

/** The four catalogue collections, in the tones the StatCards already use. */
const SERIES = [
  { key: "assignments", label: "Assignments", color: "#6366f1" },
  { key: "papers", label: "Past papers", color: "#10b981" },
  { key: "projects", label: "Projects", color: "#8b5cf6" },
  { key: "reviews", label: "Reviews", color: "#f59e0b" },
];

const VIEW = { width: 720, height: 300 };
const PAD = { top: 18, right: 16, bottom: 36, left: 40 };
const PLOT_W = VIEW.width - PAD.left - PAD.right;
const PLOT_H = VIEW.height - PAD.top - PAD.bottom;

/**
 * Multi-series line/area chart of everything added to the catalogue per month.
 *
 * Plain SVG (the admin panel ships no charting library): smooth monotone
 * curves over a dashed whole-number grid, a hover crosshair with a card
 * listing every series for that month, and legend buttons that hide and show
 * series. Reads the shared store directly so it always reflects every record.
 */
export default function ContentActivityChart() {
  const { records, loading } = useData();

  const months = useMemo(() => monthWindow(WINDOW_MONTHS), []);
  const [hidden, setHidden] = useState(() => new Set());
  const [hovered, setHovered] = useState(null);

  /** One bucketed series per collection, oldest month first. */
  const series = useMemo(
    () =>
      SERIES.map((definition) => {
        const counts = Object.fromEntries(months.map((month) => [month.key, 0]));

        for (const item of records[definition.key]) {
          const key = monthKeyOf(item.createdAt);
          if (key in counts) counts[key] += 1;
        }

        return {
          ...definition,
          values: months.map((month) => counts[month.key]),
        };
      }),
    [months, records]
  );

  const visible = series.filter((item) => !hidden.has(item.key));
  const windowTotal = series.reduce(
    (sum, item) => sum + item.values.reduce((total, value) => total + value, 0),
    0
  );

  const { ceiling, ticks } = niceScale(
    Math.max(0, ...visible.flatMap((item) => item.values))
  );

  const xAt = (index) =>
    PAD.left + (months.length > 1 ? index / (months.length - 1) : 0.5) * PLOT_W;
  const yAt = (value) => PAD.top + PLOT_H - (value / ceiling) * PLOT_H;

  /** Slot boundaries so the hover area covers the full plot, edges included. */
  const boundaries = months.map((_, index) =>
    index === 0 ? PAD.left : (xAt(index - 1) + xAt(index)) / 2
  );
  boundaries.push(VIEW.width - PAD.right);

  const toggle = (key) =>
    setHidden((current) => {
      const next = new Set(current);

      if (next.has(key)) next.delete(key);
      else next.add(key);

      return next;
    });

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3.5">
        <div>
          <h2 className="text-[13.5px] font-semibold text-slate-900">
            Catalogue activity
          </h2>
          <p className="mt-0.5 text-[12px] text-slate-500">
            New records per month, last {WINDOW_MONTHS} months
          </p>
        </div>

        <div className="text-right">
          <p className="text-[19px] font-bold leading-tight text-slate-900">
            {loading && windowTotal === 0 ? "…" : windowTotal}
          </p>
          <p className="text-[11.5px] text-slate-500">added in this window</p>
        </div>
      </header>

      <div className="px-5 pt-4">
        {windowTotal === 0 ? (
          <p className="py-14 text-center text-[12.5px] text-slate-500">
            {loading
              ? "Loading activity…"
              : `No records were created in the last ${WINDOW_MONTHS} months.`}
          </p>
        ) : (
          <div className="relative" onMouseLeave={() => setHovered(null)}>
            <svg
              viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
              className="block w-full"
              role="img"
              aria-label="Line chart of assignments, past papers, projects and reviews added per month"
            >
              <defs>
                {visible.map((item) => (
                  <linearGradient
                    key={item.key}
                    id={`activity-${item.key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={item.color} stopOpacity="0.26" />
                    <stop offset="100%" stopColor={item.color} stopOpacity="0.02" />
                  </linearGradient>
                ))}
              </defs>

              {/* Dashed grid with whole-number ticks down the left edge. */}
              {ticks.map((tick) => {
                const y = yAt(tick);

                return (
                  <g key={tick}>
                    <line
                      x1={PAD.left}
                      x2={VIEW.width - PAD.right}
                      y1={y}
                      y2={y}
                      className="stroke-slate-200"
                      strokeWidth="1"
                      strokeDasharray={tick === 0 ? undefined : "4 4"}
                    />
                    <text
                      x={PAD.left - 8}
                      y={y + 4}
                      textAnchor="end"
                      className="fill-slate-400 text-[11px]"
                    >
                      {tick}
                    </text>
                  </g>
                );
              })}

              {/* Month labels along the bottom edge. */}
              {months.map((month, index) => (
                <text
                  key={month.key}
                  x={xAt(index)}
                  y={VIEW.height - 12}
                  textAnchor="middle"
                  className={cx(
                    "text-[11px]",
                    hovered === index ? "fill-slate-700" : "fill-slate-400"
                  )}
                >
                  {month.label} &rsquo;{String(month.year).slice(2)}
                </text>
              ))}

              {/* Hover crosshair. */}
              {hovered !== null ? (
                <line
                  x1={xAt(hovered)}
                  x2={xAt(hovered)}
                  y1={PAD.top}
                  y2={PAD.top + PLOT_H}
                  className="stroke-slate-300"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ) : null}

              {/* Gradient fills, lines and dots for every visible series. */}
              {visible.map((item) => {
                const points = item.values.map((value, index) => ({
                  x: xAt(index),
                  y: yAt(value),
                }));

                return (
                  <g key={item.key}>
                    <path
                      d={areaPath(points, PAD.top + PLOT_H)}
                      fill={`url(#activity-${item.key})`}
                    />
                    <path
                      d={smoothPath(points)}
                      fill="none"
                      stroke={item.color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {points.map((point, index) => (
                      <circle
                        key={`${item.key}-${index}`}
                        cx={point.x}
                        cy={point.y}
                        r={hovered === index ? 4.5 : 3}
                        fill="#ffffff"
                        stroke={item.color}
                        strokeWidth="2"
                      />
                    ))}
                  </g>
                );
              })}

              {/* Transparent hover slots, painted last so they sit on top. */}
              {months.map((month, index) => (
                <rect
                  key={`slot-${month.key}`}
                  x={boundaries[index]}
                  y={PAD.top}
                  width={boundaries[index + 1] - boundaries[index]}
                  height={PLOT_H}
                  fill="transparent"
                  onMouseEnter={() => setHovered(index)}
                />
              ))}
            </svg>

            {/* Values for the hovered month, anchored to its column. */}
            {hovered !== null && visible.length > 0 ? (
              <div
                className="pointer-events-none absolute top-2 z-10 min-w-[158px] rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg shadow-slate-900/10"
                style={{
                  left: `${(xAt(hovered) / VIEW.width) * 100}%`,
                  transform:
                    hovered === 0
                      ? "translateX(-8%)"
                      : hovered === months.length - 1
                        ? "translateX(-92%)"
                        : "translateX(-50%)",
                }}
              >
                <p className="text-[11.5px] font-semibold text-slate-900">
                  {months[hovered].label} {months[hovered].year}
                </p>

                <ul className="mt-1.5 space-y-1">
                  {visible.map((item) => (
                    <li key={item.key} className="flex items-center gap-2 text-[11.5px]">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="flex-1 text-slate-500">{item.label}</span>
                      <span className="font-semibold tabular-nums text-slate-900">
                        {item.values[hovered]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Legend: click to hide a series, click again to bring it back. */}
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-5 py-3">
        {series.map((item) => {
          const isHidden = hidden.has(item.key);
          const total = item.values.reduce((sum, value) => sum + value, 0);

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => toggle(item.key)}
              aria-pressed={!isHidden}
              title={isHidden ? `Show ${item.label}` : `Hide ${item.label}`}
              className={cx(
                "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[12px] transition-colors",
                isHidden
                  ? "text-slate-400 opacity-60"
                  : "text-slate-700 hover:bg-slate-50"
              )}
            >
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className={isHidden ? "line-through" : undefined}>{item.label}</span>
              <span className="font-semibold tabular-nums text-slate-900">{total}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
