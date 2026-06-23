// src/components/dashboard/Leaderboard.jsx
import React from 'react';
import { Trophy, Flame, Clock, Download, FileText, Medal, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function Leaderboard({ onDownloadNote }) {
  const students = [
    { rank: 1, name: 'Sara Malik', inst: 'LUMS', xp: '1240 XP', assets: '8 uploads', color: 'from-amber-400 to-yellow-500' },
    { rank: 2, name: 'Ali Hassan', inst: 'FAST NUCES', xp: '1105 XP', assets: '6 uploads', color: 'from-slate-300 to-slate-400' },
    { rank: 3, name: 'Hamza Raza', inst: 'FAST NUCES', xp: '980 XP', assets: '5 uploads', color: 'from-amber-600 to-amber-700' }
  ];

  const subjects = ['Machine Learning', 'Web Development', 'Data Structures'];

  const recentUploads = [
    { id: 3, title: 'Database Design Cheat Sheet', type: 'Notes', time: '10m ago', author: 'Zara A.' },
    { id: 4, title: 'UML Assignment Outline', type: 'Assignment', time: '45m ago', author: 'Hamza R.' }
  ];

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <aside className="space-y-5">
      {/* Block 1: Peer Leaderboard */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <div className="p-1.5 bg-amber-50 rounded-lg border border-amber-100">
              <Trophy className="h-4 w-4 text-amber-500" />
            </div>
            <span>Leaderboard</span>
          </h3>
          <button className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-0.5">
            Full Board
            <ArrowUpRight className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-2">
          {students.map((std, index) => (
            <div 
              key={std.rank} 
              className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all duration-200 border border-transparent hover:border-slate-200/60"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm">{getMedalEmoji(std.rank)}</span>
                <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${std.color} flex items-center justify-center font-bold text-[11px] text-white shadow-sm`}>
                  {std.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{std.name}</h4>
                  <p className="text-[9px] text-slate-400">{std.inst}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-800 block font-mono">{std.xp}</span>
                <span className="text-[9px] text-slate-400 block">{std.assets}</span>
              </div>
            </div>
          ))}
        </div>

        {/* XP Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex justify-between text-[10px] text-slate-400 mb-1.5">
            <span>Next tier: 1500 XP</span>
            <span className="font-semibold text-slate-500">65%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full w-[65%] bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" />
          </div>
        </div>
      </section>

      {/* Block 2: Trending Subjects */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-orange-50 rounded-lg border border-orange-100">
            <Flame className="h-4 w-4 text-orange-500" />
          </div>
          <span>Trending Subjects</span>
        </h3>
        <div className="space-y-2">
          {subjects.map((sub, i) => (
            <div 
              key={i} 
              className="group flex justify-between items-center p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/60 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  i === 0 ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' :
                  i === 1 ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white' :
                  'bg-gradient-to-br from-amber-500 to-orange-500 text-white'
                }`}>
                  <TrendingUp className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{sub}</span>
              </div>
              <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200/60">
                Active
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Block 3: Recently Uploaded */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100">
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
            <span>Recent Uploads</span>
          </h3>
          <span className="text-[10px] font-medium bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100">Live</span>
        </div>
        
        <div className="space-y-2.5">
          {recentUploads.map((upload) => (
            <div 
              key={upload.id} 
              className="group flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-200/60 hover:bg-white hover:border-indigo-200/50 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 shrink-0 shadow-sm">
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate leading-snug pr-1 group-hover:text-indigo-700 transition-colors" title={upload.title}>
                    {upload.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-1">
                    <span className="font-medium text-indigo-600 bg-indigo-50/80 px-1.5 py-0.5 rounded border border-indigo-100">
                      {upload.type}
                    </span>
                    <span>• By {upload.author}</span>
                    <span>• {upload.time}</span>
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => onDownloadNote && onDownloadNote(upload.id)}
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all duration-200 shrink-0 opacity-0 group-hover:opacity-100"
              >
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}