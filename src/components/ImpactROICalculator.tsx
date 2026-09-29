import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Zap, 
  Clock, 
  Sliders, 
  Sparkles 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell 
} from 'recharts';

export const ImpactROICalculator: React.FC = () => {
  const [numWells, setNumWells] = useState<number>(12);
  const [avgBOPD, setAvgBOPD] = useState<number>(85);
  const [workoverCostUSD, setWorkoverCostUSD] = useState<number>(65000);
  const [electricityTariffUSD, setElectricityTariffUSD] = useState<number>(0.12);

  const roiCalculations = useMemo(() => {
    const annualBarrelsPerWell = avgBOPD * 365;
    const totalAnnualBarrels = annualBarrelsPerWell * numWells;
    
    // Workovers prevented: ~1.75 per well per year
    const workoversAvoided = Math.round(numWells * 1.75 * 10) / 10;
    const workoverSavingsUSD = Math.round(workoversAvoided * workoverCostUSD);

    // Energy savings: 4.4 kWh/bbl saved
    const totalKWhSaved = Math.round(totalAnnualBarrels * 4.4);
    const energySavingsUSD = Math.round(totalKWhSaved * electricityTariffUSD);

    const totalSavingsUSD = workoverSavingsUSD + energySavingsUSD;
    const totalCapexUSD = numWells * 18000;
    const paybackMonths = Math.round((totalCapexUSD / (totalSavingsUSD / 12)) * 10) / 10;

    return {
      totalAnnualBarrels,
      workoversAvoided,
      workoverSavingsUSD,
      totalKWhSaved,
      energySavingsUSD,
      totalSavingsUSD,
      totalCapexUSD,
      paybackMonths: Math.max(paybackMonths, 1.2)
    };
  }, [numWells, avgBOPD, workoverCostUSD, electricityTariffUSD]);

  const latencyData = [
    { name: 'Traditional Manual', latencyHours: 72, fill: '#EF4444' },
    { name: 'Isolated SCADA', latencyHours: 18, fill: '#F59E0B' },
    { name: 'ThermaLift AI', latencyHours: 0.05, fill: '#10B981' },
  ];

  const energyData = [
    { name: 'Traditional Manual', kwhPerBbl: 18.2, fill: '#EF4444' },
    { name: 'Isolated SCADA', kwhPerBbl: 17.4, fill: '#F59E0B' },
    { name: 'ThermaLift AI', kwhPerBbl: 13.8, fill: '#00E5FF' },
  ];

  return (
    <section className="bg-[#0B111E]/95 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-5 lg:p-6 shadow-2xl space-y-5">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#10192A] border border-slate-700 text-emerald-400 shadow-glow-emerald">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide font-display flex items-center gap-2">
              IMPACT ANALYTICS & FIELD ROI ESTIMATOR
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#10192A] text-emerald-400 border border-emerald-500/40 font-bold">
                OIL FIELD SCALE
              </span>
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Quantifiable economic benefits: avoided parted rod string workovers, lifting energy reduction, and payback timeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#070B14] px-3.5 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Payback: <strong>{roiCalculations.paybackMonths} Months</strong></span>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Chart 1: Diagnostic Reaction Latency */}
        <div className="bg-[#070B14] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
              DIAGNOSTIC REACTION LATENCY (HOURS)
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">99.9% Faster</span>
          </div>

          <div className="h-[180px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latencyData} layout="vertical" margin={{ top: 5, right: 25, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#10192A" horizontal={false} />
                <XAxis type="number" stroke="#475569" unit="h" tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis type="category" dataKey="name" stroke="#475569" width={110} tick={{ fill: '#CBD5E1', fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B111E', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  formatter={(val) => [`${val} Hours`, 'Reaction Latency']}
                />
                <Bar dataKey="latencyHours" radius={[0, 4, 4, 0]}>
                  {latencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800 flex justify-between">
            <span>Manual: 72 hrs (Post-rod part)</span>
            <span className="text-emerald-400 font-bold">ThermaLift AI: Instant Edge Loop</span>
          </div>
        </div>

        {/* Chart 2: Lifting Energy Consumption */}
        <div className="bg-[#070B14] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              LIFTING ENERGY INTENSITY (kWh / BARREL)
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">-24.2% Energy</span>
          </div>

          <div className="h-[180px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={energyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#10192A" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" tick={{ fill: '#CBD5E1', fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis stroke="#475569" unit=" kWh" domain={[0, 22]} tick={{ fill: '#64748B', fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B111E', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  formatter={(val) => [`${val} kWh/bbl`, 'Energy Intensity']}
                />
                <Bar dataKey="kwhPerBbl" radius={[4, 4, 0, 0]}>
                  {energyData.map((entry, index) => (
                    <Cell key={`cell-e-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800 flex justify-between">
            <span>Saves 4.4 kWh per produced barrel</span>
            <span className="text-cyan-400 font-bold">Asymmetric VFD Boost</span>
          </div>
        </div>

      </div>

      {/* Interactive Field Scale ROI Calculator */}
      <div className="bg-[#070B14] border border-slate-800 rounded-xl p-4 lg:p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-[#00E5FF]" />
            CUSTOMIZE BAGHEWALA FIELD ASSET PARAMETERS FOR ROI
          </h3>
          <span className="text-[10px] font-mono text-slate-500">OIL INDIA LIMITED ASSET MODEL</span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {/* Wells Slider */}
          <div className="p-3 bg-[#0B111E] rounded-lg border border-slate-800">
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Active Heavy Wells:</span>
              <span className="font-bold text-white">{numWells} Wells</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={numWells}
              onChange={(e) => setNumWells(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-[#00E5FF]"
            />
          </div>

          {/* Average BOPD Slider */}
          <div className="p-3 bg-[#0B111E] rounded-lg border border-slate-800">
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Avg BOPD / Well:</span>
              <span className="font-bold text-[#FF6B00]">{avgBOPD} BOPD</span>
            </div>
            <input
              type="range"
              min="20"
              max="250"
              step="5"
              value={avgBOPD}
              onChange={(e) => setAvgBOPD(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-[#FF6B00]"
            />
          </div>

          {/* Workover Cost Slider */}
          <div className="p-3 bg-[#0B111E] rounded-lg border border-slate-800">
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Avg Workover Cost:</span>
              <span className="font-bold text-amber-400">${(workoverCostUSD / 1000).toFixed(0)}k</span>
            </div>
            <input
              type="range"
              min="30000"
              max="120000"
              step="5000"
              value={workoverCostUSD}
              onChange={(e) => setWorkoverCostUSD(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Electricity Tariff Slider */}
          <div className="p-3 bg-[#0B111E] rounded-lg border border-slate-800">
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Electricity Tariff:</span>
              <span className="font-bold text-emerald-400">${electricityTariffUSD.toFixed(2)}/kWh</span>
            </div>
            <input
              type="range"
              min="0.06"
              max="0.25"
              step="0.01"
              value={electricityTariffUSD}
              onChange={(e) => setElectricityTariffUSD(parseFloat(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-400"
            />
          </div>
        </div>

        {/* Dynamic ROI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0B111E] border border-slate-800 text-center">
            <div className="text-[10px] font-mono text-slate-400">TOTAL ANNUAL SAVINGS</div>
            <div className="text-xl lg:text-2xl font-black font-display text-emerald-400 mt-1">
              ${(roiCalculations.totalSavingsUSD / 1000000).toFixed(2)}M / yr
            </div>
            <div className="text-[10px] font-mono text-emerald-300 mt-0.5">Across {numWells} Baghewala Wells</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0B111E] border border-slate-800 text-center">
            <div className="text-[10px] font-mono text-slate-400">WORKOVERS AVOIDED</div>
            <div className="text-xl lg:text-2xl font-black font-display text-white mt-1">
              {roiCalculations.workoversAvoided} Events
            </div>
            <div className="text-[10px] font-mono text-amber-400 mt-0.5">
              ${(roiCalculations.workoverSavingsUSD / 1000).toFixed(0)}k Capital Saved
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0B111E] border border-slate-800 text-center">
            <div className="text-[10px] font-mono text-slate-400">ENERGY CONSERVED</div>
            <div className="text-xl lg:text-2xl font-black font-display text-[#00E5FF] mt-1">
              {(roiCalculations.totalKWhSaved / 1000000).toFixed(2)} GWh
            </div>
            <div className="text-[10px] font-mono text-cyan-300 mt-0.5">
              ${(roiCalculations.energySavingsUSD / 1000).toFixed(0)}k OPEX Saved
            </div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 to-teal-950/40 border border-emerald-500/50 text-center shadow-glow-emerald">
            <div className="text-[10px] font-mono text-emerald-300">ESTIMATED PAYBACK</div>
            <div className="text-xl lg:text-2xl font-black font-display text-emerald-300 mt-1">
              {roiCalculations.paybackMonths} Months
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">Capex: ${(roiCalculations.totalCapexUSD / 1000).toFixed(0)}k</div>
          </div>
        </div>

      </div>

    </section>
  );
};
