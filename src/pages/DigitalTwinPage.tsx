import React from 'react';
import { Activity, ChevronRight, Flame } from 'lucide-react';
import { WellInfo, TelemetryKPIs, NavigationTab } from '../types';
import { HeroWellboreSection } from '../components/HeroWellboreSection';
import { ModulePageHeader } from '../components/ModulePageHeader';

interface DigitalTwinPageProps {
  currentWell: WellInfo;
  kpis: TelemetryKPIs;
  spm: number;
  strokeLength: number;
  onSPMChange: (spm: number) => void;
  onStrokeLengthChange: (len: number) => void;
  isEmergencyStopped: boolean;
  onNavigate: (tab: NavigationTab) => void;
  onApplyVFDCommand: (downstrokeHz: number, upstrokeHz: number, targetSPM: number) => void;
}

export const DigitalTwinPage: React.FC<DigitalTwinPageProps> = ({
  currentWell,
  kpis,
  spm,
  strokeLength,
  onSPMChange,
  onStrokeLengthChange,
  isEmergencyStopped,
  onNavigate,
  onApplyVFDCommand
}) => {
  return (
    <main className="flex-1 py-8">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 space-y-6">
        <ModulePageHeader
          currentTab="COCKPIT"
          currentWell={currentWell}
          onNavigate={onNavigate}
        />

        <div className="space-y-6 animate-fadeIn">
          <HeroWellboreSection
            currentWell={currentWell}
            kpis={kpis}
            spm={spm}
            strokeLength={strokeLength}
            onSPMChange={onSPMChange}
            onStrokeLengthChange={onStrokeLengthChange}
            isEmergencyStopped={isEmergencyStopped}
          />

          {/* Quick-access diagnostic summary cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
            <div className="bg-[#0C121D] border border-akt-border rounded-xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-akt-border">
                <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-akt-cyan" />
                  DOWNHOLE DYNO PROFILE
                </span>
                <button 
                  onClick={() => onNavigate('DYNO')}
                  className="text-[10px] font-mono text-akt-cyan hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
                >
                  Open Studio Page <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="my-4 text-xs font-mono text-slate-300 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Diagnosed Condition:</span>
                  <strong className="text-amber-400 font-bold">Heavy Crude Rod Float Detected</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">1D-CNN Confidence:</span>
                  <strong className="text-akt-emerald">98.7%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Stroke Length:</span>
                  <strong className="text-white">{strokeLength}" (Reciprocating)</strong>
                </div>
              </div>
              <button
                onClick={() => onApplyVFDCommand(32.5, 56.0, 4.8)}
                className="w-full py-2.5 rounded-md bg-akt-surface hover:bg-akt-card border border-akt-cyan/30 text-akt-cyan text-[10px] font-mono font-bold transition-all uppercase cursor-pointer"
              >
                Dispatch Proactive Speed Throttle (4.8 SPM)
              </button>
            </div>

            <div className="bg-[#0C121D] border border-akt-border rounded-xl p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-akt-border">
                <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-akt-flame" />
                  THERMAL ENERGY BALANCE
                </span>
                <button 
                  onClick={() => onNavigate('THERMAL')}
                  className="text-[10px] font-mono text-akt-flame hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
                >
                  Open Thermal CSS Page <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="my-4 text-xs font-mono text-slate-300 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Subsurface Temperature:</span>
                  <strong className="text-white">{kpis.temperature}°C</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Critical 1200 cP Deadline:</span>
                  <strong className="text-akt-crimson font-bold">{kpis.daysToCriticalViscosity} Days Remaining</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Steam-Oil Ratio (SOR):</span>
                  <strong className="text-akt-emerald">{kpis.sor} m³/m³ (+18% Target)</strong>
                </div>
              </div>
              <button
                onClick={() => onNavigate('THERMAL')}
                className="w-full py-2.5 rounded-md bg-akt-surface hover:bg-akt-card border border-akt-flame/30 text-akt-flame text-[10px] font-mono font-bold transition-all uppercase cursor-pointer"
              >
                Simulate Re-Steaming Injection Cycle
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
