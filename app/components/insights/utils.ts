import { RawShot, ShotRecord } from './types';

/**
 * Generate deterministic hash for roaster/profile names
 * Used to create consistent IDs for grouping
 */
export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Estimate caffeine based on profile title
 * Heuristic: detect common espresso profile types
 */
export function estimateCaffeine(profileTitle: string): number {
  const profile = profileTitle.toLowerCase();

  // Ristretto: shorter, concentrated shots
  if (
    profile.includes('ristretto') ||
    profile.includes('short') ||
    profile.includes('concentrated')
  ) {
    return 50;
  }

  // Lungo: longer shots, more caffeine
  if (profile.includes('lungo') || profile.includes('long')) {
    return 84;
  }

  // Espresso: standard 1-2oz
  if (
    profile.includes('espresso') ||
    profile.includes('single') ||
    profile.includes('double') ||
    profile.includes('9bar')
  ) {
    return 70;
  }

  // Americano: espresso + water (assume 1 double shot + water)
  if (profile.includes('americano')) {
    return 140;
  }

  // Default: assume espresso-like
  return 70;
}

/**
 * Transform raw shot data from API into analytics-ready format
 */
export function transformShot(raw: RawShot): ShotRecord {
  const timestamp = new Date(raw.start_time);
  const roasterName = raw.bean_brand || 'Unknown Roaster';
  const profileName = raw.profile_title || 'Unknown Profile';

  return {
    id: raw.id,
    timestamp,
    roasterId: hashString(roasterName),
    roasterName,
    profileId: hashString(profileName),
    profileName,
    estimatedCaffeine: estimateCaffeine(profileName),
    originalProfile: raw.profile_title,
  };
}

/**
 * Batch transform multiple shots
 */
export function transformShots(rawShots: RawShot[]): ShotRecord[] {
  return rawShots.map(transformShot);
}

/**
 * Filter shots to past 7 days (rolling window)
 */
export function getLastSevenDays(shots: ShotRecord[]): ShotRecord[] {
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  return shots.filter(
    (shot) => shot.timestamp >= sevenDaysAgo && shot.timestamp <= today
  );
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Get day of week string
 */
export function getDayName(date: Date): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
}
