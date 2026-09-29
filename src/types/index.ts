export type WellId = 'BGW-07' | 'BGW-03' | 'BGW-12' | 'BGW-19';

export interface WellInfo {
  id: WellId;
  name: string;
  field: string;
  formation: string;
  apiGravity: number;
  depthMeters: number;
  currentCycle: number;
  status: 'ACTIVE - THERMAL CYCLE 4' | 'SOAKING - CYCLE 3' | 'PRODUCTION - STABLE' | 'WARNING - HIGH DRAG';
  soakDaysCompleted: number;
  currentTemp: number; // °C
  currentViscosity: number; // cP
  currentSOR: number; // m3/m3
  pprl: number; // lbs
  rodFloatRisk: number; // %
}

export interface TelemetryKPIs {
  temperature: number; // °C
  tempRate: number; // °C/day
  viscosity: number; // cP
  daysToCriticalViscosity: number; // days
  sor: number; // m3/m3
  sorTargetDiff: number; // %
  pprl: number; // lbs
  mprl: number; // lbs
  pprlLimit: number; // lbs
  rodFloatRiskIndex: number; // %
  pumpFillage: number; // %
  productionRate: number; // BOPD
  liftingPowerKW: number; // kW
  motorFrequency: number; // Hz
}

export interface PumpjackParams {
  spm: number; // Strokes Per Minute (3.0 - 12.0)
  strokeLength: number; // Inches (64 - 144)
  rodDiameter: number; // Inches (e.g. 1.0, 1.125)
  fluidLevelMeters: number; // Depth to fluid
  dampingCoefficient: number;
}

export type DynoConditionType = 
  | 'NORMAL'
  | 'ROD_FLOAT'
  | 'FLUID_POUND'
  | 'GAS_LOCK'
  | 'PARTED_ROD'
  | 'VALVE_LEAK';

export interface DynoCardPoint {
  position: number; // Inches (0 to strokeLength)
  surfaceLoad: number; // lbs
  downholeLoad: number; // lbs
}

export interface DynoDiagnosis {
  condition: DynoConditionType;
  title: string;
  confidence: number; // % (e.g. 98.4%)
  severity: 'OPTIMAL' | 'WARNING' | 'CRITICAL' | 'DANGER';
  description: string;
  downholeMechanism: string;
  recommendedAction: string;
  asymmetricVFDCommand: {
    downstrokeFreq: number; // Hz
    upstrokeFreq: number; // Hz
    targetSPM: number;
  };
}

export interface CSSScenarioParams {
  steamVolumeTonnes: number; // Metric tonnes (500 - 2500)
  injectionPressureBar: number; // bar (80 - 140)
  steamQualityPercent: number; // % (60 - 95%)
  soakTimeDays: number; // days (2 - 10)
}

export interface CSSScenarioResult {
  peakBOPD: number;
  cumulativeOilM3: number;
  cycleLifespanDays: number;
  optimalCutoffDay: number;
  averageSOR: number;
  netRevenueUSD: number;
  steamCostUSD: number;
  liftingCostUSD: number;
  netMarginUSD: number;
  temperatureCurve: { day: number; temp: number; viscosity: number; rate: number }[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  event: string;
  category: 'VFD_DISPATCH' | 'SAFETY_INTERLOCK' | 'THERMAL_ALARM' | 'CYCLE_CUTOFF';
  prevSPM: number;
  newSPM: number;
  kwhSaved: number;
  status: 'EXECUTED' | 'VERIFIED' | 'OVERRIDDEN';
  hash: string;
}

export type ControlMode = 'ADVISORY' | 'AUTONOMOUS';

export type NavigationTab = 'DASHBOARD' | 'COCKPIT' | 'DYNO' | 'THERMAL' | 'VFD' | 'ROI' | 'STANDARDS';
