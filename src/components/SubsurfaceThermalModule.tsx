import React, { useState, useMemo } from 'react';
import { 
  Flame, 
  Thermometer, 
  TrendingDown, 
  Sliders, 
  Play, 
  DollarSign, 
  Calendar, 
  Sparkles, 
  Layers 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine, 
  Legend 
} from 'recharts';
import { CSSScenarioParams, CSSScenarioResult } from '../types';
import { runCSSSimulation } from '../utils/physicsEngine';

interface SubsurfaceThermalModuleProps {
  currentTemp: number;
  currentViscosity: number;
}

export const SubsurfaceThermalModule: React.FC<SubsurfaceThermalModuleProps> = ({
  currentTemp,
  currentViscosity
}) => {
  const [params, setParams] = useState<CSSScenarioParams>({
    steamVolumeTonnes: 1200,
    injectionPressureBar: 105,
    steamQualityPercent: 80,
    soakTimeDays: 5,
  });

  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const simulationResult: CSSScenarioResult = useMemo(() => {
    return runCSSSimulation(params);
  }, [params]);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 450);
  };

  return (
    <section className="bg-[#0B111E]/95 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-5 lg:p-6 shadow-2xl space-y-5">
      
      {/* Module Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#10192A] border border-slate-700 text-[#FF6B00] shadow-glow-amber">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide font-display flex items-center gap-2">
              SUBSURFACE THERMAL & CSS OPTIMIZATION MODULE
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#10192A] text-[#FF6B00] border border-[#FF6B00]/40 font-bold">
                MARX-LANGENHEIM TWIN
              </span>
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Transient heat dissipation front, Walther viscosity decay, and dynamic economic steam cut-off
            </p>
          </div>
        </div>

        {/* Current Subsurface Status Pill */}
        <div className="flex items-center gap-3 bg-[#070B14] px-3.5 py-1.5 rounded-lg border border-slate-800 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Thermometer className="w-3.5 h-3.5" />
            <span>Current: <strong className="text-white">{currentTemp}°C</strong></span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-[#00E5FF]">
            <span>Viscosity: <strong className="text-white">{currentViscosity} cP</strong></span>
          </div>
        </div>
      </div>

      {/* Main Grid: Heat Decay Curve (Left) + CSS Scenario Recommender (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Dual-Tone Timeline Area Chart */}
        <div className="lg:col-span-7 bg-[#070B14] border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-[#FF6B00]" />
                POST-SOAK TEMPERATURE DECAY & VISCOSITY PROFILE (DAYS 1 TO {simulationResult.cycleLifespanDays})
              </h3>
              <p className="text-[10px] font-mono text-slate-500">
                Critical Rod Float Risk Zone occurs when Viscosity exceeds 1,200 cP
              </p>
            </div>
            
            <div className="text-[10px] font-mono">
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30 font-bold">
                Cutoff: Day {simulationResult.optimalCutoffDay}
              </span>
            </div>
          </div>

          {/* Recharts Composed Chart */}
          <div className="h-[290px] w-full bg-[#050811] rounded-lg p-2 border border-slate-800/80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={simulationResult.temperatureCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#FF6B00" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="viscGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#10192A" />
                <XAxis 
                  dataKey="day" 
                  stroke="#475569" 
                  tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                  tickFormatter={(val) => `D${val}`}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#FF6B00"
                  domain={[30, 'auto']}
                  tick={{ fill: '#FF6B00', fontSize: 10, fontFamily: 'monospace' }}
                  unit="°C"
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#00E5FF"
                  domain={[0, 1600]}
                  tick={{ fill: '#00E5FF', fontSize: 10, fontFamily: 'monospace' }}
                  unit=" cP"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0B111E', 
                    borderColor: '#334155', 
                    borderRadius: '8px', 
                    fontSize: '11px',
                    fontFamily: 'monospace' 
                  }}
                  formatter={(value: any, name: any) => {
                    if (name === 'Reservoir Temp') return [`${value} °C`, name];
                    if (name === 'Oil Viscosity') return [`${value} cP`, name];
                    if (name === 'Inflow Rate') return [`${value} BOPD`, name];
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Day ${label} Post-Soak`}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '5px' }}
                />
                
                {/* 1,200 cP Critical Rod Float Line */}
                <ReferenceLine 
                  yAxisId="right" 
                  y={1200} 
                  stroke="#EF4444" 
                  strokeDasharray="4 4" 
                  strokeWidth={1.5}
                  label={{ 
                    value: '1,200 cP FLOAT RISK', 
                    fill: '#EF4444', 
                    fontSize: 9, 
                    position: 'top',
                    fontFamily: 'monospace'
                  }} 
                />

                {/* Optimal Cutoff Day Line */}
                <ReferenceLine 
                  yAxisId="left" 
                  x={simulationResult.optimalCutoffDay} 
                  stroke="#10B981" 
                  strokeWidth={2}
                  label={{ 
                    value: `OPT CUTOFF (D${simulationResult.optimalCutoffDay})`, 
                    fill: '#10B981', 
                    fontSize: 9, 
                    position: 'insideTopLeft',
                    fontFamily: 'monospace'
                  }} 
                />

                <Area 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="temp" 
                  name="Reservoir Temp" 
                  stroke="#FF6B00" 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#tempGradient)" 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="viscosity" 
                  name="Oil Viscosity" 
                  stroke="#00E5FF" 
                  strokeWidth={2} 
                  dot={false}
                />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="rate" 
                  name="Inflow Rate" 
                  stroke="#10B981" 
                  strokeWidth={1.5} 
                  strokeDasharray="3 3"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Base Formation Temp: 48.0°C</span>
            <span className="text-emerald-400 font-bold">
              Peak Recovery Window: Days 1 to {simulationResult.optimalCutoffDay}
            </span>
          </div>
        </div>

        {/* Right: Interactive CSS Scenario Recommender & Multi-Variable Sliders */}
        <div className="lg:col-span-5 bg-[#070B14] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#00E5FF]" />
                CSS INJECTION PARAMETER SIMULATOR
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">CYCLE 4 MODEL</span>
            </div>

            {/* Sliders Grid */}
            <div className="space-y-3 my-3">
              {/* Steam Volume */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Steam Volume:</span>
                  <span className="font-bold text-[#FF6B00]">{params.steamVolumeTonnes.toLocaleString()} Tonnes</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="2500"
                  step="50"
                  value={params.steamVolumeTonnes}
                  onChange={(e) => setParams({ ...params, steamVolumeTonnes: parseInt(e.target.value) })}
                  className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-[#FF6B00]"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-600">
                  <span>500 MT</span>
                  <span>1,200 MT</span>
                  <span>2,500 MT</span>
                </div>
              </div>

              {/* Injection Pressure */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Injection Pressure:</span>
                  <span className="font-bold text-[#00E5FF]">{params.injectionPressureBar} bar</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="140"
                  step="2"
                  value={params.injectionPressureBar}
                  onChange={(e) => setParams({ ...params, injectionPressureBar: parseInt(e.target.value) })}
                  className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-[#00E5FF]"
                />
              </div>

              {/* Steam Quality */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Steam Quality (x):</span>
                  <span className="font-bold text-emerald-400">{params.steamQualityPercent}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="95"
                  step="1"
                  value={params.steamQualityPercent}
                  onChange={(e) => setParams({ ...params, steamQualityPercent: parseInt(e.target.value) })}
                  className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Soak Time */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Soak Period:</span>
                  <span className="font-bold text-amber-400">{params.soakTimeDays} Days</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="1"
                  value={params.soakTimeDays}
                  onChange={(e) => setParams({ ...params, soakTimeDays: parseInt(e.target.value) })}
                  className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>

            {/* Run Simulation Action Button */}
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] hover:from-[#FFA726] hover:to-[#FF6B00] text-slate-950 font-mono text-xs font-bold transition-all shadow-glow-amber flex items-center justify-center gap-2"
            >
              {isSimulating ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-slate-950" />
                  <span>COMPUTING HEAT BALANCE...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>RUN CSS SCENARIO SIMULATION</span>
                </>
              )}
            </button>
          </div>

          {/* Simulation Output Card Summary */}
          <div className="mt-3 p-3 bg-[#0B111E] rounded-xl border border-slate-700 text-xs font-mono space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FF6B00]" /> Projected Peak Rate:
              </span>
              <strong className="text-white text-sm">{simulationResult.peakBOPD} BOPD</strong>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-emerald-400" /> Optimal Cutoff Date:
              </span>
              <strong className="text-emerald-400">Day {simulationResult.optimalCutoffDay} Post-Soak</strong>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-[#00E5FF]" /> Net Cycle SOR:
              </span>
              <strong className="text-[#00E5FF]">{simulationResult.averageSOR} m³/m³</strong>
            </div>

            <div className="flex justify-between items-center pt-1 border-t border-slate-800 text-slate-300">
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-amber-400" /> Est. Net Cycle Margin:
              </span>
              <strong className="text-emerald-300 font-bold">${simulationResult.netMarginUSD.toLocaleString()}</strong>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
