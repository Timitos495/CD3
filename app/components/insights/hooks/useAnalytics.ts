'use client';

import { useMemo } from 'react';
import { ShotRecord, RoasterData, ProfileData, DailyShots } from '../types';
import { getLastSevenDays, isSameDay, getDayName } from '../utils';

/**
 * Hook: useRoasterAnalytics
 * Groups shots by roaster and calculates distribution percentages
 */
export function useRoasterAnalytics(shots: ShotRecord[]) {
  return useMemo(() => {
    const filtered = getLastSevenDays(shots);
    if (filtered.length === 0) {
      return { roasters: [], totalShots: 0, weekTotal: 0 };
    }

    const roasterMap = new Map<string, { count: number; dates: Date[] }>();

    filtered.forEach((shot) => {
      const existing = roasterMap.get(shot.roasterId) || {
        count: 0,
        dates: [],
      };
      existing.count++;
      existing.dates.push(shot.timestamp);
      roasterMap.set(shot.roasterId, existing);
    });

    const roasters: RoasterData[] = Array.from(roasterMap.entries())
      .map(([id, { count, dates }]) => {
        const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
        return {
          id,
          name:
            filtered.find((s) => s.roasterId === id)?.roasterName ||
            'Unknown',
          shotCount: count,
          percentage: (count / filtered.length) * 100,
          dateRange: {
            start: sortedDates[0],
            end: sortedDates[sortedDates.length - 1],
          },
        };
      })
      .sort((a, b) => b.shotCount - a.shotCount);

    return {
      roasters,
      totalShots: filtered.length,
      weekTotal: shots.length,
    };
  }, [shots]);
}

/**
 * Hook: useProfileAnalytics
 * Groups shots by profile and calculates distribution percentages
 */
export function useProfileAnalytics(shots: ShotRecord[]) {
  return useMemo(() => {
    const filtered = getLastSevenDays(shots);
    if (filtered.length === 0) {
      return { profiles: [], totalShots: 0, weekTotal: 0 };
    }

    const profileMap = new Map<string, { count: number; dates: Date[] }>();

    filtered.forEach((shot) => {
      const existing = profileMap.get(shot.profileId) || {
        count: 0,
        dates: [],
      };
      existing.count++;
      existing.dates.push(shot.timestamp);
      profileMap.set(shot.profileId, existing);
    });

    const profiles: ProfileData[] = Array.from(profileMap.entries())
      .map(([id, { count, dates }]) => {
        const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
        return {
          id,
          name:
            filtered.find((s) => s.profileId === id)?.profileName ||
            'Unknown',
          shotCount: count,
          percentage: (count / filtered.length) * 100,
          dateRange: {
            start: sortedDates[0],
            end: sortedDates[sortedDates.length - 1],
          },
        };
      })
      .sort((a, b) => b.shotCount - a.shotCount);

    return {
      profiles,
      totalShots: filtered.length,
      weekTotal: shots.length,
    };
  }, [shots]);
}

/**
 * Hook: useCaffeineAnalytics
 * Groups shots by day and calculates daily caffeine totals
 */
export function useCaffeineAnalytics(shots: ShotRecord[]) {
  return useMemo(() => {
    const filtered = getLastSevenDays(shots);

    if (filtered.length === 0) {
      return {
        dailyData: [],
        weekTotal: 0,
        avgDaily: 0,
        peakDay: null as { date: Date; caffeine: number; count: number } | null,
      };
    }

    // Group by day
    const dayMap = new Map<string, ShotRecord[]>();

    filtered.forEach((shot) => {
      const dayKey = shot.timestamp.toISOString().split('T')[0];
      const existing = dayMap.get(dayKey) || [];
      existing.push(shot);
      dayMap.set(dayKey, existing);
    });

    // Create 7-day rolling window (today - 6 days through today)
    const today = new Date();
    const sevenDaysAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
    const dailyData: DailyShots[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
      const dayKey = date.toISOString().split('T')[0];
      const dayShotsRaw = dayMap.get(dayKey) || [];

      const totalCaffeine = dayShotsRaw.reduce(
        (sum, shot) => sum + shot.estimatedCaffeine,
        0
      );

      dailyData.push({
        date,
        shotCount: dayShotsRaw.length,
        totalCaffeine,
        shots: dayShotsRaw,
      });
    }

    // Calculate stats
    const weekTotal = filtered.reduce(
      (sum, shot) => sum + shot.estimatedCaffeine,
      0
    );
    const avgDaily = filtered.length > 0 ? weekTotal / 7 : 0;

    // Find peak day
    let peakDay = null;
    let maxCaffeine = 0;
    dailyData.forEach((day) => {
      if (day.totalCaffeine > maxCaffeine) {
        maxCaffeine = day.totalCaffeine;
        peakDay = {
          date: day.date,
          caffeine: day.totalCaffeine,
          count: day.shotCount,
        };
      }
    });

    return {
      dailyData,
      weekTotal,
      avgDaily,
      peakDay,
    };
  }, [shots]);
}
