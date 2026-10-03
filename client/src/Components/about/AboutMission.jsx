import { CheckCircle2, Target } from 'lucide-react';

import SmartImage from './SmartImage.jsx';

const MISSION_IMAGE =
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80';

const POINTS = [
  'Keep the good work each batch produces from getting lost.',
  'Make revision faster with real papers, projects and code.',
  'Give every student the same access, not just the loudest group chat.',
];

/**
 * Mission block: a photograph beside the story of why the portal exists, with
 * the three ideas that shape every decision about it.
 */
export default function AboutMission() {
  return (
    <section className="surface-card animate-fadeInUp overflow-hidden">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[260px]">
          <SmartImage
            src={MISSION_IMAGE}
            alt="Students collaborating around a laptop"
            className="h-full w-full object-cover"
            fallbackClassName="h-full min-h-[260px] w-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700"
          />
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11.5px] font-semibold text-blue-700">
            <Target className="h-3.5 w-3.5" />
            Our mission
          </span>

          <h2 className="mt-4 text-[22px] font-bold leading-snug tracking-tight text-slate-900 sm:text-[26px]">
            Turn scattered effort into shared knowledge.
          </h2>

          <p className="mt-3 text-[13.5px] leading-relaxed text-slate-500">
            Every semester, useful work quietly disappears — notes buried in group chats,
            past papers on someone else&apos;s drive, project write-ups lost after
            graduation. CampusConnect keeps that knowledge in one living library that
            belongs to the students who create it.
          </p>

          <ul className="mt-6 space-y-3">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />

                <span className="text-[13px] leading-relaxed text-slate-600">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}