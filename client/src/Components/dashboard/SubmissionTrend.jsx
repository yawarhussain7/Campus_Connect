import { TrendingUp } from 'lucide-react';

import { formatDayMonth } from '../../utils/date';

const MS_PER_DAY = 86400000;
const WEEK_COUNT = 6;

/**
 * Fallback series used only when no dated submission exists yet, so the card
 * never renders as a dead panel. The header tags it as sample data.
 */
const SAMPLE_SERIES = [
  { assignments: 3, projects: 2 },
  { assignments: 5, projects: 3 },
  { assignments: 4, projects: 5 },
  { assignments: 6, projects: 4 },
  { assignments: 5, projects: 6 },
  { assignments: 7, projects: 5 },
];

const SERIES = [
  { key: 'assignments', label: 'Assignments', color: '#2563eb' },
  { key: 'projects', label: 'Projects', color: '#10b981' },
];

const VIEW = {
  width: 340,
  height: 176,
  left: 30,
  right: 10,
  top: 12,
  bottom: 30,
};

const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** Monday-first start of the week that contains `date`. */
const startOfWeek = (date) => {
  const dayIndex = (date.getDay() + 6) % 7;

  return new Date(startOfDay(date).getTime() - dayIndex * MS_PER_DAY);
};

/**
 * "2026-10-05" is read as a local calendar day so week buckets do not shift
 * for readers west of Greenwich; anything else falls back to Date parsing.
 */
const parseDate = (value) => {
  if (!value) return null;

  const parts = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (parts) {
    const date = new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));

    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

/** The last six weeks, oldest first, as { start, end } pairs. */
const buildWeeks = () => {
  const currentWeek = startOfWeek(new Date());
  const weeks = [];

  for (let index = WEEK_COUNT - 1; index >= 0; index -= 1) {
    const start = new Date(currentWeek.getTime() - index * 7 * MS_PER_DAY);

    weeks.push({ start, end: new Date(start.getTime() + 7 * MS_PER_DAY) });
  }

  return weeks;
};

/** How many rows of `records` were submitted inside each week bucket. */
const countSubmissions = (records, weeks) => {
  const counts = weeks.map(() => 0);

  records.forEach((record) => {
    if (record.status !== 'Submitted') return;

    const date = parseDate(record.addedOn);
    if (!date) return;

    const bucket = weeks.findIndex(
      (week) => date >= week.start && date < week.end
    );

    if (bucket >= 0) counts[bucket] += 1;
  });

  return counts;
};

/**
 * Grouped bar chart of submissions per week. It reads the real addedOn and
 * status fields the loaded rows carry, and only falls back to a tagged sample
 * series when nothing has a usable date yet.
 */
export default function SubmissionTrend({ assignments = [], projects = [] }) {
  const weeks = buildWeeks();

  const realSeries = {
    assignments: countSubmissions(assignments, weeks),
    projects: countSubmissions(projects, weeks),
  };

  const total = [...realSeries.assignments, ...realSeries.projects].reduce(
    (sum, value) => sum + value,
    0
  );

  const isSample = total === 0;

  const series = isSample
    ? {
        assignments: SAMPLE_SERIES.map((point) => point.assignments),
        projects: SAMPLE_SERIES.map((point) => point.projects),
      }
    : realSeries;

  const peak = Math.max(1, ...series.assignments, ...series.projects);
  const scaleMax = peak <= 4 ? 4 : Math.ceil(peak / 2) * 2;

  const plotWidth = VIEW.width - VIEW.left - VIEW.right;
  const plotHeight = VIEW.height - VIEW.top - VIEW.bottom;
  const groupWidth = plotWidth / WEEK_COUNT;
  const barWidth = 13;
  const barGap = 4;
  const pairWidth = barWidth * 2 + barGap;
  const baseline = VIEW.top + plotHeight;

  const yOf = (value) => VIEW.top + plotHeight * (1 - value / scaleMax);

  const ticks = [0, scaleMax / 2, scaleMax];

  return (
    <section className="surface-card overflow-hidden">
      <div className="surface-card-header">
        <div className="flex min-w-0 items-center gap-2.5">
          <TrendingUp className="h-4 w-4 shrink-0 text-slate-400" />

          <div className="min-w-0">
            <h2 className="text-[13px] font-semibold text-slate-900">
              Weekly submissions
            </h2>

            <p className="mt-0.5 truncate text-[11.5px] text-slate-400">
              {isSample
                ? 'Sample data · last 6 weeks'
                : `${total} submitted · last 6 weeks`}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {SERIES.map((item) => (
            <span
              key={item.key}
              className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500"
            >
              <span
                className="h-2 w-2 rounded-[3px]"
                style={{ backgroundColor: item.color }}
              />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4">
        <svg
          viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
          className="h-auto w-full"
          role="img"
          aria-label="Grouped bar chart of assignment and project submissions over the last six weeks"
        >
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={VIEW.left}
                x2={VIEW.width - VIEW.right}
                y1={yOf(tick)}
                y2={yOf(tick)}
                stroke={tick === 0 ? '#e2e8f0' : '#eef2f7'}
                strokeWidth="1"
              />

              <text
                x={VIEW.left - 7}
                y={yOf(tick) + 3}
                textAnchor="end"
                className="fill-slate-400 text-[9.5px] tabular-nums"
              >
                {tick}
              </text>
            </g>
          ))}

          {weeks.map((week, index) => {
            const groupX = VIEW.left + index * groupWidth;
            const pairX = groupX + (groupWidth - pairWidth) / 2;
            const isCurrentWeek = index === weeks.length - 1;

            return (
              <g key={week.start.toISOString()}>
                {SERIES.map((item, seriesIndex) => {
                  const value = series[item.key][index];

                  if (value <= 0) return null;

                  const x = pairX + seriesIndex * (barWidth + barGap);
                  const y = yOf(value);

                  return (
                    <rect
                      key={item.key}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={baseline - y}
                      rx="2.5"
                      fill={item.color}
                    >
                      <title>
                        {`${item.label}: ${value} in week of ${formatDayMonth(
                          week.start
                        )}`}
                      </title>
                    </rect>
                  );
                })}

                <text
                  x={groupX + groupWidth / 2}
                  y={VIEW.height - 10}
                  textAnchor="middle"
                  className={
                    isCurrentWeek
                      ? 'fill-slate-700 text-[9.5px] font-semibold'
                      : 'fill-slate-400 text-[9.5px]'
                  }
                >
                  {formatDayMonth(week.start)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}


