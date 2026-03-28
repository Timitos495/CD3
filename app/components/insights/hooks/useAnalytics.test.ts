import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import {
  useRoasterAnalytics,
  useProfileAnalytics,
  useCaffeineAnalytics,
} from './useAnalytics';
import { ShotRecord } from '../types';

describe('useAnalytics hooks', () => {
  const mockShots: ShotRecord[] = [
    {
      id: '1',
      roasterId: 'r1',
      roasterName: 'Counter Culture',
      profileId: 'p1',
      profileName: 'Espresso',
      estimatedCaffeine: 70,
      timestamp: new Date('2026-03-28T09:00:00Z'),
      originalProfile: 'Espresso',
    },
    {
      id: '2',
      roasterId: 'r1',
      roasterName: 'Counter Culture',
      profileId: 'p2',
      profileName: 'Lungo',
      estimatedCaffeine: 84,
      timestamp: new Date('2026-03-28T12:00:00Z'),
      originalProfile: 'Lungo',
    },
    {
      id: '3',
      roasterId: 'r2',
      roasterName: 'Passenger Project',
      profileId: 'p1',
      profileName: 'Espresso',
      estimatedCaffeine: 70,
      timestamp: new Date('2026-03-28T15:00:00Z'),
      originalProfile: 'Espresso',
    },
  ];

  describe('useRoasterAnalytics', () => {
    it('should group shots by roaster', () => {
      const { result } = renderHook(() => useRoasterAnalytics(mockShots));
      expect(result.current.roasters).toHaveLength(2);
    });

    it('should calculate correct percentages', () => {
      const { result } = renderHook(() => useRoasterAnalytics(mockShots));
      const counterCulture = result.current.roasters.find((r) => r.name === 'Counter Culture');

      expect(counterCulture?.percentage).toBe((2 / 3) * 100);
    });

    it('should sort by shot count descending', () => {
      const { result } = renderHook(() => useRoasterAnalytics(mockShots));
      expect(result.current.roasters[0].shotCount).toBeGreaterThanOrEqual(result.current.roasters[1]?.shotCount || 0);
    });

    it('should handle empty shots', () => {
      const { result } = renderHook(() => useRoasterAnalytics([]));
      expect(result.current.roasters).toEqual([]);
    });
  });

  describe('useProfileAnalytics', () => {
    it('should group shots by profile', () => {
      const { result } = renderHook(() => useProfileAnalytics(mockShots));
      expect(result.current.profiles).toHaveLength(2);
    });

    it('should calculate correct percentages for profiles', () => {
      const { result } = renderHook(() => useProfileAnalytics(mockShots));
      const espresso = result.current.profiles.find((p) => p.name === 'Espresso');

      expect(espresso?.percentage).toBe((2 / 3) * 100);
    });

    it('should handle empty shots', () => {
      const { result } = renderHook(() => useProfileAnalytics([]));
      expect(result.current.profiles).toEqual([]);
    });
  });

  describe('useCaffeineAnalytics', () => {
    it('should create daily breakdown for past 7 days', () => {
      const { result } = renderHook(() => useCaffeineAnalytics(mockShots));
      expect(result.current.dailyData).toHaveLength(7);
    });

    it('should calculate total caffeine correctly', () => {
      const { result } = renderHook(() => useCaffeineAnalytics(mockShots));
      const expectedTotal = 70 + 84 + 70; // all shots

      expect(result.current.weekTotal).toBe(expectedTotal);
    });

    it('should calculate average daily caffeine', () => {
      const { result } = renderHook(() => useCaffeineAnalytics(mockShots));
      // All shots are on same day, so avg = total caffeine / 1 day
      const expectedAvg = (70 + 84 + 70) / 7; // 7 days in week but only 1 has data

      expect(result.current.avgDaily).toBeCloseTo(expectedAvg, 1);
    });

    it('should identify peak caffeine day', () => {
      const { result } = renderHook(() => useCaffeineAnalytics(mockShots));
      expect(result.current.peakDay).toBeDefined();
      expect(result.current.peakDay?.caffeine).toBeGreaterThan(0);
    });

    it('should handle empty shots', () => {
      const { result } = renderHook(() => useCaffeineAnalytics([]));
      expect(result.current.weekTotal).toBe(0);
      expect(result.current.avgDaily).toBe(0);
      // peakDay may be null or empty object when no shots
      expect(result.current.peakDay === null || result.current.peakDay?.caffeine === 0).toBe(true);
    });
  });
});
