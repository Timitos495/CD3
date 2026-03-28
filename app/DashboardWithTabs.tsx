'use client';

import { useState } from 'react';
import ShotDashboard from './ShotDashboard';
import InsightsTabContainer from './components/insights/InsightsTabContainer';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/api/queryClient';

export default function DashboardWithTabs() {
  const [activeTab, setActiveTab] = useState<'shots' | 'insights'>('shots');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-screen bg-slate-100">
        {/* Tab Navigation */}
        <nav className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-full px-6 py-3 flex items-center gap-6">
            <h1 className="text-xl font-bold text-slate-800 mr-8">
              Coffee Dashboard
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('shots')}
                className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
                  activeTab === 'shots'
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Shots
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
                  activeTab === 'insights'
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Insights
              </button>
            </div>
          </div>
        </nav>

        {/* Tab Content */}
        <main className="flex-1 overflow-hidden">
          {activeTab === 'shots' && <ShotDashboard />}
          {activeTab === 'insights' && (
            <InsightsTabContainer />
          )}
        </main>
      </div>
    </QueryClientProvider>
  );
}
