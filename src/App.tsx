import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { AKTCorporateFooter } from './components/AKTCorporateFooter';
import { TechnicalDocsModal } from './components/TechnicalDocsModal';
import { EmergencyStopModal } from './components/EmergencyStopModal';
import { IntroSplash } from './components/IntroSplash';

import {
  FieldDashboardPage,
  DigitalTwinPage,
  DynoStudioPage,
  ThermalCssPage,
  VfdGovernorPage,
  FieldEconomicsPage,
  QhseStandardsPage,
} from './pages';

import { WellInfo, TelemetryKPIs, ControlMode, AuditLogEntry, NavigationTab } from './types';
import { BAGHEWALA_WELLS, INITIAL_AUDIT_LOGS } from './data/mockData';
import { 
  calculateViscosity, 
  calculateDaysToCriticalViscosity, 
  calculateRodFloatRisk, 
  calculateRodLoads 
} from './utils/physicsEngine';
import { 
  getTabFromPath, 
  getTitleForTab, 
  navigateToTab 
} from './utils/router';

export function App() {
  // ═══ CORE OPERATIONAL STATE ═══
  const [currentWell, setCurrentWell] = useState<WellInfo>(BAGHEWALA_WELLS[0]);
  const [controlMode, setControlMode] = useState<ControlMode>('AUTONOMOUS');
  const [spm, setSpm] = useState<number>(6.2);
  const [strokeLength, setStrokeLength] = useState<number>(100);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isEmergencyStopped, setIsEmergencyStopped] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  
  // ═══ ROUTING & NAVIGATION ═══
  const [activeTab, setActiveTab] = useState<NavigationTab>(() => {
    return getTabFromPath(window.location.pathname);
  });
  
  const [streamJitter, setStreamJitter] = useState<number>(0);
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      // Direct deep-links to submodules (e.g. /3D-Digital-Twin) bypass intro
      const isDeepLink = window.location.pathname !== '/' && window.location.pathname !== '/Field-Dashboard';
      if (isDeepLink) return false;
      return !sessionStorage.getItem('thermalift_intro_seen');
    } catch {
      return false;
    }
  });

  // Telemetry stream jitter simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStreamJitter((Math.random() - 0.5) * 0.4);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Browser back/forward button history synchronization
  useEffect(() => {
    const handlePopState = () => {
      const tab = getTabFromPath(window.location.pathname);
      setActiveTab(tab);
      document.title = getTitleForTab(tab);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronize document title with current page
  useEffect(() => {
    document.title = getTitleForTab(activeTab);
  }, [activeTab]);

  // ═══ PHYSICS-INFORMED SCADA TELEMETRY KPIS ═══
  const kpis: TelemetryKPIs = useMemo(() => {
    const temp = Math.round((currentWell.currentTemp + streamJitter * 0.2) * 10) / 10;
    const visc = calculateViscosity(temp);
    const daysLeft = calculateDaysToCriticalViscosity(temp, 1.2);
    const floatRisk = calculateRodFloatRisk(visc, spm, strokeLength);
    const loads = calculateRodLoads(spm, strokeLength, visc);

    return {
      temperature: temp,
      tempRate: -1.2,
      viscosity: visc,
      daysToCriticalViscosity: daysLeft,
      sor: currentWell.currentSOR,
      sorTargetDiff: Math.round(((currentWell.currentSOR - 3.2) / 3.2) * 100 * 10) / 10,
      pprl: loads.pprl,
      mprl: loads.mprl,
      pprlLimit: 24000,
      rodFloatRiskIndex: floatRisk,
      pumpFillage: 88.5,
      productionRate: Math.round(145 * (temp / 185) * (spm / 6.0)),
      liftingPowerKW: Math.round((loads.pprl * strokeLength * spm) / (33000 * 12 * 1.341) * 0.758 * 10) / 10,
      motorFrequency: Math.round((spm / 0.12) * 10) / 10
    };
  }, [currentWell, streamJitter, spm, strokeLength]);

  // ═══ EVENT HANDLERS ═══
  const handleSelectWell = (well: WellInfo) => {
    setCurrentWell(well);
    if (well.currentViscosity > 1000) {
      setSpm(4.5);
    } else {
      setSpm(6.2);
    }
  };

  const handleToggleControlMode = () => {
    const nextMode: ControlMode = controlMode === 'AUTONOMOUS' ? 'ADVISORY' : 'AUTONOMOUS';
    setControlMode(nextMode);
    const newEntry: AuditLogEntry = {
      id: `LOG-${Math.floor(8880 + Math.random() * 200)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      event: `Control hierarchy shifted to ${nextMode} mode by engineer override`,
      category: 'SAFETY_INTERLOCK',
      prevSPM: spm,
      newSPM: spm,
      kwhSaved: 0.0,
      status: 'VERIFIED',
      hash: '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const handleConfirmEmergencyStop = () => {
    setIsEmergencyStopped(true);
    setSpm(0);
    const newEntry: AuditLogEntry = {
      id: `LOG-${Math.floor(8880 + Math.random() * 200)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      event: 'EMERGENCY SHUTDOWN TRIP — SIL-2 Carrier Bar Slack Triggered',
      category: 'SAFETY_INTERLOCK',
      prevSPM: spm,
      newSPM: 0.0,
      kwhSaved: 0.0,
      status: 'EXECUTED',
      hash: '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const handleResetEmergencyStop = () => {
    setIsEmergencyStopped(false);
    setSpm(6.0);
    const newEntry: AuditLogEntry = {
      id: `LOG-${Math.floor(8880 + Math.random() * 200)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      event: 'VFD Emergency Trip Reset & SIL-2 Safe Startup Cycle Executed',
      category: 'SAFETY_INTERLOCK',
      prevSPM: 0.0,
      newSPM: 6.0,
      kwhSaved: 0.0,
      status: 'VERIFIED',
      hash: '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const handleApplyVFDCommand = (downstrokeHz: number, upstrokeHz: number, targetSPM: number) => {
    setSpm(targetSPM);
    const newEntry: AuditLogEntry = {
      id: `LOG-${Math.floor(8880 + Math.random() * 200)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      event: `AI 1D-CNN Dyno Mitigation: Target SPM ${targetSPM} (${downstrokeHz}Hz Down / ${upstrokeHz}Hz Up)`,
      category: 'VFD_DISPATCH',
      prevSPM: spm,
      newSPM: targetSPM,
      kwhSaved: 16.4,
      status: 'EXECUTED',
      hash: '0x' + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const handleTabChange = (tab: NavigationTab, updateHistory = true) => {
    setActiveTab(tab);
    if (updateHistory) {
      navigateToTab(tab);
    } else {
      document.title = getTitleForTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleIntroComplete = () => {
    try {
      sessionStorage.setItem('thermalift_intro_seen', 'true');
    } catch {}
    setShowIntro(false);
  };

  const handleReplayIntro = () => {
    setShowIntro(true);
  };

  return (
    <div className="min-h-screen bg-[#080B10] text-slate-100 flex flex-col font-sans">
      
      {/* ═══ FIRST-TIME ENTRY INTRO SPLASH SCREEN ═══ */}
      {showIntro && <IntroSplash onComplete={handleIntroComplete} />}
      
      {/* ═══ GLOBAL HEADER ═══ */}
      <Header
        currentWell={currentWell}
        onSelectWell={handleSelectWell}
        controlMode={controlMode}
        onToggleControlMode={handleToggleControlMode}
        onOpenDocs={() => setIsDocsOpen(true)}
        onEmergencyStop={() => setIsEmergencyModalOpen(true)}
        isEmergencyStopped={isEmergencyStopped}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* ═════════════════════════════════════════════════════════════════════
          PAGE VIEW ROUTER:
          - Field Dashboard: Executive Overview & SCADA Cockpit
          - Dedicated Workspaces: 3D Twin, Dyno, Thermal, VFD, ROI, Standards
          ═════════════════════════════════════════════════════════════════════ */}

      {activeTab === 'DASHBOARD' && (
        <FieldDashboardPage
          currentWell={currentWell}
          kpis={kpis}
          spm={spm}
          controlMode={controlMode}
          auditLogs={auditLogs}
          onSelectWell={handleSelectWell}
          onToggleControlMode={handleToggleControlMode}
          onOpenDocs={() => setIsDocsOpen(true)}
          onNavigate={handleTabChange}
        />
      )}

      {activeTab === 'COCKPIT' && (
        <DigitalTwinPage
          currentWell={currentWell}
          kpis={kpis}
          spm={spm}
          strokeLength={strokeLength}
          onSPMChange={setSpm}
          onStrokeLengthChange={setStrokeLength}
          isEmergencyStopped={isEmergencyStopped}
          onNavigate={handleTabChange}
          onApplyVFDCommand={handleApplyVFDCommand}
        />
      )}

      {activeTab === 'DYNO' && (
        <DynoStudioPage
          currentWell={currentWell}
          spm={spm}
          strokeLength={strokeLength}
          viscosityCp={kpis.viscosity}
          onNavigate={handleTabChange}
          onApplyVFDCommand={handleApplyVFDCommand}
        />
      )}

      {activeTab === 'THERMAL' && (
        <ThermalCssPage
          currentWell={currentWell}
          currentTemp={kpis.temperature}
          currentViscosity={kpis.viscosity}
          onNavigate={handleTabChange}
        />
      )}

      {activeTab === 'VFD' && (
        <VfdGovernorPage
          currentWell={currentWell}
          controlMode={controlMode}
          spm={spm}
          auditLogs={auditLogs}
          isEmergencyStopped={isEmergencyStopped}
          onToggleControlMode={handleToggleControlMode}
          onSPMChange={setSpm}
          onAddAuditLog={(entry) => setAuditLogs(prev => [entry, ...prev])}
          onNavigate={handleTabChange}
        />
      )}

      {activeTab === 'ROI' && (
        <FieldEconomicsPage
          currentWell={currentWell}
          onNavigate={handleTabChange}
        />
      )}

      {activeTab === 'STANDARDS' && (
        <QhseStandardsPage
          currentWell={currentWell}
          onNavigate={handleTabChange}
        />
      )}

      {/* ═══ CORPORATE FOOTER ═══ */}
      <AKTCorporateFooter 
        onOpenDocs={() => setIsDocsOpen(true)} 
        onReplayIntro={handleReplayIntro}
      />

      {/* ═══ SYSTEM MODALS ═══ */}
      <TechnicalDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      <EmergencyStopModal
        isOpen={isEmergencyModalOpen}
        isStopped={isEmergencyStopped}
        onConfirmStop={handleConfirmEmergencyStop}
        onResetStop={handleResetEmergencyStop}
        onClose={() => setIsEmergencyModalOpen(false)}
      />
    </div>
  );
}

export default App;
