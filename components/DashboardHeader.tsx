
import React, { useState, useEffect } from 'react';
import { CloudSun, MapPin, Loader2 } from 'lucide-react';

const DashboardHeader: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [temp, setTemp] = useState<number | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoadingWeather(true);
        // Coordinates for Indianapolis, Indiana
        const lat = 39.7684;
        const lon = -86.1581;
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`
        );
        const data = await response.json();
        if (data.current_weather) {
          setTemp(Math.round(data.current_weather.temperature));
        }
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      } finally {
        setIsLoadingWeather(false);
      }
    };

    fetchWeather();
    // Refresh weather every 30 minutes
    const weatherTimer = setInterval(fetchWeather, 1800000);
    return () => clearInterval(weatherTimer);
  }, []);

  return (
    <header className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-800">Building Overview</h2>
        <div className="flex items-center gap-2 text-slate-400">
          <MapPin className="w-3.5 h-3.5" />
          <p className="text-sm font-medium">Indiana, USA • Real-time Monitoring</p>
        </div>
      </div>
      <div className="flex items-center gap-8 mt-4 md:mt-0">
        <div className="text-right">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Eastern Local Time</p>
          <p className="text-xl font-bold text-slate-700">
            {time.toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit', 
              hour12: true, 
              timeZone: 'America/New_York' 
            })}
          </p>
        </div>
        <div className="flex items-center gap-3 border-l border-slate-100 pl-8">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Indiana Weather</p>
            <div className="flex items-center justify-end h-7">
              {isLoadingWeather ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
              ) : (
                <p className="text-xl font-bold text-slate-700">{temp !== null ? `${temp}°F` : '--°F'}</p>
              )}
            </div>
          </div>
          <div className="bg-orange-50 p-2 rounded-xl">
            <CloudSun className="w-6 h-6 text-orange-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
