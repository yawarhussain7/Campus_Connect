import { ArrowRight, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

import heroIllustration from '../../assets/study-hero.svg';

/** Quick facts shown under the hero copy. */
const FACTS = ['Four academic modules', 'One unified portal', 'Built by students'];

/**
 * About page header: badge, two-tone headline, intro, entry-point buttons and
 * the shared study illustration with a small floating label.
 */
export default function AboutHero() {
  return (
    <section className="surface-card animate-fadeInUp overflow-hidden border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-50/60 p-6 sm:p-8 lg:p-10">
      <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3.5 py-1.5 text-[12px] font-semibold text-blue-700">
            <GraduationCap className="h-3.5 w-3.5" />
            About CampusConnect
          </span>

          <h1 className="mt-5 text-[28px] font-extrabold leading-[1.12] tracking-tight text-slate-900 sm:text-[36px]">
            Where campus knowledge <span className="gradient-text">comes together</span>.
          </h1>

          <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-slate-500">
            CampusConnect is a student-built hub that gathers projects, past papers,
            assignments and teacher reviews into one calm, searchable workspace — so you
            spend less time hunting for material and more time learning from it.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/student/projects"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-[13px] font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Explore projects
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/student/past-papers"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
            >
              Browse past papers
            </Link>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2">
            {FACTS.map((fact) => (
              <li
                key={fact}
                className="flex items-center gap-2 text-[12px] font-medium text-slate-500"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                {fact}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex justify-center">
          <img
            src={heroIllustration}
            alt=""
            aria-hidden="true"
            className="pointer-events-none w-full max-w-[400px] select-none"
          />

          <div className="animate-float absolute -bottom-2 left-0 hidden max-w-[240px] rounded-2xl border border-slate-100 bg-white/90 p-3.5 shadow-lg backdrop-blur sm:block">
            <p className="text-[10.5px] font-medium uppercase tracking-[0.08em] text-slate-400">
              Everything in one place
            </p>

            <p className="mt-1 text-[12.5px] font-semibold text-slate-800">
              Projects · Papers · Assignments · Reviews
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}