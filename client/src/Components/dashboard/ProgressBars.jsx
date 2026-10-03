import React from 'react';

/**
 * Semester progress as horizontal meters: easy to compare at a glance and
 * quiet enough to sit next to the calendar in the rail.
 */
export default function ProgressBars({ items = [], overall = 0, term }) {
  const safeOverall = Math.max(0, Math.min(100, Number(overall) || 0));

  return (
    <section className="surface-card">
      <div className="surface-card-header">
        <div>
          <h2 className="text-[13px] font-semibold text-slate-900">Progress</h2>

          {term && (
            <p className="mt-0.5 text-[11.5px] text-slate-400">{term}</p>
          )}
        </div>

        <span className="text-[19px] font-semibold leading-none text-slate-900 tabular-nums">
          {safeOverall}
          <span className="ml-0.5 text-[12px] font-medium text-slate-400">
            %
          </span>
        </span>
      </div>

      <div className="space-y-3.5 p-4">
        {items.map((item) => {
          const value = Math.max(0, Math.min(100, Number(item.value) || 0));

          return (
            <div key={item.label}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[12px] font-medium text-slate-600">
                  {item.label}
                </span>

                <span className="text-[11px] text-slate-400 tabular-nums">
                  {item.caption}
                </span>
              </div>

              <div
                role="progressbar"
                aria-label={item.label}
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={100}
                className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100"
              >
                <div
                  className={`h-full rounded-full ${
                    item.tone === 'muted' ? 'bg-slate-400' : 'bg-blue-600'
                  }`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
