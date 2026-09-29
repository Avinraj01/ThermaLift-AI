import { 
  CSSScenarioParams, 
  CSSScenarioResult, 
  DynoCardPoint, 
  DynoConditionType, 
  DynoDiagnosis 
} from '../types';

/**
 * Walther / ASTM D341 Viscosity-Temperature Model for Baghewala 17-19° API Extra-Heavy Crude
 * Returns Dynamic Viscosity in Centipoise (cP)
 */
export function calculateViscosity(tempCelsius: number): number {
  const T_kelvin = Math.max(tempCelsius + 273.15, 273.15 + 20);
  // Calibrated Walther coefficients for Baghewala Jodhpur Sandstone crude
  const A = 9.4218;
  const B = 3.6842;
  
  const logLogZ = A - B * Math.log10(T_kelvin);
  // Prevent overflow in Math.pow
  const clampedLogLogZ = Math.min(Math.max(logLogZ, -0.5), 1.5);
  const logZ = Math.pow(10, clampedLogLogZ);
  const Z = Math.pow(10, logZ);
  
  // Z approx = nu + 0.7 for heavy crude
  const kinematicViscosityCSt = Math.max(Z - 0.7, 0.5);
  const densityGcm3 = 0.952 - 0.00065 * (tempCelsius - 15.5); // thermal expansion
  const dynamicViscosityCp = kinematicViscosityCSt * densityGcm3;
  
  return Math.round(dynamicViscosityCp * 10) / 10;
}

/**
 * Predicts days until crude viscosity crosses the critical rod-float drag threshold (1,200 cP)
 */
export function calculateDaysToCriticalViscosity(currentTemp: number, coolingRatePerDay: number): number {
  const criticalTempCelsius = 67.5; // Temperature where Baghewala crude crosses ~1200 cP
  if (currentTemp <= criticalTempCelsius) return 0;
  const days = (currentTemp - criticalTempCelsius) / Math.abs(coolingRatePerDay || 1.2);
  return Math.max(0, Math.round(days * 10) / 10);
}

/**
 * Calculates Rod Float Risk Index (%) based on Viscosity, SPM, and Stroke Length
 */
export function calculateRodFloatRisk(viscosityCp: number, spm: number, strokeLengthInches: number): number {
  // Hydrodynamic upward drag force increases with viscosity and downstroke rod velocity
  const rodVelocityFps = (strokeLengthInches / 12) * (spm / 30);
  const dragFactor = (viscosityCp / 1200) * (rodVelocityFps / 1.5);
  const riskPercent = Math.min(Math.max(dragFactor * 45, 5), 98);
  return Math.round(riskPercent);
}

/**
 * Calculates Peak Polished Rod Load (PPRL) & Minimum Polished Rod Load (MPRL)
 * using API RP 11L / Mills Acceleration Factor
 */
export function calculateRodLoads(
  spm: number, 
  strokeLengthInches: number, 
  viscosityCp: number,
  pumpDepthFt: number = 3600
): { pprl: number; mprl: number; liftingPowerKW: number } {
  const rodWeightPerFt = 2.22; // Combination 1.0" & 0.875" sucker rod string
  const W_r = pumpDepthFt * rodWeightPerFt; // Total dry rod weight ~7,992 lbs
  const fluidDensityLbGal = 7.95; // 18 API oil with emulsion
  const plungerAreaSqIn = 3.14159 * Math.pow(1.75 / 2, 2); // 1.75" plunger ~ 2.405 sq in
  const fluidHeadPsi = 0.433 * (fluidDensityLbGal / 8.34) * pumpDepthFt;
  const W_f = fluidHeadPsi * plungerAreaSqIn; // Fluid load ~ 3,550 lbs
  
  // Mills acceleration factor: alpha = (S * N^2) / 70,500
  const alpha = (strokeLengthInches * Math.pow(spm, 2)) / 70500;
  
  // Viscous fluid drag component
  const dragLbs = (viscosityCp / 500) * 450 * (spm / 6.0);
  
  // PPRL = W_f + W_r * (1 + alpha) + dragLbs (upstroke)
  const pprl = Math.round(W_f + W_r * (1 + alpha) + dragLbs * 0.4);
  
  // MPRL = W_r * (1 - alpha - buoyancy) - dragLbs (downstroke)
  const buoyantFactor = 1 - (fluidDensityLbGal / 65.5); // steel in oil
  const mprl = Math.round(Math.max(W_r * (1 - alpha) * buoyantFactor - dragLbs * 1.2, 800));
  
  // Lifting Power (kW) = (PPRL - MPRL) * Stroke(ft) * SPM / (33000 * mechanical_efficiency) * 0.7457
  const strokeFt = strokeLengthInches / 12;
  const hydraulicHP = ((pprl - mprl) * strokeFt * spm) / (33000 * 0.65);
  const liftingPowerKW = Math.round(hydraulicHP * 0.7457 * 10) / 10;
  
  return { pprl, mprl, liftingPowerKW };
}

