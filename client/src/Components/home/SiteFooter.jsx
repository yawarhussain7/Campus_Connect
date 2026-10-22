import { GraduationCap, Heart, Shield, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ACADEMIC_LINKS = [
  { label: 'Past Papers Vault', to: '/resources?type=past-papers' },
  { label: 'Timetable Generator', to: '/student/create-timetable' },
  { label: 'Project Showcase', to: '/resources?type=projects' },
  { label: 'Assignment Guidelines', to: '/resources?type=assignments' },
  { label: 'Teacher Reviews', to: '/student/teachers-review' },
];

const PLATFORM_LINKS = [
  { label: 'Home', to: '/#home' },
  { label: 'Explore Resources', to: '/resources' },
  { label: 'Core Features', to: '/#features' },
  { label: 'How It Works', to: '/#how' },
  { label: 'FAQ', to: '/#faq' },
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
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info Column */}
          <div className="space-y-4 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </span>

              <span className="text-left">
                <span className="block text-[18px] font-bold leading-none tracking-tight text-slate-900">
                  Campus<span className="text-blue-600">Connect</span>
                </span>
                <span className="block text-[11px] font-medium leading-tight text-slate-400">
                  Student portal
                </span>
              </span>
            </Link>

            <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-slate-500">
              CampusConnect brings past papers, semester projects, assignments, and smart timetable
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

          {/* Academic Modules Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Academic Modules
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-slate-600">
              {ACADEMIC_LINKS.map((link) => (
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
          <p>© 2026 CampusConnect. Built with pride for university students.</p>

          <div className="flex items-center gap-4">
            <Link to="/#about" className="hover:text-slate-800 transition">
              About
            </Link>
            <span>·</span>
            <Link to="/#faq" className="hover:text-slate-800 transition">
              FAQ
            </Link>
            <span>·</span>
            <span className="text-slate-400">Campus Collaboration Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
