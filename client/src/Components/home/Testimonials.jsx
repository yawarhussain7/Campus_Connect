import { Quote, Star } from 'lucide-react';

import Reveal from './Reveal';

/** Short, believable quotes from across the faculties. */
const TESTIMONIALS = [
  {
    name: 'Ayesha Khan',
    program: 'BS Computer Science',
    initials: 'AK',
    tone: 'bg-blue-600',
    quote:
      'I found three semesters of past papers the night before my finals. CampusConnect genuinely saved my GPA.',
  },
  {
    name: 'Bilal Raza',
    program: 'BS Software Engineering',
    initials: 'BR',
    tone: 'bg-emerald-600',
    quote:
      'The project section is gold. I picked up a full-stack idea here and shipped it as my final-year project.',
  },
  {
    name: 'Hira Sajid',
    program: 'BS Data Science',
    initials: 'HS',
    tone: 'bg-violet-600',
    quote:
      'Teacher reviews helped me plan my electives properly. It feels like advice from a senior, always available.',
  },
];

const STARS = [0, 1, 2, 3, 4];

/**
 * Social proof: three student quotes in equal-height cards with a star row and
 * a simple initials avatar.
 */
export default function Testimonials() {
  return (
    <section className="bg-[#f6f9ff]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3.5 py-1.5 text-[12px] font-semibold text-blue-700 shadow-sm">
            Loved by students
          </span>

          <h2 className="mt-5 text-[28px] font-extrabold leading-tight tracking-tight text-slate-900 sm:text-[36px]">
            Real students. <span className="gradient-text">Real results.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map(({ name, program, initials, tone, quote }, index) => (
            <Reveal key={name} delay={index * 80}>
              <figure className="surface-card hover-lift flex h-full flex-col p-6">
                <Quote className="h-7 w-7 text-blue-100" aria-hidden="true" />

                <div className="mt-3 flex gap-0.5" aria-label="Rated 5 out of 5">
                  {STARS.map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <blockquote className="mt-4 flex-1 text-[14px] leading-relaxed text-slate-600">
                  “{quote}”
                </blockquote>

                <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white ${tone}`}
                  >
                    {initials}
                  </span>

                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-semibold text-slate-900">
                      {name}
                    </span>

                    <span className="block text-[12px] text-slate-500">{program}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
