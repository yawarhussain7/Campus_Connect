import { Quote, Star, CheckCircle2 } from 'lucide-react';
import Reveal from './Reveal';

const TESTIMONIALS = [
  {
    name: 'Ayesha Khan',
    program: 'BS Computer Science',
    initials: 'AK',
    semester: '6th Semester',
    tone: 'bg-blue-600',
    quote:
      'Finding 3 years of verified midterms and finals the week before exams saved my GPA. The timetable tool also helped our study group sync schedules effortlessly.',
  },
  {
    name: 'Bilal Raza',
    program: 'BS Software Engineering',
    initials: 'BR',
    semester: '8th Semester',
    tone: 'bg-emerald-600',
    quote:
      'The project showcase section gave me the exact architecture and documentation guidance I needed to complete my final year capstone project on time.',
  },
  {
    name: 'Hira Sajid',
    program: 'BS Data Science',
    initials: 'HS',
    semester: '4th Semester',
    tone: 'bg-violet-600',
    quote:
      'Teacher reviews provided honest guidance when selecting electives. It feels like getting direct advice from trusted seniors whenever you need it.',
  },
];

const STARS = [0, 1, 2, 3, 4];

export default function Testimonials() {
  return (
    <section className="bg-white py-16 sm:py-20 border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700">
            Student Endorsements
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Loved By <span className="text-blue-600">Ambitious Students</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-500">
            Hear from students across departments who rely on CampusConnect every semester.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map(({ name, program, initials, semester, tone, quote }, index) => (
            <Reveal key={name} delay={index * 80}>
              <figure className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-[#f8fafc] p-6 shadow-sm hover:border-slate-300 transition">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {STARS.map((star) => (
                        <Star
                          key={star}
                          className="h-4 w-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified Student
                    </span>
                  </div>

                  <blockquote className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                    &ldquo;{quote}&rdquo;
                  </blockquote>
                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-slate-200/60 pt-4">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-sm ${tone}`}
                  >
                    {initials}
                  </span>

                  <div>
                    <figcaption className="text-sm font-bold text-slate-900">
                      {name}
                    </figcaption>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {program} · {semester}
                    </p>
                  </div>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
