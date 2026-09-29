import React from 'react';
import { 
  Flame, 
  Activity, 
  Sparkles, 
  ArrowUpRight, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Layers, 
  Compass, 
  Radio,
  BookOpen
} from 'lucide-react';
import { TelemetryKPIs, WellInfo } from '../types';

interface ThermaLiftHeroProps {
  currentWell: WellInfo;
  kpis: TelemetryKPIs;
  onNavigateTab: (tab: string) => void;
  onOpenDocs: () => void;
}

export const ThermaLiftHero: React.FC<ThermaLiftHeroProps> = ({
  currentWell,
  kpis,
  onNavigateTab,
  onOpenDocs
}) => {
  return (
    <section className="relative pt-4 pb-6 overflow-hidden border-b border-white/10">
      
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[320px] bg-gradient-to-b from-[#FF7A00]/12 via-[#00E5FF]/6 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Main Brand Title & Operational Badge */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#FF7A00]/15 text-[#FF7A00] border border-[#FF7A00]/30 font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] animate-ping" />
                THERMALIFT AI • AUTONOMOUS DIGITAL TWIN
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121622] text-[#00E5FF] border border-white/10">
                OIL INDIA LTD (BAGHEWALA FIELD)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#121622] text-amber-300 border border-white/10">
                SIH PS ID: 26120
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-montserrat tracking-tight text-white uppercase leading-[1.08]">
              ThermaLift <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7A00] via-[#FFA500] to-[#00E5FF]">AI</span>
            </h1>

            <p className="text-sm font-sans text-slate-300 leading-relaxed pt-1">
              Autonomous Well-to-Surface Coupled Digital Twin for <strong>Cyclic Steam Stimulation (CSS)</strong> and <strong>Sucker Rod Pump (SRP)</strong> Optimization in extra-heavy crude reservoirs (17–19° API Jodhpur Sandstone).
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => onNavigateTab('DYNO')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FF4800] hover:from-[#FFA500] hover:to-[#FF7A00] text-white font-montserrat font-bold text-xs tracking-wider transition-all shadow-glow-amber flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span>RUN DYNO DIAGNOSTICS</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenDocs}
              className="px-5 py-2.5 rounded-xl bg-[#121622] hover:bg-[#181E2E] border border-white/15 text-slate-200 font-mono font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>VIEW TECHNICAL SPECS</span>
            </button>
          </div>
        </div>

        {/* Live Operational Status Ribbon (High-Density Engineering Metrics) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-3 bg-[#121622]/90 border border-white/10 rounded-xl">
            <div className="text-[10px] font-mono text-slate-400">ACTIVE THERMAL CYCLE</div>
            <div className="text-sm font-bold text-white font-mono mt-0.5 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#FF7A00]" />
              Cycle 4 (Post-Soak D14)
            </div>
          </div>

          <div className="p-3 bg-[#121622]/90 border border-white/10 rounded-xl">
            <div className="text-[10px] font-mono text-slate-400">DOWNHOLE VISCOSITY</div>
            <div className="text-sm font-bold text-[#00E5FF] font-mono mt-0.5">
              {kpis.viscosity} cP ({currentWell.apiGravity}° API)
            </div>
          </div>

          <div className="p-3 bg-[#121622]/90 border border-white/10 rounded-xl">
            <div className="text-[10px] font-mono text-slate-400">GIBBS WAVE SOLVER</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              100 Hz Real-Time Card
            </div>
          </div>

          <div className="p-3 bg-[#121622]/90 border border-white/10 rounded-xl">
            <div className="text-[10px] font-mono text-slate-400">ENERGY CONSERVATION</div>
            <div className="text-sm font-bold text-cyan-300 font-mono mt-0.5">
              -24.2% Lifting kWh/bbl
            </div>
          </div>

          <div className="p-3 bg-[#121622]/90 border border-white/10 rounded-xl col-span-2 sm:col-span-1">
            <div className="text-[10px] font-mono text-slate-400">SIL-2 SAFETY STATUS</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Zero-Float Protected
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
