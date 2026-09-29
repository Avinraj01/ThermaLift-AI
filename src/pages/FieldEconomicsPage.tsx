import React from 'react';
import { WellInfo, NavigationTab } from '../types';
import { ImpactROICalculator } from '../components/ImpactROICalculator';
import { ComparisonMatrix } from '../components/ComparisonMatrix';
import { ModulePageHeader } from '../components/ModulePageHeader';

interface FieldEconomicsPageProps {
  currentWell: WellInfo;
  onNavigate: (tab: NavigationTab) => void;
}

export const FieldEconomicsPage: React.FC<FieldEconomicsPageProps> = ({
  currentWell,
  onNavigate,
}) => {
  return (
    <main className="flex-1 py-8">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 space-y-6">
        <ModulePageHeader
          currentTab="ROI"
          currentWell={currentWell}
          onNavigate={onNavigate}
        />

        <div className="space-y-6 animate-fadeIn">
          <ImpactROICalculator />
          <ComparisonMatrix />
        </div>
      </div>
    </main>
  );
};
