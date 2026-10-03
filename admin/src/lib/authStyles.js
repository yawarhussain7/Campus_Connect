// Presentation shared by the auth screens (/login and /forgot-password) so the
// two cards stay visually identical and change together.

/** The compact 42px rhythm every control shares, with a soft blue focus ring. */
export const FIELD_CLASS =
  "h-[42px] w-full rounded-[9px] border border-slate-200 bg-white pl-10 pr-3.5 text-[13px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

export const FIELD_INVALID_CLASS =
  "border-red-300 focus:border-red-400 focus:ring-red-100";

/** Decorative leading icon inside each field. */
export const FIELD_ICON_CLASS =
  "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400";

/** Field heading shared by every input. */
export const LABEL_CLASS = "mb-1.5 block text-[12.5px] font-medium text-slate-700";

/** Primary blue action (Sign in, Send reset link) shared by both screens. */
export const AUTH_PRIMARY_BUTTON_CLASS =
  "flex h-[42px] w-full items-center justify-center gap-2 rounded-[9px] bg-blue-600 text-[13.5px] font-semibold text-white shadow-[0_14px_26px_-14px_rgba(37,99,235,0.9)] transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/25 disabled:cursor-not-allowed disabled:opacity-70";

/** Client-side email check; the API is the real authority. */
export const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
