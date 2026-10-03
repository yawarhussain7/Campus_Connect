import { useCallback, useMemo, useState } from "react";

import { Check, CircleAlert, X } from "lucide-react";

import { cx } from "../../lib/format";
import { ToastContext } from "./toastContext";

const TONES = {
  success: { icon: Check, accent: "text-emerald-600" },
  error: { icon: CircleAlert, accent: "text-red-600" },
};

const DISMISS_AFTER_MS = 3200;

/** Lightweight confirmation messages; no dependency on a toast library. */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (tone, message) => {
      const id = `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;

      setToasts((current) => [...current, { id, tone, message }]);

      window.setTimeout(() => dismiss(id), DISMISS_AFTER_MS);
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      success: (message) => push("success", message),
      error: (message) => push("error", message),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className="pointer-events-none fixed bottom-5 right-5 z-[60] flex w-[340px] flex-col gap-2"
        role="status"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const { icon: Icon, accent } = TONES[toast.tone] ?? TONES.success;

          return (
            <div
              key={toast.id}
              className="pointer-events-auto flex items-start gap-2.5 rounded-md border border-slate-200 bg-white px-3.5 py-3 shadow-lg shadow-slate-900/5"
            >
              <Icon size={17} className={cx("mt-px shrink-0", accent)} />

              <p className="flex-1 text-[13px] font-medium leading-5 text-slate-700">
                {toast.message}
              </p>

              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="-mr-1 shrink-0 rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
