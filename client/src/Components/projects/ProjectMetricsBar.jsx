// src/components/registry/ProjectMetricsBar.jsx
import React from 'react';
import { GitFork, ShieldCheck, Star } from 'lucide-react';

export default function ProjectMetricsBar({ totalCount }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-white/10 rounded-xl"><GitFork className="h-5 w-5" /></div>
        <div>
          <span className="text-[10px] font-mono text-blue-100 uppercase tracking-wider block">Indexed Builds</span>
          <span className="text-xl font-bold font-mono">{totalCount} Active Repos</span>
        </div>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><ShieldCheck className="h-5 w-5" /></div>
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Peer-Reviewed Status</span>
          <span className="text-xl font-bold text-slate-800 font-mono">100% Open Source</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center space-x-4">
        <div className="p-3 bg-amber-50 rounded-xl text-amber-500"><Star className="h-5 w-5" /></div>
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase block">Platform Impact Score</span>
          <span className="text-xl font-bold text-slate-800 font-mono">Top Tier Roster</span>
        </div>
      </div>
    </div>
  );
}