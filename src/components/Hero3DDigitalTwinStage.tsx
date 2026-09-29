import React, { useRef, useEffect } from 'react';

interface Hero3DDigitalTwinStageProps {
  onNavigateToCockpit: () => void;
}

export const Hero3DDigitalTwinStage: React.FC<Hero3DDigitalTwinStageProps> = ({
  onNavigateToCockpit
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Autoplay video reliably across browsers
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Fallback for autoplay policy
      });
    }
  }, []);

  return (
    <div className="w-full flex flex-col lg:flex-row items-center lg:items-center justify-end gap-3 lg:gap-5 relative select-none">
      
      {/* ═══ 4 VERTICALLY STACKED FIELD METRIC CARDS (EXACT MATCH TO DESIGN) ═══ */}
      <div className="flex flex-row flex-wrap lg:flex-col gap-2.5 sm:gap-3 shrink-0 z-30 justify-center">
        {/* Card 1: Crude Gravity */}
        <div className="bg-[#0C121D]/90 border border-slate-700/80 rounded-xl px-4 py-3 shadow-xl min-w-[140px] sm:w-[150px] backdrop-blur-md transition-all hover:border-slate-500 hover:scale-[1.02]">
          <div className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest">
            CRUDE GRAVITY
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-black font-montserrat text-[#FF9500] tracking-tight">
              17–19°
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase">API</span>
          </div>
        </div>

        {/* Card 2: Vertical Depth */}
        <div className="bg-[#0C121D]/90 border border-slate-700/80 rounded-xl px-4 py-3 shadow-xl min-w-[140px] sm:w-[150px] backdrop-blur-md transition-all hover:border-slate-500 hover:scale-[1.02]">
          <div className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest">
            VERTICAL DEPTH
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl sm:text-2xl font-black font-montserrat text-[#00D2FF] tracking-tight">
              1,120m
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase">TVD</span>
          </div>
        </div>

        {/* Card 3: Anomaly Detect */}
        <div className="bg-[#0C121D]/90 border border-slate-700/80 rounded-xl px-4 py-3 shadow-xl min-w-[140px] sm:w-[150px] backdrop-blur-md transition-all hover:border-slate-500 hover:scale-[1.02]">
          <div className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest">
            ANOMALY DETECT
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl sm:text-2xl font-black font-montserrat text-[#10B981] tracking-tight">
              94%
            </span>
            <span className="text-[10px] font-mono text-slate-400">1D-CNN</span>
          </div>
        </div>

        {/* Card 4: Energy Saved */}
        <div className="bg-[#0C121D]/90 border border-slate-700/80 rounded-xl px-4 py-3 shadow-xl min-w-[140px] sm:w-[150px] backdrop-blur-md transition-all hover:border-slate-500 hover:scale-[1.02]">
          <div className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-widest">
            ENERGY SAVED
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl sm:text-2xl font-black font-montserrat text-[#FF9500] tracking-tight">
              24.2%
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase">VFD</span>
          </div>
        </div>
      </div>

      {/* ═══ 3D ANIMATED VIDEO DIGITAL TWIN STAGE ═══ */}
      <div 
        onClick={onNavigateToCockpit}
        className="relative flex-1 w-full max-w-[710px] xl:max-w-[775px] cursor-pointer group"
        title="Interactive 3D Digital Twin — Click to launch Cockpit Workspace"
      >
        {/* Volumetric background glow for deep immersion */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[500px] bg-gradient-to-tr from-[#0284C7]/20 via-[#EA580C]/20 to-transparent rounded-full blur-[100px] pointer-events-none" />

        {/* ═══ 3D RECIROCATING PUMPJACK VIDEO CORE (+5% SCALE) ═══ */}
        <div className="relative w-full h-[400px] sm:h-[475px] lg:h-[515px] overflow-hidden rounded-2xl flex items-center justify-center">
          <video
            ref={videoRef}
            src="/hero-animated-twin.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-contain mix-blend-screen scale-[1.57] sm:scale-[1.66] lg:scale-[1.70] translate-x-2 sm:translate-x-4 translate-y-3 pointer-events-auto transform-gpu"
          />
        </div>

        {/* ═══ LEFT FLOATING ISOMETRIC HOLOGRAPHIC HUD CARD ═══ */}
        <div 
          style={{
            transform: 'perspective(700px) rotateY(14deg) rotateX(3deg) skewY(-1deg)',
            transformOrigin: 'left center'
          }}
          className="absolute bottom-6 sm:bottom-10 left-1 sm:left-4 z-20 w-[185px] sm:w-[215px] bg-[#08101E]/65 border border-slate-600/50 rounded-xl p-2.5 sm:p-3 shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-[5px] transition-transform duration-300 hover:scale-105 pointer-events-auto"
        >
          {/* Card Header */}
          <div className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-200 tracking-tight pb-1 border-b border-slate-700/50 flex items-center justify-between">
            <span>Live CSS cycle predictions</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Oscillating Orange Waveform Chart */}
          <div className="h-12 sm:h-14 w-full my-1 relative">
            <svg viewBox="0 0 160 55" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="liveHudOrangeWave" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF9500" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#FF9500" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Subtle background horizontal ticks */}
              <line x1="0" y1="12" x2="160" y2="12" stroke="#475569" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5" />
              <line x1="0" y1="28" x2="160" y2="28" stroke="#475569" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5" />
              <line x1="0" y1="44" x2="160" y2="44" stroke="#475569" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5" />

              {/* Gradient filled area */}
              <polygon
                points="0,52 0,40 12,34 24,18 36,15 48,28 60,35 72,12 84,24 96,36 108,18 120,40 132,22 144,35 156,28 160,32 160,52"
                fill="url(#liveHudOrangeWave)"
              />
              {/* Orange line curve */}
              <polyline
                points="0,40 12,34 24,18 36,15 48,28 60,35 72,12 84,24 96,36 108,18 120,40 132,22 144,35 156,28 160,32"
                fill="none"
                stroke="#FF9500"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Telemetry Metrics */}
          <div className="space-y-0.5 pt-1 border-t border-slate-800/80 font-mono text-[9px] sm:text-[10px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Fluid Viscosity</span>
              <span className="text-white font-bold">23.3 cP</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Temperature</span>
              <span className="text-[#FF9500] font-bold">21 °C</span>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT FLOATING ISOMETRIC HOLOGRAPHIC HUD CARD ═══ */}
        <div 
          style={{
            transform: 'perspective(700px) rotateY(-16deg) rotateX(4deg) skewY(1deg)',
            transformOrigin: 'right center'
          }}
          className="absolute bottom-2 sm:bottom-6 right-0 sm:right-2 z-20 w-[205px] sm:w-[235px] bg-[#08101E]/65 border border-slate-600/50 rounded-xl p-2.5 sm:p-3 shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-[5px] transition-transform duration-300 hover:scale-105 pointer-events-auto"
        >
          {/* Card Header */}
          <div className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-200 tracking-tight pb-1 border-b border-slate-700/50 flex items-center justify-between">
            <span>Live CSS cycle prediction</span>
            <span className="text-[8px] font-mono text-cyan-400">68 Hz</span>
          </div>

          {/* Graph with Y & X Axis Ticks matching Reference Mockup */}
          <div className="h-18 sm:h-20 w-full relative flex items-center my-1">
            {/* Y-axis Ticks */}
            <div className="flex flex-col justify-between h-[82%] text-[7px] sm:text-[8px] font-mono text-slate-400 pr-1 select-none">
              <span>400</span>
              <span>300</span>
              <span>200</span>
              <span>100</span>
              <span>0</span>
            </div>

            {/* Chart Area */}
            <div className="flex-1 h-full relative flex flex-col justify-between">
              <svg viewBox="0 0 140 55" className="w-full h-[80%] overflow-visible">
                <defs>
                  <linearGradient id="liveHudCyanWave" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="12" x2="140" y2="12" stroke="#475569" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
                <line x1="0" y1="26" x2="140" y2="26" stroke="#475569" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
                <line x1="0" y1="40" x2="140" y2="40" stroke="#475569" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
                <line x1="0" y1="52" x2="140" y2="52" stroke="#475569" strokeWidth="0.5" opacity="0.6" />

                {/* Fill polygon */}
                <polygon
                  points="0,52 0,42 14,36 28,32 42,18 56,15 70,22 84,14 98,16 112,11 126,15 140,20 140,52"
                  fill="url(#liveHudCyanWave)"
                />

                {/* Cyan Curve */}
                <polyline
                  points="0,42 14,36 28,32 42,18 56,15 70,22 84,14 98,16 112,11 126,15 140,20"
                  fill="none"
                  stroke="#00D2FF"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* X-axis Ticks */}
              <div className="flex justify-between items-center text-[7px] sm:text-[8px] font-mono text-slate-400 px-1 pt-0.5 select-none">
                <span>20</span>
                <span>40</span>
                <span>60</span>
                <span>Time (h)</span>
              </div>
            </div>
          </div>

          {/* Telemetry Metrics */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80 font-mono text-[9px] sm:text-[10px]">
            <div>
              <span className="text-slate-400 block text-[8px] sm:text-[9px]">Fluid Viscosity</span>
              <span className="text-white font-bold">10.80 cP</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[8px] sm:text-[9px]">Temperature</span>
              <span className="text-[#00D2FF] font-bold">77 °C</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
