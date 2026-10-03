import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, ArrowRight, Check, Loader2, Mail } from 'lucide-react';

import AuthShell, {
  FIELD_CLASS,
  FIELD_ICON_CLASS,
  LABEL_CLASS,
  PRIMARY_BUTTON_CLASS,
} from '../../Components/common/AuthShell.jsx';
import { ForgotPasswordUser } from '../../api/auth.js';

/**
 * The student "Forgot password?" screen behind `/auth/forgot-password`.
 *
 * It reuses `AuthShell`, so it shares the exact artwork, card and brand header
 * of the login screen. There are two states: the email form and, once the
 * request succeeds, a confirmation panel that tells the student to check their
 * inbox.
 */
export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await ForgotPasswordUser(email.trim());

      if (response.success) {
        toast.success(response?.message || 'Password reset link sent to your email');
        setSent(true);
      } else {
        toast.error(response?.message || 'Could not send the reset link.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell subtitle="Forgot Password">
      {sent ? (
        <>
          {/* Confirmation panel */}
          <div className="mt-6 flex flex-col items-center text-center [@media(min-height:820px)]:mt-7">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-[#1869f2]/10">
              <Check className="h-7 w-7 text-[#1869f2]" strokeWidth={2.6} />
            </span>

            <h2 className="mt-4 text-[21px] font-extrabold leading-tight tracking-tight text-[#0b2570] [@media(min-height:820px)]:text-[25px]">
              Check your inbox
            </h2>
            <p className="mt-1 text-[13px] text-[#5d76a9] [@media(min-height:820px)]:text-[14px]">
              We sent a password reset link to{' '}
              <span className="font-semibold text-[#16305f]">{email.trim()}</span>. The
              link expires in 15 minutes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/auth/signIn')}
            className={`${PRIMARY_BUTTON_CLASS} mt-5 [@media(min-height:820px)]:mt-6`}
          >
            Back to login
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </button>

          <p className="mt-3 text-center text-[12.5px] text-[#5d76a9] [@media(min-height:820px)]:mt-4 [@media(min-height:820px)]:text-[13px]">
            Didn&apos;t get the email?{' '}
            <button
              type="button"
              onClick={() => setSent(false)}
              className="font-semibold text-[#1869f2] transition hover:text-[#1559d6]"
            >
              Try again
            </button>
          </p>

          {/* Back to the landing page */}
          <Link
            to="/"
            className="mt-3 flex items-center justify-center gap-1.5 text-[12px] font-medium text-[#5d76a9] transition hover:text-[#1869f2] [@media(min-height:820px)]:mt-4 [@media(min-height:820px)]:text-[12.5px]"
          >
            <ArrowLeft className="h-[13px] w-[13px]" strokeWidth={2.2} />
            Back to home
          </Link>
        </>
      ) : (
        <>
          <h2 className="mt-4 text-[21px] font-extrabold leading-tight tracking-tight text-[#0b2570] [@media(min-height:820px)]:mt-5 [@media(min-height:820px)]:text-[25px]">
            Forgot Password?
          </h2>
          <p className="mt-1 text-[13px] text-[#5d76a9] [@media(min-height:820px)]:text-[14px]">
            Enter your student email and we&apos;ll send you a link to reset your
            password.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-4 space-y-[12px] [@media(min-height:820px)]:mt-5 [@media(min-height:820px)]:space-y-[15px]"
          >
            {/* Email */}
            <div>
              <label htmlFor="email" className={LABEL_CLASS}>
                Email Address
              </label>

              <div className="relative">
                <Mail className={FIELD_ICON_CLASS} strokeWidth={1.9} />

                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${FIELD_CLASS} pr-3.5`}
                />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={submitting} className={PRIMARY_BUTTON_CLASS}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? 'Sending…' : 'Send reset link'}
              {!submitting && <ArrowRight className="h-4 w-4" strokeWidth={2.2} />}
            </button>
          </form>

          {/* Divider + route switch */}
          <div className="mt-4 flex items-center gap-4 [@media(min-height:820px)]:mt-5">
            <span className="h-px flex-1 bg-[#e6ebf5]" />
            <span className="text-[12px] font-medium text-[#9aa8c2]">or</span>
            <span className="h-px flex-1 bg-[#e6ebf5]" />
          </div>

          <p className="mt-3 text-center text-[12.5px] text-[#5d76a9] [@media(min-height:820px)]:mt-4 [@media(min-height:820px)]:text-[13px]">
            Remembered your password?{' '}
            <button
              type="button"
              onClick={() => navigate('/auth/signIn')}
              className="font-semibold text-[#1869f2] transition hover:text-[#1559d6]"
            >
              Sign in
            </button>
          </p>

          <p className="mt-2.5 text-center text-[11.5px] text-[#9aa8c2] [@media(min-height:820px)]:mt-3 [@media(min-height:820px)]:text-[12px]">
            Only authorized students can access this portal.
          </p>

          {/* Back to the landing page */}
          <Link
            to="/"
            className="mt-3 flex items-center justify-center gap-1.5 text-[12px] font-medium text-[#5d76a9] transition hover:text-[#1869f2] [@media(min-height:820px)]:mt-4 [@media(min-height:820px)]:text-[12.5px]"
          >
            <ArrowLeft className="h-[13px] w-[13px]" strokeWidth={2.2} />
            Back to home
          </Link>
        </>
      )}
    </AuthShell>
  );
}
