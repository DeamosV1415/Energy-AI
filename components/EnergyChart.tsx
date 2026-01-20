
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { EnergyDataPoint } from '../types';

// Updated data: temp converted from Celsius (roughly 16-26) to Fahrenheit (roughly 60-79)
const data: EnergyDataPoint[] = [
  { time: '00:00', power: 40, temp: 64 },
  { time: '02:00', power: 35, temp: 62 },
  { time: '04:00', power: 30, temp: 60 },
  { time: '06:00', power: 45, temp: 60 },
  { time: '08:00', power: 85, temp: 66 },
  { time: '10:00', power: 120, temp: 70 },
  { time: '12:00', power: 143, temp: 75 },
  { time: '14:00', power: 130, temp: 79 },
  { time: '16:00', power: 110, temp: 77 },
  { time: '18:00', power: 90, temp: 72 },
  { time: '20:00', power: 65, temp: 68 },
  { time: '22:00', power: 50, temp: 66 },
];

const EnergyChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Energy Consumption Analysis</h3>
          <p className="text-slate-400 text-sm font-medium">24-hour trend vs Outdoor Temperature</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs font-bold text-slate-500">Power (kW)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span className="text-xs font-bold text-slate-500">Temp (°F)</span>
          </div>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              formatter={(value, name) => [value, name === 'power' ? 'Power (kW)' : 'Temp (°F)']}
            />
            <Area 
              type="monotone" 
              dataKey="power" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPower)" 
            />
            <Area 
              type="monotone" 
              dataKey="temp" 
              stroke="#fb7185" 
              strokeWidth={2}
              strokeDasharray="5 5"
              fill="transparent" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EnergyChart;
