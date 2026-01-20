
import React from 'react';
import { Zap, Activity, AlertTriangle, Users } from 'lucide-react';
import { KpiCardProps } from '../types';

const KpiCard: React.FC<KpiCardProps> = ({ title, value, subValue, icon, trend, trendType, description }) => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4 relative overflow-hidden group hover:shadow-md transition-all cursor-default">
      {/* Background Graphic Decoration */}
      <div className="absolute right-0 top-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
        {icon}
      </div>
      
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${
          title.includes('Alerts') ? 'bg-red-50 text-red-500' : 
          title.includes('Efficiency') ? 'bg-emerald-50 text-emerald-500' :
          title.includes('Occupancy') ? 'bg-indigo-50 text-indigo-500' :
          'bg-blue-50 text-blue-500'
        }`}>
          {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
        </div>
        <span className="text-slate-400 text-sm font-semibold">{title}</span>
      </div>

      <div>
        <div className="flex items-baseline gap-1">
          <h4 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h4>
          {subValue && <span className="text-slate-400 font-medium text-lg">{subValue}</span>}
        </div>
        {trend && (
          <p className={`text-[11px] font-bold mt-1 flex items-center gap-1 ${
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
