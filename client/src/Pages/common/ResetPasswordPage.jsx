import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Loader2, Lock } from 'lucide-react';

import AuthShell, {
  FIELD_CLASS,
  FIELD_ICON_CLASS,
  LABEL_CLASS,
  PRIMARY_BUTTON_CLASS,
} from '../../Components/common/AuthShell.jsx';
import { ResetPasswordUser } from '../../api/auth.js';

/**
 * The "choose a new password" screen behind `/reset-password/:token`, the route
 * the reset email links to.
 *
 * It shares `AuthShell` with the login screen so the look is identical, and it
 * validates the new password client-side (minimum length + confirmation match)
 * before handing the token back to the API.
 */
export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setSubmitting(true);

    try {
      const response = await ResetPasswordUser(token, password);

      if (response.success) {
        toast.success(response?.message || 'Password reset successfully');
        setDone(true);
      } else {
        toast.error(response?.message || 'Could not reset your password.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell subtitle="Reset Password">
      {done ? (
        <>
          {/* Confirmation panel */}
          <div className="mt-6 flex flex-col items-center text-center [@media(min-height:820px)]:mt-7">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-[#1869f2]/10">
              <Check className="h-7 w-7 text-[#1869f2]" strokeWidth={2.6} />
            </span>

            <h2 className="mt-4 text-[21px] font-extrabold leading-tight tracking-tight text-[#0b2570] [@media(min-height:820px)]:text-[25px]">
              Password updated
            </h2>
            <p className="mt-1 text-[13px] text-[#5d76a9] [@media(min-height:820px)]:text-[14px]">
              Your password has been reset. You can now sign in with your new
              password.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/auth/signIn')}
            className={`${PRIMARY_BUTTON_CLASS} mt-5 [@media(min-height:820px)]:mt-6`}
          >
            Go to login
            <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
          </button>

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
            Set a New Password
          </h2>
          <p className="mt-1 text-[13px] text-[#5d76a9] [@media(min-height:820px)]:text-[14px]">
            Choose a new password for your student account.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-4 space-y-[12px] [@media(min-height:820px)]:mt-5 [@media(min-height:820px)]:space-y-[15px]"
          >
            {/* New password */}
            <div>
              <label htmlFor="password" className={LABEL_CLASS}>
                New Password
              </label>

              <div className="relative">
                <Lock className={FIELD_ICON_CLASS} strokeWidth={1.9} />

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${FIELD_CLASS} pr-10`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8ea0c4] transition hover:text-[#1869f2]"
                >
                  {showPassword ? (
                    <EyeOff className="h-[17px] w-[17px]" />
                  ) : (
                    <Eye className="h-[17px] w-[17px]" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="confirmPassword" className={LABEL_CLASS}>
                Confirm Password
              </label>

              <div className="relative">
                <Lock className={FIELD_ICON_CLASS} strokeWidth={1.9} />

                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="Re-enter your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${FIELD_CLASS} pr-10`}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8ea0c4] transition hover:text-[#1869f2]"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-[17px] w-[17px]" />
                  ) : (
                    <Eye className="h-[17px] w-[17px]" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={submitting} className={PRIMARY_BUTTON_CLASS}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? 'Resetting…' : 'Reset password'}
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
