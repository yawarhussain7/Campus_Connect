import { Calendar, Search, Send, UserPlus } from 'lucide-react';
import Reveal from './Reveal';

const STEPS = [
  {
    icon: UserPlus,
    title: 'Create Your Student Account',
    desc: 'Register in seconds using your student email to gain immediate access to verified campus modules.',
  },
  {
    icon: Search,
    title: 'Discover or Generate Content',
    desc: 'Search past papers and projects by semester, or launch the timetable tool to build your custom schedule.',
  },
  {
    icon: Send,
    title: 'Contribute Back & Collaborate',
    desc: 'Upload your notes, share project links, and help the next batch of juniors navigate their courses.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 bg-white py-16 sm:py-20 border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700">
            Intuitive Onboarding
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            From First Visit To <span className="text-blue-600">Graduation</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-500">
            Three simple, straightforward steps. No complicated setup, no paywalls.
          </p>
        </Reveal>

        <div className="relative mt-14">
          {/* Connector line for desktop */}
          <div
            aria-hidden="true"
            className="absolute left-1/6 right-1/6 top-7 hidden h-[2px] bg-slate-200 lg:block"
          />

          <div className="relative grid gap-8 lg:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, desc }, index) => (
              <Reveal key={title} delay={index * 80}>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-slate-100 bg-[#f8fafc] hover:border-slate-200 transition">
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white  ring-4 ring-white">
                    <Icon className="h-6 w-6" />
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white border-2 border-white">
                      {index + 1}
                    </span>
                  </span>

                  <span className="mt-5 text-xs font-bold uppercase tracking-wider text-blue-600">
                    Step 0{index + 1}
                  </span>

                  <h3 className="mt-2 text-base font-bold text-slate-900">
                    {title}
                  </h3>

                  <p className="mt-2 max-w-xs text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
