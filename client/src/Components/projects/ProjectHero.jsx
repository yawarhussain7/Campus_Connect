import { FolderKanban, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import heroIllustration from '../../assets/study-hero.svg';

/**
 * Page header for the projects table. Mirrors the past-paper and teacher-review
 * headers: tinted card, icon tile, title and subtitle, with the upload entry
 * point on the right. The illustration is decorative, so it is hidden from
 * assistive tech and on small screens.
 */
export default function ProjectHero() {
  const navigate = useNavigate();

  return (
    <section className="surface-card overflow-hidden border-blue-100 bg-blue-50/70 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-blue-100 bg-white text-blue-600">
            <FolderKanban className="h-5 w-5" />
          </span>

          <div>
            <h1 className="text-[20px] font-semibold tracking-tight text-blue-700 sm:text-[24px]">
              Projects
            </h1>

            <p className="mt-1 text-[12.5px] text-slate-500">
              View and manage your assigned projects.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate('/student/project/upload')}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-blue-700"
          >
            <Upload className="h-4 w-4" />
            Upload Project
          </button>

          <img
            src={heroIllustration}
            alt=""
            aria-hidden="true"
            className="pointer-events-none hidden h-20 w-auto select-none sm:block sm:h-24"
          />
        </div>
      </div>
    </section>
  );
}
