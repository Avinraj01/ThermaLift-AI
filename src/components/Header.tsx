import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Activity, 
  BookOpen, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  ShieldCheck, 
  ChevronDown,
  Layers,
  Zap,
  BarChart3,
  Award,
  Radio,
  Shield,
  LayoutDashboard
} from 'lucide-react';
import { WellInfo, ControlMode, NavigationTab } from '../types';
import { WellSelectorDropdown } from './WellSelectorDropdown';
import { getPathForTab } from '../utils/router';

interface HeaderProps {
  currentWell: WellInfo;
  onSelectWell: (well: WellInfo) => void;
  controlMode: ControlMode;
  onToggleControlMode: () => void;
  onOpenDocs: () => void;
  onEmergencyStop: () => void;
  isEmergencyStopped: boolean;
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentWell,
  onSelectWell,
  controlMode,
  onToggleControlMode,
  onOpenDocs,
  onEmergencyStop,
  isEmergencyStopped,
  activeTab,
  onTabChange
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(' ')[0] + ' IST');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems: { id: NavigationTab; label: string; icon: any }[] = [
    { id: 'DASHBOARD', label: 'Field Dashboard', icon: LayoutDashboard },
    { id: 'COCKPIT', label: '3D Digital Twin', icon: Layers },
    { id: 'DYNO', label: 'Dyno Studio', icon: Activity },
    { id: 'THERMAL', label: 'Thermal CSS', icon: Flame },
    { id: 'VFD', label: 'VFD Governor', icon: Zap },
    { id: 'ROI', label: 'Field Economics', icon: BarChart3 },
    { id: 'STANDARDS', label: 'QHSE & Standards', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-40">

      {/* ═══ TOP TELEMETRY TICKER BAR ═══ */}
      <div className="akt-ticker-bar overflow-hidden py-1.5">
        <div className="akt-ticker-track">
          {[0, 1].map(i => (
            <div key={i} className="flex items-center gap-6 px-4 text-[10px] font-mono text-akt-muted tracking-wider whitespace-nowrap">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-akt-emerald animate-pulse" />
                BAGHEWALA FIELD BGW-07
              </span>
              <span className="text-akt-dim">●</span>
              <span>THERMAL CYCLE 4 — POST-SOAK DAY 14</span>
              <span className="text-akt-dim">●</span>
              <span className="text-akt-emerald">SCADA TELEMETRY: 100% OPERATIONAL</span>
              <span className="text-akt-dim">●</span>
              <span className="text-akt-flame">SIL-2 INTERLOCK: {isEmergencyStopped ? 'TRIPPED' : 'ACTIVE'}</span>
              <span className="text-akt-dim">●</span>
              <span>OIL INDIA LIMITED • BIKANER-NAGAUR BASIN</span>
              <span className="text-akt-dim">●</span>
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-akt-cyan" />
                ISO 9001 / ISO 45001 / API SPEC 11E CERTIFIED
              </span>
              <span className="text-akt-dim">●</span>
              <span>JODHPUR SANDSTONE FORMATION (17–19° API)</span>
              <span className="text-akt-dim">●</span>
              <span className="text-akt-cyan">{currentTime}</span>
              <span className="pl-12" />
            </div>
          ))}
        </div>
      </div>

      {/* ═══ MAIN NAVIGATION BAR ═══ */}
      <nav className="bg-[#0A0E15]/95 backdrop-blur-xl border-b border-akt-border">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo & Brand */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onTabChange('DASHBOARD');
              }}
              className="flex items-center gap-3 text-left group transition-all cursor-pointer"
              title="Return to Field Dashboard"
            >
              <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-gradient-to-br from-akt-flame/30 to-akt-amber/20 border border-akt-flame/40 p-1 bg-akt-card shadow-sm group-hover:border-akt-flame transition-colors shrink-0">
                <img 
                  src="/logo.png" 
                  alt="ThermaLift AI Logo" 
                  className="w-full h-full object-contain filter drop-shadow-sm" 
                />
              </div>

              <div className="flex items-center">
                <img 
                  src="/thermalift-brand-clean-transparent.png" 
                  alt="ThermaLift AI — Synchronized • Predictive • Autonomous" 
                  className="h-9 sm:h-10 w-auto object-contain select-none group-hover:brightness-110 transition-all drop-shadow-sm" 
                />
              </div>
            </a>

            {/* Center: Well Selector & Status */}
            <div className="hidden lg:flex items-center gap-4 relative z-50">
              {/* Well Selector */}
              <WellSelectorDropdown 
                currentWell={currentWell} 
                onSelectWell={onSelectWell} 
                variant="header" 
              />

              {/* SCADA Status */}
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-akt-emerald bg-akt-emerald/10 px-2.5 py-1 rounded border border-akt-emerald/20">
                <span className="w-1.5 h-1.5 rounded-full bg-akt-emerald animate-pulse" />
                <span>SCADA SYNC</span>
              </div>

              {/* Control Mode Toggle */}
              <button
                onClick={onToggleControlMode}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-mono font-bold transition-all border ${
                  controlMode === 'AUTONOMOUS'
                    ? 'bg-akt-flame/10 text-akt-flame border-akt-flame/30'
                    : 'bg-akt-cyan/10 text-akt-cyan border-akt-cyan/30'
                }`}
              >
                {controlMode === 'AUTONOMOUS' ? <Cpu className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                <span>{controlMode === 'AUTONOMOUS' ? 'AUTONOMOUS' : 'ADVISORY'}</span>
              </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <div className="hidden xl:flex items-center gap-1.5 text-[10px] font-mono text-akt-muted bg-akt-base px-2.5 py-1.5 rounded border border-akt-border">
                <Clock className="w-3 h-3 text-akt-cyan" />
                <span>{currentTime}</span>
              </div>

              <button
                onClick={onOpenDocs}
                className="akt-btn-outline flex items-center gap-1.5 !py-1.5 !px-3 !text-[10px]"
              >
                <BookOpen className="w-3.5 h-3.5 text-akt-cyan" />
                <span className="hidden sm:inline">SYSTEM DOCS</span>
              </button>

              <button
                onClick={onEmergencyStop}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-[10px] font-bold uppercase transition-all ${
                  isEmergencyStopped
                    ? 'bg-akt-crimson text-white shadow-glow-rose animate-pulse'
                    : 'bg-akt-crimson/15 border border-akt-crimson/40 text-akt-crimson hover:bg-akt-crimson/25'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{isEmergencyStopped ? 'TRIPPED' : 'E-STOP'}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ═══ NAVIGATION TAB STRIP ═══ */}
      <div className="bg-[#0A0E15] border-b border-akt-border px-4 lg:px-8">
        <div className="max-w-[1400px] mx-auto flex items-center overflow-x-auto scrollbar-none gap-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={getPathForTab(item.id)}
                onClick={(e) => {
                  e.preventDefault();
                  onTabChange(item.id);
                }}
                className={`relative px-4 py-3 text-[11px] font-mono font-bold flex items-center gap-2 transition-all whitespace-nowrap border-b-2 cursor-pointer ${
                  isActive
                    ? 'text-akt-flame border-akt-flame bg-akt-flame/5'
                    : 'text-akt-muted hover:text-white border-transparent hover:border-akt-border'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-akt-flame' : 'text-akt-dim'}`} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </header>
  );
};
