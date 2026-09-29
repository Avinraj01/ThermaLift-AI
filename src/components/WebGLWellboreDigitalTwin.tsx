import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { 
  RotateCcw, 
  Layers, 
  Flame, 
  Activity, 
  Compass, 
  Radio,
  Sliders,
  Maximize2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { TelemetryKPIs } from '../types';

interface WebGLWellboreDigitalTwinProps {
  spm: number;
  strokeLength: number;
  viscosityCp: number;
  kpis: TelemetryKPIs;
  onSPMChange: (newSPM: number) => void;
  onStrokeLengthChange: (newStroke: number) => void;
  isEmergencyStopped?: boolean;
}

export const WebGLWellboreDigitalTwin: React.FC<WebGLWellboreDigitalTwinProps> = ({
  spm,
  strokeLength,
  viscosityCp,
  kpis,
  onSPMChange,
  onStrokeLengthChange,
  isEmergencyStopped = false
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [cameraMode, setCameraMode] = useState<'SURFACE_RIG' | 'FULL_WELLBORE' | 'SUBSURFACE_PAYZONE' | 'ISOMETRIC_CAD'>('SURFACE_RIG');
  const [instantVelocity, setInstantVelocity] = useState<number>(0);
  const [currentDisplacement, setCurrentDisplacement] = useState<number>(0);
  const [crankAngleDeg, setCrankAngleDeg] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const animStateRef = useRef({
    crankAngle: 0,
    walkingBeam: null as THREE.Group | null,
    crankArm: null as THREE.Group | null,
    polishedRod: null as THREE.Mesh | null,
    carrierBar: null as THREE.Mesh | null,
    thermalParticles: null as THREE.Points | null,
    pumpPlunger: null as THREE.Mesh | null,
    inflowArrows: null as THREE.Group | null,
    controls: null as OrbitControls | null,
    camera: null as THREE.PerspectiveCamera | null,
    renderer: null as THREE.WebGLRenderer | null,
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 560;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x04070D);
    scene.fog = new THREE.FogExp2(0x04070D, 0.010);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(18, 14, 24);
    animStateRef.current.camera = camera;

    // 3. High-Performance Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      powerPreference: 'high-performance',
      logarithmicDepthBuffer: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);
    animStateRef.current.renderer = renderer;

    // 4. Orbit Controls with Damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.08;
    controls.minDistance = 3;
    controls.maxDistance = 140;
    controls.target.set(0, 3.5, 0);
    animStateRef.current.controls = controls;

    // 5. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x131F33, 2.2);
    scene.add(ambientLight);

    const keySunLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keySunLight.position.set(25, 40, 20);
    keySunLight.castShadow = true;
    keySunLight.shadow.mapSize.width = 2048;
    keySunLight.shadow.mapSize.height = 2048;
    keySunLight.shadow.bias = -0.0001;
    scene.add(keySunLight);

    const rimCyanLight = new THREE.DirectionalLight(0x00F0FF, 2.0);
    rimCyanLight.position.set(-25, 15, -25);
    scene.add(rimCyanLight);

    const amberFillLight = new THREE.PointLight(0xFF7A00, 3.0, 50);
    amberFillLight.position.set(0, 4, -8);
    scene.add(amberFillLight);

    // 6. Ground Industrial Grid & Concrete Pad
    const gridHelper = new THREE.GridHelper(70, 70, 0x00F0FF, 0x131F33);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Foundation Base Pad
    const padGeo = new THREE.BoxGeometry(20, 0.7, 14);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x09101B,
      roughness: 0.9,
      metalness: 0.1,
    });
    const concretePad = new THREE.Mesh(padGeo, padMat);
    concretePad.position.set(2, -0.35, 0);
    concretePad.receiveShadow = true;
    scene.add(concretePad);

    // 7. PUMPJACK MODEL (METALLIC PBR FINISH)
    const pumpjackGroup = new THREE.Group();
    scene.add(pumpjackGroup);

    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x1B2A45,
      metalness: 0.9,
      roughness: 0.25,
    });
    const industrialAmberMat = new THREE.MeshStandardMaterial({
      color: 0xFF7A00,
      metalness: 0.5,
      roughness: 0.35,
    });
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xF8FAFC,
      metalness: 0.98,
      roughness: 0.05,
    });
    const darkHousingMat = new THREE.MeshStandardMaterial({
      color: 0x0E1726,
      metalness: 0.8,
      roughness: 0.4,
    });

    // Samson Post A-Frame
    const postHeight = 8.2;
    const postLegGeo = new THREE.CylinderGeometry(0.2, 0.32, postHeight, 8);
    
    const leftLeg = new THREE.Mesh(postLegGeo, industrialAmberMat);
    leftLeg.position.set(-0.3, postHeight / 2, -1.8);
    leftLeg.rotation.x = 0.23;
    leftLeg.castShadow = true;
    pumpjackGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(postLegGeo, industrialAmberMat);
    rightLeg.position.set(-0.3, postHeight / 2, 1.8);
    rightLeg.rotation.x = -0.23;
    rightLeg.castShadow = true;
    pumpjackGroup.add(rightLeg);

    const rearLeg = new THREE.Mesh(postLegGeo, industrialAmberMat);
    rearLeg.position.set(1.8, postHeight / 2, 0);
    rearLeg.rotation.z = -0.24;
    rearLeg.castShadow = true;
    pumpjackGroup.add(rearLeg);

    // Center Bearing Housing
    const centerBearing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, 1.2, 16),
      steelMat
    );
    centerBearing.rotation.x = Math.PI / 2;
    centerBearing.position.set(0, postHeight - 0.2, 0);
    pumpjackGroup.add(centerBearing);

    // Walking Beam Pivot Group
    const walkingBeamGroup = new THREE.Group();
    walkingBeamGroup.position.set(0, postHeight - 0.2, 0);
    pumpjackGroup.add(walkingBeamGroup);
    animStateRef.current.walkingBeam = walkingBeamGroup;

    // Main I-Beam
    const beamGeo = new THREE.BoxGeometry(12, 0.75, 0.5);
    const beamMesh = new THREE.Mesh(beamGeo, industrialAmberMat);
    beamMesh.position.set(-0.6, 0, 0);
    beamMesh.castShadow = true;
    walkingBeamGroup.add(beamMesh);

    // Horsehead Cam Head
    const horseheadShape = new THREE.Shape();
    horseheadShape.moveTo(0, -0.3);
    horseheadShape.lineTo(-2.0, 1.4);
    horseheadShape.absarc(-2.7, 0, 2.4, Math.PI * 0.45, -Math.PI * 0.45, true);
    horseheadShape.lineTo(0, -0.3);

    const horseheadExtrude = new THREE.ExtrudeGeometry(horseheadShape, { depth: 0.45, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.05, bevelThickness: 0.05 });
    const horseheadMesh = new THREE.Mesh(horseheadExtrude, steelMat);
    horseheadMesh.position.set(-5.4, 0, -0.22);
    horseheadMesh.castShadow = true;
    walkingBeamGroup.add(horseheadMesh);

    // Gearbox & Motor Enclosure
    const gearbox = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.2, 3.2), darkHousingMat);
    gearbox.position.set(5.5, 1.1, 0);
    gearbox.castShadow = true;
    pumpjackGroup.add(gearbox);

    // Motor Nameplate & Cooling Fins
    const motorFins = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2.4, 16), steelMat);
    motorFins.rotation.x = Math.PI / 2;
    motorFins.position.set(5.5, 0.9, -2.2);
    pumpjackGroup.add(motorFins);

    // Crankshaft & Counterweights
    const crankGroup = new THREE.Group();
    crankGroup.position.set(5.5, 2.4, 0);
    pumpjackGroup.add(crankGroup);
    animStateRef.current.crankArm = crankGroup;

    const crankLobeGeo = new THREE.BoxGeometry(0.35, 2.8, 1.6);
    const leftCrank = new THREE.Mesh(crankLobeGeo, industrialAmberMat);
    leftCrank.position.set(0, 0.9, -1.8);
    leftCrank.castShadow = true;
    crankGroup.add(leftCrank);

    const rightCrank = new THREE.Mesh(crankLobeGeo, industrialAmberMat);
    rightCrank.position.set(0, 0.9, 1.8);
    rightCrank.castShadow = true;
    crankGroup.add(rightCrank);

    // Pitman Rods
    const pitmanGeo = new THREE.CylinderGeometry(0.14, 0.14, 6.8, 8);
    const pitmanLeft = new THREE.Mesh(pitmanGeo, steelMat);
    pitmanLeft.position.set(5.1, 5.2, -1.8);
    pumpjackGroup.add(pitmanLeft);

    const pitmanRight = new THREE.Mesh(pitmanGeo, steelMat);
    pitmanRight.position.set(5.1, 5.2, 1.8);
    pumpjackGroup.add(pitmanRight);

    // Surface Wellhead & Stuffing Box
    const wellheadGroup = new THREE.Group();
    wellheadGroup.position.set(-7.6, 0, 0);
    scene.add(wellheadGroup);

    const masterValve = new THREE.Mesh(
      new THREE.CylinderGeometry(1.0, 1.1, 0.6, 16),
      darkHousingMat
    );
    masterValve.position.y = 0.3;
    wellheadGroup.add(masterValve);

    const stuffingBox = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.55, 1.8, 16),
      industrialAmberMat
    );
    stuffingBox.position.y = 1.4;
    wellheadGroup.add(stuffingBox);

    // Polished Rod & Carrier Bar
    const polishedRod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 9.0, 16),
      chromeMat
    );
    polishedRod.position.set(-7.6, 4.5, 0);
    scene.add(polishedRod);
    animStateRef.current.polishedRod = polishedRod;

    const carrierBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.3, 1.6),
      industrialAmberMat
    );
    carrierBar.position.set(-7.6, 8.0, 0);
    scene.add(carrierBar);
    animStateRef.current.carrierBar = carrierBar;

    // Wireline Bridles
    const bridleGeo = new THREE.CylinderGeometry(0.025, 0.025, 3.8, 6);
    const leftBridle = new THREE.Mesh(bridleGeo, steelMat);
    leftBridle.position.set(-7.6, 9.5, -0.6);
    scene.add(leftBridle);

    const rightBridle = new THREE.Mesh(bridleGeo, steelMat);
    rightBridle.position.set(-7.6, 9.5, 0.6);
    scene.add(rightBridle);

    // 8. SUBSURFACE COLUMN (0 TO -1,120M TVD)
    const strataGroup = new THREE.Group();
    strataGroup.position.set(-7.6, 0, 0);
    scene.add(strataGroup);

    // Casing String
    const casingGeo = new THREE.CylinderGeometry(0.65, 0.65, 48, 24, 1, true);
    const casingMat = new THREE.MeshStandardMaterial({
      color: 0x273B5E,
      metalness: 0.85,
      roughness: 0.3,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    const casing = new THREE.Mesh(casingGeo, casingMat);
    casing.position.y = -24;
    strataGroup.add(casing);

    // Stratigraphic Rock Slices
    const strataLayers = [
      { name: 'Overburden Shale', y: -7, height: 14, color: 0x09101B, opacity: 0.9 },
      { name: 'Impermeable Caprock', y: -21, height: 14, color: 0x131F33, opacity: 0.9 },
      { name: 'Jodhpur Sandstone (Payzone)', y: -38, height: 20, color: 0x2B1800, opacity: 0.95 }
    ];

    strataLayers.forEach((layer) => {
      const rockGeo = new THREE.CylinderGeometry(9, 9, layer.height, 32, 1, true);
      const rockMat = new THREE.MeshStandardMaterial({
        color: layer.color,
        roughness: 0.95,
        transparent: true,
        opacity: layer.opacity,
        side: THREE.BackSide
      });
      const rockMesh = new THREE.Mesh(rockGeo, rockMat);
      rockMesh.position.y = layer.y;
      strataGroup.add(rockMesh);
    });

    // Downhole Pump Barrel & Plunger at -1120m Payzone
    const downholePumpGroup = new THREE.Group();
    downholePumpGroup.position.set(0, -40, 0);
    strataGroup.add(downholePumpGroup);

    const pumpBarrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.4, 0.4, 4.8, 16),
      new THREE.MeshStandardMaterial({ color: 0x00F0FF, metalness: 0.9, roughness: 0.2 })
    );
    downholePumpGroup.add(pumpBarrel);

    const pumpPlunger = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.32, 3.0, 16),
      chromeMat
    );
    downholePumpGroup.add(pumpPlunger);
    animStateRef.current.pumpPlunger = pumpPlunger;

    // Perforation Glow Rings
    const perfsGeo = new THREE.TorusGeometry(0.72, 0.07, 8, 24);
    const perfsMat = new THREE.MeshBasicMaterial({ color: 0xFF7A00 });
    for (let i = -3; i <= 3; i++) {
      const ring = new THREE.Mesh(perfsGeo, perfsMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = i * 0.7;
      downholePumpGroup.add(ring);
    }

    // 9. STEAM PLUME PARTICLES (320°C Thermal Front Simulation)
    const particleCount = 350;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.2 + Math.random() * 5.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePositions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      particlePositions[i * 3 + 1] = -40 + radius * Math.sin(phi);
      particlePositions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      particleColors[i * 3] = 1.0;
      particleColors[i * 3 + 1] = 0.45 + Math.random() * 0.3;
      particleColors[i * 3 + 2] = 0.05;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const thermalParticles = new THREE.Points(particleGeo, particleMat);
    strataGroup.add(thermalParticles);
    animStateRef.current.thermalParticles = thermalParticles;

    // 10. Animation Loop (60 FPS Physical Kinematics)
    let animationId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (!isEmergencyStopped && spm > 0) {
        const omega = (spm * 2 * Math.PI) / 60;
        animStateRef.current.crankAngle += omega * dt;

        const theta = animStateRef.current.crankAngle;
        const strokeScaling = strokeLength / 100;

        setCrankAngleDeg(Math.round((theta * 180 / Math.PI) % 360));

        if (animStateRef.current.walkingBeam) {
          const pitch = Math.sin(theta) * 0.20 * strokeScaling;
          animStateRef.current.walkingBeam.rotation.z = pitch;
        }

        if (animStateRef.current.crankArm) {
          animStateRef.current.crankArm.rotation.z = -theta;
        }

        const normalizedDisplacement = 0.5 * (1 - Math.cos(theta) + 0.1 * (1 - Math.cos(2 * theta)));
        const strokeTravel = normalizedDisplacement * (strokeLength / 144) * 2.5;

        setCurrentDisplacement(Math.round(normalizedDisplacement * strokeLength * 10) / 10);
        setInstantVelocity(Math.round(Math.abs(Math.sin(theta) * (strokeLength / 12) * (spm / 30)) * 100) / 100);

        if (animStateRef.current.polishedRod) {
          animStateRef.current.polishedRod.position.y = 4.5 + strokeTravel;
        }
        if (animStateRef.current.carrierBar) {
          animStateRef.current.carrierBar.position.y = 8.0 + strokeTravel;
        }
        if (animStateRef.current.pumpPlunger) {
          animStateRef.current.pumpPlunger.position.y = -0.6 + strokeTravel * 0.65;
        }

        if (animStateRef.current.thermalParticles) {
          animStateRef.current.thermalParticles.rotation.y += 0.007;
        }
      }

      controls.update();
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 560;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [spm, strokeLength, isEmergencyStopped]);

  const setCameraPreset = (mode: 'SURFACE_RIG' | 'FULL_WELLBORE' | 'SUBSURFACE_PAYZONE' | 'ISOMETRIC_CAD') => {
    setCameraMode(mode);
    const camera = animStateRef.current.camera;
    const controls = animStateRef.current.controls;
    if (!camera || !controls) return;

    if (mode === 'SURFACE_RIG') {
      camera.position.set(18, 14, 22);
      controls.target.set(0, 3.5, 0);
    } else if (mode === 'FULL_WELLBORE') {
      camera.position.set(38, -15, 42);
      controls.target.set(-7.6, -20, 0);
    } else if (mode === 'SUBSURFACE_PAYZONE') {
      camera.position.set(8, -38, 14);
      controls.target.set(-7.6, -40, 0);
    } else if (mode === 'ISOMETRIC_CAD') {
      camera.position.set(30, 30, 30);
      controls.target.set(0, 0, 0);
    }
    controls.update();
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-titanium-600 bg-[#04070D] shadow-2xl transition-all ${
      isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : ''
    }`}>
      
      {/* 3D WebGL Canvas Viewport */}
      <div 
        ref={mountRef} 
        className={`w-full block cursor-grab active:cursor-grabbing ${
          isFullscreen ? 'h-full' : 'h-[560px] lg:h-[640px]'
        }`}
      />

      {/* Elevation Depth Scale Ruler (Left Side) */}
      <div className="absolute left-3 top-16 bottom-20 w-8 z-20 pointer-events-none flex flex-col justify-between text-[9px] font-mono text-slate-500 border-r border-cyan-500/30 pr-1">
        <span className="text-[#00F0FF] font-bold">0m (BOP)</span>
        <span>-200m</span>
        <span>-400m</span>
        <span>-600m</span>
        <span>-800m</span>
        <span>-1000m</span>
        <span className="text-[#FF7A00] font-bold">-1120m (PAY)</span>
      </div>

      {/* Top Left Enterprise HUD Breadcrumb */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-1.5 ml-8">
        <div className="flex items-center gap-2 bg-titanium-900/90 backdrop-blur-xl border border-titanium-600 px-3.5 py-1.5 rounded-lg shadow-tactical-card pointer-events-auto">
          <div className="w-2 h-2 rounded-full bg-[#00F0FF] led-pulse-cyan" />
          <span className="font-mono text-xs font-bold text-white tracking-widest uppercase">
            3D DIGITAL TWIN • BAGHEWALA BGW-07
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-titanium-750 text-[#00F0FF] border border-cyan-500/30 font-semibold">
            PBR CAD TWIN
          </span>
        </div>

        <div className="text-[10px] font-mono text-slate-400 bg-titanium-900/80 px-2.5 py-1 rounded border border-titanium-700 backdrop-blur-md">
          CRANK: <strong className="text-[#FF7A00]">{crankAngleDeg}°</strong> | TORQUE: <strong className="text-white">68.4%</strong> | MOTOR FREQ: <strong className="text-[#00F0FF]">{kpis.motorFrequency} Hz</strong>
        </div>
      </div>

      {/* Top Right Camera Presets */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-titanium-900/90 backdrop-blur-xl border border-titanium-600 p-1 rounded-xl shadow-tactical-card">
        <button
          onClick={() => setCameraPreset('SURFACE_RIG')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
            cameraMode === 'SURFACE_RIG'
              ? 'bg-titanium-750 text-[#FF7A00] border border-amber-500/40 shadow-amber-glow'
              : 'text-slate-400 hover:text-white hover:bg-titanium-800'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>SURFACE RIG</span>
        </button>

        <button
          onClick={() => setCameraPreset('FULL_WELLBORE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
            cameraMode === 'FULL_WELLBORE'
              ? 'bg-titanium-750 text-[#00F0FF] border border-cyan-500/40 shadow-tactical-active'
              : 'text-slate-400 hover:text-white hover:bg-titanium-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>STRATA (1120m)</span>
        </button>

        <button
          onClick={() => setCameraPreset('SUBSURFACE_PAYZONE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
            cameraMode === 'SUBSURFACE_PAYZONE'
              ? 'bg-titanium-750 text-[#FF7A00] border border-amber-500/40 shadow-amber-glow'
              : 'text-slate-400 hover:text-white hover:bg-titanium-800'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>PAYZONE 320°C</span>
        </button>

        <button
          onClick={() => setCameraPreset('ISOMETRIC_CAD')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
            cameraMode === 'ISOMETRIC_CAD'
              ? 'bg-titanium-750 text-emerald-400 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-titanium-800'
          }`}
        >
          <span>CAD ISO</span>
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-titanium-800 transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Mechanical HUD (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-auto flex flex-col gap-2 ml-8">
        <div className="bg-titanium-900/95 backdrop-blur-2xl border border-titanium-600 p-3.5 rounded-xl shadow-tactical-card min-w-[300px]">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-2 border-b border-titanium-700">
            <span className="flex items-center gap-1.5 text-[#00F0FF] font-bold">
              <Activity className="w-3.5 h-3.5" />
              KINEMATIC TELEMETRY
            </span>
            <span className="text-white font-bold">{spm.toFixed(1)} SPM</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-2 text-xs font-mono">
            <div>
              <div className="text-[10px] text-slate-500">ROD SPEED</div>
              <div className="font-bold text-[#00F0FF] text-sm">{instantVelocity} ft/s</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500">STROKE DISPLACEMENT</div>
              <div className="font-bold text-white text-sm">{currentDisplacement}" / {strokeLength}"</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500">POLISHED ROD PPRL</div>
              <div className="font-bold text-amber-400">{kpis.pprl.toLocaleString()} lbs</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500">DOWNHOLE TEMP</div>
              <div className="font-bold text-red-400">{kpis.temperature}°C (Decay: {kpis.tempRate}°C/d)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Tactical Sliders (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-auto flex items-center gap-3">
        <div className="bg-titanium-900/95 backdrop-blur-2xl border border-titanium-600 p-3.5 rounded-xl shadow-tactical-card flex items-center gap-4">
          <div className="flex flex-col gap-1 w-32">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-slate-400">SET SPM:</span>
              <strong className="text-[#FF7A00]">{spm.toFixed(1)}</strong>
            </div>
            <input
              type="range"
              min="3.0"
              max="12.0"
              step="0.1"
              value={spm}
              onChange={(e) => onSPMChange(parseFloat(e.target.value))}
              className="w-full h-1 bg-titanium-950 rounded appearance-none cursor-pointer accent-[#FF7A00]"
            />
          </div>

          <div className="flex flex-col gap-1 w-32">
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-slate-400">STROKE:</span>
              <strong className="text-[#00F0FF]">{strokeLength}"</strong>
            </div>
            <input
              type="range"
              min="64"
              max="144"
              step="4"
              value={strokeLength}
              onChange={(e) => onStrokeLengthChange(parseInt(e.target.value))}
              className="w-full h-1 bg-titanium-950 rounded appearance-none cursor-pointer accent-[#00F0FF]"
            />
          </div>

          <button
            onClick={() => setCameraPreset(cameraMode)}
            className="p-2.5 rounded-lg bg-titanium-800 border border-titanium-600 hover:border-[#00F0FF] text-slate-300 hover:text-white transition-colors"
            title="Reset Orbit Camera Angle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Laser Corner Brackets */}
      <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#00F0FF]/60 pointer-events-none" />
      <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#00F0FF]/60 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#00F0FF]/60 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#00F0FF]/60 pointer-events-none" />

    </div>
  );
};
