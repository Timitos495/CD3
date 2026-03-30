'use client';

import { useMemo } from 'react';
import { ShotRecord, RoasterData, ProfileData, DailyShots } from '../types';
import { isSameDay, getDayName } from '../utils';

/**
 * Hook: useRoasterAnalytics
 * Groups shots by roaster and calculates distribution percentages
 */
export function useRoasterAnalytics(shots: ShotRecord[]) {
  return useMemo(() => {
    const filtered = shots;
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
    const filtered = shots;
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
    const filtered = shots;

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

    // Find date range
    const dates = filtered.map(s => s.timestamp);
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

    // Create daily data for the entire range
    const dailyData: DailyShots[] = [];
    const currentDate = new Date(minDate);

    while (currentDate <= maxDate) {
      const dayKey = currentDate.toISOString().split('T')[0];
      const dayShotsRaw = dayMap.get(dayKey) || [];

      const totalCaffeine = dayShotsRaw.reduce(
        (sum, shot) => sum + shot.estimatedCaffeine,
        0
      );

      dailyData.push({
        date: new Date(currentDate),
        shotCount: dayShotsRaw.length,
        totalCaffeine,
        shots: dayShotsRaw,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calculate stats
    const weekTotal = filtered.reduce(
      (sum, shot) => sum + shot.estimatedCaffeine,
      0
    );
    const avgDaily = dailyData.length > 0 ? weekTotal / dailyData.length : 0;

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
