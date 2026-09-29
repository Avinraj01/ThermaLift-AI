import React from 'react';
import { 
  Layers, 
  Activity, 
  BookOpen, 
  ArrowRight, 
  Cpu, 
  Gauge, 
  Thermometer, 
  TrendingDown, 
  CheckCircle2, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';
import { WellInfo, TelemetryKPIs, ControlMode, AuditLogEntry, NavigationTab } from '../types';
import { WellSelectorDropdown } from '../components/WellSelectorDropdown';
import { Hero3DDigitalTwinStage } from '../components/Hero3DDigitalTwinStage';
import { DEDICATED_MODULES } from '../data/modulesData';
import { getPathForTab } from '../utils/router';

interface FieldDashboardPageProps {
  currentWell: WellInfo;
  kpis: TelemetryKPIs;
  spm: number;
  controlMode: ControlMode;
  auditLogs: AuditLogEntry[];
  onSelectWell: (well: WellInfo) => void;
  onToggleControlMode: () => void;
  onOpenDocs: () => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const FieldDashboardPage: React.FC<FieldDashboardPageProps> = ({
  currentWell,
  kpis,
  spm,
  controlMode,
  auditLogs,
  onSelectWell,
  onToggleControlMode,
  onOpenDocs,
  onNavigate,
}) => {
  return (
    <main className="flex-1">
      {/* ═══ HERO BANNER ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A0E15] via-[#080B10] to-[#0A0E15]">
        <div className="absolute inset-0 akt-hero-pattern" />
        <div className="absolute inset-0 akt-diag-accent" />

        <div className="relative max-w-[1440px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Editorial & Title */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center space-y-4">
              {/* ThermaLift AI Brand Identity */}
              <div className="select-none">
                <img 
                  src="/thermalift-brand-clean-transparent.png" 
                  alt="ThermaLift AI — Synchronized • Predictive • Autonomous" 
                  className="h-10 sm:h-12 md:h-14 w-auto object-contain drop-shadow-[0_4px_24px_rgba(58,117,181,0.25)] select-none" 
                />
              </div>

              {/* Structured Headline with ThermaLift AI Label */}
              <div className="space-y-1">
                <div className="text-[11px] font-mono font-bold text-[#FF9500] tracking-widest uppercase flex items-center gap-2">
                  <span className="w-4 h-[2px] bg-[#FF9500]" />
                  <span>THERMALIFT AI SYSTEM ARCHITECTURE</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.15rem] font-black font-montserrat text-white uppercase tracking-tight leading-[1.03]">
                  INTEGRATED WELL-<br />
                  TO-<br />
                  SURFACE<br />
                  INTELLIGENCE
                </h1>
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.15rem] font-black font-montserrat uppercase tracking-tight leading-[1.03]">
                  <span className="text-[#FF9500] inline-block drop-shadow-[0_2px_22px_rgba(255,149,0,0.55)]">
                    FOR HEAVY CRUDE<br />
                    ASSETS
                  </span>
                </div>
              </div>

              {/* Editorial Body with Left Accent Rail */}
              <div className="border-l-[3.5px] border-[#FF9500] pl-4 sm:pl-5 py-0.5 max-w-xl">
                <p className="text-xs sm:text-sm font-sans text-slate-200 leading-relaxed font-normal">
                  Empowering <strong className="text-white font-semibold">Oil India Limited's Baghewala Field</strong> with continuous, physics-informed optimization of <strong className="text-white font-medium">Cyclic Steam Stimulation (CSS)</strong> and <strong className="text-white font-medium">Sucker Rod Artificial Lift</strong>. Coupling 320°C thermal decay with 1D Gibbs wave mechanics to eliminate rod float, reduce lifting kWh/bbl by <strong className="text-emerald-400 font-bold">24.2%</strong>, and prevent catastrophic parted rod strings.
                </p>
              </div>
            </div>

            {/* Right: 3D Digital Twin Stage matching Screenshot 2 */}
            <div className="lg:col-span-7 xl:col-span-7 flex items-center justify-end relative mt-4 lg:mt-0">
              <Hero3DDigitalTwinStage onNavigateToCockpit={() => onNavigate('COCKPIT')} />
            </div>
          </div>

          {/* ═══ LIVE TELEMETRY STRIP ═══ */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 pt-6 border-t border-akt-border/80">
            {[
              { label: 'ACTIVE THERMAL CYCLE', value: 'Cycle 4 (Post-Soak D14)', color: 'text-white' },
              { label: 'CRUDE VISCOSITY', value: `${kpis.viscosity} cP (18.2° API)`, color: 'text-akt-cyan' },
              { label: 'GIBBS WAVE SAMPLING', value: '100 Hz Real-Time Card', color: 'text-akt-emerald' },
              { label: 'LIFTING POWER CONSUMED', value: `${kpis.liftingPowerKW} kW (-24.2%)`, color: 'text-akt-flame' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-[#0B1019] border border-akt-border/80 rounded-lg font-mono">
                <div className="text-[9px] text-slate-400 uppercase tracking-wider">{item.label}</div>
                <div className={`text-sm font-bold mt-1 ${item.color}`}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="akt-divider-accent" />
      </section>

      {/* ═══ WELL OPERATIONS COCKPIT OVERVIEW ═══ */}
      <section className="py-10 max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="bg-[#0C121D] border border-akt-border rounded-xl p-6 shadow-akt-card">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-akt-border gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-akt-emerald/10 text-akt-emerald border border-akt-emerald/25 font-bold uppercase">
                  LIVE SCADA TELEMETRY
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  BAGHEWALA HEAVY OIL ASSET
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-montserrat text-white uppercase mt-1 tracking-tight">
                Well Operational Status — {currentWell.id} ({currentWell.name})
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <WellSelectorDropdown
                currentWell={currentWell}
                onSelectWell={onSelectWell}
                variant="cockpit"
              />

              <button
                onClick={onToggleControlMode}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  controlMode === 'AUTONOMOUS'
                    ? 'bg-akt-flame/15 text-akt-flame border-akt-flame/40'
                    : 'bg-akt-cyan/15 text-akt-cyan border-akt-cyan/40'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>MODE: {controlMode}</span>
              </button>
            </div>
          </div>

          {/* 6 Key Operational Status Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 mt-6">
            <div className="bg-[#090E17] border border-akt-border/60 rounded-lg p-3.5">
              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>VISCOSITY</span>
                <Gauge className="w-3.5 h-3.5 text-akt-cyan" />
              </div>
              <div className="text-xl font-bold font-montserrat text-white mt-1.5">{kpis.viscosity} cP</div>
              <div className="text-[9px] font-mono text-slate-500 mt-0.5">Walther ASTM D341</div>
            </div>

            <div className="bg-[#090E17] border border-akt-border/60 rounded-lg p-3.5">
              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>RESERVOIR TEMP</span>
                <Thermometer className="w-3.5 h-3.5 text-akt-flame" />
              </div>
              <div className="text-xl font-bold font-montserrat text-white mt-1.5">{kpis.temperature}°C</div>
              <div className="text-[9px] font-mono text-amber-400 mt-0.5">{kpis.tempRate}°C/day decay</div>
            </div>

            <div className="bg-[#090E17] border border-akt-border/60 rounded-lg p-3.5">
              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>CUTOFF DEADLINE</span>
                <TrendingDown className="w-3.5 h-3.5 text-akt-crimson" />
              </div>
              <div className="text-xl font-bold font-montserrat text-akt-crimson mt-1.5">{kpis.daysToCriticalViscosity} Days</div>
              <div className="text-[9px] font-mono text-slate-500 mt-0.5">Until 1,200 cP limit</div>
            </div>

            <div className="bg-[#090E17] border border-akt-border/60 rounded-lg p-3.5">
              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>PUMP FILLAGE</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-akt-emerald" />
              </div>
              <div className="text-xl font-bold font-montserrat text-akt-emerald mt-1.5">{kpis.pumpFillage}%</div>
              <div className="text-[9px] font-mono text-slate-500 mt-0.5">Volumetric Efficiency</div>
            </div>

            <div className="bg-[#090E17] border border-akt-border/60 rounded-lg p-3.5">
              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>POLISHED ROD LOAD</span>
                <Activity className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl font-bold font-montserrat text-white mt-1.5">{kpis.pprl.toLocaleString()} lbs</div>
              <div className="text-[9px] font-mono text-slate-500 mt-0.5">Limit: 24,000 lbs</div>
            </div>

            <div className="bg-[#090E17] border border-akt-border/60 rounded-lg p-3.5">
              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>MOTOR VFD SPEED</span>
                <Zap className="w-3.5 h-3.5 text-akt-cyan" />
              </div>
              <div className="text-xl font-bold font-montserrat text-white mt-1.5">{spm} SPM</div>
              <div className="text-[9px] font-mono text-akt-cyan mt-0.5">{kpis.motorFrequency} Hz VFD Output</div>
            </div>
          </div>

          {/* Safety Interlock Banner */}
          <div className="mt-4 p-3 bg-[#0A0E17] border border-akt-border/60 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-akt-emerald" />
              <span className="text-slate-300 font-bold">SIL-2 Certified Closed-Loop Safety Guard:</span>
              <span className="text-akt-emerald">ALL SAFETY INTERLOCKS HEALTHY & ARMED</span>
            </div>
            <div className="text-slate-500 text-[10px]">
              Carrier Bar Slack Trip: 2,500 lbs • Max PPRL Trip: 24,000 lbs
            </div>
          </div>

        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          DEDICATED MODULE PORTAL (CLICKING NAVIGATES TO DEDICATED PAGE)
          ═════════════════════════════════════════════════════════════════ */}
      <section className="py-12 max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-mono text-akt-flame font-bold uppercase tracking-widest">
              SPECIALIZED MODULE PORTAL
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-montserrat text-white uppercase mt-1 tracking-tight">
              Autonomous Engineering Modules
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl font-normal">
              Select any dedicated module below to launch its full-screen engineering workspace. Detailed 3D twins, dyno graphs, thermal physics curves, and VFD controls are isolated inside their dedicated pages.
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-akt-surface px-3 py-1.5 rounded border border-akt-border">
            OIL INDIA LIMITED • SIH 26120
          </span>
        </div>

        {/* 6 Dedicated Module Launch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEDICATED_MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <a
                key={mod.id}
                href={getPathForTab(mod.id)}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(mod.id);
                }}
                className="bg-[#0C121D] border border-akt-border hover:border-akt-flame/50 rounded-xl p-6 cursor-pointer group transition-all duration-300 hover:shadow-akt-hover flex flex-col justify-between relative overflow-hidden"
              >
                {/* Corner Accent Glow */}
                <div 
                  className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-15 transition-opacity duration-300"
                  style={{ background: `linear-gradient(135deg, transparent 50%, ${mod.color} 50%)` }}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span 
                      className="text-xs font-mono font-bold px-2.5 py-1 rounded border"
                      style={{ color: mod.color, borderColor: `${mod.color}40`, backgroundColor: `${mod.color}15` }}
                    >
                      MODULE {mod.num}
                    </span>
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center border transition-transform duration-300 group-hover:scale-110"
                      style={{ borderColor: `${mod.color}40`, backgroundColor: `${mod.color}10` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: mod.color }} />
                    </div>
                  </div>

                  <h3 className="text-lg font-black font-montserrat text-white uppercase group-hover:text-akt-flame transition-colors">
                    {mod.title}
                  </h3>
                  <div className="text-[11px] font-mono text-slate-400 font-semibold mt-0.5">
                    {mod.subtitle}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans mt-3">
                    {mod.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-akt-border/60 flex items-center justify-between text-xs font-mono font-bold" style={{ color: mod.color }}>
                  <span>Launch Dedicated Page</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* ═══ RECENT AUTONOMOUS EVENT & AI DISPATCH LOG ═══ */}
      <section className="py-10 max-w-[1400px] mx-auto px-4 lg:px-8">
        <div className="bg-[#0C121D] border border-akt-border rounded-xl p-6 shadow-akt-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-akt-border gap-2">
            <div>
              <span className="text-[10px] font-mono text-akt-flame font-bold uppercase tracking-widest">
                SYSTEM AUDIT TRAIL
              </span>
              <h3 className="text-lg font-black font-montserrat text-white uppercase mt-0.5 tracking-tight">
                Real-Time AI Dispatch & SCADA Interlock Stream
              </h3>
            </div>
            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-akt-emerald animate-pulse" />
              <span>IMMUTABLE LEDGER HASHES ACTIVE</span>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-akt-border text-slate-400 text-[10px] uppercase">
                  <th className="py-2.5 px-3">Log ID</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Event Action</th>
                  <th className="py-2.5 px-3">Delta SPM</th>
                  <th className="py-2.5 px-3">Energy Impact</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-akt-border/40">
                {auditLogs.slice(0, 5).map((log) => (
                  <tr key={log.id} className="hover:bg-akt-surface/40 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-white">{log.id}</td>
                    <td className="py-2.5 px-3 text-slate-400">{log.timestamp}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                        log.category === 'SAFETY_INTERLOCK' 
                          ? 'bg-akt-crimson/15 text-akt-crimson border border-akt-crimson/30' 
                          : log.category === 'VFD_DISPATCH'
                          ? 'bg-akt-cyan/15 text-akt-cyan border border-akt-cyan/30'
                          : 'bg-akt-amber/15 text-akt-amber border border-akt-amber/30'
                      }`}>
                        {log.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 max-w-xs truncate">{log.event}</td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {log.prevSPM} → <strong className="text-white">{log.newSPM}</strong>
                    </td>
                    <td className="py-2.5 px-3 text-akt-emerald font-bold">
                      {log.kwhSaved > 0 ? `-${log.kwhSaved} kWh` : '0 kWh'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="text-[10px] text-akt-emerald font-bold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
};
