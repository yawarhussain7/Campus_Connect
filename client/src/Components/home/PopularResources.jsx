import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import ResourceCard from './ResourceCard';

/**
 * "Popular Resources" band of the landing page: heading, a link into the
 * student portal and a four-up grid of the most downloaded uploads.
 */
const PopularResources = ({ resources = [], viewAllTo = '/student/dashboard' }) => (
  <section id="community" className="scroll-mt-20 border-y border-slate-100 bg-slate-50/70">
    <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-[26px] font-bold tracking-tight text-slate-900 sm:text-[28px]">
            Popular Resources
          </h2>

          <p className="mt-1.5 text-[13.5px] text-slate-500">
            Most downloaded and shared by our community.
          </p>
        </div>

        <Link
          to={viewAllTo}
          className="group inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-blue-600 transition hover:text-blue-700"
        >
          View all
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {resources.length > 0 ? (
        <div className="mt-8 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center">
          <p className="text-[13.5px] text-slate-500">No resources published yet.</p>
        </div>
      )}
    </div>
  </section>
);

export default PopularResources;
