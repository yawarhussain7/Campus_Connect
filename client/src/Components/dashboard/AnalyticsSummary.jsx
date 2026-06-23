// src/components/AnalyticsSummary.jsx
import React from 'react';
import { BookOpen, ClipboardList, FolderKanban, ScrollText } from 'lucide-react';

export default function AnalyticsSummary({ notesCount, assignmentCount, projectCount, pastPaperCount }) {
  const metrics = [
    { label: 'Indexed Notes', value: `${notesCount}`, suffix: 'Uploads', icon: BookOpen, highlight: false, gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Assignments', value: `${assignmentCount}`, suffix: 'specs', icon: ClipboardList, highlight: false, gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Dev Projects', value: `${projectCount}`, suffix: 'repos', icon: FolderKanban, highlight: true, gradient: 'from-indigo-500 to-purple-500' },
    { label: 'Past Papers', value: `${pastPaperCount}`, suffix: 'papers', icon: ScrollText, highlight: false, gradient: 'from-amber-500 to-orange-500' },
  ];

  return (
    <section className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Good morning, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Hamza</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Track your verified asset indices and peer engagement below.</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-full border border-indigo-100">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-medium text-indigo-600">Live Sync</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div 
              key={i} 
              className="group relative bg-slate-50/80 p-4 rounded-xl border border-slate-200/60 hover:border-slate-300 transition-all duration-200 hover-lift overflow-hidden"
            >
              <div className="absolute -top-8 -right-8 h-20 w-20 rounded-full bg-gradient-to-br from-slate-100 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.gradient} text-white shadow-sm`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              
              <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold tracking-wider block">
                {metric.label}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className={`text-xl font-bold ${metric.highlight ? 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent' : 'text-slate-900'}`}>
                  {metric.value}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{metric.suffix}</span>
              </div>

              {/* Hover accent line */}
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${metric.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full`} />
            </div>
          );
        })}
      </div>
    </section>
  );
}