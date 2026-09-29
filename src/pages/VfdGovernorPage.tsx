import React from 'react';
import { WellInfo, NavigationTab, ControlMode, AuditLogEntry } from '../types';
import { VFDGovernorModule } from '../components/VFDGovernorModule';
import { ModulePageHeader } from '../components/ModulePageHeader';

interface VfdGovernorPageProps {
  currentWell: WellInfo;
  controlMode: ControlMode;
  spm: number;
  auditLogs: AuditLogEntry[];
  isEmergencyStopped: boolean;
  onToggleControlMode: () => void;
  onSPMChange: (spm: number) => void;
  onAddAuditLog: (entry: AuditLogEntry) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const VfdGovernorPage: React.FC<VfdGovernorPageProps> = ({
  currentWell,
  controlMode,
  spm,
  auditLogs,
  isEmergencyStopped,
  onToggleControlMode,
  onSPMChange,
  onAddAuditLog,
  onNavigate,
}) => {
  return (
    <main className="flex-1 py-8">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 space-y-6">
        <ModulePageHeader
          currentTab="VFD"
          currentWell={currentWell}
          onNavigate={onNavigate}
        />

        <div className="animate-fadeIn">
          <VFDGovernorModule
            controlMode={controlMode}
            onToggleControlMode={onToggleControlMode}
            currentSPM={spm}
            onSPMChange={onSPMChange}
            auditLogs={auditLogs}
            onAddAuditLog={onAddAuditLog}
            isEmergencyStopped={isEmergencyStopped}
          />
        </div>
      </div>
    </main>
  );
};
