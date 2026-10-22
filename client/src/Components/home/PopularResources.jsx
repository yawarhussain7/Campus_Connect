import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResourceCard from './ResourceCard';
import Reveal from './Reveal';

export default function PopularResources({ resources = [], viewAllTo = '/resources' }) {
  return (
    <section id="community" className="scroll-mt-20 border-b border-slate-200/80 bg-[#f8fafc] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Community Curated
              </span>

              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Trending Study Materials
              </h2>

              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Most downloaded and referenced resources shared by top campus contributors.
              </p>
            </div>

            <Link
              to={viewAllTo}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              <span>Explore all resources</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        {resources.length > 0 ? (
          <div className="mt-8 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {resources.map((resource, index) => (
              <Reveal key={resource.id} delay={index * 50}>
                <ResourceCard resource={resource} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center">
            <p className="text-sm font-medium text-slate-500">No resources published yet.</p>
            <Link
              to="/resources"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
            >
              Browse complete library &rarr;
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
