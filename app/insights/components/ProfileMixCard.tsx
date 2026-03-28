'use client';

import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ProfileData } from '../hooks/useProfileAnalytics';

interface ProfileMixCardProps {
  profiles: ProfileData[];
  isLoading: boolean;
  selectedProfileId?: string;
  onProfileSelect: (id: string) => void;
}

const PROFILE_COLORS = [
  '#2C3E50', // Deep Blue
  '#3498DB', // Sky Blue
  '#1ABC9C', // Teal
  '#16A085', // Dark Teal
  '#27AE60', // Green
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
          {(data.value || 0).toFixed(1)}% of total
        </p>
      </div>
    );
  }
  return null;
};

export function ProfileMixCard({
  profiles,
  isLoading,
  selectedProfileId,
  onProfileSelect,
}: ProfileMixCardProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Profile Mix
        </h3>
        <div className="w-full h-48 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!profiles.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Profile Mix
        </h3>
        <div className="text-center py-12 text-gray-500">
          <p>No shots recorded yet.</p>
          <p className="text-sm">Log your first shot to get started.</p>
        </div>
      </div>
    );
  }

  const chartData = profiles.map((p) => ({
    ...p,
    value: p.percentage,
  }));

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Profile Mix
      </h3>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={2}
            dataKey="value"
            onClick={(entry: any) => onProfileSelect(entry.id)}
            onMouseEnter={(_, idx) =>
              setHoveredId(chartData[idx]?.id || null)
            }
            onMouseLeave={() => setHoveredId(null)}
          >
            {profiles.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PROFILE_COLORS[index % PROFILE_COLORS.length]}
                opacity={
                  !hoveredId || hoveredId === entry.id ? 1 : 0.4
                }
                style={{
                  transition: 'all 150ms ease-out',
                  cursor: 'pointer',
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Detail panel */}
      {selectedProfile && (
        <div className="mt-4 p-4 bg-teal-50 rounded border-l-4 border-teal-500 animate-in fade-in slide-in-from-bottom-2">
          <p className="font-semibold text-gray-800 mb-2">
            Selected: {selectedProfile.name}
          </p>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <strong>Total Shots:</strong> {selectedProfile.shotCount}
            </p>
            <p>
              <strong>Percentage:</strong> {selectedProfile.percentage.toFixed(1)}%
            </p>
            <p>
              <strong>Date Range:</strong>{' '}
              {new Date(selectedProfile.dateRange[0]).toLocaleDateString()} -{' '}
              {new Date(
                selectedProfile.dateRange[1]
              ).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => onProfileSelect('')}
            className="mt-3 px-3 py-1 text-xs bg-white border border-teal-300 rounded text-teal-600 hover:bg-teal-50 transition"
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
}
