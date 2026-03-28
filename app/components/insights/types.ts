// Shot data types (from API)
export interface RawShot {
  id: string;
  bean_type: string;
  bean_brand: string;
  grinder_model: string;
  grinder_setting: string;
  bean_weight: string;
  drink_weight: string;
  duration: number;
  profile_title: string;
  start_time: string;
  drink_tds?: string;
  drink_ey?: string;
  espresso_notes?: string;
  bean_notes?: string;
}

// Transformed shot record (for analytics)
export interface ShotRecord {
  id: string;
  timestamp: Date;
  roasterId: string;
  roasterName: string;
  profileId: string;
  profileName: string;
  estimatedCaffeine: number;
  originalProfile: string;
}

// Roaster analytics
export interface RoasterData {
  id: string;
  name: string;
  shotCount: number;
  percentage: number;
  dateRange: { start: Date; end: Date };
}

// Profile analytics
export interface ProfileData {
  id: string;
  name: string;
  shotCount: number;
  percentage: number;
  dateRange: { start: Date; end: Date };
}

// Daily caffeine data
export interface DailyShots {
  date: Date;
  shotCount: number;
  totalCaffeine: number;
  shots: ShotRecord[];
}

// Breakdown details (for click drilldown)
export interface RoasterBreakdown {
  roasterId: string;
  roasterName: string;
  profiles: { profileName: string; count: number; percentage: number }[];
  dateRange: { start: Date; end: Date };
}

export interface ProfileBreakdown {
  profileId: string;
  profileName: string;
  roasters: { roasterName: string; count: number; percentage: number }[];
  dateRange: { start: Date; end: Date };
}

export interface DayTimeline {
  date: Date;
  shots: ShotRecord[];
  totalCaffeine: number;
  peakHour?: { hour: number; shotCount: number };
}
