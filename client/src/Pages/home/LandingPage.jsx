import { useEffect, useState } from 'react';
import { BookOpen, Layers, MessagesSquare, School } from 'lucide-react';

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
import FeatureGrid from '../../Components/home/FeatureGrid';
import HowItWorks from '../../Components/home/HowItWorks';
import PopularResources from '../../Components/home/PopularResources';
import Testimonials from '../../Components/home/Testimonials';
import CTASection from '../../Components/home/CTASection';
import SiteFooter from '../../Components/home/SiteFooter';

/**
 * The card's file-type tile, derived from the stored file name / path. A
 * project that only carries a repository link reads as a code resource.
 */
const kindOf = ({ fileUrl, fileName, repo }) => {
  const name = String(fileName || fileUrl || '').toLowerCase();

  if (name.endsWith('.pdf')) return 'pdf';
  if (name.endsWith('.doc') || name.endsWith('.docx')) return 'doc';
  if (!fileUrl && repo) return 'code';

  return 'pdf';
};

/** Maps an assignment / paper / project row onto a "Popular Resources" card. */
const toResourceCard = (record, { title, category, to }) => ({
  id: record._id,
  title: title || 'Untitled resource',
  category,
  to,
  kind: kindOf(record),
  downloads: record.fileSize ? `${formatFileSize(record.fileSize)} file` : 'Shared by students',
  age: formatRelativeTime(record.createdAt),
  createdAt: record.createdAt || '',
});

/**
 * Public landing page. A single vertical flow of marketing sections — hero,
 * trust figures, benefits, the how-it-works steps, popular resources,
 * testimonials, a closing CTA and the footer. Every anchor id here is
 * referenced by the SiteNavbar and the footer.
 *
 * The trust figures, the navbar's library counter and the "Popular Resources"
 * cards are read live from the public catalogue endpoints (assignments, past
 * papers, projects, reviews and the faculty directory), so the page always
 * shows the real size and freshness of the library. A failed request simply
 * leaves that surface at zero / empty instead of inventing numbers.
 */
const LandingPage = () => {
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

      // The client unwraps the JSON envelope, but a bare array is accepted too.
      const recordsOf = (result) => {
        if (result.status !== 'fulfilled') {
          console.error('Landing page request failed:', result.reason);
          return [];
        }

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
        { icon: Layers, value: 4, decimals: 0, suffix: '', label: 'Academic modules' },
        { icon: BookOpen, value: totalResources, decimals: 0, suffix: '+', label: 'Resources shared' },
        { icon: MessagesSquare, value: reviews.length, decimals: 0, suffix: '+', label: 'Teacher reviews' },
        { icon: School, value: teachers.length, decimals: 0, suffix: '+', label: 'Faculty profiles' },
      ]);

      // The four newest uploads across the three catalogues.
      setPopular(
        [
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
        ]
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
    <div className="min-h-screen bg-white">
      <SiteNavbar resourceCount={resourceCount} />

      <main>
        <Hero />
        <StatsBand stats={stats || undefined} />
        <FeatureGrid />

        <HowItWorks />

        <PopularResources
          resources={popular}
          viewAllTo={user ? '/student/dashboard' : '/resources'}
        />

        <Testimonials />

        <CTASection />
      </main>

      <SiteFooter />
    </div>
  );
};

export default LandingPage;
