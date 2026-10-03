import { cx } from "../../lib/format";

/**
 * Underlined filter tabs with a count pill per option. Sits directly above the
 * table, so the current slice of data is obvious at a glance.
 */
export default function FilterTabs({ options, value, counts = {}, onChange }) {
  const items = [{ value: "all", label: "All" }, ...options];

  return (
    <div className="flex items-center gap-0.5 overflow-x-auto border-b border-slate-200 px-3">
      {items.map((item) => {
        const isActive = item.value === value;

        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(item.value)}
            className={cx(
              "relative -mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13px] font-medium transition-colors",
              isActive
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
            )}
          >
            {item.label}

            <span
              className={cx(
                "rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold",
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "bg-slate-100 text-slate-500"
              )}
            >
              {counts[item.value] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
