import React, { useState } from 'react';

interface Hero3DDigitalTwinStageProps {
  onNavigateToCockpit: () => void;
}

export const Hero3DDigitalTwinStage: React.FC<Hero3DDigitalTwinStageProps> = ({
  onNavigateToCockpit
}) => {
  const [isVideoMode, setIsVideoMode] = useState(false);

  return (
    <div className="relative w-full flex items-center justify-center lg:justify-end select-none">
      <div 
        onClick={onNavigateToCockpit}
        className="relative w-full max-w-[700px] xl:max-w-[760px] cursor-pointer group transition-all"
        title="Interactive 3D Digital Twin — Click to launch Cockpit Workspace"
      >
        {/* Volumetric background glow for deep immersion */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[460px] bg-gradient-to-tr from-[#0284C7]/15 via-[#EA580C]/15 to-transparent rounded-full blur-[90px] pointer-events-none" />

        {/* ═══ 100% SAME TO SAME TARGET DIGITAL TWIN STAGE ═══ */}
        {!isVideoMode ? (
          <div className="relative w-full overflow-hidden rounded-xl">
            <img 
              src="/hero-stage-clean@2x.png" 
              alt="ThermaLift AI 3D Wellbore Digital Twin & Holographic HUDs"
              className="w-full h-auto object-contain drop-shadow-[0_12px_48px_rgba(0,0,0,0.7)] group-hover:scale-[1.01] transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="relative w-full overflow-hidden rounded-xl">
            <video
              src="/hero-animated-twin.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-contain mix-blend-screen scale-[1.3] translate-y-2 pointer-events-auto"
            />
          </div>
        )}

        {/* Kinetic 3D Video Stream Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsVideoMode(!isVideoMode);
          }}
          className="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0C121D]/90 hover:bg-[#152136] border border-slate-700/80 rounded-full px-3 py-1 text-[10px] font-mono text-slate-300 hover:text-white flex items-center gap-1.5 shadow-xl backdrop-blur-md cursor-pointer"
          title={isVideoMode ? "Switch to High-Res Holographic Twin" : "Play Looping 3D Simulation"}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-akt-cyan animate-pulse" />
          <span>{isVideoMode ? "HUD Static Twin" : "3D Animated Motion"}</span>
        </button>
      </div>
    </div>
  );
};
