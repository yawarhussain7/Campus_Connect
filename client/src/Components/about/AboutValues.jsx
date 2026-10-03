import { HeartHandshake, ShieldCheck, Sparkles, Zap } from 'lucide-react';

const VALUES = [
  {
    icon: HeartHandshake,
    title: 'Student-first',
    desc: 'Every screen is judged by one question: does it help a student get through the semester?',
  },
  {
    icon: Sparkles,
    title: 'Open knowledge',
    desc: 'Material stays free and shared, so no batch has to redo work an earlier one finished.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust and privacy',
    desc: 'You sign in with your own account and only share what you decide to.',
  },
  {
    icon: Zap,
    title: 'Simple by design',
    desc: 'Clean layouts, quick search and nothing standing between you and the file you need.',
  },
];

const STACK = ['React', 'Tailwind CSS', 'Node & Express', 'MongoDB'];

/**
 * The principles the platform is built on, followed by the stack it is built
 * with — a short, honest look behind the interface.
 */
export default function AboutValues() {
  return (
    <section className="animate-fadeInUp">
      <div className="mb-4">
        <h2 className="text-[19px] font-bold tracking-tight text-slate-900 sm:text-[22px]">
          What we stand for
        </h2>

        <p className="mt-1 text-[13px] text-slate-500">
          The principles behind every decision we make on the platform.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {VALUES.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="surface-card hover-lift flex items-start gap-4 p-5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Icon className="h-5 w-5" />
            </span>

            <div className="min-w-0">
              <h3 className="text-[14px] font-semibold text-slate-900">{title}</h3>

              <p className="mt-1 text-[12.5px] leading-relaxed text-slate-500">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="surface-card mt-4 flex flex-wrap items-center gap-3 p-5">
        <span className="text-[11.5px] font-medium uppercase tracking-[0.08em] text-slate-400">
          Built with
        </span>

        {STACK.map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] font-semibold text-slate-600"
          >
            {tech}
          </span>
        ))}
      </div>
    </section>
  );
}