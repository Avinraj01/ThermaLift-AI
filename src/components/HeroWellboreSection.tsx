import React from 'react';
import { 
  Thermometer, 
  Droplet, 
  Flame, 
  ShieldAlert, 
  TrendingDown, 
  TrendingUp, 
  Layers, 
  Activity,
  Zap
} from 'lucide-react';
import { WellInfo, TelemetryKPIs } from '../types';
import { WebGLWellboreDigitalTwin } from './WebGLWellboreDigitalTwin';

interface HeroWellboreSectionProps {
  currentWell: WellInfo;
  kpis: TelemetryKPIs;
  spm: number;
  strokeLength: number;
  onSPMChange: (newSPM: number) => void;
  onStrokeLengthChange: (newStroke: number) => void;
  isEmergencyStopped?: boolean;
}

export const HeroWellboreSection: React.FC<HeroWellboreSectionProps> = ({
  currentWell,
  kpis,
  spm,
  strokeLength,
  onSPMChange,
  onStrokeLengthChange,
  isEmergencyStopped = false
}) => {
  return (
    <section className="space-y-5">
      
      {/* 5 Primary Live Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        
        {/* KPI 1: Downhole Temperature */}
        <div className="bg-[#0B111E]/90 backdrop-blur-xl border border-slate-700/60 hover:border-[#FF6B00]/60 rounded-xl p-3.5 transition-all shadow-hud-card relative overflow-hidden group">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>DOWNHOLE TEMP</span>
            <Thermometer className="w-3.5 h-3.5 text-[#FF6B00]" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl lg:text-3xl font-black font-display text-white tracking-tight">
              {kpis.temperature.toFixed(1)}°C
            </span>
            <span className="text-[10px] font-mono text-slate-500">({(kpis.temperature * 1.8 + 32).toFixed(0)}°F)</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono">
            <span className="text-amber-400 flex items-center gap-0.5">
              <TrendingDown className="w-3 h-3" />
              {kpis.tempRate.toFixed(1)}°C / day
            </span>
            <span className="text-slate-500">Base: 48.0°C</span>
          </div>
          <div className="w-full bg-slate-900 h-1 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(Math.max(((kpis.temperature - 48) / (280 - 48)) * 100, 5), 100)}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Dynamic Crude Viscosity */}
        <div className="bg-[#0B111E]/90 backdrop-blur-xl border border-slate-700/60 hover:border-[#00E5FF]/60 rounded-xl p-3.5 transition-all shadow-hud-card relative overflow-hidden group">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>DYNAMIC VISCOSITY</span>
            <Droplet className="w-3.5 h-3.5 text-[#00E5FF]" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className={`text-2xl lg:text-3xl font-black font-display tracking-tight ${
              kpis.viscosity >= 1200 ? 'text-red-400' : kpis.viscosity >= 800 ? 'text-amber-400' : 'text-white'
            }`}>
              {kpis.viscosity.toLocaleString()} <span className="text-xs font-normal text-slate-500">cP</span>
            </span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono">
            <span className={kpis.daysToCriticalViscosity <= 3 ? 'text-red-400 font-bold' : 'text-slate-400'}>
              Float Drag in: {kpis.daysToCriticalViscosity.toFixed(1)}d
            </span>
            <span className="text-slate-500">Limit: 1,200 cP</span>
          </div>
          <div className="w-full bg-slate-900 h-1 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                kpis.viscosity >= 1200 ? 'bg-red-500' : kpis.viscosity >= 800 ? 'bg-amber-500' : 'bg-[#00E5FF]'
              }`}
              style={{ width: `${Math.min((kpis.viscosity / 1500) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* KPI 3: Steam-Oil Ratio (SOR) */}
        <div className="bg-[#0B111E]/90 backdrop-blur-xl border border-slate-700/60 hover:border-emerald-500/60 rounded-xl p-3.5 transition-all shadow-hud-card relative overflow-hidden group">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>STEAM-OIL RATIO (SOR)</span>
            <Flame className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl lg:text-3xl font-black font-display text-emerald-400 tracking-tight">
              {kpis.sor.toFixed(2)}
            </span>
            <span className="text-xs font-mono text-slate-500">m³/m³</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono">
            <span className="text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              +18% Net Efficiency
            </span>
            <span className="text-slate-500">Target: 2.70</span>
          </div>
          <div className="w-full bg-slate-900 h-1 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((2.70 / Math.max(kpis.sor, 1)) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* KPI 4: Peak Polished Rod Load (PPRL) */}
        <div className="bg-[#0B111E]/90 backdrop-blur-xl border border-slate-700/60 hover:border-cyan-500/60 rounded-xl p-3.5 transition-all shadow-hud-card relative overflow-hidden group">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>PEAK ROD LOAD (PPRL)</span>
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-2xl lg:text-3xl font-black font-display text-white tracking-tight">
              {kpis.pprl.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-slate-500">lbs</span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono">
            <span className="text-cyan-400">Stress: {((kpis.pprl / kpis.pprlLimit) * 100).toFixed(0)}%</span>
            <span className="text-slate-500">Limit: 24k lbs</span>
          </div>
          <div className="w-full bg-slate-900 h-1 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                kpis.pprl > 21600 ? 'bg-red-500' : 'bg-cyan-500'
              }`}
              style={{ width: `${Math.min((kpis.pprl / kpis.pprlLimit) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* KPI 5: Rod Float Risk Index */}
        <div className={`backdrop-blur-xl border rounded-xl p-3.5 transition-all shadow-hud-card relative overflow-hidden group ${
          kpis.rodFloatRiskIndex > 60 
            ? 'bg-red-950/40 border-red-500/60 shadow-glow-rose' 
            : kpis.rodFloatRiskIndex > 30 
            ? 'bg-amber-950/30 border-amber-500/60' 
            : 'bg-[#0B111E]/90 border-slate-700/60'
        }`}>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>ROD FLOAT RISK</span>
            <Activity className={`w-3.5 h-3.5 ${kpis.rodFloatRiskIndex > 60 ? 'text-red-400' : 'text-emerald-400'}`} />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className={`text-2xl lg:text-3xl font-black font-display tracking-tight ${
              kpis.rodFloatRiskIndex > 60 ? 'text-red-400' : kpis.rodFloatRiskIndex > 30 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {kpis.rodFloatRiskIndex}%
            </span>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono">
            <span className={kpis.rodFloatRiskIndex > 30 ? 'text-amber-300 font-bold' : 'text-emerald-400'}>
              {kpis.rodFloatRiskIndex > 60 ? 'CRITICAL SLAP' : kpis.rodFloatRiskIndex > 30 ? 'THROTTLED' : 'ZERO FLOAT'}
            </span>
          </div>
          <div className="w-full bg-slate-900 h-1 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                kpis.rodFloatRiskIndex > 60 ? 'bg-red-500' : kpis.rodFloatRiskIndex > 30 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(kpis.rodFloatRiskIndex, 100)}%` }}
            />
          </div>
        </div>

      </div>

      {/* Main 3D WebGL Digital Twin Hero Canvas */}
      <WebGLWellboreDigitalTwin
        spm={spm}
        strokeLength={strokeLength}
        viscosityCp={kpis.viscosity}
        kpis={kpis}
        onSPMChange={onSPMChange}
        onStrokeLengthChange={onStrokeLengthChange}
        isEmergencyStopped={isEmergencyStopped}
      />

    </section>
  );
};
