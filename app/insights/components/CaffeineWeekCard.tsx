'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import type { DailyShots } from '../hooks/useCaffeineAnalytics';

interface CaffeineWeekCardProps {
  dailyData: DailyShots[];
  weekTotal: number;
  avgDaily: number;
  peakDay: DailyShots | null;
  isLoading: boolean;
  selectedDate?: Date;
  onDaySelect: (date: Date) => void;
}

const CustomTooltip = (props: any) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded shadow-lg text-sm border border-gray-200">
        <p className="font-semibold text-gray-800">{data.dayName}</p>
        <p className="text-gray-600">{data.shotCount} shots</p>
        <p className="text-red-600 font-medium">
          {data.totalCaffeine}mg caffeine
        </p>
        {data.shots && data.shots.length > 0 && (
          <div className="mt-2 text-xs text-gray-500 max-w-xs">
            {data.shots.slice(0, 3).map((shot: any, i: number) => (
              <p key={i}>{shot.roasterName}</p>
            ))}
            {data.shots.length > 3 && (
              <p>+{data.shots.length - 3} more</p>
            )}
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function CaffeineWeekCard({
  dailyData,
  weekTotal,
  avgDaily,
  peakDay,
  isLoading,
  selectedDate,
  onDaySelect,
}: CaffeineWeekCardProps) {
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Caffeine This Week
        </h3>
        <div className="w-full h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const chartData = dailyData.map((day) => ({
    ...day,
    name: day.dayName.slice(0, 3),
    dateStr: day.date.toISOString().split('T')[0],
  }));

  const selectedDay = selectedDate
    ? chartData.find(
        (d) =>
          d.date.toISOString().split('T')[0] ===
          selectedDate.toISOString().split('T')[0]
      )
    : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-700">
          Caffeine This Week
        </h3>
        <div className="text-right text-sm text-gray-600">
          <p>
            <strong>{weekTotal}mg</strong> total
          </p>
          <p className="text-xs">Avg: {avgDaily}mg/day</p>
          {peakDay && (
            <p className="text-xs text-red-600">
              Peak: {peakDay.dayName} ({peakDay.totalCaffeine}mg)
            </p>
          )}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: 'Shots', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="shotCount"
            fill="#E74C3C"
            onClick={(data: any) => onDaySelect(data.date)}
            onMouseEnter={(data: any) =>
              setHoveredDate(data.dateStr)
            }
            onMouseLeave={() => setHoveredDate(null)}
            style={{
              cursor: 'pointer',
              transition: 'all 150ms ease-out',
            }}
            radius={[4, 4, 0, 0]}
          />
          <Line
            type="monotone"
            dataKey="shotCount"
            stroke="#E74C3C"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Detail timeline panel */}
      {selectedDay && (
        <div className="mt-4 p-4 bg-red-50 rounded border-l-4 border-red-500 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="font-semibold text-gray-800">
                {selectedDay.dayName}, {selectedDay.date.toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                {selectedDay.shotCount} shots • {selectedDay.totalCaffeine}mg caffeine
              </p>
            </div>
            <button
              onClick={() => onDaySelect(new Date(0))}
              className="px-3 py-1 text-xs bg-white border border-red-300 rounded text-red-600 hover:bg-red-50 transition"
            >
              Close
            </button>
          </div>

          <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
            {selectedDay.shots && selectedDay.shots.length > 0 ? (
              selectedDay.shots.map((shot: any, i: number) => (
                <div
                  key={i}
                  className="p-2 bg-white rounded border border-red-100"
                >
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-700">
                      {new Date(shot.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="text-red-600 font-medium">
                      {shot.estimatedCaffeine}mg
                    </span>
                  </div>
                  <p className="text-gray-600">{shot.roasterName}</p>
                  <p className="text-xs text-gray-500">{shot.profileName}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No shots this day</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
