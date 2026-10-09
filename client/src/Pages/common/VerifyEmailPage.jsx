import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, ArrowRight, Check, KeyRound, Loader2, Mail } from 'lucide-react';

import AuthShell, {
  FIELD_CLASS,
  FIELD_ICON_CLASS,
  LABEL_CLASS,
  PRIMARY_BUTTON_CLASS,
} from '../../Components/common/AuthShell.jsx';
import { VerifyEmailUser, ResendVerificationEmail } from '../../api/auth.js';

/**
 * The verification gate behind `/verify-email`. Sign-up and blocked sign-in
 * both land here, and the account cannot be used until the one-time token from
 * the verification email is entered.
 *
 * Two ways in:
 *   - The emailed link (`?token=...`) verifies itself on arrival.
 *   - Otherwise a form is shown: paste the code from the email (the token in
 *     the link), then continue to sign-in. A resend works by address, since no
 *     session exists yet — login is locked until this step passes.
 */
export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // The emailed link carries ?token=; signup hands the address over via
  // router state so the form (and resend) can prefill it.
  const linkToken = searchParams.get('token');
  const initialEmail = location.state?.email || '';

  // 'verifying' (link check in flight) | 'form' | 'success' | 'error'
  const [status, setStatus] = useState(linkToken ? 'verifying' : 'form');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  // StrictMode mounts effects twice in dev; this guard keeps the one-time token
  // from being consumed (and reported as "already used") by a second call.
  const verifyStartedRef = useRef(false);

  /** Shared success path for both the link and the typed code. */
  const succeed = (msg) => {
    setStatus('success');
    setMessage(msg || 'Your email has been verified.');
    toast.success('Email verified successfully!');
  };

  useEffect(() => {
    // No token in the URL — the form below handles it.
    if (!linkToken) return;

    if (verifyStartedRef.current) return;
    verifyStartedRef.current = true;

    const run = async () => {
      try {
        const response = await VerifyEmailUser(linkToken);

        if (response.success) {
          succeed(response.message);
        } else {
          // Link already used or expired: fall back to the form.
          setStatus('form');
          setMessage(response.message || 'This link is invalid or has expired. Enter the code from a newer email instead.');
        }
      } catch (error) {
        console.error(error);
        setStatus('form');
        setMessage(error?.message || 'This link is invalid or has expired. Enter the code from a newer email instead.');
      }
    };

    run();
  }, [linkToken]);

  /** Submits the pasted code; the token itself is the credential. */
  const handleVerify = async (event) => {
    event.preventDefault();

    if (!code.trim()) {
      toast.error('Enter the code from your verification email');
      return;
    }

    setSubmitting(true);

    try {
      const response = await VerifyEmailUser(code.trim());

      if (response.success) {
        succeed(response.message);
      } else {
        toast.error(response.message || 'That code is invalid or has expired.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'That code is invalid or has expired.');
    } finally {
      setSubmitting(false);
    }
  };

  /** Re-mails a fresh link/code; no session needed, only the address. */
  const handleResend = async () => {
    if (!email.trim()) {
      toast.error('Enter the email address you signed up with');
      return;
    }

    setResending(true);

    try {
      const response = await ResendVerificationEmail(email.trim());

      toast.success(response.message || 'A new verification link is on its way!');
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Could not send a new link. Please try again.');
    } finally {
      setResending(false);
    }
  };

  /** Per-state body: verifying spinner, code form, or success panel. */
  const renderContent = () => {
    if (status === 'verifying') {
      return (
        <div className="mt-8 flex flex-col items-center text-center [@media(min-height:820px)]:mt-10">
          <Loader2 className="h-9 w-9 animate-spin text-[#1869f2]" strokeWidth={2.2} />
          <h2 className="mt-4 text-[21px] font-extrabold leading-tight tracking-tight text-[#0b2570] [@media(min-height:820px)]:text-[25px]">
            Verifying your email…
          </h2>
          <p className="mt-1 text-[13px] text-[#5d76a9] [@media(min-height:820px)]:text-[14px]">
            Hang tight, this only takes a moment.
          </p>
        </div>
      );
    }

    if (status === 'success') {
      return (
        <>
          <div className="mt-6 flex flex-col items-center text-center [@media(min-height:820px)]:mt-7">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-[#16a34a]/10">
              <Check className="h-7 w-7 text-[#16a34a]" strokeWidth={2.6} />
            </span>

            <h2 className="mt-4 text-[21px] font-extrabold leading-tight tracking-tight text-[#0b2570] [@media(min-height:820px)]:text-[25px]">
              Email verified
            </h2>
            <p className="mt-1 text-[13px] text-[#5d76a9] [@media(min-height:820px)]:text-[14px]">
              {message} Your account is now active.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/auth/signIn')}
            className={`${PRIMARY_BUTTON_CLASS} mt-5 [@media(min-height:820px)]:mt-6`}
          >
            Continue to sign in
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </button>
        </>
      );
    }

    // status === 'form' — the code entry gate.
    return (
      <>
        <div className="mt-6 flex flex-col items-center text-center [@media(min-height:820px)]:mt-7">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-[#1869f2]/10">
            <Mail className="h-7 w-7 text-[#1869f2]" strokeWidth={2.2} />
          </span>

          <h2 className="mt-4 text-[21px] font-extrabold leading-tight tracking-tight text-[#0b2570] [@media(min-height:820px)]:text-[25px]">
            Verify your email
          </h2>
          <p className="mt-1 max-w-[34ch] text-[13px] text-[#5d76a9] [@media(min-height:820px)]:text-[14px]">
            Your account is created but not active yet. Enter the code from
            your verification email to finish — then you can sign in.
          </p>
        </div>

        <form onSubmit={handleVerify} className="mt-5 space-y-4 [@media(min-height:820px)]:mt-6">
          {/* Address the code was sent to (editable for resend). */}
          <div>
            <label htmlFor="email" className={LABEL_CLASS}>
              Email address
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
                className={FIELD_CLASS}
              />
            </div>
          </div>

          {/* The one-time code from the email. */}
          <div>
            <label htmlFor="code" className={LABEL_CLASS}>
              Verification code
            </label>
            <div className="relative">
              <KeyRound className={FIELD_ICON_CLASS} strokeWidth={1.9} />
              <input
                id="code"
                type="text"
                name="code"
                required
                autoComplete="one-time-code"
                placeholder="Paste the code from your email"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={FIELD_CLASS}
              />
            </div>
          </div>

          {message && (
            <p className="text-[12.5px] text-[#dc2626]">{message}</p>
          )}

          <button type="submit" disabled={submitting} className={PRIMARY_BUTTON_CLASS}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? 'Verifying…' : 'Verify email'}
            {!submitting && <ArrowRight className="h-4 w-4" strokeWidth={2.2} />}
          </button>
        </form>

        {/* Resend row — works without a session, by address. */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-[12.5px] text-[#5d76a9]">No email?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-[12.5px] font-medium text-[#1869f2] transition hover:text-[#1559d6] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {resending ? 'Sending…' : 'Resend verification email'}
          </button>
        </div>

        {/* Back to sign-in for users who already verified elsewhere. */}
        <p className="mt-2.5 text-center text-[12.5px] text-[#5d76a9] [@media(min-height:820px)]:mt-3 [@media(min-height:820px)]:text-[13px]">
          Already verified?{' '}
          <button
            type="button"
            onClick={() => navigate('/auth/signIn')}
            className="font-semibold text-[#1869f2] transition hover:text-[#1559d6]"
          >
            Sign in
          </button>
        </p>
      </>
    );
  };

  return (
    <AuthShell subtitle="Verify Email">
      {renderContent()}

      {/* Divider */}
      <div className="mt-4 flex items-center gap-4 [@media(min-height:820px)]:mt-5">
        <span className="h-px flex-1 bg-[#e6ebf5]" />
        <span className="text-[12px] font-medium text-[#9aa8c2]">or</span>
        <span className="h-px flex-1 bg-[#e6ebf5]" />
      </div>

      {/* Back to the landing page */}
      <Link
        to="/"
        className="mt-3 flex items-center justify-center gap-1.5 text-[12px] font-medium text-[#5d76a9] transition hover:text-[#1869f2] [@media(min-height:820px)]:mt-4"
      >
        <ArrowLeft className="h-[13px] w-[13px]" strokeWidth={2.2} />
        Back to home
      </Link>
    </AuthShell>
  );
}
