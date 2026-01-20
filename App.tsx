
import React from 'react';
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import KpiGrid from './components/KpiGrid';
import EnergyChart from './components/EnergyChart';
import ChatBot from './components/ChatBot';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-slate-50 font-inter">
      {/* Fixed Sidebar for Desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-x-hidden">
        {/* Mobile Header (Simplified) */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold tracking-tight text-[#0a1128]">SmartWatt <span className="text-blue-500">AI</span></h1>
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">JD</div>
        </div>

        {/* 1. Header (Time and Temp) stays at the top */}
        <DashboardHeader />
        
        {/* 2. ChatBot now at the top below header */}
        <div className="mb-8">
          <ChatBot />
        </div>

        {/* 3. KPI Grid moved down */}
        <KpiGrid />

        {/* 4. Energy Chart moved down and made full-width for clarity */}
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
