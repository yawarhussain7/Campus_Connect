import { useEffect, useRef, useState } from "react";

import { cx } from "../../lib/format";

/**
 * Click-to-open dropdown; closes on an outside click or Escape.
 * `trigger` is a render prop receiving `{ open, toggle }`.
 */
export default function Menu({ trigger, children, align = "right", panelClassName }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleDown);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      {trigger({ open, toggle: () => setOpen((value) => !value) })}

      {open ? (
        <div
          role="menu"
          // Any click inside is an action, so the panel closes itself.
          onClick={() => setOpen(false)}
          className={cx(
            "absolute z-40 mt-2 min-w-[200px] rounded-xl border border-slate-200 bg-white p-1.5",
            "shadow-lg shadow-slate-900/5",
            align === "right" ? "right-0" : "left-0",
            panelClassName
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function MenuItem({ icon: Icon, danger, children, ...props }) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cx(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors",
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-slate-700 hover:bg-slate-100"
      )}
      {...props}
    >
      {Icon ? <Icon size={15} strokeWidth={1.9} /> : null}

      {children}
    </button>
  );
}

export function MenuLabel({ children }) {
  return (
    <p className="px-2.5 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-wide text-slate-400">
      {children}
    </p>
  );
}
