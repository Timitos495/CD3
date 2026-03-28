'use client';

import React, { useState } from 'react';
import { useRoasterAnalytics } from '../hooks/useRoasterAnalytics';
import { useProfileAnalytics } from '../hooks/useProfileAnalytics';
import { useCaffeineAnalytics } from '../hooks/useCaffeineAnalytics';
import { RoasterMixCard } from './RoasterMixCard';
import { ProfileMixCard } from './ProfileMixCard';
import { CaffeineWeekCard } from './CaffeineWeekCard';

export function InsightsTab() {
  const [selectedRoasterId, setSelectedRoasterId] = useState<string>('');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const {
    roasters,
    isLoading: roastersLoading,
    error: roastersError,
  } = useRoasterAnalytics();

  const {
    profiles,
    isLoading: profilesLoading,
    error: profilesError,
  } = useProfileAnalytics();

  const {
    dailyData,
    weekTotal,
    avgDaily,
    peakDay,
    isLoading: caffeineLoading,
    error: caffeineError,
  } = useCaffeineAnalytics();

  const isLoading = roastersLoading || profilesLoading || caffeineLoading;
  const hasError = roastersError || profilesError || caffeineError;

  if (hasError) {
    return (
      <div className="w-full p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-lg font-semibold text-red-800 mb-2">
          Unable to load analytics
        </h2>
        <p className="text-red-700 text-sm mb-4">
          There was an error loading your analytics data. Please refresh the page or try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Desktop/Tablet layout: 2x1 grid on top, full width below */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RoasterMixCard
          roasters={roasters}
          isLoading={roastersLoading}
          selectedRoasterId={selectedRoasterId}
          onRoasterSelect={setSelectedRoasterId}
        />
        <ProfileMixCard
          profiles={profiles}
          isLoading={profilesLoading}
          selectedProfileId={selectedProfileId}
          onProfileSelect={setSelectedProfileId}
        />
      </div>

      {/* Full width caffeine chart */}
      <CaffeineWeekCard
        dailyData={dailyData}
        weekTotal={weekTotal}
        avgDaily={avgDaily}
        peakDay={peakDay}
        isLoading={caffeineLoading}
        selectedDate={selectedDate}
        onDaySelect={setSelectedDate}
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/5 animate-pulse pointer-events-none rounded-lg" />
      )}
    </div>
  );
}
