import React from 'react';
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import KpiGrid from './components/KpiGrid';
import EnergyChart from './components/EnergyChart';
import ChatBot from './components/ChatBot';
import ThreeBackground from './components/ThreeBackground';
import { Lightbulb } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex font-inter relative">
      {/* Three.js Animated Background */}
      <ThreeBackground />

      {/* Fixed Sidebar for Desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 p-4 md:p-8 overflow-x-hidden relative z-10">
        {/* Branding Header */}
        <div className="flex items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
              <Lightbulb className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#0a1128]">
                EnerVision <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">AI</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-0.5">Smart Building Intelligence</p>
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
          &copy; {new Date().getFullYear()} EnerVision AI Building Intelligence. All systems operational.
        </footer>
      </main>
    </div>
  );
};

export default App;