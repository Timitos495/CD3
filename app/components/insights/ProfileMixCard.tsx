'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ProfileData } from './types';

const PROFILE_COLORS = ['#2C3E50', '#3498DB', '#1ABC9C', '#16A085', '#27AE60'];

interface ProfileMixCardProps {
  profiles: ProfileData[];
  onProfileSelect: (id: string) => void;
  selectedProfileId?: string;
}

export function ProfileMixCard({
  profiles,
  onProfileSelect,
  selectedProfileId,
}: ProfileMixCardProps) {
  if (profiles.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6 h-80 flex flex-col items-center justify-center">
        <h3 className="text-lg font-bold mb-2">Profile Mix</h3>
        <p className="text-slate-400 text-sm text-center">
          No shots recorded yet. Log your first shot to get started.
        </p>
      </div>
    );
  }

  const chartData = profiles.map((p) => ({
    name: p.name,
    value: p.percentage,
    id: p.id,
  }));

  const totalShots = profiles.reduce((sum, p) => sum + p.shotCount, 0);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-lg font-bold mb-4">Profile Mix</h3>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value.toFixed(0)}%`}
            labelLine={false}
            onClick={(entry) => onProfileSelect(entry.payload.id)}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={PROFILE_COLORS[index % PROFILE_COLORS.length]}
                opacity={selectedProfileId === entry.id ? 1 : 0.8}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${(value as number).toFixed(1)}%`, 'Percentage']}
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '8px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 text-sm text-slate-600 text-center">
        <p className="font-semibold">{totalShots} shots</p>
      </div>
    </div>
  );
}
