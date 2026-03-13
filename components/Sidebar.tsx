import React from 'react';
import { LayoutDashboard, Lightbulb, ShieldCheck } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gradient-to-b from-[#0a1128] via-[#0d1636] to-[#0a1128] text-white flex flex-col h-screen fixed left-0 top-0 z-50">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5 pointer-events-none"></div>
      
      <div className="p-6 flex items-center gap-3 relative z-10">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 rounded-xl shadow-lg shadow-blue-500/30">
          <Lightbulb className="w-5 h-5 text-white" fill="white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">EnerVision <span className="text-blue-400">AI</span></h1>
      </div>
      <p className="px-6 text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-8 relative z-10">Building Intelligence System</p>
      
      <nav className="flex-1 px-4 space-y-1.5 relative z-10">
        <p className="px-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3">Menu</p>
        <a href="#" className="flex items-center gap-3 bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-white px-4 py-3 rounded-xl border-l-4 border-blue-500 transition-all hover:from-blue-600/30 hover:to-indigo-600/20">
          <LayoutDashboard className="w-5 h-5 text-blue-400" />
          <span className="font-medium text-sm">Overview Dashboard</span>
        </a>
      </nav>

      <div className="p-6 mt-auto relative z-10">
        <div className="bg-gradient-to-br from-[#1e293b]/80 to-[#1e293b]/40 p-4 rounded-2xl flex items-center gap-3 border border-emerald-500/10 glow-pulse">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#0a1128] rounded-full animate-pulse"></div>
          </div>
          <div>
            <p className="text-sm font-bold">System Online</p>
            <p className="text-[10px] text-emerald-400 font-medium">99.9% Uptime</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;