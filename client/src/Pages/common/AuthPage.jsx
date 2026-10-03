import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  User,
} from 'lucide-react';

import loginBackground from '../../assets/login_bg.png';
import { SignInUser, SignUpUser } from '../../api/auth.js';
import { useAppContext } from '../../context/AppContext.jsx';

/*
 * Palette sampled from the `login_bg.png` mockup so this page matches it:
 *   navy (headings, wordmark, labels) ... #0b2570
 *   muted copy ......................... #5d76a9
 *   placeholder text ................... #9aa8c2
 *   brand blue (CTA, links, icons) ..... #1869f2   hover #1559d6
 *   field hairline ..................... #e2e9f6
 *   "or" divider ....................... #e6ebf5
 */

/**
 * Shared field styling: the 52px rhythm and soft blue focus ring used across
 * the portal. Right padding is added per field so the password row can make
 * room for the show/hide toggle.
 */
const FIELD_CLASS =
  'h-[42px] w-full rounded-[9px] border border-[#e2e9f6] bg-white pl-10 text-[13.5px] text-[#16305f] outline-none transition placeholder:text-[#9aa8c2] focus:border-[#1869f2] focus:ring-4 focus:ring-[#1869f2]/10 [@media(min-height:820px)]:h-[46px] [@media(min-height:820px)]:text-[14px]';

/** Decorative leading icon inside each field. */
const FIELD_ICON_CLASS =
  'pointer-events-none absolute left-3 top-1/2 h-[17px] w-[17px] -translate-y-1/2 text-[#8ea0c4]';

/** Field heading shared by every input. */
const LABEL_CLASS =
  'mb-1.5 block text-[13px] font-semibold text-[#0b2570] [@media(min-height:820px)]:text-[13.5px]';

/**
 * Card shell. `max-h-full` plus the scrollbar-hidden overflow keep the whole
 * form inside the viewport on short windows, so the page itself never grows a
 * scrollbar, which is the contract of a full-window mockup.
 */
const CARD_CLASS =
  'animate-fadeInUp flex max-h-full w-full max-w-[26rem] flex-col overflow-y-auto overscroll-contain rounded-[20px] border border-white/80 bg-white/95 px-6 py-6 shadow-[0_30px_70px_-30px_rgba(16,44,100,0.35)] backdrop-blur-sm [-ms-overflow-style:none] [scrollbar-width:none] sm:px-8 sm:py-7 [&::-webkit-scrollbar]:hidden [@media(min-height:820px)]:rounded-[22px]';

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
    toast.info('Password reset is not available yet. Please contact your campus IT desk.');
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
          toast.success('Register successful!');
          loginUser(response.data);
          navigate('/auth/signIn');
        } else {
          toast.error(response?.message || 'Registration failed. Please try again.');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#f5f9ff]">
      {/*
        Full-window artwork. `login_bg.png` is the finished mockup: the brand
        story (wordmark, students, tagline) owns the left half while the right
        half is left deliberately empty for this card.

        Below `lg` it covers the window (the card sits centred over a softened
        copy). From `lg` up it switches to `object-contain`, which scales the
        whole drawing down to fit inside the window so nothing is cropped — a
        plain `object-cover` zoomed in and sliced the wordmark off on widescreen
        monitors. It stays pinned left, so the spare space lands on the mockup's
        own pale, empty half where the card sits.
      */}
      <img
        src={loginBackground}
        alt=""
        aria-hidden="true"
        draggable="false"
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-left lg:object-contain"
      />

      {/*
        Below `lg` the card is centred on the artwork, so it is softened first to
        keep the form readable.
      */}
      <div className="pointer-events-none absolute inset-0 bg-[#f5f9ff]/80 backdrop-blur-[2px] lg:hidden" />

      {/*
        Form layer: centred on small screens, parked on the artwork's blank right
        half from `lg` up. `overflow-hidden` here, together with `max-h-full` on
        the card, is what guarantees the page never grows a scrollbar.
      */}
      <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden px-4 py-4 sm:px-8 lg:justify-end lg:pr-[4%] xl:pr-[7%] 2xl:pr-[10%]">
        <div className={CARD_CLASS}>
          {/* Card header */}
          <div className="flex items-center justify-center gap-3">
            <GraduationCap className="h-7 w-7 shrink-0 text-[#1869f2] [@media(min-height:820px)]:h-8 [@media(min-height:820px)]:w-8" strokeWidth={1.8} />
            <span className="leading-tight">
              <span className="block text-[19px] font-extrabold tracking-tight text-[#0b2570] [@media(min-height:820px)]:text-[21px]">
                CampusConnect
              </span>
              <span className="block text-[12px] font-medium text-[#5d76a9] [@media(min-height:820px)]:text-[13px]">
                {isSignIn ? 'Student Login' : 'Student Sign Up'}
              </span>
            </span>
          </div>

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
              className="flex h-[46px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#1869f2] text-[14px] font-semibold text-white shadow-[0_18px_32px_-16px_rgba(24,105,242,0.9)] transition hover:bg-[#1559d6] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1869f2]/25 active:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-70 [@media(min-height:820px)]:h-[50px] [@media(min-height:820px)]:text-[15px]"
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
        </div>
      </div>
    </div>
  );
}

