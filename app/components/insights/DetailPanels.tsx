'use client';

import { ShotRecord, RoasterData, ProfileData, DailyShots } from './types';
import { getDayName } from './utils';

interface RoasterDetailProps {
  roasterName: string;
  shots: ShotRecord[];
  onClose: () => void;
}

export function RoasterDetail({
  roasterName,
  shots,
  onClose,
}: RoasterDetailProps) {
  // Group by profile
  const profileMap = new Map<string, number>();
  shots.forEach((shot) => {
    const count = profileMap.get(shot.profileName) || 0;
    profileMap.set(shot.profileName, count + 1);
  });

  const profileEntries = Array.from(profileMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count, percentage: (count / shots.length) * 100 }));

  const dates = shots.map((s) => s.timestamp).sort();
  const firstDate = dates[0];
  const lastDate = dates[dates.length - 1];

  return (
    <div className="mt-4 p-4 bg-slate-50 rounded border border-slate-200 animate-slideIn">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-slate-900">Selected: {roasterName}</h4>
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-600"
        >
          ✕
        </button>
      </div>

      <p className="text-xs text-slate-600 mb-3">
        Date Range: {firstDate.toLocaleDateString()} - {lastDate.toLocaleDateString()}
      </p>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-700">Profile Distribution:</p>
        {profileEntries.map((p) => (
          <div key={p.name} className="text-xs flex justify-between">
            <span>• {p.name}:</span>
            <span>{p.percentage.toFixed(0)}% ({p.count} shots)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ProfileDetailProps {
  profileName: string;
  shots: ShotRecord[];
  onClose: () => void;
}

export function ProfileDetail({
  profileName,
  shots,
  onClose,
}: ProfileDetailProps) {
  // Group by roaster
  const roasterMap = new Map<string, number>();
  shots.forEach((shot) => {
    const count = roasterMap.get(shot.roasterName) || 0;
    roasterMap.set(shot.roasterName, count + 1);
  });

  const roasterEntries = Array.from(roasterMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count, percentage: (count / shots.length) * 100 }));

  const dates = shots.map((s) => s.timestamp).sort();
  const firstDate = dates[0];
  const lastDate = dates[dates.length - 1];

  return (
    <div className="mt-4 p-4 bg-slate-50 rounded border border-slate-200 animate-slideIn">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-slate-900">Selected: {profileName}</h4>
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-600"
        >
          ✕
        </button>
      </div>

      <p className="text-xs text-slate-600 mb-3">
        Date Range: {firstDate.toLocaleDateString()} - {lastDate.toLocaleDateString()}
      </p>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-700">Roasters Used:</p>
        {roasterEntries.map((r) => (
          <div key={r.name} className="text-xs flex justify-between">
            <span>• {r.name}:</span>
            <span>{r.percentage.toFixed(0)}% ({r.count} shots)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DayDetailProps {
  day: DailyShots;
  onClose: () => void;
}

export function DayDetail({ day, onClose }: DayDetailProps) {
  const sortedShots = [...day.shots].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  return (
    <div className="mt-4 p-4 bg-slate-50 rounded border border-slate-200 animate-slideIn">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-slate-900">
          {getDayName(day.date)}, {day.date.toLocaleDateString()}
        </h4>
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-slate-600"
        >
          ✕
        </button>
      </div>

      <p className="text-xs text-slate-600 mb-3">
        {day.shotCount} shots • {day.totalCaffeine}mg caffeine
      </p>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {sortedShots.map((shot, idx) => (
          <div key={idx} className="text-xs border-l-2 border-slate-300 pl-2">
            <div className="font-semibold text-slate-900">
              {shot.timestamp.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </div>
            <div className="text-slate-700">
              {shot.roasterName} • {shot.profileName}
            </div>
            <div className="text-slate-500">{shot.estimatedCaffeine}mg</div>
          </div>
        ))}
      </div>
    </div>
  );
}