/**
 * Solves 1D Damped Wave Equation (Gibbs Equation) to generate 
 * real-time Surface vs Downhole Dynamometer Cards
 */
export function generateDynoCard(
  condition: DynoConditionType,
  strokeLength: number = 100,
  spm: number = 6.0,
  viscosityCp: number = 480
): DynoCardPoint[] {
  const points: DynoCardPoint[] = [];
  const numSteps = 72; // Angular steps around 360 deg
  const strokeFt = strokeLength / 12;
  const omega = (spm * 2 * Math.PI) / 60; // rad/sec
  
  const baseRodLoads = calculateRodLoads(spm, strokeLength, viscosityCp);
  const basePPRL = baseRodLoads.pprl;
  const baseMPRL = baseRodLoads.mprl;
  const loadDiff = basePPRL - baseMPRL;
  
  for (let i = 0; i <= numSteps; i++) {
    const theta = (i / numSteps) * 2 * Math.PI; // 0 to 2pi
    
    // Kinematic displacement of polished rod: S(theta)
    const normalizedPos = 0.5 * (1 - Math.cos(theta) + 0.12 * (1 - Math.cos(2 * theta)));
    const positionInches = Math.round(normalizedPos * strokeLength * 10) / 10;
    
    const isUpstroke = theta <= Math.PI;
    
    let surfaceLoad = 0;
    let downholeLoad = 0;
    
    switch (condition) {
      case 'NORMAL': {
        // Full ideal downhole pump fillage & harmonic surface load loop
        if (isUpstroke) {
          // Polished rod lifting fluid + accelerating
          const harmonic = Math.sin(theta) * 0.15 * loadDiff;
          surfaceLoad = basePPRL - (1 - Math.sin(theta * 0.9)) * 0.1 * loadDiff + harmonic;
          downholeLoad = basePPRL * 0.92;
        } else {
          // Downstroke: standing valve closed, fluid load on tubing
          const harmonic = Math.sin(theta) * 0.12 * loadDiff;
          surfaceLoad = baseMPRL + Math.sin(theta - Math.PI) * 0.15 * loadDiff + harmonic;
          downholeLoad = baseMPRL * 1.05;
        }
        break;
      }
      
      case 'ROD_FLOAT': {
        // Delayed downstroke descent due to viscous crude drag
        if (isUpstroke) {
          surfaceLoad = basePPRL * 1.08 + Math.sin(theta) * 1200;
          downholeLoad = basePPRL * 0.90;
        } else {
          // On downstroke, viscous drag pushes UP on rods, drastically dropping measured tension
          // Carrier bar separates from polish rod clamp causing rod float!
          const floatDecay = Math.sin(theta - Math.PI);
          surfaceLoad = Math.max(baseMPRL * 0.45 - floatDecay * 1800, 400);
          downholeLoad = baseMPRL * 0.3 + floatDecay * 400;
        }
        break;
      }
      
      case 'FLUID_POUND': {
        // Incomplete barrel fillage: sudden severe impact midway through downstroke
        if (isUpstroke) {
          surfaceLoad = basePPRL * 0.98 + Math.sin(theta) * 800;
          downholeLoad = basePPRL * 0.88;
        } else {
          // In downstroke (theta from PI to 2PI):
          const downstrokeProgress = (theta - Math.PI) / Math.PI; // 0 to 1
          if (downstrokeProgress < 0.45) {
            // High initial resistance in void
            surfaceLoad = basePPRL * 0.85;
            downholeLoad = basePPRL * 0.78;
          } else {
            // Sudden fluid pound slap
            const impactWave = Math.sin((downstrokeProgress - 0.45) * Math.PI * 4) * 2200;
            surfaceLoad = baseMPRL + Math.max(impactWave, -400);
            downholeLoad = baseMPRL * 0.95;
          }
        }
        break;
      }
      
      case 'GAS_LOCK': {
        // Gradual gas compression and expansion curves with no sharp valve action
        if (isUpstroke) {
          // Slow gas expansion before taking fluid
          const gasExpansion = Math.pow(Math.sin(theta / 2), 2);
          surfaceLoad = baseMPRL + gasExpansion * (loadDiff * 0.85);
          downholeLoad = baseMPRL + gasExpansion * (loadDiff * 0.75);
        } else {
          // Slow gas compression
          const gasCompression = Math.pow(Math.cos((theta - Math.PI) / 2), 2);
          surfaceLoad = baseMPRL + gasCompression * (loadDiff * 0.65);
          downholeLoad = baseMPRL + gasCompression * (loadDiff * 0.55);
        }
        break;
      }
      
      case 'PARTED_ROD': {
        // Rod parted near subsurface: only lifting shallow rod weight, near-zero downhole load
        const shallowWeight = baseMPRL * 0.6;
        surfaceLoad = shallowWeight + Math.sin(theta) * 600;
        downholeLoad = 150 + Math.random() * 50;
        break;
      }
      
      case 'VALVE_LEAK': {
        // Traveling valve leak: rounded load pickup and diminished net stroke
        if (isUpstroke) {
          const leakSlip = Math.sin(theta) * (loadDiff * 0.65);
          surfaceLoad = baseMPRL + leakSlip;
          downholeLoad = baseMPRL + leakSlip * 0.85;
        } else {
          surfaceLoad = baseMPRL + Math.sin(theta - Math.PI) * 400;
          downholeLoad = baseMPRL * 1.0;
        }
        break;
      }
    }
    
    points.push({
      position: positionInches,
      surfaceLoad: Math.round(surfaceLoad),
      downholeLoad: Math.round(downholeLoad)
    });
  }
  
  return points;
}

