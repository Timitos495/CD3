import { useQuery } from '@tanstack/react-query';
import { queryKeys, handleQueryError } from '@/lib/api/queryClient';
import { useMemo } from 'react';
import type { ShotRecord } from './useRoasterAnalytics';

export interface ProfileData {
  id: string;
  name: string;
  barPressure?: number;
  shotCount: number;
  percentage: number;
  dateRange: [Date, Date];
}

/**
 * Fetch all shots for analytics
 */
function useShots() {
  return useQuery({
    queryKey: queryKeys.shots(),
    queryFn: async () => {
      const response = await fetch('/api/shots', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN || ''}`,
        },
      });

      if (!response.ok) {
        const error = new Error('Failed to fetch shots') as any;
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      return (data.data || []).map((shot: any) => ({
        ...shot,
        timestamp: new Date(shot.timestamp),
      })) as ShotRecord[];
    },
  });
}

/**
 * Analyze profile distribution from all shots
 * Returns breakdown by profile (machine settings) with percentages
 * Uses default refetchOnWindowFocus: false for Insights (historical data, not time-critical)
 */
export function useProfileAnalytics() {
  const { data: shots = [], isLoading, error } = useShots();

  const analytics = useMemo(() => {
    if (!shots.length) return { profiles: [], totalShots: 0 };

    // Group shots by profile
    const profileMap = new Map<
      string,
      { name: string; shots: ShotRecord[] }
    >();

    shots.forEach((shot) => {
      if (!profileMap.has(shot.profileId)) {
        profileMap.set(shot.profileId, {
          name: shot.profileName,
          shots: [],
        });
      }
      profileMap.get(shot.profileId)!.shots.push(shot);
    });

    // Calculate percentages and date ranges
    const profiles: ProfileData[] = Array.from(profileMap.entries()).map(
      ([id, { name, shots: profileShots }]) => {
        const dates = profileShots.map((s) => s.timestamp).sort();
        return {
          id,
          name,
          shotCount: profileShots.length,
          percentage: (profileShots.length / shots.length) * 100,
          dateRange: [dates[0], dates[dates.length - 1]] as [Date, Date],
        };
      }
    );

    // Sort by shot count descending
    profiles.sort((a, b) => b.shotCount - a.shotCount);

    return {
      profiles,
      totalShots: shots.length,
    };
  }, [shots]);

  return {
    ...analytics,
    isLoading,
    error,
  };
}
