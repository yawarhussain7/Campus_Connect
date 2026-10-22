import { useEffect, useState } from 'react';
import { BookOpen, Calendar, Layers, MessagesSquare, School } from 'lucide-react';

import { ShowAllassignment } from '../../api/assignment';
import { ShowPapers } from '../../api/paper';
import { ShowProjects } from '../../api/project';
import { ShowReviews } from '../../api/review';
import { ShowAllTeachers } from '../../api/teacher';
import { formatFileSize } from '../../utils/format';
import { formatRelativeTime } from '../../utils/date';
import { useAppContext } from '../../context/AppContext';

import SiteNavbar from '../../Components/home/SiteNavbar';
import Hero from '../../Components/home/Hero';
import StatsBand from '../../Components/home/StatsBand';
import AcademicModules from '../../Components/home/AcademicModules';
import TimetableSpotlight from '../../Components/home/TimetableSpotlight';
import FeatureGrid from '../../Components/home/FeatureGrid';
import HowItWorks from '../../Components/home/HowItWorks';
import PopularResources from '../../Components/home/PopularResources';
import Testimonials from '../../Components/home/Testimonials';
import FAQSection from '../../Components/home/FAQSection';
import CTASection from '../../Components/home/CTASection';
import SiteFooter from '../../Components/home/SiteFooter';

/** Determine file category kind for the card badge */
const kindOf = ({ fileUrl, fileName, repo }) => {
  const name = String(fileName || fileUrl || '').toLowerCase();

  if (name.endsWith('.pdf')) return 'pdf';
  if (name.endsWith('.doc') || name.endsWith('.docx')) return 'doc';
  if (!fileUrl && repo) return 'code';

  return 'pdf';
};

/** Map API records into resource card structure */
const toResourceCard = (record, { title, category, to }) => ({
  id: record._id || String(Math.random()),
  title: title || 'Untitled Resource',
  category,
  to,
  kind: kindOf(record),
  downloads: record.fileSize ? `${formatFileSize(record.fileSize)} file` : 'Shared by students',
  age: formatRelativeTime(record.createdAt),
  createdAt: record.createdAt || '',
});

export default function LandingPage() {
  const { user } = useAppContext();

  const [resourceCount, setResourceCount] = useState(0);
  const [stats, setStats] = useState(null);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      const [assignmentResult, paperResult, projectResult, reviewResult, teacherResult] =
        await Promise.allSettled([
          ShowAllassignment(),
          ShowPapers(),
          ShowProjects(),
          ShowReviews(),
          ShowAllTeachers(),
        ]);

      if (!isActive) return;

      const recordsOf = (result) => {
        if (result.status !== 'fulfilled') return [];
        const payload = result.value?.data ?? result.value;
        return Array.isArray(payload) ? payload : [];
      };

      const assignments = recordsOf(assignmentResult);
      const papers = recordsOf(paperResult);
      const projects = recordsOf(projectResult);
      const reviews = recordsOf(reviewResult);
      const teachers = recordsOf(teacherResult);

      const totalResources = assignments.length + papers.length + projects.length;

      setResourceCount(totalResources);

      setStats([
        { icon: Layers, value: 5, decimals: 0, suffix: '', label: 'Academic Modules' },
        {
          icon: BookOpen,
          value: totalResources > 0 ? totalResources : 120,
          decimals: 0,
          suffix: '+',
          label: 'Resources Shared',
        },
        {
          icon: MessagesSquare,
          value: reviews.length > 0 ? reviews.length : 40,
          decimals: 0,
          suffix: '+',
          label: 'Teacher Reviews',
        },
        {
          icon: School,
          value: teachers.length > 0 ? teachers.length : 32,
          decimals: 0,
          suffix: '+',
          label: 'Faculty Profiles',
        },
      ]);

      // Top 4 newest uploads across the catalogue
      const combined = [
        ...assignments.map((row) =>
          toResourceCard(row, {
            title: row.title,
            category: 'Assignments',
            to: '/student/assignments',
          })
        ),
        ...papers.map((row) =>
          toResourceCard(row, {
            title: row.subject,
            category: 'Past Papers',
            to: '/student/past-papers',
          })
        ),
        ...projects.map((row) =>
          toResourceCard(row, {
            title: row.title,
            category: 'Projects',
            to: '/student/projects',
          })
        ),
      ];

      setPopular(
        combined
          .sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0))
          .slice(0, 4)
      );
    };

    load();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      <SiteNavbar resourceCount={resourceCount} />

      <main>
        <Hero />
        <StatsBand stats={stats || undefined} />
        <AcademicModules />
        <TimetableSpotlight />
        <FeatureGrid />
        <HowItWorks />
        <PopularResources
          resources={popular}
          viewAllTo={user ? '/student/dashboard' : '/resources'}
        />
        <Testimonials />
        <FAQSection />
        <CTASection />
      </main>

      <SiteFooter />
    </div>
  );
}
