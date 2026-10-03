import { ClipboardList } from 'lucide-react';

import heroIllustration from '../../assets/study-hero.svg';

/**
 * Page header for the assignments table. Matches the projects, past-paper and
 * teacher-review headers: tinted card, icon tile, title and subtitle. The
 * illustration is decorative, so it is hidden from assistive tech and on small
 * screens.
 */
export default function AssignmentHero() {
  return (
    <section className="surface-card overflow-hidden border-blue-100 bg-blue-50/70 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-blue-100 bg-white text-blue-600">
            <ClipboardList className="h-5 w-5" />
          </span>

          <div>
            <h1 className="text-[20px] font-semibold tracking-tight text-blue-700 sm:text-[24px]">
              Assignments
            </h1>

            <p className="mt-1 text-[12.5px] text-slate-500">
              View and manage your course assignments.
            </p>
          </div>
        </div>

        <img
          src={heroIllustration}
          alt=""
          aria-hidden="true"
          className="pointer-events-none hidden h-20 w-auto select-none sm:block sm:h-24"
        />
      </div>
    </section>
  );
}
