import React from 'react';
import { 
  ArrowUpRight, 
  Activity, 
  Flame, 
  Radio, 
  ShieldCheck, 
  Award, 
  Layers, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface AKTHeroBannerProps {
  onScrollToConsole: () => void;
  onOpenDocs: () => void;
  currentWellName: string;
  currentCycle: number;
}

export const AKTHeroBanner: React.FC<AKTHeroBannerProps> = ({
  onScrollToConsole,
  onOpenDocs,
  currentWellName,
  currentCycle
}) => {
  return (
    <section className="relative pt-6 pb-12 overflow-hidden border-b border-white/10">
      
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#FF3B30]/10 via-[#FF6B00]/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Massive AKT Brand Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#FF3B30]/15 text-[#FF3B30] border border-[#FF3B30]/30 font-bold tracking-widest uppercase flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-ping" />
                AKT OIL SERVICES • THERMALIFT AI
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                ASSET: OIL INDIA LTD (BAGHEWALA FIELD, RAJASTHAN)
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-montserrat tracking-tight text-white uppercase leading-[1.05]">
              ThermaLift AI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#FF3B30]">
                Autonomous Well-to-Surface
              </span> <br />
              Digital Twin
            </h1>
          </div>

          <div className="max-w-md space-y-4">
            <p className="text-sm font-sans text-slate-300 leading-relaxed">
              The premier Engineering, Procurement, Construction and Commissioning (EPCC) digital twin suite for Cyclic Steam Stimulation (CSS) and Sucker Rod Pump (SRP) optimization in extra-heavy crude reservoirs (17–19° API Jodhpur Sandstone).
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onScrollToConsole}
                className="px-5 py-3 rounded-lg bg-[#FF3B30] hover:bg-[#E62E2D] text-white font-montserrat font-bold text-xs tracking-wider transition-all shadow-akt-red flex items-center gap-2"
              >
                <span>LAUNCH DIGITAL TWIN</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenDocs}
                className="px-4 py-3 rounded-lg bg-[#121622] hover:bg-[#181E2E] border border-white/10 text-slate-200 font-mono font-semibold text-xs transition-colors"
              >
                SYSTEM BLUEPRINT
              </button>
            </div>
          </div>
        </div>

        {/* 6-Pillar Profile Capabilities Grid (Direct from AKT Oil Services format) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#121622]/80 border border-white/5 hover:border-white/20 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-[#FF3B30]">01. SUBSURFACE THERMODYNAMICS</span>
              <Flame className="w-4 h-4 text-[#FF3B30]" />
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Marx-Langenheim heat decay engine predicting reservoir temperature front from 320°C steam soak down to 48°C baseline with Walther viscosity mapping.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#121622]/80 border border-white/5 hover:border-white/20 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-[#00E5FF]">02. 1D GIBBS WAVE SOLVER</span>
              <Activity className="w-4 h-4 text-[#00E5FF]" />
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              100 Hz hyperbolic wave equation reconstructing real-time downhole pump cards from surface polished rod load cells to detect fluid pound and rod float.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#121622]/80 border border-white/5 hover:border-white/20 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-emerald-400">03. ZERO-FLOAT ASYMMETRIC VFD</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Decelerates downstroke (32 Hz) to prevent carrier bar separation in heavy crude and accelerates upstroke (56 Hz) to conserve 24.2% lifting kWh/bbl.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#121622]/80 border border-white/5 hover:border-white/20 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-amber-400">04. CSS ECONOMIC CUT-OFF</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Multi-variable Steam-Oil Ratio (SOR) optimizer calculating the precise economic cutoff date before lifting energy costs exceed daily recovered oil value.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#121622]/80 border border-white/5 hover:border-white/20 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-[#FF6B00]">05. SIL-2 HARDWARE SAFETY</span>
              <Award className="w-4 h-4 text-[#FF6B00]" />
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Hardwired 24,000 lbs peak load trip, slack wireline carrier bar interlock, and immutable cryptographic audit logging for zero-accident operations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#121622]/80 border border-white/5 hover:border-white/20 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-cyan-300">06. BAGHEWALA JODHPUR ASSET</span>
              <Radio className="w-4 h-4 text-cyan-300" />
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Tailored specifically for Oil India Limited’s Cambrian Jodhpur Sandstone reservoir, solving SIH Problem Statement 26120 with verified field metrics.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
