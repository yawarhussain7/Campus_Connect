import { useCallback, useMemo, useState } from "react";

import { Check, CircleAlert, Info, TriangleAlert, X } from "lucide-react";

import { cx } from "../../lib/format";
import { ToastContext } from "./toastContext";

const TONES = {
  success: {
    icon: Check,
    accent: "text-emerald-600",
    ring: "border-emerald-200",
    iconBg: "bg-emerald-50",
  },
  error: {
    icon: CircleAlert,
    accent: "text-red-600",
    ring: "border-red-200",
    iconBg: "bg-red-50",
  },
  info: {
    icon: Info,
    accent: "text-blue-600",
    ring: "border-blue-200",
    iconBg: "bg-blue-50",
  },
  warning: {
    icon: TriangleAlert,
    accent: "text-amber-600",
    ring: "border-amber-200",
    iconBg: "bg-amber-50",
  },
};

const DISMISS_AFTER_MS = 3600;

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
      info: (message) => push("info", message),
      warning: (message) => push("warning", message),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className="pointer-events-none fixed left-1/2 top-5 z-[120] flex w-full max-w-md -translate-x-1/2 flex-col gap-2 px-4"
        role="status"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const tone = TONES[toast.tone] ?? TONES.success;
          const Icon = tone.icon;

          return (
            <div
              key={toast.id}
              className={cx(
                "toast-enter pointer-events-auto flex items-start gap-3 rounded-2xl border bg-white px-4 py-3.5 shadow-xl shadow-slate-900/10 backdrop-blur",
                tone.ring
              )}
            >
              <span
                className={cx(
                  "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                  tone.iconBg
                )}
              >
                <Icon size={17} className={tone.accent} />
              </span>

              <p className="flex-1 pt-1 text-[13px] font-medium leading-5 text-slate-700">
                {toast.message}
              </p>

              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="-mr-1 shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
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
