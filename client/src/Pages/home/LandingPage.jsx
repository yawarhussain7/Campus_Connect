import { ClipboardList, CodeXml, FileSearch, FileText } from 'lucide-react';

import Navbar from '../../Components/common/Navbar';
import Hero from '../../Components/home/Hero';
import StatsBand from '../../Components/home/StatsBand';
import FeatureGrid from '../../Components/home/FeatureGrid';
import FeatureCard from '../../Components/home/FeatureCard';
import Reveal from '../../Components/home/Reveal';
import HowItWorks from '../../Components/home/HowItWorks';
import PopularResources from '../../Components/home/PopularResources';
import Testimonials from '../../Components/home/Testimonials';
import CTASection from '../../Components/home/CTASection';
import SiteFooter from '../../Components/home/SiteFooter';

/** Browse-by-type grid. Each card deep-links into the matching student section. */
const CATEGORIES = [
  {
    id: 'notes',
    title: 'Notes',
    desc: 'Find and share class notes, summaries and study guides.',
    icon: FileText,
    tone: 'blue',
    to: '/student/resources',
  },
  {
    id: 'projects',
    title: 'Projects',
    desc: 'Access project ideas, source code and complete projects.',
    icon: CodeXml,
    tone: 'emerald',
    to: '/student/projects',
  },
  {
    id: 'past-papers',
    title: 'Past Papers',
    desc: 'Get past papers from different courses and universities.',
    icon: FileSearch,
    tone: 'violet',
    to: '/student/past-papers',
  },
  {
    id: 'assignments',
    title: 'Assignments',
    desc: 'View and share assignments, solutions and helpful resources.',
    icon: ClipboardList,
    tone: 'amber',
    to: '/student/assignments',
  },
];

/** Static showcase of the most downloaded uploads. */
const POPULAR_RESOURCES = [
  {
    id: 'res-1',
    title: 'Calculus Notes (Chapter 1-5)',
    kind: 'pdf',
    category: 'Notes',
    downloads: '1.2k downloads',
    age: '2 days ago',
    to: '/student/resources',
  },
  {
    id: 'res-2',
    title: 'Web Development Project',
    kind: 'code',
    category: 'Projects',
    downloads: '856 downloads',
    age: '3 days ago',
    to: '/student/projects',
  },
  {
    id: 'res-3',
    title: 'Physics Past Paper 2023',
    kind: 'pdf',
    category: 'Past Papers',
    downloads: '1.5k downloads',
    age: '5 days ago',
    to: '/student/past-papers',
  },
  {
    id: 'res-4',
    title: 'Data Structures Assignment',
    kind: 'doc',
    category: 'Assignments',
    downloads: '642 downloads',
    age: '1 week ago',
    to: '/student/assignments',
  },
];

/**
 * Public landing page. A single vertical flow of marketing sections — hero,
 * trust figures, benefits, the browse-by-type grid, the how-it-works steps,
 * popular resources, testimonials, a closing CTA and the footer. Every anchor
 * id here is referenced by the Navbar and the footer.
 */
const LandingPage = () => (
  <div className="min-h-screen bg-white">
    <Navbar />

    <main>
      <Hero />
      <StatsBand />
      <FeatureGrid />

      {/* Browse by resource type */}
      <section id="resources" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-[12px] font-semibold text-blue-700">
              Browse the library
            </span>

            <h2 className="mt-5 text-[28px] font-extrabold leading-tight tracking-tight text-slate-900 sm:text-[36px]">
              Everything, sorted by <span className="gradient-text">what you need</span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-[14.5px] leading-relaxed text-slate-500">
              Four focused modules, one login. Jump straight to the material that helps you
              most.
            </p>
          </Reveal>

          <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map(({ id, ...card }, index) => (
              <Reveal key={id} delay={index * 70}>
                <FeatureCard {...card} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />

      <PopularResources resources={POPULAR_RESOURCES} />

      <Testimonials />

      <CTASection />
    </main>

    <SiteFooter />
  </div>
);

export default LandingPage;
