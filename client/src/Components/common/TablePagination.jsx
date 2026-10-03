import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Page numbers to show, with '…' where numbers were skipped. */
const pageNumbers = (current, total) => {
  if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1);

  const visible = [...new Set([1, current - 1, current, current + 1, total])]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  return visible.flatMap((page, index) =>
    index > 0 && page - visible[index - 1] > 1 ? ['…', page] : [page]
  );
};

/**
 * Footer shared by the list tables: "Showing 1 – 6 of 24 reviews" on the left
 * and the page buttons on the right. `noun` is the singular word to count.
 */
export default function TablePagination({
  page,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  noun = 'item',
  ariaLabel,
}) {
  if (!totalItems) return null;

  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, totalItems);
  const label = totalItems === 1 ? noun : `${noun}s`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
      <p className="text-[11.5px] text-slate-500 tabular-nums">
        Showing {first} – {last} of {totalItems} {label}
      </p>

      {/* Kept visible for a single page too, so the footer keeps its shape. */}
      {totalPages >= 1 && (
        <nav
          className="flex items-center gap-1"
          aria-label={ariaLabel || `${label} pagination`}
        >
          <PageButton
            label="Previous page"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </PageButton>

          {pageNumbers(page, totalPages).map((entry, index) =>
            entry === '…' ? (
              <span
                key={`gap-${index}`}
                className="px-1 text-[12px] text-slate-400"
              >
                …
              </span>
            ) : (
              <PageButton
                key={entry}
                active={entry === page}
                ariaCurrent={entry === page}
                onClick={() => onPageChange(entry)}
              >
                {entry}
              </PageButton>
            )
          )}

          <PageButton
            label="Next page"
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </PageButton>
        </nav>
      )}
    </div>
  );
}

function PageButton({
  children,
  active = false,
  disabled = false,
  label,
  ariaCurrent,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-current={ariaCurrent ? 'page' : undefined}
      className={`flex h-8 min-w-8 items-center justify-center rounded-[8px] border px-2 text-[12px] tabular-nums transition ${
        active
          ? 'border-blue-600 bg-blue-600 font-medium text-white'
          : disabled
          ? 'border-slate-200 text-slate-300'
          : 'border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      {children}
    </button>
  );
}
