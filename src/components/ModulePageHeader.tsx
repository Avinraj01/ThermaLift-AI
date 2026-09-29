import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { WellInfo, NavigationTab } from '../types';
import { DEDICATED_MODULES } from '../data/modulesData';
import { getPathForTab } from '../utils/router';

interface ModulePageHeaderProps {
  currentTab: NavigationTab;
  currentWell: WellInfo;
  onNavigate: (tab: NavigationTab) => void;
}

export const ModulePageHeader: React.FC<ModulePageHeaderProps> = ({
  currentTab,
  currentWell,
  onNavigate
}) => {
  const currentModuleIndex = Math.max(0, DEDICATED_MODULES.findIndex(m => m.id === currentTab));
  const currentModuleMeta = DEDICATED_MODULES[currentModuleIndex] || DEDICATED_MODULES[0];
  const prevModule = currentModuleIndex > 0 ? DEDICATED_MODULES[currentModuleIndex - 1] : DEDICATED_MODULES[DEDICATED_MODULES.length - 1];
  const nextModule = currentModuleIndex < DEDICATED_MODULES.length - 1 ? DEDICATED_MODULES[currentModuleIndex + 1] : DEDICATED_MODULES[0];

  const getPageTitle = (tab: NavigationTab) => {
    switch (tab) {
      case 'COCKPIT':
        return '3D Wellbore & Surface Digital Twin';
      case 'DYNO':
        return 'Dyno Studio — 1D Gibbs Wave Diagnostic Engine';
      case 'THERMAL':
        return 'Thermal CSS — Heat Decay & Walther Viscosity';
      case 'VFD':
        return 'Autonomous VFD Governor — Closed-Loop Speed Control';
      case 'ROI':
        return 'Field Economics — Energy Savings & Payback Matrix';
      case 'STANDARDS':
        return 'QHSE & Standards — Compliance, Safety & SIH 26120';
      default:
        return currentModuleMeta.title;
    }
  };

  return (
    <div className="space-y-6 mb-6">
      {/* Top Operational Bar: Back Button + Target Well Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('DASHBOARD');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0E1524] hover:bg-[#152136] text-white text-xs font-mono font-bold transition-all border border-slate-700 hover:border-[#FF9500] shadow-sm w-fit group cursor-pointer"
          title="Return to Executive Field Dashboard"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF9500] group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </a>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0E1524] px-3.5 py-1.5 rounded-lg border border-slate-700/80 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Target Asset:</span>
            <strong className="text-white">{currentWell.id}</strong>
            <span className="text-slate-500">•</span>
            <span className="text-amber-400 font-semibold">{currentWell.name.replace(/Well BGW-\d+\s*/, '')}</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1.5 rounded border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SCADA 100 Hz SYNC</span>
          </div>
        </div>
      </div>

      {/* Structured Module Identification Banner & Step Navigation */}
      <div className="bg-[#0C121E] border border-slate-700/80 rounded-xl p-5 sm:p-6 shadow-akt-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span 
                className="text-[10px] font-mono px-2.5 py-0.5 rounded font-bold uppercase tracking-wider border"
                style={{ 
                  color: currentModuleMeta.color, 
                  borderColor: `${currentModuleMeta.color}50`,
                  backgroundColor: `${currentModuleMeta.color}15`
                }}
              >
                MODULE {currentModuleMeta.num} OF 06 • {currentModuleMeta.title.toUpperCase()}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                OIL INDIA LIMITED • BAGHEWALA ASSET
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-montserrat text-white uppercase tracking-tight">
              {getPageTitle(currentTab)}
            </h1>

            <p className="text-xs text-slate-300 font-sans max-w-3xl font-normal leading-relaxed">
              {currentModuleMeta.desc}
            </p>
          </div>

          {/* Clean Module Step Navigation (Previous / Next) */}
          <div className="flex items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
            <a
              href={getPathForTab(prevModule.id)}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(prevModule.id);
              }}
              className="px-3.5 py-2 rounded-lg bg-[#0E1524] hover:bg-[#152136] text-slate-300 hover:text-white text-xs font-mono font-medium border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
              title={`Previous Module: ${prevModule.title}`}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline text-slate-400">Prev:</span>
              <span className="font-bold text-white">{prevModule.title}</span>
            </a>

            <a
              href={getPathForTab(nextModule.id)}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(nextModule.id);
              }}
              className="px-3.5 py-2 rounded-lg bg-[#0E1524] hover:bg-[#152136] text-slate-300 hover:text-white text-xs font-mono font-medium border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
              title={`Next Module: ${nextModule.title}`}
            >
              <span className="hidden sm:inline text-slate-400">Next:</span>
              <span className="font-bold text-white">{nextModule.title}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#FF9500]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