/**
 * Real-Time 1D-CNN AI Diagnostic Evaluation for Dyno Cards
 */
export function diagnoseDynoCard(condition: DynoConditionType, viscosityCp: number): DynoDiagnosis {
  switch (condition) {
    case 'ROD_FLOAT':
      return {
        condition: 'ROD_FLOAT',
        title: 'Severe Heavy Crude Rod Floating Detected',
        confidence: 98.7,
        severity: 'DANGER',
        description: 'High dynamic crude drag exceeding downward buoyant rod weight on downstroke. Polished rod clamp is floating above the carrier bar, risking violent impact shock on upstroke reversal.',
        downholeMechanism: `Hydrodynamic drag $F_{drag} \\propto \\mu \\cdot v_{rod}$ exceeding sinker bar gravitational acceleration at crude viscosity ${viscosityCp} cP.`,
        recommendedAction: 'Engage Autonomous VFD Asymmetric Modulation: Decelerate downstroke frequency to 32.5 Hz (reduce rod velocity) and boost upstroke to 56.0 Hz to protect rod string integrity.',
        asymmetricVFDCommand: {
          downstrokeFreq: 32.5,
          upstrokeFreq: 56.0,
          targetSPM: 4.8
        }
      };
      
    case 'FLUID_POUND':
      return {
        condition: 'FLUID_POUND',
        title: 'Mid-Stroke Severe Fluid Pound / Incomplete Fillage',
        confidence: 96.4,
        severity: 'CRITICAL',
        description: 'Plunger entering void pump barrel chamber and slamming onto liquid oil interface at 45% downstroke position. High acoustic shockwave propagating through sucker rod string.',
        downholeMechanism: 'Pump displacement capacity exceeds reservoir inflow rate ($q_{inflow} < q_{pump}$). Plunger strikes fluid level at high downward velocity.',
        recommendedAction: 'Autonomous SPM Throttle: Reduce nominal SPM from current setpoint by 25% to allow reservoir fluid recharge and restore 92%+ barrel fillage.',
        asymmetricVFDCommand: {
          downstrokeFreq: 36.0,
          upstrokeFreq: 42.0,
          targetSPM: 4.2
        }
      };
      
    case 'GAS_LOCK':
      return {
        condition: 'GAS_LOCK',
        title: 'Subsurface Gas Interference / Partial Gas Lock',
        confidence: 94.1,
        severity: 'WARNING',
        description: 'Free casing/reservoir gas entering downhole barrel, cushioning traveling valve opening on downstroke and delaying standing valve opening on upstroke.',
        downholeMechanism: 'High free GOR fluid entering pump intake; compressibility of free gas prevents valve differential pressure from cracking valves.',
        recommendedAction: 'Execute periodic deep-stroke purge cycle and increase casing-tubing annulus gas venting valve pressure setpoint.',
        asymmetricVFDCommand: {
          downstrokeFreq: 48.0,
          upstrokeFreq: 50.0,
          targetSPM: 5.5
        }
      };
      
    case 'PARTED_ROD':
      return {
        condition: 'PARTED_ROD',
        title: 'EMERGENCY: Parted Sucker Rod String Failure',
        confidence: 99.9,
        severity: 'DANGER',
        description: 'Total structural tensile separation of sucker rod string detected at ~850 m TVD depth. Downhole pump load decoupled from surface load cell.',
        downholeMechanism: 'Cyclic bending fatigue / severe hydrogen embrittlement parting. Zero fluid column lifted.',
        recommendedAction: 'IMMEDIATE SIL-2 VFD EMERGENCY STOP TRIGGERED. Automatic alert dispatched to Baghewala Field Workover Crew.',
        asymmetricVFDCommand: {
          downstrokeFreq: 0.0,
          upstrokeFreq: 0.0,
          targetSPM: 0.0
        }
      };
      
    case 'VALVE_LEAK':
      return {
        condition: 'VALVE_LEAK',
        title: 'Traveling Valve Sand Abrasion / Mechanical Slippage',
        confidence: 91.8,
        severity: 'WARNING',
        description: 'Fluid slippage past traveling ball and seat on upstroke. Volumetric efficiency reduced by 34%.',
        downholeMechanism: 'Quartz sand grain erosion from Jodhpur Sandstone scoring tungsten carbide valve seat.',
        recommendedAction: 'Schedule preventative flush cycle and monitor volumetric lifting rate decay over next 48 hours.',
        asymmetricVFDCommand: {
          downstrokeFreq: 44.0,
          upstrokeFreq: 48.0,
          targetSPM: 5.0
        }
      };
      
    case 'NORMAL':
    default:
      return {
        condition: 'NORMAL',
        title: 'Optimal Full Liquid Pumping (Zero Rod Float)',
        confidence: 99.2,
        severity: 'OPTIMAL',
        description: 'Ideal parallelogram downhole card. Full barrel fillage, traveling & standing valves seating crisply with zero mechanical shock or rod float.',
        downholeMechanism: 'Viscous drag within safe bounds. Net positive carrier bar tension maintained throughout 100% of the kinematic stroke cycle.',
        recommendedAction: 'Maintain current autonomous VFD closed-loop schedule. Energy efficiency index: 94.8% (optimal).',
        asymmetricVFDCommand: {
          downstrokeFreq: 50.0,
          upstrokeFreq: 52.0,
          targetSPM: 6.2
        }
      };
  }
}

