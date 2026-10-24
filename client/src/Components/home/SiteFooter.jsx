import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import uniMateLogo from '../../assets/uniMat.png';

const PLATFORM_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
];

const ACCOUNT_LINKS = [
  { label: 'Student Sign In', to: '/auth/signIn' },
  { label: 'Create Free Account', to: '/auth/signUp' },
  { label: 'Student Dashboard', to: '/student/dashboard' },
  { label: 'Reset Password', to: '/auth/forgot-password' },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info Column */}
          <div className="space-y-4 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <img src={uniMateLogo} alt="UniMate" className="h-16 w-16 shrink-0 object-contain" />

              <span className="text-left">
                <span className="block text-[11px] font-medium leading-tight text-slate-400">
                  Student portal
                </span>
              </span>
            </Link>

            <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-slate-500">
              UniMate brings past papers, semester projects, assignments, and smart timetable
              tools together so university students can excel throughout their academic degree.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                All Systems Operational
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                <Shield className="h-3 w-3 text-slate-400" />
                SSL Verified
              </span>
            </div>
          </div>

          {/* Platform Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Navigation
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-600">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="transition hover:text-blue-600 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Student Account
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-600">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="transition hover:text-blue-600 hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row text-xs text-slate-500">
          <p>© 2026 UniMate. Built with pride for university students.</p>

          <div className="flex items-center gap-4">
            <Link to="/#about" className="hover:text-slate-800 transition">
              About
            </Link>
            <span>·</span>
            <Link to="/#features" className="hover:text-slate-800 transition">
              Features
            </Link>
            <span>·</span>
            <span className="text-slate-400">Campus Collaboration Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
