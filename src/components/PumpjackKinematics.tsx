import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Activity, Gauge, Zap, AlertCircle } from 'lucide-react';
import { calculateRodLoads, calculateRodFloatRisk } from '../utils/physicsEngine';

interface PumpjackKinematicsProps {
  spm: number;
  strokeLength: number;
  viscosityCp: number;
  onSPMChange: (newSPM: number) => void;
  onStrokeLengthChange: (newStroke: number) => void;
  isEmergencyStopped?: boolean;
}

export const PumpjackKinematics: React.FC<PumpjackKinematicsProps> = ({
  spm,
  strokeLength,
  viscosityCp,
  onSPMChange,
  onStrokeLengthChange,
  isEmergencyStopped = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(!isEmergencyStopped);
  const [crankAngleDeg, setCrankAngleDeg] = useState<number>(0);
  const [instantVelocityFps, setInstantVelocityFps] = useState<number>(0);
  const [currentDisplacementInches, setCurrentDisplacementInches] = useState<number>(0);
  const [currentPhase, setCurrentPhase] = useState<'UPSTROKE (LIFT)' | 'DOWNSTROKE (FALL)'>('UPSTROKE (LIFT)');

  // Synchronize playing state with E-stop
  useEffect(() => {
    if (isEmergencyStopped) {
      setIsPlaying(false);
    }
  }, [isEmergencyStopped]);

  const rodLoads = calculateRodLoads(spm, strokeLength, viscosityCp);
  const rodFloatRisk = calculateRodFloatRisk(viscosityCp, spm, strokeLength);

  // Animation Loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let currentAngle = 0; // Radians

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (isPlaying && !isEmergencyStopped) {
        // Angular velocity in rad/sec: omega = (SPM * 2 * PI) / 60
        const omega = (spm * 2 * Math.PI) / 60;
        currentAngle = (currentAngle + omega * dt) % (2 * Math.PI);
        
        const deg = Math.round((currentAngle * 180) / Math.PI);
        setCrankAngleDeg(deg);
        
        // Instantaneous kinematic velocity & displacement
        const isUp = currentAngle <= Math.PI;
        setCurrentPhase(isUp ? 'UPSTROKE (LIFT)' : 'DOWNSTROKE (FALL)');
        
        const strokeFt = strokeLength / 12;
        const normalizedDisplacement = 0.5 * (1 - Math.cos(currentAngle) + 0.1 * (1 - Math.cos(2 * currentAngle)));
        const dispIn = Math.round(normalizedDisplacement * strokeLength * 10) / 10;
        setCurrentDisplacementInches(dispIn);

        const velFps = Math.abs(Math.sin(currentAngle) * (strokeFt * omega / 2));
        setInstantVelocityFps(Math.round(velFps * 100) / 100);
      }

      // Render Dynamic Pumpjack Frame
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background High-Tech Grid
      ctx.strokeStyle = '#162244';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Ground Base Line
      const groundY = height - 40;
      ctx.strokeStyle = '#324B8B';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(20, groundY);
      ctx.lineTo(width - 20, groundY);
      ctx.stroke();

      // Concrete Pad
      ctx.fillStyle = '#111C38';
      ctx.fillRect(40, groundY, width - 80, 20);
      ctx.strokeStyle = '#233566';
      ctx.strokeRect(40, groundY, width - 80, 20);

      // Samson Post (Center A-Frame)
      const samsonApexX = width * 0.46;
      const samsonApexY = height * 0.38;
      const samsonBaseLeftX = samsonApexX - 55;
      const samsonBaseRightX = samsonApexX + 55;

      ctx.strokeStyle = '#00B4D8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(samsonBaseLeftX, groundY);
      ctx.lineTo(samsonApexX, samsonApexY);
      ctx.lineTo(samsonBaseRightX, groundY);
      ctx.stroke();

      // Samson Post Cross Braces
      ctx.strokeStyle = '#0077B6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(samsonApexX - 30, groundY - 50);
      ctx.lineTo(samsonApexX + 30, groundY - 50);
      ctx.moveTo(samsonApexX - 30, groundY - 50);
      ctx.lineTo(samsonApexX, samsonApexY);
      ctx.moveTo(samsonApexX + 30, groundY - 50);
      ctx.lineTo(samsonApexX, samsonApexY);
      ctx.stroke();

      // Center Bearing (Pivot Point)
      ctx.fillStyle = '#FF7A00';
      ctx.beginPath();
      ctx.arc(samsonApexX, samsonApexY, 7, 0, 2 * Math.PI);
      ctx.fill();

      // Crank Shaft Center (Gearbox)
      const crankCenterX = samsonApexX + 130;
      const crankCenterY = groundY - 45;

      // Gearbox Housing
      ctx.fillStyle = '#162244';
      ctx.strokeStyle = '#324B8B';
      ctx.lineWidth = 2;
      ctx.fillRect(crankCenterX - 25, crankCenterY - 15, 50, 45);
      ctx.strokeRect(crankCenterX - 25, crankCenterY - 15, 50, 45);

      // Crank Arm & Counterweight
      const crankRadius = 38 * (strokeLength / 100);
      const crankPinX = crankCenterX + crankRadius * Math.cos(currentAngle);
      const crankPinY = crankCenterY + crankRadius * Math.sin(currentAngle);

      // Draw Crank Arm
      ctx.strokeStyle = '#FF7A00';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(crankCenterX, crankCenterY);
      ctx.lineTo(crankPinX, crankPinY);
      ctx.stroke();

      // Counterweight Lobe
      ctx.fillStyle = '#FF9E40';
      ctx.beginPath();
      ctx.arc(crankPinX, crankPinY, 14, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#070B19';
      ctx.beginPath();
      ctx.arc(crankPinX, crankPinY, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Walking Beam Kinematics
      // Tail bearing connected to crank pin via Pitman Arm
      const beamLengthFront = 140; // towards horsehead
      const beamLengthBack = 110;  // towards pitman arm
      
      // Calculate Walking Beam Angle using geometric approximation
      const pitmanLength = 115;
      const beamAngle = Math.asin((crankPinY - (samsonApexY + 45)) / pitmanLength) * 0.45;

      const beamTailX = samsonApexX + beamLengthBack * Math.cos(beamAngle);
      const beamTailY = samsonApexY + beamLengthBack * Math.sin(beamAngle);

      const beamNoseX = samsonApexX - beamLengthFront * Math.cos(beamAngle);
      const beamNoseY = samsonApexY - beamLengthFront * Math.sin(beamAngle);

      // Draw Pitman Arm
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(beamTailX, beamTailY);
      ctx.lineTo(crankPinX, crankPinY);
      ctx.stroke();

      // Pitman Pins
      ctx.fillStyle = '#00B4D8';
      ctx.beginPath();
      ctx.arc(beamTailX, beamTailY, 5, 0, 2 * Math.PI);
      ctx.fill();

      // Draw Walking Beam (Main Steel I-Beam)
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(beamTailX, beamTailY);
      ctx.lineTo(beamNoseX, beamNoseY);
      ctx.stroke();

      // Draw Horsehead (Curved Cam Structure)
      const horseheadRadius = 60;
      ctx.fillStyle = '#FF7A00';
      ctx.strokeStyle = '#FF4800';
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      ctx.moveTo(beamNoseX, beamNoseY);
      // Curved front arc of the horsehead
      const horseArcCenterX = beamNoseX + 15;
      const horseArcCenterY = beamNoseY;
      ctx.arc(horseArcCenterX, horseArcCenterY, horseheadRadius, Math.PI - 0.75, Math.PI + 0.75, false);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Bridle Wirelines hanging straight down from topmost tangent of the horsehead
      const bridleHangX = beamNoseX - 42;
      const horseheadContactY = beamNoseY - 25 + (beamAngle * 35);
      
      // Wellhead Stuffing Box Location
      const wellheadX = bridleHangX;
      const wellheadTopY = groundY - 30;

      // Carrier Bar & Polished Rod
      const strokeDisplacementPx = (currentDisplacementInches / 144) * 55;
      const carrierBarY = horseheadContactY + 65 + strokeDisplacementPx;

      // Draw Wireline Bridle Cables
      ctx.strokeStyle = '#CBD5E1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bridleHangX - 4, horseheadContactY);
      ctx.lineTo(bridleHangX - 4, carrierBarY);
      ctx.moveTo(bridleHangX + 4, horseheadContactY);
      ctx.lineTo(bridleHangX + 4, carrierBarY);
      ctx.stroke();

      // Carrier Bar
      ctx.fillStyle = '#00B4D8';
      ctx.fillRect(bridleHangX - 14, carrierBarY - 3, 28, 6);

      // Polished Rod (descending into wellhead)
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(wellheadX, carrierBarY);
      ctx.lineTo(wellheadX, groundY + 15);
      ctx.stroke();

      // Polished Rod Clamp (Visual indicator for rod float separation)
      ctx.fillStyle = rodFloatRisk > 50 ? '#EF4444' : '#10B981';
      ctx.fillRect(wellheadX - 6, carrierBarY - 7, 12, 5);

      // Surface Wellhead & Stuffing Box
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = '#00B4D8';
      ctx.lineWidth = 2;
      ctx.fillRect(wellheadX - 12, wellheadTopY, 24, 30);
      ctx.strokeRect(wellheadX - 12, wellheadTopY, 24, 30);
      
      // Wellhead Flange
      ctx.fillStyle = '#334155';
      ctx.fillRect(wellheadX - 18, wellheadTopY + 20, 36, 10);

      // Live Telemetry Overlay in Canvas
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#00B4D8';
      ctx.fillText(`BAGHEWALA SRP-1120M`, 20, 25);
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(`CRANK ANGLE: ${crankAngleDeg}°`, 20, 42);
      ctx.fillText(`ROD SPEED: ${instantVelocityFps} ft/s`, 20, 58);
      ctx.fillText(`DISPLACEMENT: ${currentDisplacementInches}" / ${strokeLength}"`, 20, 74);

      // Floating Warning Overlay if applicable
      if (rodFloatRisk > 60 && currentPhase.includes('DOWNSTROKE')) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
        ctx.font = 'bold 11px "Inter", sans-serif';
        ctx.fillText(`⚠ CAUTION: SINKER BAR DRAG / FLOAT DETECTED`, width - 310, 30);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, spm, strokeLength, viscosityCp, isEmergencyStopped]);

  return (
    <div className="bg-[#111C38] border border-[#233566] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#233566]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-[#FF7A00]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              REAL-TIME KINEMATIC PUMPJACK SIMULATION
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Baghewala Jodhpur Sandstone • 60 FPS Continuous Reciprocation
            </p>
          </div>
        </div>

        {/* Play/Pause & Reset Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={isEmergencyStopped}
            className={`p-2 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all ${
              isPlaying 
                ? 'bg-[#162244] border-[#00B4D8] text-[#00B4D8] hover:bg-[#1C2C58]' 
                : 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
            } ${isEmergencyStopped ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isPlaying ? 'Pause Kinematics' : 'Resume Kinematics'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPlaying ? 'PAUSE' : 'RUN'}</span>
          </button>
          <button
            onClick={() => {
              onSPMChange(6.0);
              onStrokeLengthChange(100);
            }}
            className="p-2 rounded-lg bg-[#162244] border border-[#233566] hover:border-slate-400 text-slate-300 text-xs transition-colors"
            title="Reset to Baseline Setpoints (6.0 SPM, 100 in)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Visualization */}
      <div className="relative my-3 rounded-xl overflow-hidden bg-[#070B19] border border-[#233566]">
        <canvas
          ref={canvasRef}
          width={640}
          height={320}
          className="w-full h-[280px] sm:h-[310px] block"
        />

        {/* Phase Pill Overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border font-bold ${
            currentPhase.includes('UPSTROKE') 
              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300' 
              : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
          }`}>
            {currentPhase}
          </span>
        </div>
      </div>

      {/* Interactive Controls & Real-Time Parameter Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* SPM Slider */}
        <div className="p-3 bg-[#0B132B] rounded-xl border border-[#233566]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#FF7A00]" />
              STROKES PER MINUTE (SPM):
            </span>
            <span className="text-sm font-mono font-bold text-[#FF7A00]">
              {spm.toFixed(1)} SPM
            </span>
          </div>
          <input
            type="range"
            min="3.0"
            max="12.0"
            step="0.1"
            value={spm}
            onChange={(e) => onSPMChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#162244] rounded-lg appearance-none cursor-pointer accent-[#FF7A00]"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>3.0 (Heavy Drag)</span>
            <span>6.0 (Optimal)</span>
            <span>12.0 (Max VFD)</span>
          </div>
        </div>

        {/* Stroke Length Slider */}
        <div className="p-3 bg-[#0B132B] rounded-xl border border-[#233566]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#00B4D8]" />
              POLISHED ROD STROKE LENGTH:
            </span>
            <span className="text-sm font-mono font-bold text-[#00B4D8]">
              {strokeLength}" ({Math.round((strokeLength * 2.54) / 10) / 10} m)
            </span>
          </div>
          <input
            type="range"
            min="64"
            max="144"
            step="4"
            value={strokeLength}
            onChange={(e) => onStrokeLengthChange(parseInt(e.target.value))}
            className="w-full h-1.5 bg-[#162244] rounded-lg appearance-none cursor-pointer accent-[#00B4D8]"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
            <span>64" (C-64)</span>
            <span>100" (C-228)</span>
            <span>144" (C-320 Long)</span>
          </div>
        </div>
      </div>

      {/* Real-time Dynamic Mechanical Status Strip */}
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-[#233566]/60 text-center font-mono">
        <div className="p-2 rounded-lg bg-[#162244]/60 border border-[#233566]">
          <div className="text-[10px] text-slate-400">PEAK LOAD (PPRL)</div>
          <div className="text-xs font-bold text-white mt-0.5">{rodLoads.pprl.toLocaleString()} lbs</div>
        </div>
        <div className="p-2 rounded-lg bg-[#162244]/60 border border-[#233566]">
          <div className="text-[10px] text-slate-400">MIN LOAD (MPRL)</div>
          <div className="text-xs font-bold text-slate-200 mt-0.5">{rodLoads.mprl.toLocaleString()} lbs</div>
        </div>
        <div className="p-2 rounded-lg bg-[#162244]/60 border border-[#233566]">
          <div className="text-[10px] text-slate-400">LIFTING POWER</div>
          <div className="text-xs font-bold text-[#00B4D8] mt-0.5">{rodLoads.liftingPowerKW} kW</div>
        </div>
        <div className={`p-2 rounded-lg border ${
          rodFloatRisk > 60 ? 'bg-red-500/10 border-red-500/40 text-red-400' :
          rodFloatRisk > 30 ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' :
          'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
        }`}>
          <div className="text-[10px] flex items-center justify-center gap-1">
            <AlertCircle className="w-2.5 h-2.5" />
            FLOAT RISK
          </div>
          <div className="text-xs font-bold mt-0.5">{rodFloatRisk}%</div>
        </div>
      </div>
    </div>
  );
};
