import {
  Calendar,
  FolderKanban,
  Search,
  ShieldCheck,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import Reveal from './Reveal';

const FEATURES = [
  {
    icon: Search,
    color: 'blue',
    iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
    title: 'Fast Cross-Department Search',
    desc: 'Instantly discover past midterms, assignments, project documentation, and lecture slides with course code filters.',
  },
  {
    icon: Calendar,
    color: 'emerald',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    title: 'Smart Timetable Engine',
    desc: 'Auto-arrange your semester lectures into a clean weekly grid with custom timings and shareable URLs.',
  },
  {
    icon: FolderKanban,
    color: 'violet',
    iconBg: 'bg-violet-50 text-violet-600 border-violet-200',
    title: 'Universal Document Support',
    desc: 'Structured storage for PDFs, Microsoft Word docs, archive ZIPs, and direct links to GitHub repositories.',
  },
  {
    icon: Users,
    color: 'amber',
    iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
    title: 'Student Community Powered',
    desc: 'Every resource is shared and reviewed by current students and alumni, expanding with every new semester batch.',
  },
  {
    icon: Star,
    color: 'rose',
    iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
    title: 'Faculty Ratings & Guidance',
    desc: 'Read unbiased senior feedback on course workloads, teaching methodology, and grading clarity.',
  },
  {
    icon: ShieldCheck,
    color: 'sky',
    iconBg: 'bg-sky-50 text-sky-600 border-sky-200',
    title: 'Private & Secure Portal',
    desc: 'Your profile, timetable preferences, and submissions are securely stored with role-based student authentication.',
  },
];

export default function FeatureGrid() {
  return (
    <section id="features" className="scroll-mt-20 bg-[#f8fafc] py-16 sm:py-20 border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-blue-700 ">
            Core Platform Architecture
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Built Specifically For <span className="text-blue-600">University Workflows</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-500">
            No more searching scattered WhatsApp groups and expired cloud links. All your academic necessities reside in one calm, structured place.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, iconBg, title, desc }, index) => (
            <Reveal key={title} delay={index * 50}>
              <div className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6  transition  hover:border-slate-300 hover:">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border ${iconBg}`}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <h3 className="mt-4 text-base font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition">
                  {title}
                </h3>

                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500">
                  {desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
