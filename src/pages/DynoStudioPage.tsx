import React from 'react';
import { WellInfo, NavigationTab } from '../types';
import { DynoCardStudio } from '../components/DynoCardStudio';
import { ModulePageHeader } from '../components/ModulePageHeader';

interface DynoStudioPageProps {
  currentWell: WellInfo;
  spm: number;
  strokeLength: number;
  viscosityCp: number;
  onNavigate: (tab: NavigationTab) => void;
  onApplyVFDCommand: (downstrokeHz: number, upstrokeHz: number, targetSPM: number) => void;
}

export const DynoStudioPage: React.FC<DynoStudioPageProps> = ({
  currentWell,
  spm,
  strokeLength,
  viscosityCp,
  onNavigate,
  onApplyVFDCommand,
}) => {
  return (
    <main className="flex-1 py-8">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 space-y-6">
        <ModulePageHeader
          currentTab="DYNO"
          currentWell={currentWell}
          onNavigate={onNavigate}
        />

        <div className="animate-fadeIn">
          <DynoCardStudio
            spm={spm}
            strokeLength={strokeLength}
            viscosityCp={viscosityCp}
            onApplyVFDCommand={onApplyVFDCommand}
          />
        </div>
      </div>
    </main>
  );
};
