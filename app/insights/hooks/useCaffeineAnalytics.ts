import { useQuery } from '@tanstack/react-query';
import { queryKeys, handleQueryError } from '@/lib/api/queryClient';
import { useMemo } from 'react';
import type { ShotRecord } from './useRoasterAnalytics';

export interface DailyShots {
  date: Date;
  dayName: string;
  shotCount: number;
  totalCaffeine: number;
  shots: ShotRecord[];
}

export interface CaffeineAnalytics {
  dailyData: DailyShots[];
  weekTotal: number;
  avgDaily: number;
  peakDay: DailyShots | null;
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
    // Insights refetch on focus: NO (historical data, not time-critical)
    refetchOnWindowFocus: false,
  });
}

/**
 * Analyze caffeine consumption over the past 7 days
 * Returns daily breakdown with totals and peak day
 */
export function useCaffeineAnalytics(): CaffeineAnalytics & {
  isLoading: boolean;
  error: Error | null;
} {
  const { data: shots = [], isLoading, error } = useShots();

  const analytics = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyMap = new Map<string, DailyShots>();

    // Initialize 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];

      const dayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];

      dailyMap.set(key, {
        date,
        dayName: dayNames[date.getDay()],
        shotCount: 0,
        totalCaffeine: 0,
        shots: [],
      });
    }

    // Populate with actual shots
    shots.forEach((shot) => {
      const shotDate = new Date(shot.timestamp);
      shotDate.setHours(0, 0, 0, 0);
      const key = shotDate.toISOString().split('T')[0];

      const daily = dailyMap.get(key);
      if (daily) {
        daily.shotCount += 1;
        daily.totalCaffeine += shot.estimatedCaffeine || 0;
        daily.shots.push(shot);
      }
    });

    // Convert to sorted array
    const dailyData = Array.from(dailyMap.values()).sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    const weekTotal = dailyData.reduce((sum, day) => sum + day.totalCaffeine, 0);
    const avgDaily = Math.round(weekTotal / 7);
    const peakDay = dailyData.reduce((max, day) =>
      day.totalCaffeine > (max?.totalCaffeine || 0) ? day : max
    ) || null;

    return {
      dailyData,
      weekTotal,
      avgDaily,
      peakDay,
    };
  }, [shots]);

  return {
    ...analytics,
    isLoading,
    error,
  };
}
