
import React from 'react';
import {
  Trophy,
  Flame,
  Clock3,
  Download,
  FileText,
  ChevronRight,
} from 'lucide-react';

export default function Leaderboard({ onDownloadNote }) {
  const students = [
    {
      rank: 1,
      name: 'Sara Malik',
      inst: 'LUMS',
      xp: 1240,
      uploads: 8,
    },
    {
      rank: 2,
      name: 'Ali Hassan',
      inst: 'FAST NUCES',
      xp: 1105,
      uploads: 6,
    },
    {
      rank: 3,
      name: 'Hamza Raza',
      inst: 'FAST NUCES',
      xp: 980,
      uploads: 5,
    },
  ];

  const subjects = [
    'Machine Learning',
    'Web Development',
    'Data Structures',
  ];

  const recentUploads = [
    {
      id: 3,
      title: 'Database Design Cheat Sheet',
      type: 'Notes',
      time: '10m ago',
      author: 'Zara A.',
    },
    {
      id: 4,
      title: 'UML Assignment Outline',
      type: 'Assignment',
      time: '45m ago',
      author: 'Hamza R.',
    },
  ];

  return (
    <aside className="space-y-4">

      {/* Leaderboard */}
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Trophy className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Top Students
              </h3>
              <p className="text-xs text-slate-400">
                This month
              </p>
            </div>
          </div>

          <button
            type="button"
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            View all
          </button>
        </div>

        <div className="p-2">
          {students.map((student) => (
            <div
              key={student.rank}
              className="flex items-center gap-3 rounded-lg px-2 py-3 transition hover:bg-slate-50"
            >
              <span className="w-5 text-center text-xs font-semibold text-slate-400">
                {student.rank}
              </span>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                {student.name.charAt(0)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">
                  {student.name}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {student.inst}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">
                  {student.xp.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400">
                  {student.uploads} uploads
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 px-4 py-3">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Progress to next tier
            </span>
            <span className="font-medium text-slate-700">
              65%
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-[65%] rounded-full bg-blue-600" />
          </div>
        </div>
      </section>

      {/* Trending Subjects */}
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
            <Flame className="h-4 w-4" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Trending Subjects
            </h3>
            <p className="text-xs text-slate-400">
              Popular right now
            </p>
          </div>
        </div>

        <div className="p-2">
          {subjects.map((subject) => (
            <div
              key={subject}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 transition hover:bg-slate-50"
            >
              <span className="text-sm text-slate-700">
                {subject}
              </span>

              <ChevronRight className="h-4 w-4 text-slate-300" />
            </div>
          ))}
        </div>
      </section>

      {/* Recent Uploads */}
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Clock3 className="h-4 w-4" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Recent Uploads
              </h3>
              <p className="text-xs text-slate-400">
                Latest resources
              </p>
            </div>
          </div>

          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        </div>

        <div className="p-2">
          {recentUploads.map((upload) => (
            <div
              key={upload.id}
              className="group flex items-center gap-3 rounded-lg p-2.5 transition hover:bg-slate-50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <FileText className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-sm font-medium text-slate-800"
                  title={upload.title}
                >
                  {upload.title}
                </p>

                <p className="mt-0.5 truncate text-xs text-slate-400">
                  {upload.type} · {upload.author} · {upload.time}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onDownloadNote?.(upload.id)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-blue-600"
                aria-label={`Download ${upload.title}`}
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

    </aside>
  );
}

