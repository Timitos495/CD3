'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { RoasterData } from './types';

const ROASTER_COLORS = ['#8B6F47', '#D4A574', '#B8860B', '#A0826D', '#C19A6B'];

interface RoasterMixCardProps {
  roasters: RoasterData[];
  onRoasterSelect: (id: string) => void;
  selectedRoasterId?: string;
}

export function RoasterMixCard({
  roasters,
  onRoasterSelect,
  selectedRoasterId,
}: RoasterMixCardProps) {
  if (roasters.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6 h-80 flex flex-col items-center justify-center">
        <h3 className="text-lg font-bold mb-2">Roaster Mix</h3>
        <p className="text-slate-400 text-sm text-center">
          No shots recorded yet. Log your first shot to get started.
        </p>
      </div>
    );
  }

  const chartData = roasters.map((r) => ({
    name: r.name,
    value: r.percentage,
    id: r.id,
  }));

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-lg font-bold mb-4">Roaster Mix</h3>

      <ResponsiveContainer width="100%" height={220}>
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
            onClick={(entry) => onRoasterSelect(entry.payload.id)}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={ROASTER_COLORS[index % ROASTER_COLORS.length]}
                opacity={
                  selectedRoasterId === entry.id ? 1 : 0.8
                }
                className={selectedRoasterId === entry.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
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

      <div className="mt-4 text-sm text-slate-600">
        <p>Total shots (7 days): {roasters.reduce((sum, r) => sum + r.shotCount, 0)}</p>
      </div>
    </div>
  );
}
