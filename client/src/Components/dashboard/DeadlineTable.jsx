import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, ChevronRight } from 'lucide-react';

import { daysUntil, formatCountdown, formatDayMonth } from '../../utils/date';

const TYPE_STYLES = {
  Assignment: 'bg-blue-50 text-blue-700',
  Project: 'bg-blue-50 text-blue-700',
  Quiz: 'bg-amber-50 text-amber-700',
  Exam: 'bg-rose-50 text-rose-700',
};

const PRIORITY_DOTS = {
  High: 'bg-rose-500',
  Medium: 'bg-amber-500',
  Low: 'bg-slate-300',
};

/**
 * Deadline queue rendered as a compact table: task / type / due.
 * Priority is carried by the leading dot so no extra column is needed.
 */
export default function DeadlineTable({ items = [], viewAllTo = '/student/assignments' }) {
  const navigate = useNavigate();

  return (
    <section className="surface-card overflow-hidden">
      <div className="surface-card-header">
        <div className="min-w-0">
          <h2 className="text-[13px] font-semibold text-slate-900">
            Upcoming deadlines
          </h2>

          <p className="mt-0.5 text-[11.5px] text-slate-400">
            {items.length > 0
              ? `${items.length} open ${items.length === 1 ? 'item' : 'items'} this period`
              : 'Nothing scheduled'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(viewAllTo)}
          className="inline-flex items-center gap-1 text-[11.5px] font-medium text-blue-600 transition hover:text-blue-700"
        >
          All assignments
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-10 text-center">
          <CalendarCheck className="h-5 w-5 text-slate-300" />

          <p className="mt-3 text-[12.5px] font-medium text-slate-600">
            You are all caught up
          </p>

          <p className="mt-1 text-[11.5px] text-slate-400">
            New deadlines appear here as soon as your instructors post them.
          </p>
        </div>
      ) : (
        <ul>
          {items.map((item) => {
            const overdue = (daysUntil(item.due) ?? 0) < 0;

            return (
              <li
                key={item.id}
                className="grid grid-cols-1 items-center gap-x-4 gap-y-1.5 border-t border-slate-100 px-4 py-3.5 transition first:border-t-0 hover:bg-slate-50/60 sm:grid-cols-[minmax(0,1fr)_104px_128px]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    title={`${item.priority || 'Low'} priority`}
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      PRIORITY_DOTS[item.priority] || PRIORITY_DOTS.Low
                    }`}
                  />

                  <div className="min-w-0">
                    <p className="truncate text-[12.5px] font-medium text-slate-800">
                      {item.title}
                    </p>

                    <p className="mt-0.5 truncate text-[11px] text-slate-400">
                      {item.code ? `${item.code} · ` : ''}
                      {item.course}
                    </p>
                  </div>
                </div>

                <span
                  className={`w-fit rounded-md px-2 py-[3px] text-[11px] font-medium ${
                    TYPE_STYLES[item.type] || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.type}
                </span>

                <div className="sm:text-right">
                  <p className="text-[12px] font-medium text-slate-700 tabular-nums">
                    {formatDayMonth(item.due)}
                  </p>

                  <p
                    className={`mt-0.5 text-[11px] ${
                      overdue ? 'font-medium text-rose-600' : 'text-slate-400'
                    }`}
                  >
                    {formatCountdown(item.due)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
