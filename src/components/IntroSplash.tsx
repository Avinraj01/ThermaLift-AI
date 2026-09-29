import React, { useState, useEffect } from 'react';

interface IntroSplashProps {
  onComplete: () => void;
}

const TELEMETRY_PHASES = [
  'INITIALIZING SCADA TELEMETRY MESH...',
  'SOLVING 1D GIBBS WAVE MECHANICS...',
  'CALIBRATING THERMAL CSS VISCOSITY...',
  'SYSTEM SYNCHRONIZED • READY'
];

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  useEffect(() => {
    // Shorter, punchier, cinematic animation (~1.4 seconds total)
    const duration = 1350; 
    const intervalTime = 25;
    const increment = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress < 30) setPhaseIndex(0);
    else if (progress < 65) setPhaseIndex(1);
    else if (progress < 95) setPhaseIndex(2);
    else setPhaseIndex(3);

    // Auto transition smoothly without requiring any click
    if (progress >= 100 && !isExiting) {
      const exitTimeout = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          onComplete();
        }, 450);
      }, 300);
      return () => clearTimeout(exitTimeout);
    }
  }, [progress, isExiting, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[99999] bg-[#05070D] flex flex-col items-center justify-center select-none overflow-hidden transition-all duration-500 ease-out ${
        isExiting ? 'opacity-0 scale-[1.03] blur-[3px] pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* ═══ AMBIENT ATMOSPHERIC LIGHTING ═══ */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-[#1E3A8A]/25 via-[#EA580C]/15 to-[#0284C7]/20 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />

      {/* Cyber Grid Lines */}
      <div 
        className="absolute inset-0 opacity-[0.06] pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #38BDF8 1px, transparent 1px),
            linear-gradient(to bottom, #38BDF8 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px'
        }}
      />

      {/* ═══ CENTRAL HERO DISPLAY ═══ */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg w-full">
        
        {/* Animated Pumpjack Icon Core */}
        <div className="relative mb-6">
          {/* Dual Precision Rotating Calibration Rings */}
          <div className="absolute -inset-5 rounded-full border border-sky-400/25 border-dashed animate-[spin_10s_linear_infinite]" />
          <div className="absolute -inset-9 rounded-full border border-amber-500/20 border-dotted animate-[spin_14s_linear_infinite_reverse]" />
          
          {/* Reactor Glow Aura */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-sky-500/40 via-orange-500/30 to-amber-400/20 blur-xl opacity-80" />

          {/* Icon Box */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#090D17] border border-orange-500/60 p-3 shadow-[0_0_40px_rgba(249,115,22,0.4)] flex items-center justify-center transform transition-transform duration-500 animate-in zoom-in-50">
            <img 
              src="/logo.png" 
              alt="ThermaLift AI Logo" 
              className="w-full h-full object-contain filter drop-shadow-[0_0_14px_rgba(249,115,22,0.6)]" 
            />
          </div>
        </div>

        {/* ═══ DESIGNER BRAND LOGO WITH ANIMATED LASER SHIMMER ═══ */}
        <div className="relative overflow-hidden mb-6 group">
          <img 
            src="/thermalift-brand-clean-transparent.png" 
            alt="ThermaLift AI — Synchronized • Predictive • Autonomous" 
            className="h-14 sm:h-16 w-auto object-contain mx-auto drop-shadow-[0_4px_24px_rgba(58,117,181,0.4)] transition-all duration-700 animate-in fade-in" 
          />
          {/* Laser light sweep across the brand logo */}
          <div 
            className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none" 
          />
        </div>

        {/* ═══ TELEMETRY PROGRESS & CALIBRATION ═══ */}
        <div className="w-full max-w-xs space-y-2.5">
          {/* Minimalist Progress Track */}
          <div className="h-1 w-full bg-slate-800/90 rounded-full overflow-hidden relative shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-sky-400 via-orange-400 to-amber-400 rounded-full transition-all duration-75 ease-out shadow-[0_0_14px_rgba(249,115,22,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Synchronized Readout */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 tracking-wider">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="truncate text-slate-300 font-semibold">{TELEMETRY_PHASES[phaseIndex]}</span>
            </div>
            <span className="text-orange-400 font-bold ml-2 shrink-0">{Math.floor(progress)}%</span>
          </div>
        </div>

      </div>

      {/* Subtle Top & Bottom Corporate Tags */}
      <div className="absolute top-6 text-center text-[9px] font-mono tracking-widest text-slate-600 uppercase">
        OIL INDIA LIMITED • BAGHEWALA ASSET TELEMETRY
      </div>
      <div className="absolute bottom-6 text-center text-[9px] font-mono tracking-widest text-slate-600 uppercase">
        AKT OIL SERVICES • SIH PROBLEM 26120 • AUTONOMOUS ARTIFICIAL LIFT
      </div>
    </div>
  );
};
