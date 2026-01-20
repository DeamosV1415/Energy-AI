
// Fix: Added React import to provide the React namespace for React.ReactNode in KpiCardProps
import React from 'react';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface EnergyDataPoint {
  time: string;
  power: number;
  temp: number;
}

export interface KpiCardProps {
  title: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  description?: string;
}
