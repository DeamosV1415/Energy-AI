import React from 'react';
import { Zap, Activity, AlertTriangle, Users } from 'lucide-react';
import { KpiCardProps } from '../types';

const KpiCard: React.FC<KpiCardProps> = ({ title, value, subValue, icon, trend, trendType, description }) => {
  const colorConfig = title.includes('Alerts') 
    ? { bg: 'from-red-50 to-rose-50', border: 'border-red-100/50', icon: 'bg-red-100 text-red-500', glow: 'group-hover:shadow-red-500/10' }
    : title.includes('Efficiency') 
    ? { bg: 'from-emerald-50 to-green-50', border: 'border-emerald-100/50', icon: 'bg-emerald-100 text-emerald-500', glow: 'group-hover:shadow-emerald-500/10' }
    : title.includes('Occupancy') 
    ? { bg: 'from-indigo-50 to-violet-50', border: 'border-indigo-100/50', icon: 'bg-indigo-100 text-indigo-500', glow: 'group-hover:shadow-indigo-500/10' }
    : { bg: 'from-blue-50 to-cyan-50', border: 'border-blue-100/50', icon: 'bg-blue-100 text-blue-500', glow: 'group-hover:shadow-blue-500/10' };

  return (
    <div className={`bg-gradient-to-br ${colorConfig.bg} p-6 rounded-3xl shadow-sm border ${colorConfig.border} flex flex-col gap-4 relative overflow-hidden group card-hover cursor-default ${colorConfig.glow}`}>
      {/* Background decoration */}
      <div className="absolute -right-6 -top-6 w-24 h-24 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500">
        {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-24 h-24' })}
      </div>
      
      <div className="flex items-center gap-3 relative z-10">
        <div className={`p-2.5 rounded-xl ${colorConfig.icon} shadow-sm transition-transform duration-300 group-hover:scale-110`}>
          {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5' })}
        </div>
        <span className="text-slate-500 text-sm font-semibold">{title}</span>
      </div>

      <div className="relative z-10">
        <div className="flex items-baseline gap-1">
          <h4 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h4>
          {subValue && <span className="text-slate-400 font-medium text-lg">{subValue}</span>}
        </div>
        {trend && (
          <p className={`text-[11px] font-bold mt-1.5 flex items-center gap-1 ${
            trendType === 'negative' ? 'text-red-500' : 
            trendType === 'positive' ? 'text-emerald-500' : 'text-slate-400'
          }`}>
            {trend}
          </p>
        )}
        {description && (
          <p className="text-[11px] text-slate-400 font-medium mt-1">{description}</p>
        )}
      </div>
    </div>
  );
};

const KpiGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KpiCard 
        title="Real-time Load" 
        value="143.13" 
        subValue="kW" 
        icon={<Zap />}
        trend="↘ -2.4% vs last hour"
        trendType="positive"
      />
      <KpiCard 
        title="Efficiency Score" 
        value="85" 
        subValue="/100" 
        icon={<Activity />}
        description="Top 10% of similar buildings"
        trendType="positive"
      />
      <KpiCard 
        title="Active Alerts" 
        value="87" 
        icon={<AlertTriangle />}
        description="Attention Needed"
        trendType="negative"
      />
      <KpiCard 
        title="Occupancy" 
        value="82" 
        subValue="%" 
        icon={<Users />}
        description="Peak hours (09:00 - 17:00)"
      />
    </div>
  );
};

export default KpiGrid;