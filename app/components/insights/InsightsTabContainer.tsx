'use client';

import { useEffect, useState } from 'react';
import { InsightsTab } from './InsightsTab';
import { RawShot } from './types';

export default function InsightsTabContainer() {
  const [shots, setShots] = useState<RawShot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchShots() {
      try {
        setLoading(true);
        const response = await fetch('/api/index');
        if (!response.ok) throw new Error('Failed to fetch shots');
        const data = await response.json();
        setShots(data.shots || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load insights data'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchShots();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-lg font-semibold text-slate-700 mb-2">
            Loading insights...
          </div>
          <div className="text-sm text-slate-500">Building your analytics</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-600">
          <div className="text-lg font-semibold mb-2">Error</div>
          <div className="text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return <InsightsTab rawShots={shots} />;
}
