import { createContext, useContext } from "react";

/** Provided by ToastProvider and consumed through useToast. */
export const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside a ToastProvider");
  }

  return context;
}