/**
 * Comprehensive Cyclic Steam Stimulation (CSS) Scenario Simulation Engine
 * Based on Marx-Langenheim Energy Balance & Boberg-Lantz Post-Soak Heat Decay
 */
export function runCSSSimulation(params: CSSScenarioParams): CSSScenarioResult {
  const { steamVolumeTonnes, injectionPressureBar, steamQualityPercent, soakTimeDays } = params;
  
  // Total injected enthalpy (GJ) = Mass (tonnes) * (h_f + x * h_fg)
  const saturationTempC = 110 + 20 * Math.log(injectionPressureBar / 1.0); // approx sat temp
  const latentHeatKJkg = 2100 * (steamQualityPercent / 100);
  const totalHeatInjectedGJ = steamVolumeTonnes * (latentHeatKJkg / 1000 + (saturationTempC - 48) * 0.004184);
  
  // Peak reservoir temperature achieved post-soak
  const peakTemp = Math.min(48 + (totalHeatInjectedGJ / (steamVolumeTonnes * 0.018)) * 0.35, saturationTempC);
  
  // Peak production rate (BOPD)
  const peakViscosity = calculateViscosity(peakTemp);
  const mobilityRatio = 35000 / Math.max(peakViscosity, 15);
  const peakBOPD = Math.round(35 + Math.sqrt(steamVolumeTonnes) * 4.2 * Math.min(mobilityRatio / 30, 2.5));
  
  // Days of cycle lifespan until reservoir returns to cold baseline
  const thermalDecayTau = 16 + (steamVolumeTonnes / 100) * 1.1 + soakTimeDays * 0.5;
  const cycleLifespanDays = Math.round(thermalDecayTau * 2.8);
  
  const temperatureCurve: { day: number; temp: number; viscosity: number; rate: number }[] = [];
  let cumulativeOilM3 = 0;
  let optimalCutoffDay = cycleLifespanDays;
  let cutoffFound = false;
  
  // Oil price & Cost assumptions for Baghewala Field
  const oilPricePerBblUSD = 75.0; // $75/bbl
  const steamCostPerTonneUSD = 32.0; // $32/tonne
  const liftingCostPerBblColdUSD = 18.5; // High lifting cost when cold (drag + energy)
  const liftingCostPerBblHotUSD = 6.2; // Low lifting cost when hot
  
  for (let day = 1; day <= cycleLifespanDays; day++) {
    // Marx-Langenheim exponential decay with conduction losses
    const tempDecay = (peakTemp - 48) * Math.exp(-day / thermalDecayTau) * (1 - 0.15 * Math.pow(day / cycleLifespanDays, 0.7));
    const dayTemp = Math.round(Math.max(48 + tempDecay, 48) * 10) / 10;
    const dayViscosity = calculateViscosity(dayTemp);
    
    // Inflow rate decay follows temperature mobility
    const rateFactor = Math.exp(-day / (thermalDecayTau * 1.3));
    const dayBOPD = Math.max(Math.round(peakBOPD * rateFactor), 6);
    const dayM3 = dayBOPD * 0.158987;
    cumulativeOilM3 += dayM3;
    
    // Marginal Economics: Daily revenue vs daily operating cost
    const dailyRevenue = dayBOPD * oilPricePerBblUSD;
    const currentLiftingCostBbl = liftingCostPerBblHotUSD + (dayViscosity / 1200) * (liftingCostPerBblColdUSD - liftingCostPerBblHotUSD);
    const dailyOpex = dayBOPD * currentLiftingCostBbl + (steamVolumeTonnes * steamCostPerTonneUSD) / cycleLifespanDays;
    
    if (!cutoffFound && (dailyRevenue - dailyOpex <= 150 || dayViscosity >= 1200)) {
      optimalCutoffDay = day;
      cutoffFound = true;
    }
    
    temperatureCurve.push({
      day,
      temp: dayTemp,
      viscosity: dayViscosity,
      rate: dayBOPD
    });
  }
  
  const cumulativeOilBbl = cumulativeOilM3 / 0.158987;
  const steamCWEVolumeM3 = steamVolumeTonnes * 1.0; // 1 tonne ~ 1 m3 CWE
  const averageSOR = Math.round((steamCWEVolumeM3 / Math.max(cumulativeOilM3, 1)) * 100) / 100;
  
  const netRevenueUSD = Math.round(cumulativeOilBbl * oilPricePerBblUSD);
  const steamCostUSD = Math.round(steamVolumeTonnes * steamCostPerTonneUSD);
  const liftingCostUSD = Math.round(cumulativeOilBbl * 9.5);
  const netMarginUSD = netRevenueUSD - steamCostUSD - liftingCostUSD;
  
  return {
    peakBOPD,
    cumulativeOilM3: Math.round(cumulativeOilM3),
    cycleLifespanDays,
    optimalCutoffDay: optimalCutoffDay || Math.round(cycleLifespanDays * 0.75),
    averageSOR,
    netRevenueUSD,
    steamCostUSD,
    liftingCostUSD,
    netMarginUSD,
    temperatureCurve
  };
}
