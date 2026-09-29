import React, { useRef, useEffect } from 'react';

interface Hero3DDigitalTwinStageProps {
  onNavigateToCockpit: () => void;
}

export const Hero3DDigitalTwinStage: React.FC<Hero3DDigitalTwinStageProps> = ({
  onNavigateToCockpit
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Autoplay video reliably on mount
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: muted video is supported
      });
    }
  }, []);

  return (
    <div className="w-full flex flex-col lg:flex-row items-center lg:items-center justify-between gap-4 lg:gap-8 relative select-none">
      
      {/* ═══ 4 VERTICALLY STACKED FIELD METRIC CARDS (EXACT MATCH TO REFERENCE IMAGE) ═══ */}
      <div className="flex flex-row flex-wrap lg:flex-col gap-3 shrink-0 z-30 justify-center">
        {/* Card 1: Crude Gravity */}
        <div className="bg-[#0C121D]/90 border border-slate-700/80 rounded-xl px-4 py-3 shadow-xl min-w-[145px] sm:w-[155px] backdrop-blur-md transition-all hover:border-slate-500 hover:scale-[1.02]">
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
        <div className="bg-[#0C121D]/90 border border-slate-700/80 rounded-xl px-4 py-3 shadow-xl min-w-[145px] sm:w-[155px] backdrop-blur-md transition-all hover:border-slate-500 hover:scale-[1.02]">
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
        <div className="bg-[#0C121D]/90 border border-slate-700/80 rounded-xl px-4 py-3 shadow-xl min-w-[145px] sm:w-[155px] backdrop-blur-md transition-all hover:border-slate-500 hover:scale-[1.02]">
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
        <div className="bg-[#0C121D]/90 border border-slate-700/80 rounded-xl px-4 py-3 shadow-xl min-w-[145px] sm:w-[155px] backdrop-blur-md transition-all hover:border-slate-500 hover:scale-[1.02]">
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

      {/* ═══ 3D ANIMATED DIGITAL TWIN STAGE + DUAL HOLOGRAPHIC HUD CARDS ═══ */}
      <div 
        onClick={onNavigateToCockpit}
        className="relative flex-1 w-full max-w-[680px] group cursor-pointer"
        title="Interactive 3D Digital Twin — Click to launch full cockpit workspace"
      >
        {/* Soft volumetric glow in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[480px] bg-gradient-to-tr from-[#0284C7]/15 via-[#EA580C]/15 to-transparent rounded-full blur-[90px] pointer-events-none" />

        {/* 3D Animated Video Wrapper */}
        <div className="relative w-full overflow-hidden rounded-2xl flex items-center justify-center">
          <video
            ref={videoRef}
            src="/hero-animated-twin.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto object-contain mix-blend-screen scale-[1.3] lg:scale-[1.4] translate-y-2 pointer-events-auto transform-gpu"
          />
        </div>

        {/* ═══ LEFT FLOATING HUD CARD: LIVE CSS CYCLE PREDICTIONS ═══ */}
        <div className="absolute bottom-6 sm:bottom-12 left-0 sm:left-4 z-20 w-[190px] sm:w-[215px] bg-[#0A0F1A]/85 border border-slate-700/70 rounded-xl p-3 shadow-2xl backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-1">
          {/* Card Header */}
          <div className="text-[11px] font-mono font-bold text-slate-200 tracking-tight pb-1.5">
            Live CSS cycle predictions
          </div>

          {/* Oscillating Orange Waveform Chart */}
          <div className="h-14 sm:h-16 w-full my-1.5 relative">
            <svg viewBox="0 0 160 55" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="hudOrangeWaveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF9500" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#FF9500" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Subtle background horizontal ticks */}
              <line x1="0" y1="12" x2="160" y2="12" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.6" />
              <line x1="0" y1="28" x2="160" y2="28" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.6" />
              <line x1="0" y1="44" x2="160" y2="44" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.6" />

              {/* Gradient filled area */}
              <polygon
                points="0,52 0,40 12,34 24,18 36,15 48,28 60,35 72,12 84,24 96,36 108,18 120,40 132,22 144,35 156,28 160,32 160,52"
                fill="url(#hudOrangeWaveGrad)"
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
          <div className="space-y-1 pt-1.5 border-t border-slate-800/80 font-mono text-[9px] sm:text-[10px]">
            <div>
              <span className="text-slate-400 block text-[9px]">Fluid Viscosity</span>
              <span className="text-white font-bold text-xs sm:text-sm">23.3 cP</span>
            </div>
            <div className="pt-1">
              <span className="text-slate-400 block text-[9px]">Temperature</span>
              <span className="text-slate-200 font-bold text-xs sm:text-sm">21 °C</span>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT FLOATING HUD CARD: LIVE CSS CYCLE PREDICTION WITH AXES ═══ */}
        <div className="absolute bottom-2 sm:bottom-6 right-0 sm:-right-2 z-20 w-[210px] sm:w-[240px] bg-[#0A0F1A]/85 border border-slate-700/70 rounded-xl p-3 shadow-2xl backdrop-blur-md transition-transform duration-300 group-hover:-translate-y-1">
          {/* Card Header */}
          <div className="text-[11px] font-mono font-bold text-slate-200 tracking-tight pb-1">
            Live CSS cycle prediction
          </div>

          {/* Graph with Y & X Axis Ticks matching Reference Mockup */}
          <div className="h-20 sm:h-24 w-full relative flex items-center my-1">
            {/* Y-axis Ticks */}
            <div className="flex flex-col justify-between h-[80%] text-[8px] font-mono text-slate-500 pr-1 select-none">
              <span>400</span>
              <span>300</span>
              <span>200</span>
              <span>100</span>
              <span>0</span>
            </div>

            {/* Chart Area */}
            <div className="flex-1 h-full relative flex flex-col justify-between">
              <svg viewBox="0 0 140 60" className="w-full h-[80%] overflow-visible">
                <defs>
                  <linearGradient id="hudCyanWaveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="12" x2="140" y2="12" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
                <line x1="0" y1="26" x2="140" y2="26" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
                <line x1="0" y1="40" x2="140" y2="40" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
                <line x1="0" y1="54" x2="140" y2="54" stroke="#334155" strokeWidth="0.5" opacity="0.7" />

                {/* Fill polygon */}
                <polygon
                  points="0,54 0,44 14,38 28,34 42,20 56,16 70,24 84,15 98,18 112,12 126,16 140,22 140,54"
                  fill="url(#hudCyanWaveGrad)"
                />

                {/* Cyan Curve */}
                <polyline
                  points="0,44 14,38 28,34 42,20 56,16 70,24 84,15 98,18 112,12 126,16 140,22"
                  fill="none"
                  stroke="#00D2FF"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* X-axis Ticks */}
              <div className="flex justify-between items-center text-[8px] font-mono text-slate-500 px-1 pt-0.5 select-none">
                <span>20</span>
                <span>40</span>
                <span>60</span>
                <span>Time (h)</span>
              </div>
            </div>
          </div>

          {/* Telemetry Metrics */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 font-mono">
            <div>
              <span className="text-slate-400 block text-[9px]">Fluid Viscosity</span>
              <span className="text-white font-bold text-xs sm:text-sm">0.80 cP</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">Temperature</span>
              <span className="text-[#00D2FF] font-bold text-xs sm:text-sm">77 °C</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
