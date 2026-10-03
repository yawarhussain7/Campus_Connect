import { BookOpen, ClipboardList, CodeXml, FileSearch, FileText } from 'lucide-react';

/**
 * The five buckets the library is organised into. Every entry carries complete
 * Tailwind class strings (no interpolation) so the compiler can always see the
 * utilities it has to emit.
 */
export const RESOURCE_TYPES = {
  notes: {
    label: 'Notes',
    icon: FileText,
    badge: 'border-blue-100 bg-blue-50 text-blue-700',
    tile: 'border-blue-100 bg-blue-50 text-blue-600',
    text: 'text-blue-600',
  },
  'past-papers': {
    label: 'Past Papers',
    icon: FileSearch,
    badge: 'border-violet-100 bg-violet-50 text-violet-700',
    tile: 'border-violet-100 bg-violet-50 text-violet-600',
    text: 'text-violet-600',
  },
  assignments: {
    label: 'Assignments',
    icon: ClipboardList,
    badge: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    tile: 'border-emerald-100 bg-emerald-50 text-emerald-600',
    text: 'text-emerald-600',
  },
  projects: {
    label: 'Projects',
    icon: CodeXml,
    badge: 'border-rose-100 bg-rose-50 text-rose-700',
    tile: 'border-rose-100 bg-rose-50 text-rose-600',
    text: 'text-rose-600',
  },
  'study-materials': {
    label: 'Study Materials',
    icon: BookOpen,
    badge: 'border-amber-100 bg-amber-50 text-amber-700',
    tile: 'border-amber-100 bg-amber-50 text-amber-600',
    text: 'text-amber-600',
  },
};

/** Tab strip across the top of the results area. `all` shows every type. */
export const RESOURCE_TABS = [
  { id: 'all', label: 'All Resources' },
  { id: 'notes', label: 'Notes' },
  { id: 'past-papers', label: 'Past Papers' },
  { id: 'assignments', label: 'Assignments' },
  { id: 'projects', label: 'Projects' },
  { id: 'study-materials', label: 'Study Materials' },
];

export const SORT_OPTIONS = [
  { id: 'latest', label: 'Latest First' },
  { id: 'popular', label: 'Most Downloaded' },
  { id: 'title', label: 'Title (A-Z)' },
];

/**
 * Showcase catalogue for the public library page. `avatar` points at a public
 * face image on the internet; ResourceAvatar falls back to initials offline.
 */
