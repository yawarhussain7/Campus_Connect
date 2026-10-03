import { ArrowUpRight, CalendarClock, CheckCircle2, ClipboardList, Clock } from 'lucide-react';

import { addedThisMonth, sharePercent, statusCounts } from '../../utils/assignment.js';

/**
 * The four headline numbers above the assignment table. Every figure is worked
 * out from the rows the page holds, so the cards never disagree with the table.
 */
export default function AssignmentSummaryCards({ assignments = [] }) {
  const total = assignments.length;
  const counts = statusCounts(assignments);
  const newThisMonth = addedThisMonth(assignments);

  const tiles = [
    {
      key: 'total',
      label: 'Total Assignments',
      value: total,
      icon: ClipboardList,
      iconTone: 'bg-emerald-50 text-emerald-600',
      note: newThisMonth ? `+${newThisMonth} this month` : 'No new assignments this month',
      noteTone: newThisMonth ? 'text-emerald-600' : 'text-slate-400',
      trend: newThisMonth > 0,
    },
    {
      key: 'pending',
      label: 'Pending',
      value: counts.Pending,
      icon: Clock,
      iconTone: 'bg-blue-50 text-blue-600',
      note: sharePercent(counts.Pending, total),
      noteTone: 'text-slate-500',
    },
    {
      key: 'submitted',
      label: 'Submitted',
      value: counts.Submitted,
      icon: CheckCircle2,
      iconTone: 'bg-emerald-50 text-emerald-600',
      note: sharePercent(counts.Submitted, total),
      noteTone: 'text-slate-500',
    },
    {
      key: 'overdue',
      label: 'Overdue',
      value: counts.Overdue,
      icon: CalendarClock,
      iconTone: 'bg-rose-50 text-rose-600',
      note: sharePercent(counts.Overdue, total),
      noteTone: 'text-slate-500',
    },
  ];

  return (
    <section className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map((tile) => {
        const Icon = tile.icon;

        return (
          <div
            key={tile.key}
            className="surface-card flex items-center gap-3 border-blue-100/80 p-4"
          >
            <span
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${tile.iconTone}`}
            >
              <Icon className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <p className="truncate text-[12px] text-slate-500">{tile.label}</p>

              <p className="text-[20px] font-semibold tracking-tight text-slate-900 tabular-nums">
                {tile.value}
              </p>

              <p
                className={`mt-0.5 flex items-center gap-1 text-[11.5px] ${tile.noteTone}`}
              >
                {tile.trend && <ArrowUpRight className="h-3 w-3 shrink-0" />}
                {tile.note}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
