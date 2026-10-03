import { Search, Send, UserPlus } from 'lucide-react';

import Reveal from './Reveal';

/** Three moves from a first visit to giving back. */
const STEPS = [
  {
    icon: UserPlus,
    title: 'Create your account',
    desc: 'Sign up with your campus email in seconds and land straight in your dashboard.',
  },
  {
    icon: Search,
    title: 'Find what you need',
    desc: 'Search and filter notes, past papers, projects and assignments by course.',
  },
  {
    icon: Send,
    title: 'Share it back',
    desc: 'Upload your own files so the next batch starts the semester further ahead.',
  },
];

/**
 * "How it works" band: a three-step journey connected by a soft gradient line
 * on wide screens, stacked on phones.
 */
export default function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-[12px] font-semibold text-blue-700">
            How it works
          </span>

          <h2 className="mt-5 text-[28px] font-extrabold leading-tight tracking-tight text-slate-900 sm:text-[36px]">
            From first login to <span className="gradient-text">giving back</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-[14.5px] leading-relaxed text-slate-500">
            Three simple steps — no clutter, no learning curve.
          </p>
        </Reveal>

        <div className="relative mt-14">
          {/* Connector line, hidden on small screens. */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[22px] hidden h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent lg:block"
          />

          <ol className="relative grid gap-10 lg:grid-cols-3 lg:gap-8">
            {STEPS.map(({ icon: Icon, title, desc }, index) => (
              <Reveal as="li" key={title} delay={index * 90} className="text-center lg:px-4">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-md ring-8 ring-white">
                  <Icon className="h-5 w-5" />
                </span>

                <span className="mt-4 inline-block text-[12px] font-bold uppercase tracking-[0.12em] text-blue-600">
                  Step {index + 1}
                </span>

                <h3 className="mt-1.5 text-[17px] font-semibold tracking-tight text-slate-900">
                  {title}
                </h3>

                <p className="mx-auto mt-2 max-w-xs text-[13.5px] leading-relaxed text-slate-500">
                  {desc}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
