import { useEffect } from "react";

import { X } from "lucide-react";

import { cx } from "../../lib/format";

const WIDTHS = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl" };

/**
 * Right-hand slide-over. Used for record forms and the read-only detail view.
 * Closes on Escape, on a backdrop click, and restores page scrolling on exit.
 */
export default function Drawer({
  open,
  onClose,
  title,
  description,
  footer,
  width = "md",
  children,
}) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cx(
          "flex h-full w-full flex-col bg-white shadow-2xl",
          WIDTHS[width] ?? WIDTHS.md
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-[15px] font-semibold text-slate-900">{title}</h2>

            {description ? (
              <p className="mt-0.5 text-[12.5px] text-slate-500">{description}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="-mr-1 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={17} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

        {footer ? (
          <footer className="border-t border-slate-200 bg-slate-50 px-5 py-3.5">
            {footer}
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
