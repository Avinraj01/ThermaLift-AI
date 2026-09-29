import { NavigationTab } from '../types';

export interface RouteDefinition {
  tab: NavigationTab;
  path: string;
  title: string;
  name: string;
  aliases: string[];
}

export const ROUTES: RouteDefinition[] = [
  {
    tab: 'DASHBOARD',
    path: '/Field-Dashboard',
    title: 'ThermaLift AI — Field Dashboard',
    name: 'Field Dashboard',
    aliases: ['/', '/dashboard', '/field-dashboard']
  },
  {
    tab: 'COCKPIT',
    path: '/3D-Digital-Twin',
    title: 'ThermaLift AI — 3D Digital Twin',
    name: '3D Digital Twin',
    aliases: ['/3d-digital-twin', '/digital-twin', '/cockpit']
  },
  {
    tab: 'DYNO',
    path: '/Dyno-Studio',
    title: 'ThermaLift AI — Dyno Studio',
    name: 'Dyno Studio',
    aliases: ['/dyno-studio', '/dyno', '/dynamometer']
  },
  {
    tab: 'THERMAL',
    path: '/Thermal-CSS',
    title: 'ThermaLift AI — Thermal CSS',
    name: 'Thermal CSS',
    aliases: ['/thermal-css', '/thermal', '/css']
  },
  {
    tab: 'VFD',
    path: '/VFD-Governor',
    title: 'ThermaLift AI — VFD Governor',
    name: 'VFD Governor',
    aliases: ['/vfd-governor', '/vfd', '/governor']
  },
  {
    tab: 'ROI',
    path: '/Field-Economics',
    title: 'ThermaLift AI — Field Economics',
    name: 'Field Economics',
    aliases: ['/field-economics', '/roi', '/economics']
  },
  {
    tab: 'STANDARDS',
    path: '/QHSE-Standards',
    title: 'ThermaLift AI — QHSE & Standards',
    name: 'QHSE & Standards',
    aliases: ['/qhse-standards', '/standards', '/qhse', '/qhse-and-standards']
  }
];

export function getTabFromPath(pathname: string): NavigationTab {
  const cleanPath = pathname.trim().replace(/\/+$/, '') || '/';
  const lowerPath = cleanPath.toLowerCase();

  for (const route of ROUTES) {
    if (route.path.toLowerCase() === lowerPath) return route.tab;
    if (route.aliases.some(a => a.toLowerCase() === lowerPath)) return route.tab;
  }
  return 'DASHBOARD';
}

export function getPathForTab(tab: NavigationTab): string {
  if (tab === 'DASHBOARD') return '/';
  const route = ROUTES.find(r => r.tab === tab);
  return route ? route.path : '/';
}

export function getTitleForTab(tab: NavigationTab): string {
  const route = ROUTES.find(r => r.tab === tab);
  return route ? route.title : 'ThermaLift AI';
}

export function navigateToTab(tab: NavigationTab) {
  const newPath = getPathForTab(tab);
  if (window.location.pathname !== newPath) {
    window.history.pushState({ tab }, '', newPath);
  }
  document.title = getTitleForTab(tab);
}
