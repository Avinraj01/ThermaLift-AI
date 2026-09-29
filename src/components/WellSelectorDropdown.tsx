import React, { useState, useRef, useEffect } from 'react';
import { Radio, ChevronDown, Check, Thermometer, Gauge, Layers, Droplet } from 'lucide-react';
import { WellInfo } from '../types';
import { BAGHEWALA_WELLS } from '../data/mockData';

interface WellSelectorDropdownProps {
  currentWell: WellInfo;
  onSelectWell: (well: WellInfo) => void;
  variant?: 'header' | 'cockpit';
}

export const WellSelectorDropdown: React.FC<WellSelectorDropdownProps> = ({
  currentWell,
  onSelectWell,
  variant = 'header'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const getStatusColor = (status: string) => {
    if (status.includes('WARNING') || status.includes('DRAG')) {
      return {
        bg: 'bg-rose-500/20',
        text: 'text-rose-400',
        border: 'border-rose-500/50',
        dot: 'bg-rose-500'
      };
    }
    if (status.includes('SOAKING')) {
      return {
        bg: 'bg-amber-500/20',
        text: 'text-amber-300',
        border: 'border-amber-500/50',
        dot: 'bg-amber-400'
      };
    }
    return {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-300',
      border: 'border-emerald-500/50',
      dot: 'bg-emerald-400'
    };
  };

  const activeStatus = getStatusColor(currentWell.status);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2.5 rounded-lg font-mono transition-all border shadow-sm ${
          variant === 'cockpit'
            ? 'px-3.5 py-2 bg-[#0E1524] hover:bg-[#152136] border-slate-700/80 hover:border-[#FF9500] text-white text-xs'
            : 'px-3 py-1.5 bg-[#0D1422] hover:bg-[#141E30] border-slate-700 hover:border-[#FF9500] text-white text-xs'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${activeStatus.dot} animate-pulse`} />
          <Radio className="w-3.5 h-3.5 text-akt-emerald" />
        </span>

        <div className="flex items-center gap-1.5 text-left">
          <span className="font-bold text-white tracking-wide text-xs">{currentWell.id}</span>
          <span className="text-slate-500 text-[11px]">|</span>
          <span className="text-slate-200 text-[11px] font-medium hidden sm:inline max-w-[160px] truncate">
            {currentWell.name.replace(/Well BGW-\d+\s*/, '').replace(/[()]/g, '') || currentWell.name}
          </span>
        </div>

        <ChevronDown 
          className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#FF9500]' : ''}`} 
        />
      </button>

      {/* Expanded 100% Solid Non-Transparent Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute left-0 mt-2 w-[360px] sm:w-[420px] rounded-xl border-2 border-slate-600 shadow-[0_24px_60px_rgba(0,0,0,0.95)] overflow-hidden animate-slideUp"
          style={{ backgroundColor: '#090E1A', opacity: 1, zIndex: 9999 }}
          role="listbox"
        >
          {/* Header with High-Contrast Prominent Badges */}
          <div 
            className="px-4 py-3 border-b border-slate-700/90 flex items-center justify-between font-mono"
            style={{ backgroundColor: '#060A13' }}
          >
            <span className="font-bold uppercase tracking-wider text-white flex items-center gap-2 text-xs">
              <Layers className="w-4 h-4 text-[#FF9500]" />
              BAGHEWALA ASSET WELLS
            </span>
            <span className="text-[#FF9500] bg-[#FF9500]/15 border border-[#FF9500]/40 px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wide">
              {BAGHEWALA_WELLS.length} ACTIVE WELLS MONITORED
            </span>
          </div>

          {/* Solid Well Items List */}
          <div 
            className="max-h-[380px] overflow-y-auto p-2 space-y-1.5"
            style={{ backgroundColor: '#090E1A' }}
          >
            {BAGHEWALA_WELLS.map((well) => {
              const isSelected = well.id === currentWell.id;
              const statusColors = getStatusColor(well.status);

              return (
                <div
                  key={well.id}
                  onClick={() => {
                    onSelectWell(well);
                    setIsOpen(false);
                  }}
                  style={{ backgroundColor: isSelected ? '#15233B' : '#0E1729', opacity: 1 }}
                  className={`p-3.5 rounded-lg cursor-pointer transition-all border text-left ${
                    isSelected
                      ? 'border-[#FF9500] shadow-md ring-1 ring-[#FF9500]/40'
                      : 'border-slate-800 hover:border-slate-600 hover:!bg-[#121E36]'
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  {/* Top Line: ID + Name + Status Pill + Checkmark */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${statusColors.dot} ${isSelected ? 'animate-ping' : ''}`} />
                      <span className={`font-mono text-sm font-black tracking-wide ${isSelected ? 'text-[#FF9500]' : 'text-white'}`}>
                        {well.id}
                      </span>
                      <span className="text-xs font-sans text-slate-100 font-bold truncate max-w-[150px]">
                        {well.name.replace(/Well BGW-\d+\s*/, '')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}>
                        {well.status.split(' - ')[0]}
                      </span>

                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[#FF9500]/25 flex items-center justify-center text-[#FF9500]">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {/* Formation & Depth */}
                  <div className="text-[11px] font-mono text-slate-300 mt-1.5 flex items-center gap-2">
                    <span className="text-white font-medium">{well.formation.split(' (')[0]}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-200 font-semibold">{well.depthMeters.toLocaleString()}m TVD</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-amber-400 font-bold">{well.apiGravity}° API</span>
                  </div>

                  {/* Telemetry Metrics Grid (Solid Background) */}
                  <div 
                    className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-700/60 text-[10px] font-mono rounded px-1"
                    style={{ backgroundColor: isSelected ? '#121E33' : '#0B1220' }}
                  >
                    <div className="flex items-center gap-1.5 text-slate-200 py-1">
                      <Thermometer className="w-3.5 h-3.5 text-[#FF9500]" />
                      <span>{well.currentTemp}°C</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-200 py-1">
                      <Gauge className="w-3.5 h-3.5 text-akt-cyan" />
                      <span>{well.currentViscosity} cP</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-200 py-1">
                      <Droplet className="w-3.5 h-3.5 text-emerald-400" />
                      <span>SOR {well.currentSOR}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div 
            className="px-4 py-2 border-t border-slate-700/80 text-[10px] font-mono text-slate-400 text-center font-medium"
            style={{ backgroundColor: '#060A13' }}
          >
            Click to dispatch SCADA telemetry & recalculate 1D Gibbs wave physics
          </div>
        </div>
      )}
    </div>
  );
};
