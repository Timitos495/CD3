import { useQuery } from '@tanstack/react-query';
import { queryKeys, handleQueryError } from '@/lib/api/queryClient';
import { useMemo } from 'react';

export interface ShotRecord {
  id: string;
  timestamp: Date;
  roasterId: string;
  roasterName: string;
  profileId: string;
  profileName: string;
  estimatedCaffeine: number;
  notes?: string;
}

export interface RoasterData {
  id: string;
  name: string;
  shotCount: number;
  percentage: number;
  dateRange: [Date, Date];
}

/**
 * Fetch all shots for the current user
 * Respects React Query caching: 10min stale time prevents excessive API calls
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
      // Convert timestamps to Date objects
      return (data.data || []).map((shot: any) => ({
        ...shot,
        timestamp: new Date(shot.timestamp),
      })) as ShotRecord[];
    },
  });
}

/**
 * Analyze roaster distribution from all shots
 * Returns breakdown by roaster with percentages
 */
export function useRoasterAnalytics() {
  const { data: shots = [], isLoading, error } = useShots();

  const analytics = useMemo(() => {
    if (!shots.length) return { roasters: [], totalShots: 0 };

    // Group shots by roaster
    const roasterMap = new Map<
      string,
      { name: string; shots: ShotRecord[] }
    >();

    shots.forEach((shot) => {
      if (!roasterMap.has(shot.roasterId)) {
        roasterMap.set(shot.roasterId, {
          name: shot.roasterName,
          shots: [],
        });
      }
      roasterMap.get(shot.roasterId)!.shots.push(shot);
    });

    // Calculate percentages and date ranges
    const roasters: RoasterData[] = Array.from(roasterMap.entries()).map(
      ([id, { name, shots: roasterShots }]) => {
        const dates = roasterShots.map((s) => s.timestamp).sort();
        return {
          id,
          name,
          shotCount: roasterShots.length,
          percentage: (roasterShots.length / shots.length) * 100,
          dateRange: [dates[0], dates[dates.length - 1]] as [Date, Date],
        };
      }
    );

    // Sort by shot count descending
    roasters.sort((a, b) => b.shotCount - a.shotCount);

    return {
      roasters,
      totalShots: shots.length,
    };
  }, [shots]);

  return {
    ...analytics,
    isLoading,
    error,
  };
}
