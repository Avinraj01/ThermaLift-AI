import { WellInfo, AuditLogEntry } from '../types';

export const BAGHEWALA_WELLS: WellInfo[] = [
  {
    id: 'BGW-07',
    name: 'Well BGW-07 (Main Producer)',
    field: 'Baghewala Heavy Oil Field, Rajasthan',
    formation: 'Jodhpur Sandstone (Cambrian)',
    apiGravity: 18.2,
    depthMeters: 1120,
    currentCycle: 4,
    status: 'ACTIVE - THERMAL CYCLE 4',
    soakDaysCompleted: 14,
    currentTemp: 82.4,
    currentViscosity: 480.0,
    currentSOR: 2.85,
    pprl: 18450,
    rodFloatRisk: 14,
  },
  {
    id: 'BGW-03',
    name: 'Well BGW-03 (North Flank)',
    field: 'Baghewala Heavy Oil Field, Rajasthan',
    formation: 'Jodhpur Sandstone (Cambrian)',
    apiGravity: 17.6,
    depthMeters: 1080,
    currentCycle: 5,
    status: 'WARNING - HIGH DRAG',
    soakDaysCompleted: 28,
    currentTemp: 68.1,
    currentViscosity: 1140.0,
    currentSOR: 3.42,
    pprl: 22100,
    rodFloatRisk: 78,
  },
  {
    id: 'BGW-12',
    name: 'Well BGW-12 (Central Pad)',
    field: 'Baghewala Heavy Oil Field, Rajasthan',
    formation: 'Jodhpur Sandstone (Cambrian)',
    apiGravity: 18.9,
    depthMeters: 1150,
    currentCycle: 3,
    status: 'PRODUCTION - STABLE',
    soakDaysCompleted: 8,
    currentTemp: 94.2,
    currentViscosity: 220.0,
    currentSOR: 2.45,
    pprl: 16800,
    rodFloatRisk: 8,
  },
  {
    id: 'BGW-19',
    name: 'Well BGW-19 (South Sector)',
    field: 'Baghewala Heavy Oil Field, Rajasthan',
    formation: 'Jodhpur Sandstone (Cambrian)',
    apiGravity: 17.2,
    depthMeters: 1190,
    currentCycle: 2,
    status: 'SOAKING - CYCLE 3',
    soakDaysCompleted: 3,
    currentTemp: 260.0,
    currentViscosity: 4.8,
    currentSOR: 2.10,
    pprl: 12200,
    rodFloatRisk: 2,
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-8842',
    timestamp: '2026-09-29 07:48:12',
    event: 'Asymmetric VFD Speed Modulation Dispatched',
    category: 'VFD_DISPATCH',
    prevSPM: 7.2,
    newSPM: 5.8,
    kwhSaved: 14.8,
    status: 'EXECUTED',
    hash: '0x9F4C2A1E8D7B09F6'
  },
  {
    id: 'LOG-8841',
    timestamp: '2026-09-29 07:15:00',
    event: 'Viscosity Warning: Downstroke Frequency Throttled to 34 Hz',
    category: 'VFD_DISPATCH',
    prevSPM: 8.0,
    newSPM: 6.5,
    kwhSaved: 22.4,
    status: 'VERIFIED',
    hash: '0x4E7A1C29B0D88E33'
  },
  {
    id: 'LOG-8840',
    timestamp: '2026-09-29 06:30:22',
    event: '1D-CNN Dyno Card Evaluation: Normal Full Pumping Verified',
    category: 'VFD_DISPATCH',
    prevSPM: 6.5,
    newSPM: 6.5,
    kwhSaved: 0.0,
    status: 'VERIFIED',
    hash: '0x18B9D034EFC82A11'
  },
  {
    id: 'LOG-8839',
    timestamp: '2026-09-29 05:00:19',
    event: 'Marx-Langenheim Subsurface Cooling Forecast: -1.2°C/day Updated',
    category: 'THERMAL_ALARM',
    prevSPM: 6.8,
    newSPM: 6.8,
    kwhSaved: 0.0,
    status: 'EXECUTED',
    hash: '0x88D2F31A79C410EE'
  },
  {
    id: 'LOG-8838',
    timestamp: '2026-09-29 03:12:45',
    event: 'Closed-Loop PID Fine-Tuning: Carrier Bar Tension Restored >900 lbs',
    category: 'VFD_DISPATCH',
    prevSPM: 6.2,
    newSPM: 6.8,
    kwhSaved: 18.2,
    status: 'EXECUTED',
    hash: '0x32A55F981C04DE67'
  }
];

export const COMPARISON_DATA = [
  {
    category: 'Subsurface Heat & Viscosity Tracking',
    manual: 'Static post-soak calendar rules (e.g. fixed 60-day cycle). No real-time cooling feedback.',
    scada: 'Surface temperature gauge only; no bottomhole viscosity or fluid mobility modeling.',
    thermalift: 'PINN + Marx-Langenheim physics twin predicting daily viscosity decay and critical float dates 5 days in advance.',
    impact: 'Zero premature or late re-steaming; optimizes cycle recovery by +18%.'
  },
  {
    category: 'Sucker Rod Kinematics & Speed Control',
    manual: 'Fixed motor pulley / constant SPM. Constant speed on downstroke and upstroke.',
    scada: 'Static VFD setpoint manually entered by field operator during daytime shifts.',
    thermalift: 'Autonomous Asymmetric Kinematics: Decelerates downstroke to prevent rod float, accelerates upstroke to maximize volume.',
    impact: 'Eliminates 100% of viscous rod-slap parted string incidents; saves 24% lifting kWh/bbl.'
  },
  {
    category: 'Downhole Dynamometer Diagnostics',
    manual: 'Periodic bi-weekly manual acoustic/load testing. Analysis delayed by 48–72 hours.',
    scada: 'Surface load-vs-position curves only; cannot distinguish fluid pound from rod float downhole.',
    thermalift: '100 Hz Gibbs 1D Wave Equation solver + 1D-CNN real-time classification of 12 downhole states.',
    impact: 'Diagnostic reaction latency reduced from 72 hours to sub-second autonomous intervention.'
  },
  {
    category: 'Rod Float & Viscous Drag Mitigation',
    manual: 'Unmitigated. Rod string separates from carrier bar, causing catastrophic fatigue parting.',
    scada: 'Alerts operator only after peak load spike or string failure has already occurred.',
    thermalift: 'Proactive carrier bar tension tracking; automatically matches downstroke speed to sinker bar sink rate.',
    impact: 'Triples mean time between workovers (MTBF extended from 4.2 to 18.5+ months).'
  },
  {
    category: 'CSS Economic Cycle Cut-Off',
    manual: 'Fixed production threshold or arbitrary operator gut-feel.',
    scada: 'Tracks cumulative barrels but disconnected from energy lifting costs or steam allocation.',
    thermalift: 'Dynamic Marginal Profit & SOR cut-off engine that alerts when lifting energy exceeds revenue.',
    impact: 'Prevents wasteful high-viscosity cold pumping; cuts Steam-Oil Ratio by up to 0.45 m³/m³.'
  },
  {
    category: 'Field Safety & SIL-2 Compliance',
    manual: 'Relies on physical shear pins and manual mechanical brake levers.',
    scada: 'Basic over-torque limit trips on surface motor drive.',
    thermalift: 'Hardware + Software SIL-2 Watchdog, automatic carrier bar slack detection, and tamper-proof cryptographic audit trail.',
    impact: 'Fail-safe protection against destructive surface/downhole mechanical blowouts.'
  }
];
