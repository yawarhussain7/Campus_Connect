import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

/** Same-page anchors, kept in sync with the public Navbar. */
const EXPLORE_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Community', href: '#community' },
];

const ACCOUNT_LINKS = [
  { label: 'Sign in', to: '/auth/signIn' },
  { label: 'Create account', to: '/auth/signUp' },
  { label: 'Dashboard', to: '/student/dashboard' },
  { label: 'Reset password', to: '/auth/forgot-password' },
];

/**
 * Marketing footer for the public landing page: brand blurb beside the two
 * link columns a visitor is most likely to want, closed by a legal strip.
 */
export default function SiteFooter() {
  return (
    <footer id="about" className="scroll-mt-20 border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-blue-600 text-white shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </span>

              <span className="text-[20px] font-bold tracking-tight text-slate-900">
                CUI<span className="text-blue-600">Hub</span>
              </span>
            </Link>

            <p className="mt-4 text-[13.5px] leading-relaxed text-slate-500">
              CampusConnect brings notes, projects, past papers and assignments together so
              students can share, learn and grow together.
            </p>
          </div>

          {/* Explore */}
          <nav aria-label="Explore">
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-slate-400">
              Explore
            </h3>

            <ul className="mt-4 space-y-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[13.5px] text-slate-600 transition hover:text-blue-600"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Account */}
          <nav aria-label="Account">
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-slate-400">
              Account
            </h3>

            <ul className="mt-4 space-y-3">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[13.5px] text-slate-600 transition hover:text-blue-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-slate-100 pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-[12px] text-slate-400">
            © 2026 CUI Student Hub. All rights reserved.
          </p>

          <p className="text-[12px] text-slate-400">
            CampusConnect is a student project, not an official COMSATS website.
          </p>
        </div>
      </div>
    </footer>
  );
}
