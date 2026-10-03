import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  KeyRound,
  Mail,
  MailCheck,
} from "lucide-react";

import { isAdminEmail } from "../lib/adminAuth";
import {
  AUTH_PRIMARY_BUTTON_CLASS,
  EMAIL_PATTERN,
  FIELD_CLASS,
  FIELD_ICON_CLASS,
  FIELD_INVALID_CLASS,
  LABEL_CLASS,
} from "../lib/authStyles";
import { cx } from "../lib/format";

/**
 * The password-reset screen at `/forgot-password`. Collects an email address,
 * validates it, then confirms the reset link. Like the sign-in page it runs on
 * local sample data, so nothing is actually emailed.
 */
export default function ForgotPassword() {
  const location = useLocation();

  // The sign-in screen forwards whatever was typed, so it can be prefilled.
  const [email, setEmail] = useState(location.state?.email ?? "");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Enter your email address");
      return;
    }

    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Enter a valid email address");
      return;
    }

    // Only an allowlisted admin may be sent a reset link.
    if (!isAdminEmail(email)) {
      setError("This email does not have admin access");
      return;
    }

    setSent(true);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[#eef3fb] px-4 py-8">
      <div className="w-full max-w-[400px]">
        {/* Eyebrow */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <KeyRound size={15} strokeWidth={2} className="text-[#64789b]" />

          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64789b]">
            Password Reset
          </span>
        </div>

        <div className="rounded-2xl border border-white/80 bg-white px-6 py-7 shadow-[0_20px_50px_-30px_rgba(15,35,80,0.28)] sm:px-7">
          {/* Brand lockup */}
          <div className="flex items-center justify-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-blue-600 text-white shadow-[0_12px_22px_-14px_rgba(37,99,235,0.9)]">
              <GraduationCap size={22} strokeWidth={2} />
            </span>

            <span className="leading-tight">
              <span className="block text-[18px] font-bold tracking-tight text-slate-900">
                CampusConnect
              </span>

              <span className="mt-0.5 block text-[12px] text-slate-500">
                Admin Portal
              </span>
            </span>
          </div>

          {sent ? (
            /* Confirmation */
            <div className="mt-5 text-center">
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <MailCheck size={22} strokeWidth={2} />
              </span>

              <h1 className="mt-3.5 text-[20px] font-bold tracking-tight text-slate-900">
                Check your inbox
              </h1>

              <p className="mt-1 text-[13px] leading-5 text-slate-500">
                We sent a password reset link to{" "}
                <span className="font-medium text-slate-700">{email.trim()}</span>.
              </p>

              <Link to="/login" className={cx(AUTH_PRIMARY_BUTTON_CLASS, "mt-5")}>
                <ArrowLeft size={16} strokeWidth={2.2} />
                Back to sign in
              </Link>

              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-3 w-full text-center text-[12.5px] font-medium text-blue-600 transition-colors hover:text-blue-700"
              >
                Use a different email
              </button>
            </div>
          ) : (
            /* Request form */
            <>
              <div className="mt-5 text-center">
                <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                  Forgot password?
                </h1>

                <p className="mt-1 text-[13px] text-slate-500">
                  Enter your email address to receive a reset link.
                </p>
              </div>

              <form onSubmit={submit} noValidate className="mt-5 space-y-4">
                <div>
                  <label htmlFor="reset-email" className={LABEL_CLASS}>
                    Email address
                  </label>

                  <div className="relative">
                    <Mail className={FIELD_ICON_CLASS} strokeWidth={1.9} />

                    <input
                      id="reset-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (error) setError("");
                      }}
                      placeholder="yawarhussain793@gmail.com"
                      className={cx(FIELD_CLASS, error && FIELD_INVALID_CLASS)}
                    />
                  </div>

                  {error ? (
                    <p className="mt-1 text-[11.5px] text-red-600">{error}</p>
                  ) : null}
                </div>

                <button type="submit" className={AUTH_PRIMARY_BUTTON_CLASS}>
                  <ArrowRight size={16} strokeWidth={2.2} />
                  Send reset link
                </button>
              </form>

              <Link
                to="/login"
                className="mt-4 flex items-center justify-center gap-1.5 text-[12.5px] font-medium text-slate-500 transition-colors hover:text-slate-700"
              >
                <ArrowLeft size={15} strokeWidth={2.2} />
                Back to sign in
              </Link>
            </>
          )}

          {/* Support footer */}
          <p className="mt-5 text-center text-[12px] text-slate-500">
            Need help?{" "}
            <a
              href="mailto:it-support@campusconnect.app"
              className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
            >
              Contact IT support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
