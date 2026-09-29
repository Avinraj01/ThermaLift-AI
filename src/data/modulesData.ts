import { Layers, Activity, Flame, Zap, BarChart3, Award } from 'lucide-react';
import { NavigationTab } from '../types';

export interface DedicatedModuleMeta {
  id: NavigationTab;
  num: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: any;
  color: string;
}

export const DEDICATED_MODULES: DedicatedModuleMeta[] = [
  {
    id: 'COCKPIT',
    num: '01',
    title: '3D Digital Twin',
    subtitle: 'Subsurface Wellbore & Surface Unit Twin',
    desc: 'Real-time Three.js spatial visualization of 1,120m wellbore, dynamic sucker rod string stress, fluid levels, and live kinematic motion.',
    icon: Layers,
    color: '#00D2FF'
  },
  {
    id: 'DYNO',
    num: '02',
    title: 'Dyno Studio',
    subtitle: 'Gibbs Wave Downhole Dynamometer Studio',
    desc: '100 Hz Gibbs 1D wave equation solver translating surface load telemetry into true downhole pump cards with 1D-CNN AI classification.',
    icon: Activity,
    color: '#FF6B00'
  },
  {
    id: 'THERMAL',
    num: '03',
    title: 'Thermal CSS',
    subtitle: 'Subsurface Thermodynamics & Viscosity Decay',
    desc: 'Marx-Langenheim heat dissipation engine coupled with Walther ASTM D341 equation to predict oil mobility and optimize steam injection cycles.',
    icon: Flame,
    color: '#FF8C00'
  },
  {
    id: 'VFD',
    num: '04',
    title: 'VFD Governor',
    subtitle: 'Autonomous Closed-Loop Speed & Float Governor',
    desc: 'Asymmetric speed scheduler (32.5 Hz downstroke / 56 Hz upstroke) eliminating rod float, reducing power consumption by 24.2%.',
    icon: Zap,
    color: '#10B981'
  },
  {
    id: 'ROI',
    num: '05',
    title: 'Field Economics',
    subtitle: 'Field ROI, OPEX Energy & Payback Modeling',
    desc: 'Dynamic economic model tracking lifting power kWh/bbl reduction, pump wear extension, and optimal CSS cycle cutoff timing.',
    icon: BarChart3,
    color: '#F59E0B'
  },
  {
    id: 'STANDARDS',
    num: '06',
    title: 'QHSE & Standards',
    subtitle: 'Industrial Standards & SIH 26120 Compliance',
    desc: 'DGMS mine safety guidelines, API RP 11L standards compliance, SIL-2 emergency interlocks, and carbon abatement tracking.',
    icon: Award,
    color: '#A78BFA'
  }
];