export const RESOURCES = [
  {
    id: 'dsa-notes',
    type: 'notes',
    title: 'Data Structures & Algorithms - Complete Notes',
    subject: 'Data Structures',
    department: 'Computer Science',
    semester: 'Semester 5',
    description:
      'Arrays, trees, graphs, sorting and complexity - explained with worked examples and solved past-paper questions.',
    fileType: 'PDF',
    size: '4.2 MB',
    downloads: 2431,
    posted: '2 days ago',
    uploader: { name: 'Ahmed Raza', avatar: 'https://i.pravatar.cc/120?img=12' },
  },
  {
    id: 'fyp-portal',
    type: 'projects',
    title: 'Campus Connect Portal (Final Year Project)',
    subject: 'Software Engineering',
    department: 'Software Engineering',
    semester: 'Semester 8',
    description:
      'MERN portal with role-based dashboards, resource uploads and a teacher review workflow. Source and report included.',
    fileType: 'ZIP',
    size: '31.2 MB',
    downloads: 2140,
    posted: '3 days ago',
    uploader: { name: 'Sana Malik', avatar: 'https://i.pravatar.cc/120?img=25' },
  },
  {
    id: 'cpp-past-papers',
    type: 'past-papers',
    title: 'C++ Programming Past Papers (2019 - 2024)',
    subject: 'Programming Fundamentals',
    department: 'Computer Science',
    semester: 'Semester 3',
    description:
      'Six years of mid and final papers with marking schemes and full model solutions for every question.',
    fileType: 'PDF',
    size: '6.8 MB',
    downloads: 1876,
    posted: '4 days ago',
    uploader: { name: 'Ayesha Khan', avatar: 'https://i.pravatar.cc/120?img=45' },
  },
  {
    id: 'dbms-notes',
    type: 'notes',
    title: 'Database Systems Notes + ER Diagrams',
    subject: 'Database Systems',
    department: 'Computer Science',
    semester: 'Semester 4',
    description:
      'Normalisation, SQL joins and transactions, illustrated with ER diagrams and quick revision tables.',
    fileType: 'PDF',
    size: '3.5 MB',
    downloads: 1633,
    posted: '5 days ago',
    uploader: { name: 'Bilal Hussain', avatar: 'https://i.pravatar.cc/120?img=68' },
  },
  {
    id: 'web-dev-assignment',
    type: 'assignments',
    title: 'Web Development Assignment (React + Node)',
    subject: 'Web Engineering',
    department: 'Software Engineering',
    semester: 'Semester 6',
    description:
      'Full-stack assignment with authentication, CRUD APIs and a documented deployment guide for the demo.',
    fileType: 'ZIP',
    size: '12.4 MB',
    downloads: 1542,
    posted: '1 week ago',
    uploader: { name: 'Usman Ali', avatar: 'https://i.pravatar.cc/120?img=33' },
  },
  {
    id: 'physics-past-papers',
    type: 'past-papers',
    title: 'Applied Physics Past Papers (2022 - 2024)',
    subject: 'Applied Physics',
    department: 'Electrical Engineering',
    semester: 'Semester 2',
    description:
      'Solved finals bundled with a formula sheet and the grading rubric used by the department.',
    fileType: 'PDF',
    size: '5.3 MB',
    downloads: 1420,
    posted: '3 days ago',
    uploader: { name: 'Hira Iqbal', avatar: 'https://i.pravatar.cc/120?img=5' },
  },
  {
    id: 'movie-recsys',
    type: 'projects',
    title: 'Movie Recommendation System',
    subject: 'Machine Learning',
    department: 'Computer Science',
    semester: 'Semester 7',
    description:
      'Collaborative-filtering recommender with the cleaned dataset, Jupyter notebook and final report.',
    fileType: 'ZIP',
    size: '24.1 MB',
    downloads: 1204,
    posted: '1 week ago',
    uploader: { name: 'Zainab Khan', avatar: 'https://i.pravatar.cc/120?img=60' },
  },
  {
    id: 'os-revision-sheet',
    type: 'study-materials',
    title: 'Operating Systems Revision Sheet',
    subject: 'Operating Systems',
    department: 'Computer Science',
    semester: 'Semester 4',
    description:
      'Two-page cheat sheet covering scheduling, deadlock, paging and memory-management formulas.',
    fileType: 'PDF',
    size: '1.1 MB',
    downloads: 987,
    posted: '2 weeks ago',
    uploader: { name: 'Fatima Noor', avatar: 'https://i.pravatar.cc/120?img=47' },
  },
  {
    id: 'ml-assignment',
    type: 'assignments',
    title: 'Machine Learning Assignment (Regression)',
    subject: 'Machine Learning',
    department: 'Computer Science',
    semester: 'Semester 7',
    description:
      'Linear and logistic regression implemented from scratch, with the evaluation notebook and results.',
    fileType: 'ZIP',
    size: '8.7 MB',
    downloads: 764,
    posted: '6 days ago',
    uploader: { name: 'Daniyal Ahmed', avatar: 'https://i.pravatar.cc/120?img=15' },
  },
];

/** Dropdown options are built from the catalogue so they never go stale. */
const uniqueSorted = (key) =>
  [...new Set(RESOURCES.map((item) => item[key]).filter(Boolean))].sort();

export const SEMESTER_OPTIONS = uniqueSorted('semester');

export const SUBJECT_OPTIONS = uniqueSorted('subject');

/** `2431` -> `2.4k`. Keeps the card meta line short. */
export const formatDownloads = (value) =>
  value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value);
