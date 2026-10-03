import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { toast } from 'react-toastify';

import Navbar from '../../Components/common/Navbar';
import SiteFooter from '../../Components/home/SiteFooter';
import ResourcesHero from '../../Components/resources/ResourcesHero';
import ResourceFilters from '../../Components/resources/ResourceFilters';
import ResourceTabs from '../../Components/resources/ResourceTabs';
import ResourceCard from '../../Components/resources/ResourceCard';
import ResourceSidebar from '../../Components/resources/ResourceSidebar';
import {
  RESOURCES,
  SEMESTER_OPTIONS,
  SUBJECT_OPTIONS,
} from '../../Components/resources/resourceData';

const POPULAR_COUNT = 5;

const compare = (sort) => (a, b) => {
  if (sort === 'popular') return b.downloads - a.downloads;
  if (sort === 'title') return a.title.localeCompare(b.title);
  return 0; // `latest` keeps the catalogue order (authored newest first).
};

/**
 * Public resource library. The page owns every bit of filter state and derives
 * three lists from it: the catalogue narrowed by search/semester/subject, the
 * badge counts, and the final visible grid.
 */
export default function ResourcesPage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sort, setSort] = useState('latest');

  // Everything except the type filters - the badge counts are built from this.
  const narrowed = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return RESOURCES.filter((resource) => {
      if (semester && resource.semester !== semester) return false;
      if (subject && resource.subject !== subject) return false;

      if (needle) {
        const haystack =
          `${resource.title} ${resource.subject} ${resource.department} ${resource.description}`.toLowerCase();

        if (!haystack.includes(needle)) return false;
      }

      return true;
    });
  }, [search, semester, subject]);

  const typeCounts = useMemo(() => {
    const counts = {};

    narrowed.forEach((resource) => {
      counts[resource.type] = (counts[resource.type] || 0) + 1;
    });

    return counts;
  }, [narrowed]);

  const tabCounts = useMemo(() => {
    const counts = { all: 0 };

    narrowed.forEach((resource) => {
      if (selectedTypes.length && !selectedTypes.includes(resource.type)) return;

      counts.all += 1;
      counts[resource.type] = (counts[resource.type] || 0) + 1;
    });

    return counts;
  }, [narrowed, selectedTypes]);

  const visible = useMemo(() => {
    const matches = narrowed.filter((resource) => {
      if (activeTab !== 'all' && resource.type !== activeTab) return false;
      if (selectedTypes.length && !selectedTypes.includes(resource.type)) return false;

      return true;
    });

    return [...matches].sort(compare(sort));
  }, [narrowed, activeTab, selectedTypes, sort]);

  const popular = useMemo(
    () => [...RESOURCES].sort((a, b) => b.downloads - a.downloads).slice(0, POPULAR_COUNT),
    []
  );

  const toggleType = (id) =>
    setSelectedTypes((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );

  const resetFilters = () => {
    setSelectedTypes([]);
    setSemester('');
    setSubject('');
    setActiveTab('all');
    setQuery('');
    setSearch('');
  };

  // The catalogue is public, but downloading needs an account.
  const handleDownload = (resource) => {
    toast.info(`Create a free account to download "${resource.title}"`);
    navigate('/auth/signUp');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <ResourcesHero
          query={query}
          onQueryChange={setQuery}
          onSubmit={() => setSearch(query)}
          total={RESOURCES.length}
        />

        <section className="bg-[#f7f9fc]">
          <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-12">
            {/* Same three columns as the design: filter rail, results, sidebar. */}
            <div className="grid gap-5 lg:grid-cols-[216px_minmax(0,1fr)] xl:grid-cols-[216px_minmax(0,1fr)_264px]">
              <ResourceFilters
                typeCounts={typeCounts}
                selectedTypes={selectedTypes}
                onToggleType={toggleType}
                semester={semester}
                onSemesterChange={setSemester}
                subject={subject}
                onSubjectChange={setSubject}
                semesters={SEMESTER_OPTIONS}
                subjects={SUBJECT_OPTIONS}
                onReset={resetFilters}
              />

              <div className="min-w-0">
                <ResourceTabs
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  counts={tabCounts}
                  sort={sort}
                  onSortChange={setSort}
                />

                <p className="mb-3 text-[12px] text-slate-500">
                  Showing{' '}
                  <span className="font-semibold tabular-nums text-slate-700">
                    {visible.length}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold tabular-nums text-slate-700">
                    {RESOURCES.length}
                  </span>{' '}
                  resources
                  {search && (
                    <>
                      {' '}
                      for{' '}
                      <span className="font-semibold text-slate-700">&quot;{search}&quot;</span>
                    </>
                  )}
                </p>

                {visible.length > 0 ? (
                  <div
                    key={`${activeTab}-${selectedTypes.join('-')}-${sort}-${search}`}
                    className="animate-fadeInUp grid items-stretch gap-3.5 sm:grid-cols-2 xl:grid-cols-3"
                  >
                    {visible.map((resource) => (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        onDownload={handleDownload}
                        onOpen={handleDownload}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="surface-card animate-fadeInUp flex flex-col items-center px-6 py-14 text-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <SearchX className="h-6 w-6" />
                    </span>

                    <h3 className="mt-4 text-[15.5px] font-bold text-slate-900">
                      No resources match your filters
                    </h3>

                    <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-slate-500">
                      Try a different resource type, or clear the filters to see the whole
                      library again.
                    </p>

                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </div>

              <ResourceSidebar popular={popular} />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
