import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  Award 
} from 'lucide-react';
import { COMPARISON_DATA } from '../data/mockData';

export const ComparisonMatrix: React.FC = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  return (
    <section className="bg-[#0B111E]/95 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-5 lg:p-6 shadow-2xl space-y-5">
      
      {/* Matrix Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#10192A] border border-slate-700 text-[#00E5FF] shadow-glow-cyan">
            <Award className="w-5 h-5 text-[#00E5FF]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide font-display flex items-center gap-2">
              COMPREHENSIVE BENCHMARK: EXISTING SYSTEMS VS THERMALIFT AI
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#10192A] text-[#00E5FF] border border-[#00E5FF]/40 font-bold">
                SIH RUBRIC BENCHMARK
              </span>
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Direct technical evaluation against traditional oilfield practices and isolated standalone SCADA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-[#070B14] px-3 py-1.5 rounded-lg border border-slate-800">
          <Sparkles className="w-3.5 h-3.5" />
          <span>+270% MTBF • -24.2% kWh/bbl</span>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="bg-[#070B14] border-b border-slate-800 text-slate-300">
              <th className="p-3.5 font-bold text-white w-1/4">EVALUATION DIMENSION</th>
              <th className="p-3.5 font-bold text-slate-500 w-1/4">TRADITIONAL MANUAL (EXCEL)</th>
              <th className="p-3.5 font-bold text-amber-300/80 w-1/4">ISOLATED FIELD SCADA</th>
              <th className="p-3.5 font-bold text-[#00E5FF] w-1/4 bg-[#10192A]/50">
                <span className="flex items-center gap-1.5 text-white">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                  THERMALIFT AI DIGITAL TWIN
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 bg-[#050811]">
            {COMPARISON_DATA.map((row, idx) => (
              <tr 
                key={idx}
                className="hover:bg-[#10192A]/40 transition-colors cursor-pointer"
                onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
              >
                <td className="p-3.5 font-semibold text-slate-200 align-top">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
                    {row.category}
                  </div>
                </td>
                
                <td className="p-3.5 text-slate-500 align-top leading-relaxed">
                  <div className="flex items-start gap-1.5">
                    <XCircle className="w-3.5 h-3.5 text-red-400/80 flex-shrink-0 mt-0.5" />
                    <span>{row.manual}</span>
                  </div>
                </td>

                <td className="p-3.5 text-amber-200/80 align-top leading-relaxed">
                  <div className="flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>{row.scada}</span>
                  </div>
                </td>

                <td className="p-3.5 text-slate-100 bg-[#10192A]/30 align-top leading-relaxed font-sans">
                  <div className="flex items-start gap-1.5 font-mono text-xs text-emerald-300 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{row.thermalift}</span>
                  </div>
                  <div className="mt-1.5 text-[11px] font-mono text-cyan-300/90 bg-[#0B111E] px-2 py-1 rounded border border-slate-700/80">
                    Impact: {row.impact}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </section>
  );
};
