import {
  FolderKanban,
  Search,
  ShieldCheck,
  Star,
  Users,
  Zap,
} from 'lucide-react';

import Reveal from './Reveal';

/** Icon-tile palettes reused across the marketing sections. */
const TONES = {
  blue: 'bg-blue-50 text-blue-600',
  violet: 'bg-violet-50 text-violet-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  sky: 'bg-sky-50 text-sky-600',
  rose: 'bg-rose-50 text-rose-600',
};

/** What makes the portal worth using — the "why", not the feature list. */
const FEATURES = [
  {
    icon: Search,
    tone: 'blue',
    title: 'Smart search',
    desc: 'Find notes, past papers, projects and assignments from one search bar.',
  },
  {
    icon: FolderKanban,
    tone: 'violet',
    title: 'Every file type',
    desc: 'PDFs, source code, reports and docs — organised by course and semester.',
  },
  {
    icon: Users,
    tone: 'emerald',
    title: 'Community powered',
    desc: 'Everything is shared by students, so the library grows with every batch.',
  },
  {
    icon: ShieldCheck,
    tone: 'amber',
    title: 'Safe and private',
    desc: 'Your own account and your own uploads — you decide what to share.',
  },
  {
    icon: Zap,
    tone: 'sky',
    title: 'Fast and lightweight',
    desc: 'A clean, quick interface that stays out of the way while you study.',
  },
  {
    icon: Star,
    tone: 'rose',
    title: 'Teacher reviews',
    desc: 'Honest, student-written reviews to help you pick the right course.',
  },
];

/**
 * "Why CampusConnect" introduction: a centred heading over a six-up grid of
 * benefit cards, each revealed on scroll with a small stagger.
 */
export default function FeatureGrid() {
  return (
    <section id="features" className="scroll-mt-20 bg-[#f6f9ff]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3.5 py-1.5 text-[12px] font-semibold text-blue-700 shadow-sm">
            Why CampusConnect
          </span>

          <h2 className="mt-5 text-[28px] font-extrabold leading-tight tracking-tight text-slate-900 sm:text-[36px]">
            One calm home for your <span className="gradient-text">campus knowledge</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-[14.5px] leading-relaxed text-slate-500">
            Stop hunting through group chats and forgotten drives. Everything a student needs
            to get through the semester lives in one organised, searchable place.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, tone, title, desc }, index) => (
            <Reveal key={title} delay={index * 70}>
              <article className="surface-card hover-lift group h-full p-6">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    TONES[tone] ?? TONES.blue
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>

                <h3 className="mt-5 text-[16.5px] font-semibold tracking-tight text-slate-900">
                  {title}
                </h3>

                <p className="mt-2 text-[13.5px] leading-relaxed text-slate-500">{desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
