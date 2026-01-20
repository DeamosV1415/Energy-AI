import React from 'react';
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import KpiGrid from './components/KpiGrid';
import EnergyChart from './components/EnergyChart';
import ChatBot from './components/ChatBot';
import { Lightbulb } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-slate-50 font-inter">
      {/* Fixed Sidebar for Desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-x-hidden">
        {/* Branding Header - Visible on all screens in the main area */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm">
              <Lightbulb className="w-5 h-5 text-white" fill="white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0a1128]">
              SmartWatt <span className="text-blue-500">AI</span>
            </h1>
          </div>
          
          {/* User Profile / Status */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Status</p>
              <p className="text-xs font-bold text-emerald-500">Operational</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              JD
            </div>
          </div>
        </div>

        {/* 1. Header (Time and Temp) */}
        <DashboardHeader />
        
        {/* 2. ChatBot */}
        <div className="mb-8">
          <ChatBot />
        </div>

        {/* 3. KPI Grid */}
        <KpiGrid />

        {/* 4. Energy Chart */}
        <div className="w-full">
          <EnergyChart />
        </div>
        
        <footer className="mt-12 text-center text-slate-400 text-xs font-medium pb-8">
          &copy; {new Date().getFullYear()} SmartWatt AI Building Intelligence. All systems operational.
        </footer>
      </main>
    </div>
  );
};

export default App;