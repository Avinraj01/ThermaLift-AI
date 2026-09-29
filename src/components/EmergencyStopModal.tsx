import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, RotateCcw, X, ZapOff } from 'lucide-react';

interface EmergencyStopModalProps {
  isOpen: boolean;
  onConfirmStop: () => void;
  onResetStop: () => void;
  onClose: () => void;
  isStopped: boolean;
}

export const EmergencyStopModal: React.FC<EmergencyStopModalProps> = ({
  isOpen,
  onConfirmStop,
  onResetStop,
  onClose,
  isStopped
}) => {
  const [resetKey, setResetKey] = useState<string>('');
  const [resetError, setResetError] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetKey.trim() === 'RESET-SIL2' || resetKey.trim() === 'OIL-BGW') {
      onResetStop();
      setResetError(false);
      setResetKey('');
      onClose();
    } else {
      setResetError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-[#070B14] border-2 border-red-500 rounded-2xl w-full max-w-lg shadow-glow-rose overflow-hidden">
        
        {/* Header */}
        <div className="bg-red-950/60 p-4 border-b border-red-500/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600 text-white animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                SIL-2 VFD EMERGENCY SHUTDOWN (ESD)
              </h3>
              <p className="text-xs text-red-200 font-mono">
                Asset: Baghewala Field Well BGW-07
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-red-900/40 text-red-300 hover:bg-red-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!isStopped ? (
            <>
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs font-mono space-y-2">
                <div className="font-bold text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  CONFIRM IMMEDIATE SURFACE MOTOR DRIVE TRIP:
                </div>
                <p>
                  Triggering this Emergency Stop will immediately decouple the Variable Frequency Drive (VFD) inverter bridge, engage mechanical disc brakes, and lock the walking beam in safe park position within 250 milliseconds.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-[#0B111E] border border-slate-800 text-slate-300 text-xs font-mono hover:bg-[#10192A]"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => {
                    onConfirmStop();
                  }}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold shadow-glow-rose flex items-center gap-2"
                >
                  <ZapOff className="w-4 h-4" />
                  EXECUTE HARDWARE E-STOP
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 rounded-xl bg-[#0B111E] border border-red-500/50 text-xs font-mono space-y-3">
                <div className="text-red-400 font-bold flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping inline-block" />
                  VFD DRIVE CURRENTLY TRIPPED & LOCKED
                </div>
                <p className="text-slate-300">
                  Surface beam pump is stationary. Motor frequency: 0.0 Hz. Sucker rod string tension locked in resting state.
                </p>
                <div className="p-2.5 rounded bg-[#070B14] border border-slate-800 text-slate-400 text-[11px]">
                  Authorized Operator Reset Authorization Required. Enter passkey: <code className="text-amber-400">RESET-SIL2</code> or <code className="text-amber-400">OIL-BGW</code>
                </div>
              </div>

              <form onSubmit={handleResetSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    ENTER SAFETY OVERRIDE KEY:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter RESET-SIL2"
                    value={resetKey}
                    onChange={(e) => {
                      setResetKey(e.target.value);
                      setResetError(false);
                    }}
                    className="w-full bg-[#0B111E] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-red-400"
                  />
                  {resetError && (
                    <span className="text-[11px] font-mono text-red-400 mt-1 block">
                      Invalid authorization code. Enter "RESET-SIL2".
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-[#0B111E] border border-slate-800 text-slate-300 text-xs font-mono"
                  >
                    CLOSE WINDOW
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono text-xs font-black shadow-glow-emerald flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    AUTHORIZE SAFETY RESTART
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
