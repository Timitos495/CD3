import { describe, it, expect } from 'vitest';
import {
  hashString,
  estimateCaffeine,
  transformShot,
  getLastSevenDays,
  filterShotsByPeriod,
  isSameDay,
} from './utils';
import { RawShot } from './types';

describe('utils', () => {
  describe('hashString', () => {
    it('should generate consistent hashes for the same input', () => {
      const hash1 = hashString('Counter Culture');
      const hash2 = hashString('Counter Culture');
      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different inputs', () => {
      const hash1 = hashString('Counter Culture');
      const hash2 = hashString('Passenger Project');
      expect(hash1).not.toBe(hash2);
    });

    it('should return valid string identifiers', () => {
      const hash = hashString('Test Roaster');
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
    });
  });

  describe('estimateCaffeine', () => {
    it('should estimate ristretto as 50mg', () => {
      expect(estimateCaffeine('Ristretto')).toBe(50);
      expect(estimateCaffeine('ristretto concentrated')).toBe(50);
    });

    it('should estimate lungo as 84mg', () => {
      expect(estimateCaffeine('Lungo')).toBe(84);
      expect(estimateCaffeine('lungo extract')).toBe(84);
    });

    it('should estimate espresso as 70mg', () => {
      expect(estimateCaffeine('Espresso')).toBe(70);
      expect(estimateCaffeine('Espresso 9bar')).toBe(70);
      expect(estimateCaffeine('Double shot')).toBe(70);
    });

    it('should estimate americano as 140mg', () => {
      expect(estimateCaffeine('Americano')).toBe(140);
    });

    it('should default to espresso (70mg) for unknown profiles', () => {
      expect(estimateCaffeine('Unknown Profile')).toBe(70);
    });
  });

  describe('transformShot', () => {
    const rawShot: RawShot = {
      id: 'shot-1',
      bean_type: 'Ethiopian Natural',
      bean_brand: 'Counter Culture',
      grinder_model: 'Niche Zero',
      grinder_setting: '5.5',
      bean_weight: '18',
      drink_weight: '36',
      duration: 27,
      profile_title: 'Espresso 9bar',
      start_time: '2026-03-28T09:15:00Z',
    };

    it('should transform raw shot data correctly', () => {
      const result = transformShot(rawShot);

      expect(result.id).toBe('shot-1');
      expect(result.roasterName).toBe('Counter Culture');
      expect(result.profileName).toBe('Espresso 9bar');
      expect(result.estimatedCaffeine).toBe(70);
      expect(result.timestamp).toEqual(new Date('2026-03-28T09:15:00Z'));
    });

    it('should generate consistent roaster and profile IDs', () => {
      const result1 = transformShot(rawShot);
      const result2 = transformShot(rawShot);

      expect(result1.roasterId).toBe(result2.roasterId);
      expect(result1.profileId).toBe(result2.profileId);
    });

    it('should handle missing roaster/profile names', () => {
      const shotWithMissing: RawShot = {
        ...rawShot,
        bean_brand: '',
        profile_title: '',
      };

      const result = transformShot(shotWithMissing);
      expect(result.roasterName).toBe('Unknown Roaster');
      expect(result.profileName).toBe('Unknown Profile');
    });
  });

  describe('isSameDay', () => {
    const date1 = new Date('2026-03-28T09:15:00Z');
    const date2 = new Date('2026-03-28T15:30:00Z');
    const date3 = new Date('2026-03-29T09:15:00Z');

    it('should return true for same day', () => {
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different days', () => {
      expect(isSameDay(date1, date3)).toBe(false);
    });
  });

  describe('getLastSevenDays', () => {
    it('should filter shots to past 7 days', () => {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const eightDaysAgo = new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000);

      const shots = [
        {
          id: '1',
          timestamp: yesterday,
          roasterId: 'r1',
          roasterName: 'R1',
          profileId: 'p1',
          profileName: 'P1',
          estimatedCaffeine: 70,
          originalProfile: 'Espresso',
        },
        {
          id: '2',
          timestamp: eightDaysAgo,
          roasterId: 'r2',
          roasterName: 'R2',
          profileId: 'p2',
          profileName: 'P2',
          estimatedCaffeine: 70,
          originalProfile: 'Espresso',
        },
      ];

      const result = getLastSevenDays(shots);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });
  });

  describe('filterShotsByPeriod', () => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const eightDaysAgo = new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000);
    const thirtyOneDaysAgo = new Date(today.getTime() - 31 * 24 * 60 * 60 * 1000);

    const shots = [
      {
        id: '1',
        timestamp: today,
        roasterId: 'r1',
        roasterName: 'R1',
        profileId: 'p1',
        profileName: 'P1',
        estimatedCaffeine: 70,
        originalProfile: 'Espresso',
      },
      {
        id: '2',
        timestamp: yesterday,
        roasterId: 'r2',
        roasterName: 'R2',
        profileId: 'p2',
        profileName: 'P2',
        estimatedCaffeine: 70,
        originalProfile: 'Espresso',
      },
      {
        id: '3',
        timestamp: eightDaysAgo,
        roasterId: 'r3',
        roasterName: 'R3',
        profileId: 'p3',
        profileName: 'P3',
        estimatedCaffeine: 70,
        originalProfile: 'Espresso',
      },
      {
        id: '4',
        timestamp: thirtyOneDaysAgo,
        roasterId: 'r4',
        roasterName: 'R4',
        profileId: 'p4',
        profileName: 'P4',
        estimatedCaffeine: 70,
        originalProfile: 'Espresso',
      },
    ];

    it('should return all shots for "all" period', () => {
      const result = filterShotsByPeriod(shots, 'all');
      expect(result).toHaveLength(4);
    });

    it('should filter to 7 days for "7d"', () => {
      const result = filterShotsByPeriod(shots, '7d');
      expect(result).toHaveLength(2); // today, yesterday (8 days ago is outside 7 days)
      expect(result.map(s => s.id)).toEqual(['1', '2']);
    });

    it('should filter to 30 days for "1m"', () => {
      const result = filterShotsByPeriod(shots, '1m');
      expect(result).toHaveLength(3); // excludes 31 days ago
      expect(result.map(s => s.id)).toEqual(['1', '2', '3']);
    });

    it('should filter to 90 days for "3m"', () => {
      const result = filterShotsByPeriod(shots, '3m');
      expect(result).toHaveLength(4); // all within 90 days
    });

    it('should filter to 180 days for "6m"', () => {
      const result = filterShotsByPeriod(shots, '6m');
      expect(result).toHaveLength(4); // all within 180 days
    });
  });
});
