'use client';

import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { RoasterData } from '../hooks/useRoasterAnalytics';

interface RoasterMixCardProps {
  roasters: RoasterData[];
  isLoading: boolean;
  selectedRoasterId?: string;
  onRoasterSelect: (id: string) => void;
}

const ROASTER_COLORS = [
  '#8B6F47', // Coffee Brown
  '#D4A574', // Caramel
  '#B8860B', // Dark Goldenrod
  '#A0826D', // Tan
  '#704214', // Dark Brown
];

const CustomTooltip = (props: any) => {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded shadow-lg text-sm border border-gray-200">
        <p className="font-semibold text-gray-800">{data.name}</p>
        <p className="text-gray-600">{data.shotCount} shots</p>
        <p className="text-gray-500 text-xs">
          {new Date(data.dateRange[0]).toLocaleDateString()} -{' '}
          {new Date(data.dateRange[1]).toLocaleDateString()}
        </p>
      </div>
    );
  }
  return null;
};

export function RoasterMixCard({
  roasters,
  isLoading,
  selectedRoasterId,
  onRoasterSelect,
}: RoasterMixCardProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Roaster Mix
        </h3>
        <div className="w-full h-48 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!roasters.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Roaster Mix
        </h3>
        <div className="text-center py-12 text-gray-500">
          <p>No shots recorded yet.</p>
          <p className="text-sm">Log your first shot to get started.</p>
        </div>
      </div>
    );
  }

  const chartData = roasters.map((r) => ({
    ...r,
    value: r.percentage,
  }));

  // Get selected roaster for detail panel
  const selectedRoaster = roasters.find((r) => r.id === selectedRoasterId);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Roaster Mix</h3>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value.toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onClick={(entry: any) => onRoasterSelect(entry.id)}
            onMouseEnter={(_, idx) =>
              setHoveredId(chartData[idx]?.id || null)
            }
            onMouseLeave={() => setHoveredId(null)}
          >
            {roasters.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={ROASTER_COLORS[index % ROASTER_COLORS.length]}
                opacity={
                  !hoveredId || hoveredId === entry.id ? 1 : 0.4
                }
                style={{
                  transition: 'all 150ms ease-out',
                  cursor: 'pointer',
                  transform:
                    hoveredId === entry.id
                      ? 'scale(1.05)'
                      : 'scale(1)',
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Detail panel */}
      {selectedRoaster && (
        <div className="mt-4 p-4 bg-blue-50 rounded border-l-4 border-blue-500 animate-in fade-in slide-in-from-bottom-2">
          <p className="font-semibold text-gray-800 mb-2">
            Selected: {selectedRoaster.name}
          </p>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <strong>Total Shots:</strong> {selectedRoaster.shotCount}
            </p>
            <p>
              <strong>Percentage:</strong> {selectedRoaster.percentage.toFixed(1)}%
            </p>
            <p>
              <strong>Date Range:</strong>{' '}
              {new Date(selectedRoaster.dateRange[0]).toLocaleDateString()} -{' '}
              {new Date(
                selectedRoaster.dateRange[1]
              ).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => onRoasterSelect('')}
            className="mt-3 px-3 py-1 text-xs bg-white border border-blue-300 rounded text-blue-600 hover:bg-blue-50 transition"
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
}
