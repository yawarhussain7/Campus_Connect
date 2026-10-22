import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchX, SlidersHorizontal, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

import SiteNavbar from '../../Components/home/SiteNavbar';
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
  return 0;
};

export default function ResourcesPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch = searchParams.get('search') || '';
  const urlType = searchParams.get('type') || 'all';

  const [query, setQuery] = useState(urlSearch);
  const [search, setSearch] = useState(urlSearch);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [semester, setSemester] = useState('');
  const [subject, setSubject] = useState('');
  const [activeTab, setActiveTab] = useState(urlType);
  const [sort, setSort] = useState('latest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Synchronize when URL search parameters change
  useEffect(() => {
    const q = searchParams.get('search') || '';
    const t = searchParams.get('type') || 'all';
    setQuery(q);
    setSearch(q);
    setActiveTab(t);
  }, [searchParams]);

  // Filter catalogue by search query, semester, and subject
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
    setSearchParams({});
  };

  const handleDownload = (resource) => {
    toast.info(`Create a free account to download "${resource.title}"`);
    navigate('/auth/signUp');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      <SiteNavbar resourceCount={RESOURCES.length} />

      <main>
        <ResourcesHero
          query={query}
          onQueryChange={setQuery}
          onSubmit={() => setSearch(query)}
          total={RESOURCES.length}
        />

        <section className="bg-[#f8fafc] py-10 sm:py-12 border-t border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Mobile Filter Toggle Button */}
            <div className="mb-4 lg:hidden">
              <button
                type="button"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm"
              >
                <SlidersHorizontal className="h-4 w-4 text-blue-600" />
                <span>{showMobileFilters ? 'Hide Filters' : 'Show Filter Options'}</span>
              </button>
            </div>

            {/* Three Column Layout: Filters Rail, Results, Sidebar */}
            <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)] xl:grid-cols-[230px_minmax(0,1fr)_270px] items-start">
              {/* Filter Sidebar */}
              <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block`}>
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
              </div>

              {/* Main Content Area */}
              <div className="min-w-0">
                <ResourceTabs
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  counts={tabCounts}
                  sort={sort}
                  onSortChange={setSort}
                />

                <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
                  <p>
                    Showing{' '}
                    <span className="font-bold text-slate-800">{visible.length}</span> of{' '}
                    <span className="font-bold text-slate-800">{RESOURCES.length}</span> resources
                    {search && (
                      <>
                        {' '}
                        matching <span className="font-semibold text-blue-600">&quot;{search}&quot;</span>
                      </>
                    )}
                  </p>

                  {(search || semester || subject || selectedTypes.length > 0 || activeTab !== 'all') && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {visible.length > 0 ? (
                  <div
                    key={`${activeTab}-${selectedTypes.join('-')}-${sort}-${search}`}
                    className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3"
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
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
                      <SearchX className="h-6 w-6" />
                    </span>

                    <h3 className="mt-4 text-base font-bold text-slate-900">
                      No matching resources found
                    </h3>

                    <p className="mt-1.5 max-w-sm text-xs text-slate-500 leading-relaxed">
                      Try clearing your search query or choosing a different semester or course filter.
                    </p>

                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Right Sidebar: Popular & Recommendations */}
              <div className="hidden xl:block">
                <ResourceSidebar popular={popular} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
