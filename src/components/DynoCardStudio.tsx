import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Cpu, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Sliders, 
  Radio, 
  Crosshair 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { DynoConditionType, DynoDiagnosis, DynoCardPoint } from '../types';
import { generateDynoCard, diagnoseDynoCard } from '../utils/physicsEngine';

interface DynoCardStudioProps {
  spm: number;
  strokeLength: number;
  viscosityCp: number;
  onApplyVFDCommand?: (downstrokeHz: number, upstrokeHz: number, targetSPM: number) => void;
}

export const DynoCardStudio: React.FC<DynoCardStudioProps> = ({
  spm,
  strokeLength,
  viscosityCp,
  onApplyVFDCommand
}) => {
  const [selectedCondition, setSelectedCondition] = useState<DynoConditionType>('ROD_FLOAT');
  const [appliedFeedback, setAppliedFeedback] = useState<boolean>(false);

  // Generate Real-Time Card Curves from 1D Gibbs Wave Equation
  const cardPoints = useMemo(() => {
    return generateDynoCard(selectedCondition, strokeLength, spm, viscosityCp);
  }, [selectedCondition, strokeLength, spm, viscosityCp]);

  // AI 1D-CNN Diagnosis
  const diagnosis: DynoDiagnosis = useMemo(() => {
    return diagnoseDynoCard(selectedCondition, viscosityCp);
  }, [selectedCondition, viscosityCp]);

  const handleApplyAction = () => {
    if (onApplyVFDCommand) {
      onApplyVFDCommand(
        diagnosis.asymmetricVFDCommand.downstrokeFreq,
        diagnosis.asymmetricVFDCommand.upstrokeFreq,
        diagnosis.asymmetricVFDCommand.targetSPM
      );
    }
    setAppliedFeedback(true);
    setTimeout(() => {
      setAppliedFeedback(false);
    }, 2000);
  };

  const conditionButtons: { id: DynoConditionType; label: string; desc: string; badge: string }[] = [
    { id: 'NORMAL', label: '1. Normal Full Pumping', desc: 'Ideal 100% fillage loop', badge: 'OPTIMAL' },
    { id: 'ROD_FLOAT', label: '2. Heavy Crude Rod Floating', desc: 'Carrier bar separation & drag', badge: 'DANGER' },
    { id: 'FLUID_POUND', label: '3. Severe Fluid Pound', desc: 'Incomplete pump fillage impact', badge: 'CRITICAL' },
    { id: 'GAS_LOCK', label: '4. Gas Interference / Lock', desc: 'Compressible casing gas', badge: 'WARNING' },
    { id: 'PARTED_ROD', label: '5. Parted Sucker Rod String', desc: 'Tensile fatigue separation', badge: 'DANGER' },
    { id: 'VALVE_LEAK', label: '6. Traveling Valve Leak', desc: 'Sand wear & volumetric slip', badge: 'WARNING' },
  ];

  return (
    <section className="bg-[#0B111E]/95 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-5 lg:p-6 shadow-2xl space-y-5">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#10192A] border border-slate-700 text-[#00E5FF] shadow-glow-cyan">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide font-display flex items-center gap-2">
              DYNAMOMETER OSCILLOSCOPE & ROD-FLOAT DIAGNOSTIC STUDIO
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#10192A] text-[#00E5FF] border border-[#00E5FF]/40 font-bold">
                1D GIBBS WAVE SOLVER
              </span>
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Simultaneous surface polished rod load cell & downhole pump barrel card reconstruction (100 Hz)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#070B14] px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-xs">
          <Crosshair className="w-3.5 h-3.5 text-[#00E5FF] animate-spin" />
          <span className="text-slate-400">1D-CNN Telemetry:</span>
          <strong className="text-emerald-400">128-Point Real-Time Inference</strong>
        </div>
      </div>

      {/* Preset Condition Selector Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {conditionButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={() => setSelectedCondition(btn.id)}
            className={`p-2.5 rounded-xl border text-left font-mono transition-all relative overflow-hidden ${
              selectedCondition === btn.id
                ? 'bg-[#131F33] border-[#00E5FF] text-white shadow-glow-cyan'
                : 'bg-[#070B14] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-300 font-bold truncate">{btn.label}</span>
              <span className={`text-[8px] px-1 py-0.2 rounded font-bold ${
                btn.badge === 'OPTIMAL' ? 'bg-emerald-500/20 text-emerald-400' :
                btn.badge === 'WARNING' ? 'bg-amber-500/20 text-amber-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {btn.badge}
              </span>
            </div>
            <div className="text-[9px] text-slate-500 truncate">{btn.desc}</div>
          </button>
        ))}
      </div>

      {/* Main Dual Grid: Oscilloscope Dyno (Left) + AI Diagnostic HUD (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Oscilloscope Dyno Card Visualizer */}
        <div className="lg:col-span-7 bg-[#070B14] border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
          {/* Laser corner marks */}
          <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#00E5FF]/40" />
          <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#00E5FF]/40" />
          
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-[#00E5FF]" />
                POLISHED ROD LOAD VS POSITION PLOT (OSCILLOSCOPE)
              </h3>
              <p className="text-[10px] font-mono text-slate-500">
                Orange = Surface Card (Load Cell) • Cyan = Downhole Gibbs Pump Card
              </p>
            </div>

            <div className="text-[10px] font-mono text-slate-400 bg-[#0B111E] px-2 py-0.5 rounded border border-slate-800">
              Stroke: 0" to {strokeLength}"
            </div>
          </div>

          {/* Recharts Scatter Visualizer with Line connectors */}
          <div className="h-[310px] w-full bg-[#050811] rounded-lg p-2 border border-slate-800/80">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 15, right: 15, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#10192A" />
                <XAxis 
                  type="number" 
                  dataKey="position" 
                  name="Position" 
                  domain={[0, strokeLength]} 
                  unit='"' 
                  stroke="#475569"
                  tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                />
                <YAxis 
                  type="number" 
                  dataKey="surfaceLoad" 
                  name="Load" 
                  domain={[0, 26000]} 
                  unit=" lbs" 
                  stroke="#475569"
                  tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3', stroke: '#00E5FF' }}
                  content={({ payload }) => {
                    if (!payload || payload.length === 0) return null;
                    const data = payload[0].payload as DynoCardPoint;
                    return (
                      <div className="bg-[#0B111E] border border-slate-700 p-2.5 rounded-lg text-[11px] font-mono shadow-2xl">
                        <div className="text-slate-400 font-bold mb-1">Position: {data.position}"</div>
                        <div className="text-[#FF6B00]">Surface Load: {data.surfaceLoad?.toLocaleString()} lbs</div>
                        <div className="text-[#00E5FF]">Downhole Pump Load: {data.downholeLoad?.toLocaleString()} lbs</div>
                      </div>
                    );
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '4px' }}
                />
                {/* Surface Measured Card */}
                <Scatter 
                  name="Surface Measured Load Card" 
                  data={cardPoints.map(p => ({ position: p.position, surfaceLoad: p.surfaceLoad }))} 
                  fill="#FF6B00" 
                  line={{ stroke: '#FF6B00', strokeWidth: 2.5 }}
                />
                {/* Downhole Gibbs Card */}
                <Scatter 
                  name="Downhole Gibbs Pump Card" 
                  data={cardPoints.map(p => ({ position: p.position, surfaceLoad: p.downholeLoad }))} 
                  fill="#00E5FF" 
                  line={{ stroke: '#00E5FF', strokeWidth: 2, strokeDasharray: '4 2' }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400 gap-2">
            <span>PPRL Safety Limit: 24,000 lbs</span>
            <span>Damping Coefficient (c): 0.185</span>
            <span className="text-cyan-400">Card Fillage: {selectedCondition === 'NORMAL' ? '98.4%' : selectedCondition === 'FLUID_POUND' ? '54.2%' : '76.8%'}</span>
          </div>
        </div>

        {/* Right: AI 1D-CNN Diagnosis Box */}
        <div className="lg:col-span-5 bg-[#070B14] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-mono font-bold text-white">
                  REAL-TIME AI 1D-CNN DIAGNOSIS
                </h3>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                diagnosis.severity === 'OPTIMAL' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' :
                diagnosis.severity === 'WARNING' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' :
                'bg-red-500/20 border-red-500/40 text-red-300 shadow-glow-rose'
              }`}>
                {diagnosis.severity}
              </span>
            </div>

            {/* AI Diagnosis Confidence Banner */}
            <div className="my-3 p-3 rounded-xl bg-[#0B111E] border border-slate-700">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  {diagnosis.severity === 'OPTIMAL' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                  {diagnosis.title}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {diagnosis.confidence}%
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed mt-1">
                {diagnosis.description}
              </p>
            </div>

            {/* Subsurface Physics Mechanism */}
            <div className="mb-3 p-2.5 rounded-lg bg-[#050811] border border-slate-800 text-[11px] font-mono">
              <span className="text-[#FF6B00] font-bold block mb-0.5">DOWNHOLE PHYSICS MECHANISM:</span>
              <span className="text-slate-400 leading-tight">
                {diagnosis.downholeMechanism}
              </span>
            </div>

            {/* Recommended Autonomous Mitigation Action */}
            <div className="p-2.5 rounded-lg bg-[#050811] border border-slate-800 text-[11px] font-mono">
              <span className="text-[#00E5FF] font-bold block mb-0.5">AUTONOMOUS VFD MITIGATION:</span>
              <span className="text-slate-300 leading-tight">
                {diagnosis.recommendedAction}
              </span>
            </div>

            {/* Recommended Asymmetric Setpoints */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2 rounded-lg bg-[#0B111E] border border-slate-800">
                <div className="text-[9px] text-slate-400">DOWNSTROKE</div>
                <div className="text-xs font-bold text-amber-400 mt-0.5">
                  {diagnosis.asymmetricVFDCommand.downstrokeFreq} Hz
                </div>
              </div>
              <div className="p-2 rounded-lg bg-[#0B111E] border border-slate-800">
                <div className="text-[9px] text-slate-400">UPSTROKE</div>
                <div className="text-xs font-bold text-cyan-400 mt-0.5">
                  {diagnosis.asymmetricVFDCommand.upstrokeFreq} Hz
                </div>
              </div>
              <div className="p-2 rounded-lg bg-[#0B111E] border border-slate-800">
                <div className="text-[9px] text-slate-400">TARGET SPM</div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5">
                  {diagnosis.asymmetricVFDCommand.targetSPM} SPM
                </div>
              </div>
            </div>
          </div>

          {/* Action Dispatch Button */}
          <button
            onClick={handleApplyAction}
            className={`w-full mt-4 py-2.5 px-3 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              appliedFeedback 
                ? 'bg-emerald-600 text-white shadow-glow-emerald' 
                : 'bg-gradient-to-r from-[#00E5FF] to-[#0284C7] hover:from-[#38BDF8] hover:to-[#00E5FF] text-slate-950 shadow-glow-cyan font-black'
            }`}
          >
            {appliedFeedback ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>COMMAND DISPATCHED TO VFD ENCODER</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-current" />
                <span>APPLY ASYMMETRIC VFD CORRECTION</span>
              </>
            )}
          </button>
        </div>

      </div>

    </section>
  );
};
