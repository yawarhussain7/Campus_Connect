import { Link } from 'react-router-dom';
import {
  Calendar,
  ClipboardList,
  FileText,
  FolderKanban,
  Star,
  ArrowRight,
  Check,
} from 'lucide-react';
import Reveal from './Reveal';

const MODULES = [
  {
    id: 'timetable',
    title: 'Smart Timetable Generator',
    subtitle: 'Automated Schedule Planner',
    description:
      'Set your university class timings, choose your days off, add your subjects, and generate a conflict-free timetable with a personalized sharing link.',
    icon: Calendar,
    color: 'blue',
    iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
    borderHover: 'hover:border-blue-400',
    link: '/student/create-timetable',
    ctaText: 'Build Timetable',
    badge: 'New Feature',
    highlights: [
      'Custom class timings & day-off selector',
      'Shareable link with students',
      'One-click full screen & print preview',
    ],
  },
  {
    id: 'papers',
    title: 'Past Papers Vault',
    subtitle: 'Exam Preparation Archive',
    description:
      'Search through verified past midterms and terminal examination papers organized by department, course, and semester session.',
    icon: FileText,
    color: 'rose',
    iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
    borderHover: 'hover:border-rose-400',
    link: '/resources?type=past-papers',
    ctaText: 'Browse Past Papers',
    badge: 'Exam Ready',
    highlights: [
      'Terminal & midterm question papers',
      'Filtered by semester & degree program',
      'Instant preview & high-speed download',
    ],
  },
  {
    id: 'projects',
    title: 'Projects & Repositories',
    subtitle: 'Portfolio & Code Showcase',
    description:
      'Access documented final-year projects, semester software repositories, reports, and architecture diagrams from seniors and peers.',
    icon: FolderKanban,
    color: 'violet',
    iconBg: 'bg-violet-50 text-violet-600 border-violet-200',
    borderHover: 'hover:border-violet-400',
    link: '/resources?type=projects',
    ctaText: 'Explore Projects',
    badge: 'Source Code',
    highlights: [
      'GitHub repository links & documentation',
      'MERN, AI, Mobile & IoT project tracks',
      'Project blueprints for your semester',
    ],
  },
  {
    id: 'assignments',
    title: 'Assignment Guidelines',
    subtitle: 'Task Rubrics & Solutions',
    description:
      'Keep track of university assignments, view reference submissions, formatting guidelines, and sample problems across courses.',
    icon: ClipboardList,
    color: 'emerald',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    borderHover: 'hover:border-emerald-400',
    link: '/resources?type=assignments',
    ctaText: 'View Assignments',
    badge: 'Coursework',
    highlights: [
      'Assignment question briefs and rubrics',
      'Reference solutions and sample outputs',
      'Deadline tracking and submission tips',
    ],
  },
  {
    id: 'reviews',
    title: 'Teacher Reviews & Feedback',
    subtitle: 'Transparent Course Evaluations',
    description:
      'Read honest student evaluations and teaching ratings to select the most engaging electives and instructors for your semester.',
    icon: Star,
    color: 'amber',
    iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
    borderHover: 'hover:border-amber-400',
    link: '/student/teachers-review',
    ctaText: 'Read Reviews',
    badge: 'Student Voice',
    highlights: [
      'Teaching methodology and grading trends',
      'Constructive peer recommendations',
      'Faculty profiles and course alignment',
    ],
  },
];

export default function AcademicModules() {
  return (
    <section className="bg-white py-16 sm:py-20 border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700">
            Comprehensive Academic Suite
          </span>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Everything Required For Your <span className="text-blue-600">Semester Success</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-500">
            A cohesive suite of academic tools built to save you time and help you achieve your target GPA.
          </p>
        </Reveal>

        {/* Flat Grid of Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
          {MODULES.map((module, index) => {
            const Icon = module.icon;
            return (
              <Reveal key={module.id} delay={index * 60}>
                <div
                  className={`group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6  transition-all duration-200  hover: ${module.borderHover}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border ${module.iconBg}`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>

                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                        {module.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition">
                        {module.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">
                        {module.subtitle}
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {module.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      {module.highlights.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-xs text-slate-600">
                          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-slate-100">
                    <Link
                      to={module.link}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-600 hover:text-white"
                    >
                      <span>{module.ctaText}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

