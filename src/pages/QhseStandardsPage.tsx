import React from 'react';
import { WellInfo, NavigationTab } from '../types';
import { AKTStandardsAndInsights } from '../components/AKTStandardsAndInsights';
import { ModulePageHeader } from '../components/ModulePageHeader';

interface QhseStandardsPageProps {
  currentWell: WellInfo;
  onNavigate: (tab: NavigationTab) => void;
}

export const QhseStandardsPage: React.FC<QhseStandardsPageProps> = ({
  currentWell,
  onNavigate,
}) => {
  return (
    <main className="flex-1 py-8">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 space-y-6">
        <ModulePageHeader
          currentTab="STANDARDS"
          currentWell={currentWell}
          onNavigate={onNavigate}
        />

        <div className="animate-fadeIn">
          <AKTStandardsAndInsights />
        </div>
      </div>
    </main>
  );
};
