import React from 'react';
import { WellInfo, NavigationTab } from '../types';
import { SubsurfaceThermalModule } from '../components/SubsurfaceThermalModule';
import { ModulePageHeader } from '../components/ModulePageHeader';

interface ThermalCssPageProps {
  currentWell: WellInfo;
  currentTemp: number;
  currentViscosity: number;
  onNavigate: (tab: NavigationTab) => void;
}

export const ThermalCssPage: React.FC<ThermalCssPageProps> = ({
  currentWell,
  currentTemp,
  currentViscosity,
  onNavigate,
}) => {
  return (
    <main className="flex-1 py-8">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 space-y-6">
        <ModulePageHeader
          currentTab="THERMAL"
          currentWell={currentWell}
          onNavigate={onNavigate}
        />

        <div className="animate-fadeIn">
          <SubsurfaceThermalModule
            currentTemp={currentTemp}
            currentViscosity={currentViscosity}
          />
        </div>
      </div>
    </main>
  );
};
