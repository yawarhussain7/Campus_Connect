
import React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import ModernSelect from '../common/ModernSelect';

/**
 * Filter panel for the project queue. Each group is `{ key, label, placeholder,
 * options }` and the chosen value is read from `values[key]`, so the panel only
 * ever offers values the loaded projects actually carry.
 */
export default function MatrixFilters({ groups = [], values = {}, onChange }) {
  const activeCount = groups.filter((group) => values[group.key]).length;

  const hasActiveFilters = activeCount > 0;

  const clearFilters = () => {
    groups.forEach((group) => onChange(group.key, ''));
  };

  return (
    <section className="surface-card p-4">
      {/* Header */}
      <div className="mb-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />

          <h2 className="text-[13px] font-semibold text-slate-900">
            Refine projects
          </h2>

          {hasActiveFilters && (
            <span className="rounded-md bg-blue-50 px-2 py-[3px] text-[10.5px] font-medium text-blue-700">
              {activeCount} active
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1 text-[11.5px] font-medium text-slate-500 transition hover:text-slate-800"
          >
            <X className="h-3.5 w-3.5" />
            Clear all
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {groups.map((group) => (
          <ModernSelect
            key={group.key}
            label={group.label}
            value={values[group.key] || ''}
            onChange={(value) => onChange(group.key, value)}
            options={[
              { value: '', label: group.placeholder },
              ...group.options.map((option) => ({
                value: option,
                label: option,
              })),
            ]}
            placeholder={group.placeholder}
          />
        ))}
      </div>
    </section>
  );
}

