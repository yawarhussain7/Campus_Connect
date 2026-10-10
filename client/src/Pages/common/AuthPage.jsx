import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
  VenusAndMars,
} from 'lucide-react';

import AuthShell, {
  FIELD_CLASS,
  FIELD_ICON_CLASS,
  LABEL_CLASS,
  PRIMARY_BUTTON_CLASS,
} from '../../Components/common/AuthShell.jsx';
import { SignInUser, SignUpUser } from '../../api/auth.js';
import { useAppContext } from '../../context/AppContext.jsx';
import { GENDER_OPTIONS } from '../../utils/gender.js';

/** The email address "Remember me" opted into, so it can be prefilled. */
const REMEMBERED_EMAIL_KEY = 'rememberedEmail';

/** Returns the remembered address, tolerating private-mode storage errors. */
const readRememberedEmail = () => {
  try {
    return localStorage.getItem(REMEMBERED_EMAIL_KEY) || '';
  } catch {
    // Storage can be unavailable (private mode, blocked cookies): ignore it.
    return '';
  }
};

/**
 * The single page behind `/auth/signIn` and `/auth/signUp`. Sign-in is the happy
 * path; the same card flips to registration (which adds the Full Name field) so
 * both routes share one form.
 */
export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginUser } = useAppContext();

  const isSignIn = location.pathname === '/auth/signIn';

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => Boolean(readRememberedEmail()));

  const [formData, setFormData] = useState(() => ({
    name: '',
    email: readRememberedEmail(),
    password: '',
    // Picked at signup so the portal can show the matching male/female
    // portrait wherever the student has not uploaded a photo yet.
    gender: '',
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /** Keeps the stored address in sync with the checkbox after a sign-in. */
  const persistRememberedEmail = (email) => {
    try {
      if (rememberMe) {
        localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
      } else {
        localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }
    } catch {
      // Storage unavailable: remembering the address is a nice-to-have only.
    }
  };

  const handleForgotPassword = () => {
    navigate('/auth/forgot-password');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isSignIn) {
        const response = await SignInUser(formData);

        if (response.success) {
          persistRememberedEmail(formData.email.trim());
          toast.success('Login successful!');
          loginUser(response.data);
          navigate('/student/dashboard');
        } else {
          toast.error(response?.message || 'Incorrect email or password.');
        }
      } else {
        const response = await SignUpUser(formData);

        if (response.success) {
          // No session is issued at signup — the account is locked until the
          // emailed link (or token) is entered, so go to the verify screen.
          toast.success('Account created! Check your inbox for the verification link.');
          navigate('/verify-email', { state: { email: formData.email.trim() } });
        } else {
          toast.error(response?.message || 'Registration failed. Please try again.');
        }
      }
    } catch (error) {
      console.error(error);

      // The server locks sign-in until the address is verified; send the user
      // to the verification screen instead of a dead-end toast. The cookie-less
      // 403 carries the marker `code`, surfaced by the axios interceptor.
      if (error?.code === 'EMAIL_NOT_VERIFIED') {
        toast.info(error?.message || 'Please verify your email before signing in.');
        navigate('/verify-email', { state: { email: formData.email.trim() } });
        return;
      }

      // An account an admin blocked never signs in — say why and stay put.
      if (error?.code === 'ACCOUNT_BLOCKED') {
        toast.error(
          error?.message || 'Your account has been blocked. Contact an administrator.'
        );
        return;
      }

      toast.error(error?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell subtitle={isSignIn ? 'Student Login' : 'Student Sign Up'}>
      <h2 className="mt-4 text-[21px] font-extrabold leading-tight tracking-tight text-[#0b2570] [@media(min-height:820px)]:mt-5 [@media(min-height:820px)]:text-[25px]">
        {isSignIn ? 'Welcome Back' : 'Create Your Account'}
      </h2>
      <p className="mt-1 text-[13px] text-[#5d76a9] [@media(min-height:820px)]:text-[14px]">
        {isSignIn
          ? 'Sign in to your student account to continue.'
          : 'Sign up to start sharing resources across your campus.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-[12px] [@media(min-height:820px)]:mt-5 [@media(min-height:820px)]:space-y-[15px]">
        {/* Full Name */}
        {!isSignIn && (
          <div>
            <label htmlFor="name" className={LABEL_CLASS}>
              Full Name
            </label>

            <div className="relative">
              <User className={FIELD_ICON_CLASS} strokeWidth={1.9} />

              <input
                id="name"
                type="text"
                name="name"
                required
                autoComplete="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className={`${FIELD_CLASS} pr-3.5`}
              />
            </div>
          </div>
        )}

        {/* Gender (sign-up only): selects the public-folder icon used as the
            default portrait until a photo is uploaded. */}
        {!isSignIn && (
          <div>
            <label htmlFor="gender" className={LABEL_CLASS}>
              Gender
            </label>

            <div className="relative">
              <VenusAndMars className={FIELD_ICON_CLASS} strokeWidth={1.9} />

              <select
                id="gender"
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                className={`${FIELD_CLASS} cursor-pointer appearance-none pr-3.5 ${
                  formData.gender ? '' : 'text-[#9aa8c2]'
                }`}
              >
                <option value="" disabled className="text-[#16305f]">
                  Select your gender
                </option>

                {GENDER_OPTIONS.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="text-[#16305f]"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

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
              value={formData.email}
              onChange={handleChange}
              className={`${FIELD_CLASS} pr-3.5`}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className={LABEL_CLASS}>
            Password
          </label>

          <div className="relative">
            <Lock className={FIELD_ICON_CLASS} strokeWidth={1.9} />

            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              minLength={6}
              autoComplete={isSignIn ? 'current-password' : 'new-password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
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

        {/* Remember me + forgot password (sign-in only) */}
        {isSignIn && (
          <div className="flex items-center justify-between gap-3">
            <label className="flex cursor-pointer select-none items-center gap-2 text-[12.5px] font-medium text-[#445c93] [@media(min-height:820px)]:text-[13px]">
              <span className="relative grid h-4 w-4 shrink-0 place-items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="peer h-4 w-4 cursor-pointer appearance-none rounded-[4px] border border-[#cbd8ee] bg-white transition checked:border-[#1869f2] checked:bg-[#1869f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1869f2]/30"
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
              className="text-[12.5px] font-medium text-[#1869f2] transition hover:text-[#1559d6] [@media(min-height:820px)]:text-[13px]"
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className={PRIMARY_BUTTON_CLASS}
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? 'Please wait…' : isSignIn ? 'Login' : 'Create Account'}
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
        {isSignIn ? 'New to CampusConnect?' : 'Already have an account?'}{' '}
        <button
          type="button"
          onClick={() => navigate(isSignIn ? '/auth/signUp' : '/auth/signIn')}
          className="font-semibold text-[#1869f2] transition hover:text-[#1559d6]"
        >
          {isSignIn ? 'Create an account' : 'Sign in'}
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
    </AuthShell>
  );
}

