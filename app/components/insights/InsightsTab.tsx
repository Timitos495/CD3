'use client';

import { useState, useEffect } from 'react';
import { RawShot } from './types';
import { transformShots } from './utils';
import { filterShotsByPeriod } from './utils';
import { useRoasterAnalytics, useProfileAnalytics, useCaffeineAnalytics } from './hooks/useAnalytics';
import { RoasterMixCard } from './RoasterMixCard';
import { ProfileMixCard } from './ProfileMixCard';
import { CaffeineWeekCard } from './CaffeineWeekCard';
import { RoasterDetail, ProfileDetail, DayDetail } from './DetailPanels';

interface InsightsTabProps {
  rawShots: RawShot[];
}

export function InsightsTab({ rawShots }: InsightsTabProps) {
  const shots = transformShots(rawShots);

  const [selectedPeriod, setSelectedPeriod] = useState<string>('7d');
  const filteredShots = filterShotsByPeriod(shots, selectedPeriod);

  const { roasters } = useRoasterAnalytics(filteredShots);
  const { profiles } = useProfileAnalytics(filteredShots);
  const { dailyData } = useCaffeineAnalytics(filteredShots);

  const [selectedRoasterId, setSelectedRoasterId] = useState<string | undefined>();
  const [selectedProfileId, setSelectedProfileId] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Get detail data
  const selectedRoaster = roasters.find((r) => r.id === selectedRoasterId);
  const selectedRoasterShots = selectedRoasterId
    ? filteredShots.filter((s) => s.roasterId === selectedRoasterId)
    : [];

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId);
  const selectedProfileShots = selectedProfileId
    ? filteredShots.filter((s) => s.profileId === selectedProfileId)
    : [];

  const selectedDayData = selectedDate
    ? dailyData.find((d) => d.date.toDateString() === selectedDate.toDateString())
    : undefined;

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Insights</h2>

      {/* Time Period Selector */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: '7d', label: '7 days' },
            { key: '1m', label: '1 month' },
            { key: '3m', label: '3 months' },
            { key: '6m', label: '6 months' },
            { key: 'all', label: 'all time' },
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === period.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Roaster Mix - 1/3 on desktop, full on mobile */}
        <div className="lg:col-span-1">
          <RoasterMixCard
            roasters={roasters}
            onRoasterSelect={setSelectedRoasterId}
            selectedRoasterId={selectedRoasterId}
          />
          {selectedRoaster && selectedRoasterShots.length > 0 && (
            <RoasterDetail
              roasterName={selectedRoaster.name}
              shots={selectedRoasterShots}
              onClose={() => setSelectedRoasterId(undefined)}
            />
          )}
        </div>

        {/* Profile Mix - 1/3 on desktop, full on mobile */}
        <div className="lg:col-span-1">
          <ProfileMixCard
            profiles={profiles}
            onProfileSelect={setSelectedProfileId}
            selectedProfileId={selectedProfileId}
          />
          {selectedProfile && selectedProfileShots.length > 0 && (
            <ProfileDetail
              profileName={selectedProfile.name}
              shots={selectedProfileShots}
              onClose={() => setSelectedProfileId(undefined)}
            />
          )}
        </div>

        {/* Caffeine Chart - 1/3 on desktop, full on mobile */}
        <div className="lg:col-span-1">
          <CaffeineWeekCard
            dailyData={dailyData}
            onDaySelect={setSelectedDate}
            selectedDate={selectedDate}
          />
        </div>
      </div>

      {/* Caffeine Week Details - Full width below charts */}
      {selectedDayData && (
        <div className="mb-6">
          <DayDetail
            day={selectedDayData}
            onClose={() => setSelectedDate(undefined)}
          />
        </div>
      )}

      {/* If no data, show empty state */}
      {filteredShots.length === 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <p className="text-slate-400 text-lg">
            No shots recorded yet. Start logging to see your analytics!
          </p>
        </div>
      )}
    </div>
  );
}
