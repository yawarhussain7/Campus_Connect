import { BarChart3 } from 'lucide-react';

/**
 * Fallback rows used only when neither collection has a course yet, so the
 * card still shows a workload shape. The header tags them as sample data.
 */
const SAMPLE_COURSES = [
  { label: 'CS405', name: 'Software Engineering', total: 7 },
  { label: 'CS305', name: 'Database Systems', total: 6 },
  { label: 'CS310', name: 'Operating Systems', total: 5 },
  { label: 'CS320', name: 'Computer Networks', total: 4 },
  { label: 'CS340', name: 'Artificial Intelligence', total: 3 },
  { label: 'CS350', name: 'Web Technologies', total: 2 },
];

const ROW_LIMIT = 6;

/**
 * Horizontal bars of how many assignments and projects each course carries.
 * Reads the course/subject fields of the loaded rows; falls back to a tagged
 * sample set while the registry is empty.
 */
export default function CourseWorkload({
  assignments = [],
  projects = [],
  viewAllTo = '/student/assignments',
  onOpenAll,
}) {
  const grouped = new Map();

  [...assignments, ...projects].forEach((item) => {
    const key = item.course || item.subject || 'Unlisted course';
    const entry = grouped.get(key) || { label: key, name: '', total: 0 };

    if (!entry.name && item.subject && item.subject !== key) {
      entry.name = item.subject;
    }

    entry.total += 1;
    grouped.set(key, entry);
  });

  const allRows = [...grouped.values()].sort((a, b) => b.total - a.total);
  const isSample = allRows.length === 0;

  const rows = (isSample ? SAMPLE_COURSES : allRows).slice(0, ROW_LIMIT);
  const trackedTotal = allRows.reduce((sum, row) => sum + row.total, 0);
  const peak = Math.max(1, ...rows.map((row) => row.total));

  return (
    <section className="surface-card overflow-hidden">
      <div className="surface-card-header">
        <div className="min-w-0">
          <h2 className="text-[13px] font-semibold text-slate-900">
            Course workload
          </h2>

          <p className="mt-0.5 text-[11.5px] text-slate-400">
            {isSample
              ? 'Sample data · assignments + projects'
              : `${trackedTotal} items across ${allRows.length} ${
                  allRows.length === 1 ? 'course' : 'courses'
                }`}
          </p>
        </div>

        <span className="shrink-0 rounded-md bg-slate-100 px-2 py-[3px] text-[11px] font-medium text-slate-500">
          Top {rows.length}
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-10 text-center">
          <BarChart3 className="h-5 w-5 text-slate-300" />

          <p className="mt-3 text-[12.5px] font-medium text-slate-600">
            Nothing to chart yet
          </p>

          <p className="mt-1 text-[11.5px] text-slate-400">
            Workload appears here as soon as courses are assigned.
          </p>
        </div>
      ) : (
        <ul className="space-y-3.5 p-4">
          {rows.map((row) => (
            <li key={row.label}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="flex min-w-0 items-baseline gap-1.5">
                  <span className="truncate text-[12px] font-medium text-slate-700">
                    {row.label}
                  </span>

                  {row.name && (
                    <span className="truncate text-[11px] text-slate-400">
                      {row.name}
                    </span>
                  )}
                </span>

                <span className="shrink-0 text-[11.5px] font-semibold text-slate-600 tabular-nums">
                  {row.total}
                </span>
              </div>

              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${Math.round((row.total / peak) * 100)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {!isSample && rows.length > 0 && onOpenAll && (
        <div className="border-t border-slate-100 px-4 py-2.5">
          <button
            type="button"
            onClick={() => onOpenAll(viewAllTo)}
            className="text-[11.5px] font-medium text-blue-600 transition hover:text-blue-700"
          >
            Open the full list
          </button>
        </div>
      )}
    </section>
  );
}