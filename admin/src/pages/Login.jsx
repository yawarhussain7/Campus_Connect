import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  Landmark,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { cx } from "../lib/format";
import { useToast } from "../components/ui/toastContext";
import { saveSession } from "../lib/session";
import { apiErrorMessage, loginRequest, logoutRequest } from "../lib/api";
import {
  AUTH_PRIMARY_BUTTON_CLASS,
  EMAIL_PATTERN,
  FIELD_CLASS,
  FIELD_ICON_CLASS,
  FIELD_INVALID_CLASS,
  LABEL_CLASS,
} from "../lib/authStyles";

/*
 * Palette sampled from the sign-in mockup so this page matches it:
 *   page background .................... #eef3fb
 *   navy headings / wordmark ........... slate-900  (#0f172a)
 *   brand blue (CTA, links, logo) ...... blue-600   (#2563eb)  hover blue-700
 *   muted copy ......................... slate-500
 *   field hairline ..................... slate-200
 *   "SECURE ADMIN ACCESS" eyebrow ...... #64789b
 */

/* The field styling and the email check live in lib/authStyles, shared with the
 * forgot-password screen. */

/**
 * The admin portal sign-in page at `/login`, rendered outside the app shell so
 * it owns the whole window. Credentials are verified by the real backend
 * (POST /auth/signIn), which also leaves the httpOnly token cookie every
 * /admin request rides on; only accounts whose stored role is `admin` are let
 * through, and a successful submit records the session locally.
 */
export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /** Client-side checks; returns true when the form is safe to submit. */
  const validate = () => {
    const next = {};

    if (!email.trim()) {
      next.email = "Enter your email address";
    } else if (!EMAIL_PATTERN.test(email.trim())) {
      next.email = "Enter a valid email address";
    }

    if (!password) {
      next.password = "Enter your password";
    } else if (password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      // Real backend sign-in: on success the server sets the httpOnly `token`
      // cookie (credentials: "include") that every /admin call sends back.
      const response = await loginRequest(email.trim(), password);
      const user = response.data;

      if (user?.role !== "admin") {
        // A student account must not keep the admin cookie lying around.
        try {
          await logoutRequest();
        } catch {
          // Clearing a cookie that was never set is not worth a toast.
        }

        setErrors({ email: "This account does not have admin access" });
        toast.error("This account cannot access the admin panel");
        return;
      }

      saveSession({
        name: user.name,
        email: user.email,
        role: user.role,
        rememberMe,
      });
      toast.success(`Welcome back, ${(user.name || "Admin").split(" ")[0]}`);
      navigate("/overview", { replace: true });
    } catch (error) {
      const message = apiErrorMessage(error);

      setErrors({ password: message });
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  /** Carries the typed address across so the reset screen can prefill it. */
  const handleForgotPassword = () => {
    navigate("/forgot-password", { state: { email: email.trim() } });
  };

  const handleSso = () => {
    toast.success("Redirecting to your university SSO…");
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[#eef3fb] px-4 py-8">
      <div className="w-full max-w-[400px]">
        {/* Eyebrow: "SECURE ADMIN ACCESS" */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <ShieldCheck size={15} strokeWidth={2} className="text-[#64789b]" />

          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64789b]">
            Secure Admin Access
          </span>
        </div>

        {/* Card */}
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

          {/* Welcome */}
          <div className="mt-5 text-center">
            <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>

            <p className="mt-1 text-[13px] text-slate-500">
              Sign in to manage your campus
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
            {/* Email address */}
            <div>
              <label htmlFor="admin-email" className={LABEL_CLASS}>
                Email address
              </label>

              <div className="relative">
                <Mail className={FIELD_ICON_CLASS} strokeWidth={1.9} />

                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (errors.email) setErrors((current) => ({ ...current, email: undefined }));
                  }}
                  placeholder="admin123@gmail.com"
                  className={cx(FIELD_CLASS, errors.email && FIELD_INVALID_CLASS)}
                />
              </div>

              {errors.email ? (
                <p className="mt-1 text-[11.5px] text-red-600">{errors.email}</p>
              ) : null}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" className={LABEL_CLASS}>
                Password
              </label>

              <div className="relative">
                <Lock className={FIELD_ICON_CLASS} strokeWidth={1.9} />

                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (errors.password) setErrors((current) => ({ ...current, password: undefined }));
                  }}
                  placeholder="••••••••"
                  className={cx(FIELD_CLASS, "pr-10", errors.password && FIELD_INVALID_CLASS)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff size={16} strokeWidth={1.9} />
                  ) : (
                    <Eye size={16} strokeWidth={1.9} />
                  )}
                </button>
              </div>

              {errors.password ? (
                <p className="mt-1 text-[11.5px] text-red-600">{errors.password}</p>
              ) : null}
            </div>

            {/* Remember me + forgot password */}
            <div className="flex items-center justify-between gap-3">
              <label className="flex cursor-pointer select-none items-center gap-2 text-[12.5px] font-medium text-slate-700">
                <span className="relative grid h-4 w-4 shrink-0 place-items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="peer h-4 w-4 cursor-pointer appearance-none rounded-[4px] border border-slate-300 bg-white transition checked:border-blue-600 checked:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
                  />

                  <Check
                    className="pointer-events-none absolute h-3 w-3 text-white opacity-0 transition peer-checked:opacity-100"
                    strokeWidth={3}
                  />
                </span>
                Remember me
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[12.5px] font-medium text-blue-600 transition-colors hover:text-blue-700"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className={AUTH_PRIMARY_BUTTON_CLASS}
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : null}

              {submitting ? "Signing in…" : "Sign In"}

              {!submitting ? <ArrowRight size={16} strokeWidth={2.2} /> : null}
            </button>
          </form>

          {/* OR divider */}
          <div className="my-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-slate-200" />

            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
              or
            </span>

            <span className="h-px flex-1 bg-slate-200" />
          </div>

          {/* University SSO */}
          <button
            type="button"
            onClick={handleSso}
            className="flex h-[42px] w-full items-center justify-center gap-2 rounded-[9px] border border-slate-200 bg-white text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
          >
            <Landmark size={16} strokeWidth={1.9} className="text-slate-500" />
            Sign in with university SSO
          </button>

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
