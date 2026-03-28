'use client';

import { useState, useEffect } from 'react';
import { RawShot } from './types';
import { transformShots } from './utils';
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

  const { roasters } = useRoasterAnalytics(shots);
  const { profiles } = useProfileAnalytics(shots);
  const { dailyData } = useCaffeineAnalytics(shots);

  const [selectedRoasterId, setSelectedRoasterId] = useState<string | undefined>();
  const [selectedProfileId, setSelectedProfileId] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Get detail data
  const selectedRoaster = roasters.find((r) => r.id === selectedRoasterId);
  const selectedRoasterShots = selectedRoasterId
    ? shots.filter((s) => s.roasterId === selectedRoasterId)
    : [];

  const selectedProfile = profiles.find((p) => p.id === selectedProfileId);
  const selectedProfileShots = selectedProfileId
    ? shots.filter((s) => s.profileId === selectedProfileId)
    : [];

  const selectedDayData = selectedDate
    ? dailyData.find((d) => d.date.toDateString() === selectedDate.toDateString())
    : undefined;

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Insights</h2>

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
      {shots.length === 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <p className="text-slate-400 text-lg">
            No shots recorded yet. Start logging to see your analytics!
          </p>
        </div>
      )}
    </div>
  );
}
