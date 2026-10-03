import { ArrowRight, ClipboardList, FileText, FolderKanban, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

/** The four academic modules, each linking to its section of the portal. */
const MODULES = [
  {
    icon: FolderKanban,
    tone: 'blue',
    title: 'Projects',
    desc: 'Discover coursework projects with code and reports attached.',
    to: '/student/projects',
  },
  {
    icon: FileText,
    tone: 'violet',
    title: 'Past papers',
    desc: 'Practise with real midterm and final papers from earlier semesters.',
    to: '/student/past-papers',
  },
  {
    icon: ClipboardList,
    tone: 'amber',
    title: 'Assignments',
    desc: 'Track what is due and share solutions with your batch.',
    to: '/student/assignments',
  },
  {
    icon: Star,
    tone: 'emerald',
    title: 'Teacher reviews',
    desc: 'Read honest, student-written reviews before you pick a course.',
    to: '/student/teachers-review',
  },
];

const TONES = {
  blue: 'bg-blue-50 text-blue-600',
  violet: 'bg-violet-50 text-violet-600',
  amber: 'bg-amber-50 text-amber-600',
  emerald: 'bg-emerald-50 text-emerald-600',
};

/** Four quick moves from a fresh sign-in to giving back. */
const STEPS = [
  { title: 'Sign in', desc: 'Reach the portal with your campus account.' },
  { title: 'Browse & filter', desc: 'Narrow by course, semester, status or teacher.' },
  { title: 'Upload & share', desc: 'Add files so the next batch starts further ahead.' },
  { title: 'Learn & grow', desc: 'Revise faster, then leave a review to help others.' },
];

/**
 * Two blocks: the module grid a visitor can deep-link from, and the four-step
 * journey that explains how the portal is actually used.
 */
export default function AboutHighlights() {
  return (
    <>
      {/* What you can do here */}
      <section className="animate-fadeInUp">
        <div className="mb-4">
          <h2 className="text-[19px] font-bold tracking-tight text-slate-900 sm:text-[22px]">
            What you can do here
          </h2>

          <p className="mt-1 text-[13px] text-slate-500">
            Four focused sections, one login — jump straight to what you need.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map(({ icon: Icon, tone, title, desc, to }) => (
            <Link
              key={title}
              to={to}
              className="surface-card hover-lift group flex flex-col p-5"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  TONES[tone] || TONES.blue
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>

              <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-slate-900">
                {title}
              </h3>

              <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-slate-500">
                {desc}
              </p>

              <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-blue-600">
                Open
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="surface-card animate-fadeInUp p-6 sm:p-8">
        <h2 className="text-[19px] font-bold tracking-tight text-slate-900 sm:text-[22px]">
          How it works
        </h2>

        <p className="mt-1 text-[13px] text-slate-500">
          From a fresh sign-in to giving back, in four simple moves.
        </p>

        <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-[13px] font-bold text-white shadow-sm">
                {index + 1}
              </span>

              <h3 className="mt-3.5 text-[14px] font-semibold text-slate-900">
                {step.title}
              </h3>

              <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}