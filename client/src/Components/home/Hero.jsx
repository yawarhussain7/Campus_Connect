import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  FolderKanban,
  Search,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';

import { useAppContext } from '../../context/AppContext';

const CATEGORY_SHORTCUTS = [
  { label: 'Past Papers', icon: FileText, to: '/resources?type=past-papers' },
  { label: 'Assignments', icon: ClipboardList, to: '/resources?type=assignments' },
  { label: 'Projects', icon: FolderKanban, to: '/resources?type=projects' },
  { label: 'Timetable', icon: Calendar, to: '/student/create-timetable', isNew: true },
];

export default function Hero() {
  const navigate = useNavigate();
  const { user } = useAppContext();

  const [query, setQuery] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/resources?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/resources');
    }
  };

  const handleShortcutClick = (to) => {
    navigate(to);
  };

  return (
    <section id="home" className="relative scroll-mt-20 overflow-hidden bg-[#f8fafc] border-b border-slate-200/80">
      {/* Flat grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.2]"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />


      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Headline & Controls */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Pill Banner */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1.5 text-xs font-semibold text-blue-700 ">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <span>UniMate 2.0</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 font-medium">All-in-one Student Portal</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[56px] leading-[1.1]">
              Smart Academic Management,{' '}
              <span className="text-blue-600 block">Made Effortless.</span>
            </h1>

            {/* Sub-headline */}
            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600">
              Access verified past papers, notes, projects, and teacher reviews — or generate
              your custom university timetable in seconds. Built by students, for students.
            </p>

            {/* Flat Search Form */}
            <form
              onSubmit={handleSearch}
              className="mt-6 flex flex-col sm:flex-row items-stretch gap-2 rounded-2xl border border-slate-300 bg-white p-2  transition hover:border-slate-400 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100"
            >
              <div className="flex flex-1 items-center gap-2.5 px-3">
                <Search className="h-5 w-5 shrink-0 text-slate-400" />
                <input
                  id="landing-search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search past papers, notes, courses, projects..."
                  className="h-11 w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
                />
              </div>

              <button
                type="submit"
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white  transition hover:bg-blue-700  shrink-0"
              >
                <span>Find Resources</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Quick Category Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-500 font-medium mr-1">Quick jumps:</span>
              {CATEGORY_SHORTCUTS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleShortcutClick(item.to)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700  "
                  >
                    <Icon className="h-3.5 w-3.5 text-blue-600" />
                    <span>{item.label}</span>
                    {item.isNew && (
                      <span className="rounded bg-blue-600 px-1 py-0.2 text-[9px] font-bold uppercase text-white">
                        New
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(user ? '/student/dashboard' : '/auth/signUp')}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white  transition hover:bg-slate-800 "
              >
                <span>{user ? 'Open Dashboard' : 'Join Community Free'}</span>
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/student/create-timetable')}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 "
              >
                <Calendar className="h-4 w-4" />
                <span>Create Timetable</span>
              </button>
            </div>

            {/* Trust Badges Bar */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-200 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                100% Free for Students
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Verified Course Materials
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Instant Schedule Generation
              </span>
            </div>
          </div>

          {/* Right Column: Flat Interactive Preview Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl border border-slate-200 bg-white p-5  space-y-4">
              {/* Card Header Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-xs font-semibold text-slate-600">
                    UniMate · Academic Workspace
                  </span>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  Live
                </span>
              </div>

              {/* Module 1: Timetable Snippet */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">Weekly Schedule</span>
                  </div>
                  <span className="text-[10.5px] font-medium text-blue-600">Mon - Fri</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="rounded-lg border border-blue-200 bg-white p-2">
                    <span className="block text-[10px] text-slate-400">09:00 AM</span>
                    <span className="block text-[11px] font-bold text-blue-700 truncate">Mathematics</span>
                  </div>
                  <div className="rounded-lg border border-purple-200 bg-purple-50/60 p-2">
                    <span className="block text-[10px] text-slate-400">11:00 AM</span>
                    <span className="block text-[11px] font-bold text-purple-700 truncate">Physics</span>
                  </div>
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-2">
                    <span className="block text-[10px] text-slate-400">02:00 PM</span>
                    <span className="block text-[11px] font-bold text-emerald-700 truncate">Computer Sci</span>
                  </div>
                </div>
              </div>

              {/* Module 2: Recent Academic Uploads */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 block">Recent Study Materials</span>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5 transition hover:bg-slate-100/80">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-700 font-bold text-[10px]">
                        PDF
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          Algorithms & Data Structures - Final Paper
                        </p>
                        <p className="text-[10px] text-slate-400">CS Department · 4th Semester</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 shrink-0">1.2k DL</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5 transition hover:bg-slate-100/80">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-violet-700 font-bold text-[10px]">
                        CODE
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">
                          UniMate MERN Project & Report
                        </p>
                        <p className="text-[10px] text-slate-400">Software Eng · Final Year</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 shrink-0">840 DL</span>
                  </div>
                </div>
              </div>

              {/* Module 3: Floating Stats Strip */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  <div>
                    <span className="block text-sm font-bold text-slate-900">15,000+</span>
                    <span className="block text-[10px] text-slate-400 font-medium">Resources Shared</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
                    <Star className="h-4 w-4 fill-amber-400" />
                  </span>
                  <div>
                    <span className="block text-sm font-bold text-slate-900">4.9 / 5.0</span>
                    <span className="block text-[10px] text-slate-400 font-medium">Student Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
