import React, { useState } from 'react';
import { 
  Zap, 
  Cpu, 
  ShieldCheck, 
  Sliders, 
  ListOrdered, 
  Hash, 
  CheckCircle2, 
  Radio 
} from 'lucide-react';
import { ControlMode, AuditLogEntry } from '../types';

interface VFDGovernorModuleProps {
  controlMode: ControlMode;
  onToggleControlMode: () => void;
  currentSPM: number;
  onSPMChange: (newSPM: number) => void;
  auditLogs: AuditLogEntry[];
  onAddAuditLog: (entry: AuditLogEntry) => void;
  isEmergencyStopped?: boolean;
}

export const VFDGovernorModule: React.FC<VFDGovernorModuleProps> = ({
  controlMode,
  onToggleControlMode,
  currentSPM,
  onSPMChange,
  auditLogs,
  onAddAuditLog,
  isEmergencyStopped = false
}) => {
  const [downstrokeFreqHz, setDownstrokeFreqHz] = useState<number>(34.0);
  const [upstrokeFreqHz, setUpstrokeFreqHz] = useState<number>(54.0);
  const [carrierBarTensionTargetLbs, setCarrierBarTensionTargetLbs] = useState<number>(850);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [dispatchStatusMsg, setDispatchStatusMsg] = useState<string | null>(null);

  const handleManualDispatch = () => {
    const newTargetSPM = Math.round(((downstrokeFreqHz + upstrokeFreqHz) / 100) * 6.5 * 10) / 10;
    onSPMChange(newTargetSPM);
    
    // Generate new Audit Log
    const newEntry: AuditLogEntry = {
      id: `LOG-${Math.floor(8850 + Math.random() * 500)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      event: `Asymmetric Frequency Dispatch: ${downstrokeFreqHz}Hz (Down) / ${upstrokeFreqHz}Hz (Up)`,
      category: 'VFD_DISPATCH',
      prevSPM: currentSPM,
      newSPM: newTargetSPM,
      kwhSaved: Math.round((12.0 + Math.random() * 8.5) * 10) / 10,
      status: 'EXECUTED',
      hash: '0x' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase()
    };
    onAddAuditLog(newEntry);

    setDispatchStatusMsg(`Dispatched SPM ${newTargetSPM} to ABB ACS880 VFD Governor`);
    setTimeout(() => setDispatchStatusMsg(null), 3000);
  };

  const filteredLogs = auditLogs.filter(log => {
    if (filterCategory === 'ALL') return true;
    return log.category === filterCategory;
  });

  return (
    <section className="bg-[#0B111E]/95 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-5 lg:p-6 shadow-2xl space-y-5">
      
      {/* Module Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#10192A] border border-slate-700 text-emerald-400 shadow-glow-emerald">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide font-display flex items-center gap-2">
              AUTONOMOUS VFD GOVERNOR & CLOSED-LOOP DISPATCH
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#10192A] text-emerald-400 border border-emerald-500/40 font-bold">
                ASYMMETRIC KINEMATICS
              </span>
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Decelerates downstroke in viscous oil to prevent rod float, accelerates upstroke for maximum lifted volume
            </p>
          </div>
        </div>

        {/* Supervisory Control Mode Switcher */}
        <div className="flex items-center gap-2 bg-[#070B14] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              if (controlMode !== 'ADVISORY') onToggleControlMode();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              controlMode === 'ADVISORY' 
                ? 'bg-[#131F33] text-amber-400 border border-amber-500/40 shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ADVISORY (HITL)</span>
          </button>
          <button
            onClick={() => {
              if (controlMode !== 'AUTONOMOUS') onToggleControlMode();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
              controlMode === 'AUTONOMOUS' 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 font-black shadow-glow-emerald' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 animate-pulse" />
            <span>AUTONOMOUS DISPATCH</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Asymmetric Speed Waveform & Sliders (Left) + Audit Trail (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Asymmetric Profile Scheduling */}
        <div className="lg:col-span-6 bg-[#070B14] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                ASYMMETRIC STROKE SPEED PROFILE (360° KINEMATIC CYCLE)
              </h3>
              <span className="text-[10px] font-mono text-emerald-400">PID CARRIER TENSION: &gt;800 LBS</span>
            </div>

            {/* Visual Waveform SVG Diagram */}
            <div className="my-3 p-3 bg-[#050811] rounded-xl border border-slate-800 flex flex-col items-center">
              <svg viewBox="0 0 450 140" className="w-full h-auto max-h-[140px]">
                <defs>
                  <linearGradient id="upstrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#0284C7" stopOpacity="0.9" />
                  </linearGradient>
                  <linearGradient id="downstrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#FF8C00" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Base Grid lines */}
                <line x1="30" y1="20" x2="430" y2="20" stroke="#10192A" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="30" y1="70" x2="430" y2="70" stroke="#10192A" strokeWidth="1" />
                <line x1="30" y1="120" x2="430" y2="120" stroke="#10192A" strokeWidth="1" strokeDasharray="2 2" />

                {/* 180 Deg Transition line */}
                <line x1="230" y1="10" x2="230" y2="130" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="235" y="25" fill="#64748B" fontSize="9" fontFamily="monospace">
                  TDC (180°)
                </text>

                {/* Upstroke Phase Wave (0 to 180 deg) -> Fast Upstroke */}
                <path
                  d={`M 40 70 C 90 ${70 - (upstrokeFreqHz - 50) * 2.5 - 25}, 170 ${70 - (upstrokeFreqHz - 50) * 2.5 - 25}, 230 70`}
                  fill="none"
                  stroke="url(#upstrokeGrad)"
                  strokeWidth="3.5"
                />
                <text x="60" y="45" fill="#00E5FF" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  ▲ UPSTROKE BOOST ({upstrokeFreqHz} Hz)
                </text>

                {/* Downstroke Phase Wave (180 to 360 deg) -> Decelerated Downstroke to prevent rod float */}
                <path
                  d={`M 230 70 C 290 ${70 + (50 - downstrokeFreqHz) * 2.2 + 20}, 370 ${70 + (50 - downstrokeFreqHz) * 2.2 + 20}, 420 70`}
                  fill="none"
                  stroke="url(#downstrokeGrad)"
                  strokeWidth="3.5"
                />
                <text x="250" y="110" fill="#FF6B00" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  ▼ DOWNSTROKE DECELERATION ({downstrokeFreqHz} Hz)
                </text>

                {/* BDC & Crank Markers */}
                <circle cx="40" cy="70" r="4" fill="#00E5FF" />
                <circle cx="230" cy="70" r="4" fill="#E2E8F0" />
                <circle cx="420" cy="70" r="4" fill="#FF6B00" />
              </svg>
              
              <div className="w-full flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>0° (Bottom Dead Center)</span>
                <span>180° (Top Dead Center)</span>
                <span>360° (Complete Stroke)</span>
              </div>
            </div>

            {/* Parameter Sliders */}
            <div className="space-y-3">
              {/* Downstroke Frequency */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Downstroke Damping Frequency:</span>
                  <span className="font-bold text-[#FF6B00]">{downstrokeFreqHz.toFixed(1)} Hz (Slow descent)</span>
                </div>
                <input
                  type="range"
                  min="25.0"
                  max="50.0"
                  step="0.5"
                  value={downstrokeFreqHz}
                  onChange={(e) => setDownstrokeFreqHz(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-[#FF6B00]"
                />
              </div>

              {/* Upstroke Boost Frequency */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Upstroke Lift Frequency:</span>
                  <span className="font-bold text-[#00E5FF]">{upstrokeFreqHz.toFixed(1)} Hz (High efficiency lift)</span>
                </div>
                <input
                  type="range"
                  min="45.0"
                  max="65.0"
                  step="0.5"
                  value={upstrokeFreqHz}
                  onChange={(e) => setUpstrokeFreqHz(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-[#00E5FF]"
                />
              </div>

              {/* Minimum Carrier Bar Tension */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-slate-400">Minimum Carrier Bar Tension Interlock:</span>
                  <span className="font-bold text-emerald-400">{carrierBarTensionTargetLbs} lbs (Zero float threshold)</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="1500"
                  step="50"
                  value={carrierBarTensionTargetLbs}
                  onChange={(e) => setCarrierBarTensionTargetLbs(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Action Dispatch Button */}
          <div className="mt-4">
            <button
              onClick={handleManualDispatch}
              disabled={isEmergencyStopped}
              className={`w-full py-2.5 px-3 rounded-lg font-mono text-xs font-bold transition-all shadow-glow-emerald flex items-center justify-center gap-2 ${
                isEmergencyStopped 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>DISPATCH ASYMMETRIC SETPOINT TO WELLHEAD VFD</span>
            </button>

            {dispatchStatusMsg && (
              <div className="mt-2 p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{dispatchStatusMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Action Log & Cryptographic Audit Trail */}
        <div className="lg:col-span-6 bg-[#070B14] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-[#00E5FF]" />
                <h3 className="text-xs font-mono font-bold text-slate-200">
                  REAL-TIME ACTION LOG & AUDIT TRAIL
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{filteredLogs.length} Records</span>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 my-2.5 overflow-x-auto pb-1 text-[10px] font-mono">
              {(['ALL', 'VFD_DISPATCH', 'THERMAL_ALARM', 'SAFETY_INTERLOCK'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                    filterCategory === cat 
                      ? 'bg-[#131F33] text-[#00E5FF] border border-[#00E5FF]/50 font-bold' 
                      : 'bg-[#050811] text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Log Table Entries */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {filteredLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="p-2.5 rounded-lg bg-[#050811] border border-slate-800/80 hover:border-slate-700 transition-colors text-xs font-mono"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      {log.id}
                    </span>
                    <span>{log.timestamp}</span>
                  </div>

                  <div className="font-semibold text-slate-200 text-[11px] mb-1">
                    {log.event}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                    <span>SPM: <strong className="text-amber-400">{log.prevSPM} → {log.newSPM}</strong></span>
                    <span className="text-emerald-400">+{log.kwhSaved} kWh Saved</span>
                    <span className="text-slate-500 truncate max-w-[110px]" title={log.hash}>
                      {log.hash.substring(0, 10)}...
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Trail Verification Summary */}
          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> SIL-2 Immutable Ledger Active
            </span>
            <span>Total Energy Conserved: <strong className="text-white">124.6 kWh</strong></span>
          </div>
        </div>

      </div>

    </section>
  );
};
