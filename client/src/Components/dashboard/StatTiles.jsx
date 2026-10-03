import React from 'react';
import { useNavigate } from 'react-router-dom';

const HINT_TONES = {
  neutral: 'text-slate-400',
  accent: 'text-blue-600',
  positive: 'text-emerald-600',
  warning: 'text-amber-600',
  critical: 'text-rose-600',
};

/**
 * Flat KPI tiles. Values are the only loud element on the card so the row
 * scans quickly; everything else stays muted.
 */
export default function StatTiles({ items = [] }) {
  const navigate = useNavigate();

  return (
    <section className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ key, label, value, hint, tone = 'neutral', icon: Icon, to }) => (
        <button
          key={key || label}
          type="button"
          onClick={() => to && navigate(to)}
          className="surface-card group px-4 py-3.5 text-left transition hover:border-slate-300/90 hover:bg-slate-50/50"
        >
          <span className="flex items-center justify-between gap-3">
            <span className="text-[12px] font-medium text-slate-500">{label}</span>

            {Icon && (
              <Icon className="h-4 w-4 text-slate-300 transition group-hover:text-slate-400" />
            )}
          </span>

          <span className="mt-2.5 block text-[26px] font-semibold leading-none tracking-tight text-slate-900 tabular-nums">
            {value}
          </span>

          {hint && (
            <span
              className={`mt-2 block text-[11.5px] font-medium ${
                HINT_TONES[tone] || HINT_TONES.neutral
              }`}
            >
              {hint}
            </span>
          )}
        </button>
      ))}
    </section>
  );
}
