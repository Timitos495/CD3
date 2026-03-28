'use client';

import { BarChart, Bar, LineChart, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DailyShots } from './types';
import { getDayName } from './utils';

interface CaffeineWeekCardProps {
  dailyData: DailyShots[];
  onDaySelect: (date: Date) => void;
  selectedDate?: Date;
}

export function CaffeineWeekCard({
  dailyData,
  onDaySelect,
  selectedDate,
}: CaffeineWeekCardProps) {
  if (dailyData.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6 h-80 flex flex-col items-center justify-center">
        <h3 className="text-lg font-bold mb-2">Caffeine Over Time</h3>
        <p className="text-slate-400 text-sm text-center">
          No shots recorded this week. Log your first shot to get started.
        </p>
      </div>
    );
  }

  const chartData = dailyData.map((day) => ({
    date: getDayName(day.date),
    fullDate: day.date.toISOString().split('T')[0],
    caffeine: day.totalCaffeine,
    shotCount: day.shotCount,
    isSelected: selectedDate && day.date.toDateString() === selectedDate.toDateString(),
  }));

  const weekTotal = dailyData.reduce((sum, day) => sum + day.totalCaffeine, 0);
  const avgDaily = weekTotal / 7;
  const peakDay = dailyData.reduce((max, day) =>
    day.totalCaffeine > max.totalCaffeine ? day : max
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-lg font-bold mb-2">Caffeine This Week</h3>
      <div className="flex gap-4 text-sm text-slate-600 mb-4">
        <span>Total: {weekTotal}mg</span>
        <span>Avg: {Math.round(avgDaily)}mg/day</span>
        <span>Peak: {peakDay.date.toLocaleDateString()} ({peakDay.totalCaffeine}mg)</span>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" stroke="#999" />
          <YAxis stroke="#999" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px',
            }}
            formatter={(value, name) => {
              if (name === 'caffeine') return [`${value}mg`, 'Caffeine'];
              if (name === 'shotCount') return [value, 'Shots'];
              return [value, name];
            }}
          />
          <Bar
            dataKey="caffeine"
            fill="#E74C3C"
            opacity={0.8}
            onClick={(e) => {
              if (e && e.payload && e.payload.fullDate) {
                onDaySelect(new Date(e.payload.fullDate));
              }
            }}
          />
          <Line
            type="monotone"
            dataKey="caffeine"
            stroke="#E74C3C"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
