import { ChevronLeft, ChevronRight } from "lucide-react";

import { cx } from "../../lib/format";

/** "1 2 3 4 5 … 12" around the current page; short lists are shown in full. */
function pageWindow(page, pageCount) {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const wanted = [...new Set([1, pageCount, page - 1, page, page + 1])]
    .filter((value) => value >= 1 && value <= pageCount)
    .sort((a, b) => a - b);

  const output = [];

  for (const value of wanted) {
    const previous = output[output.length - 1];

    if (typeof previous === "number" && value - previous > 1) output.push("gap");

    output.push(value);
  }

  return output;
}

function StepButton({ label, icon: Icon, disabled, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Icon size={15} strokeWidth={2} />
    </button>
  );
}

export default function Pagination({
  page,
  pageCount,
  from,
  to,
  total,
  itemLabel = "records",
  onChange,
}) {
  const pages = pageWindow(page, Math.max(pageCount, 1));

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3.5">
      <p className="text-[12.5px] text-slate-500">
        Showing{" "}
        <span className="font-medium text-slate-700">
          {total === 0 ? 0 : from} - {total === 0 ? 0 : to}
        </span>{" "}
        of <span className="font-medium text-slate-700">{total}</span> {itemLabel}
      </p>

      <div className="flex items-center gap-1.5">
        <StepButton
          label="Previous page"
          icon={ChevronLeft}
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
        />

        {pages.map((entry, index) =>
          entry === "gap" ? (
            <span
              key={`gap-${index}`}
              className="px-1 text-[12.5px] leading-8 text-slate-400"
            >
              …
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              aria-label={`Page ${entry}`}
              aria-current={entry === page ? "page" : undefined}
              onClick={() => onChange(entry)}
              className={cx(
                "h-8 w-8 rounded-lg text-[12.5px] font-medium transition-colors",
                entry === page
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {entry}
            </button>
          )
        )}

        <StepButton
          label="Next page"
          icon={ChevronRight}
          disabled={page >= pageCount}
          onClick={() => onChange(page + 1)}
        />
      </div>
    </div>
  );
}
