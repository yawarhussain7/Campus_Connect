import { ClipboardList, CodeXml, FileSearch, FileText, GraduationCap } from 'lucide-react';

import Navbar from '../../Components/common/Navbar';
import Hero from '../../Components/home/Hero';
import FeatureCard from '../../Components/home/FeatureCard';
import PopularResources from '../../Components/home/PopularResources';

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

const LandingPage = () => (
  <div className="min-h-screen bg-white">
    <Navbar />

    <main>
      <Hero />

      <section id="resources" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-14 sm:px-8">
        <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map(({ id, ...card }) => (
            <FeatureCard key={id} {...card} />
          ))}
        </div>
      </section>

      <PopularResources resources={POPULAR_RESOURCES} />
    </main>

    <footer id="about" className="scroll-mt-20 bg-white py-12">
      <div className="mx-auto max-w-7xl px-5 text-center sm:px-8">
        <div className="flex items-center justify-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-blue-600 text-white">
            <GraduationCap className="h-[18px] w-[18px]" />
          </span>

          <span className="text-[18px] font-bold tracking-tight text-slate-900">
            CUI<span className="text-blue-600">Hub</span>
          </span>
        </div>

        <p className="mx-auto mt-4 max-w-2xl text-[13.5px] leading-relaxed text-slate-500">
          CampusConnect brings notes, projects, past papers and assignments together so students
          can share, learn and grow together.
        </p>

        <p className="mt-2 text-[12px] text-slate-400">
          © 2026 CUI Student Hub. Not an official COMSATS website.
        </p>
      </div>
    </footer>
  </div>
);

export default LandingPage;
