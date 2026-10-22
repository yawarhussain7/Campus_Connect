import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';

export default function CTASection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 sm:px-12 sm:py-16 text-center text-white shadow-xl">
            {/* Subtle flat grid pattern */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/80 px-3.5 py-1.5 text-xs font-semibold text-blue-400">
                <Sparkles className="h-3.5 w-3.5" />
                Join Free in Seconds
              </span>

              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
                Ready to Take Control of Your <span className="text-blue-400">Semester?</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
                Join thousands of students accessing exam past papers, study materials, and the smart
                timetable builder. Completely free and built for student success.
              </p>

              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <Link
                  to="/auth/signUp"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-95"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/student/create-timetable"
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 hover:border-slate-600 active:scale-95"
                >
                  <Calendar className="h-4 w-4 text-blue-400" />
                  <span>Try Timetable Generator</span>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
