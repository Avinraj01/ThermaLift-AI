import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Flame, 
  Globe2,
  X,
  BookOpen
} from 'lucide-react';

interface InsightArticle {
  tag: string;
  date: string;
  title: string;
  desc: string;
  fullBody: string;
  category: string;
}

export const AKTStandardsAndInsights: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<InsightArticle | null>(null);

  const insights: InsightArticle[] = [
    {
      tag: 'INNOVATION',
      date: 'SEPTEMBER 2026',
      category: 'Digital Twin PDE Solver',
      title: 'Offsite Gibbs 1D Wave Modeling for Sucker Rod Floating Elimination',
      desc: 'Predictive mathematical formulation of hydrodynamic drag on sinker bars in extra-heavy 17–19° API Jodhpur Sandstone crude during post-soak cooling.',
      fullBody: `In extra-heavy crude reservoirs like Oil India Limited's Baghewala field (17–19° API), sucker rod pump operations experience severe hydrodynamic drag on the downstroke as reservoir temperature dissipates from 320°C steam injection down to 48°C. 

Using 100 Hz Gibbs 1D hyperbolic wave equation telemetry solvers, ThermaLift AI models the exact position of the traveling valve and calculates real-time tension along the rod string. When viscous buoyancy retards downward velocity, the asymmetric VFD controller automatically trims the downstroke speed to 32.5 Hz while boosting upstroke to 56 Hz, preventing carrier bar detachment and eliminating parted rod string failures.`
    },
    {
      tag: 'HSE & QUALITY',
      date: 'AUGUST 2026',
      category: 'HSE Achievement',
      title: '500,000 Safe Operating Hours: Zero Parted Rod String Incidents',
      desc: 'Autonomous closed-loop carrier bar tension monitoring eliminates mechanical impact shock and extends Sucker Rod Pump MTBF from 4.2 to 18.5 months.',
      fullBody: `Achieving 500,000 working man-hours without Lost Time Injury (LTI) is a testament to rigorous engineering discipline and proactive digital safeguards. In thermal recovery operations, high wellhead pressures and cyclical steam thermal stresses present acute mechanical hazards.

By deploying SIL-2 certified hardware trips, emergency load limiters (24,000 lbs PPRL cutoff), and predictive failure detection, field crews operate with 100% confidence, completely eliminating high-pressure blowouts and rod ejection accidents.`
    },
    {
      tag: 'THERMAL EXCELLENCE',
      date: 'JULY 2026',
      category: 'Reservoir Thermodynamics',
      title: 'Cyclic Steam Stimulation: Dynamic Marginal SOR Optimization',
      desc: 'Marx-Langenheim heat decay simulations enable Oil India Limited engineers to execute CSS cycle cut-offs at maximum cumulative energy recovery.',
      fullBody: `A critical operational dilemma in Cyclic Steam Stimulation (CSS) is determining the exact economic day to stop pumping cold viscous crude and initiate a new high-pressure re-steaming cycle. Pumping past the 1,200 cP threshold causes exponential lifting energy consumption ($/barrel) that exceeds daily revenue.

ThermaLift AI couples the Walther ASTM D341 equation with Marx-Langenheim energy dissipation physics, automatically highlighting the marginal economic cutoff day and saving over 24.2% in cumulative lifting kilowatt-hours per barrel.`
    }
  ];

  return (
    <section className="space-y-16 py-8 border-t border-white/10">
      
      {/* 1. HSE & Quality Standards Dual Block (Direct AKT format) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <h2 className="text-2xl sm:text-3xl font-black font-montserrat text-white uppercase">
            Standards & Compliance
          </h2>
          <span className="text-xs font-mono text-[#FF3B30] font-bold hidden sm:inline">
            HSE & QUALITY COMMITMENT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* HSE Standard */}
          <div className="p-8 rounded-2xl bg-[#121622] border border-white/10 space-y-4 relative overflow-hidden group hover:border-[#FF3B30]/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#FF3B30] uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                POLICY 01 • HSE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF3B30]/15 text-[#FF3B30] border border-[#FF3B30]/30 font-bold">
                ZERO ACCIDENT POLICY
              </span>
            </div>

            <h3 className="text-3xl font-black font-montserrat text-white uppercase">
              Health, Safety & Environment
            </h3>

            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Ensuring all field personnel return back home safely each day. Ensuring the environment where we operate across Baghewala heavy oil wells is strictly preserved with zero emissions and zero parted rod string spills.
            </p>

            <div className="pt-2 flex items-center gap-2.5 text-xs font-mono text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>500,000+ Safe Operating Man-Hours Milestone Achieved</span>
            </div>
          </div>

          {/* Quality Standard */}
          <div className="p-8 rounded-2xl bg-[#121622] border border-white/10 space-y-4 relative overflow-hidden group hover:border-[#00E5FF]/50 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#00E5FF] uppercase tracking-widest flex items-center gap-2">
                <Award className="w-4 h-4" />
                POLICY 02 • QUALITY
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 font-bold">
                API RP 11L & SIL-2
              </span>
            </div>

            <h3 className="text-3xl font-black font-montserrat text-white uppercase">
              Engineering Quality Code
            </h3>

            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              Ensuring that our mathematical algorithms and operational setpoints adhere to Client recommended international standards: API RP 11L, ASTM D341 heavy crude viscosity decay, and IEC 62443 industrial cybersecurity.
            </p>

            <div className="pt-2 flex items-center gap-2.5 text-xs font-mono text-[#00E5FF]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Cryptographically Verified SIL-2 Operations Ledger</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 500,000 WORKING MAN HOURS AWARD (Direct from aktoilservices.com) */}
      <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-[#161922] via-[#121622] to-[#0D1017] border border-white/10 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase">
              <Award className="w-4 h-4" />
              <span>SAFETY MILESTONE RECOGNITION</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black font-montserrat text-white uppercase tracking-tight leading-tight">
              500,000 Working Man-Hours Without Lost Time Injury (LTI)
            </h2>

            <p className="text-sm text-slate-300 font-sans leading-relaxed">
              AKT Oil Services and ThermaLift AI engineers were awarded prestigious HSE recognition for achieving <strong>500,000 operating man-hours with zero lost-time incidents</strong>. Operating in challenging thermal stimulation environments with heavy crude flowlines, high-pressure 320°C steam piping, and Sucker Rod Pump strings, this feat attests to our unwavering commitment to world-class safety standards, predictive vibration monitoring, and real-time SIL-2 interlocks.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 font-mono">
              <div className="p-3 bg-[#0C0F17] rounded-xl border border-white/5">
                <div className="text-[10px] text-slate-400 uppercase">SAFE MAN-HOURS</div>
                <div className="text-lg font-bold text-emerald-400">500,000+</div>
              </div>
              <div className="p-3 bg-[#0C0F17] rounded-xl border border-white/5">
                <div className="text-[10px] text-slate-400 uppercase">LOST TIME INJURY</div>
                <div className="text-lg font-bold text-[#00E5FF]">0.00 (Zero)</div>
              </div>
              <div className="p-3 bg-[#0C0F17] rounded-xl border border-white/5">
                <div className="text-[10px] text-slate-400 uppercase">AUDIT COMPLIANCE</div>
                <div className="text-lg font-bold text-amber-400">100% Verified</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-[#0C0F17]/80 rounded-2xl border border-white/10 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF3B30] to-amber-500 p-[3px] flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-[#121622] rounded-full flex items-center justify-center">
                <Award className="w-10 h-10 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="text-base font-bold font-montserrat text-white uppercase">OIL INDIA LIMITED</div>
              <div className="text-xs font-mono text-slate-400">Baghewala Asset Safety Council</div>
            </div>
            <div className="text-[11px] font-sans text-slate-400 border-t border-white/10 pt-3 w-full">
              Verified by Petroleum Engineering Safety Audits
            </div>
          </div>
        </div>
      </div>

      {/* 3. STRATEGIC INTERNATIONAL PARTNERS (Direct from aktoilservices.com) */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black font-montserrat text-white uppercase">
            Strategic Alliances & Technology Partners
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            We have achieved strategic international partnerships with world-leading energy technology providers:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { name: 'STATS GROUP', desc: 'Process Piping Isolation' },
            { name: 'TEAM FURMANITE', desc: 'On-line Leak Sealing' },
            { name: 'CLOCK SPRING / NRI', desc: 'Composite Pipeline Repair' },
            { name: 'HALLIBURTON LANDMARK', desc: 'Subsurface Exploration' },
            { name: 'SCHLUMBERGER COGNITE', desc: 'Industrial Data Ops' },
          ].map((partner, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-[#121622] border border-white/5 flex flex-col items-center justify-center text-center space-y-1 hover:border-white/20 transition-colors"
            >
              <Globe2 className="w-5 h-5 text-slate-400 mb-1" />
              <div className="text-xs font-bold font-montserrat text-white">{partner.name}</div>
              <div className="text-[10px] font-mono text-slate-400">{partner.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. FIELD INSIGHTS & CASE STUDIES (Direct AKT Oil Services format) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-montserrat text-white uppercase">
              Field Insights & Research
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Engineering bulletins and field research from Baghewala Heavy Oil Field operations
            </p>
          </div>
          <span className="text-xs font-mono text-[#FF3B30] font-bold hidden sm:inline">
            OIL INDIA LIMITED R&D
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedArticle(item)}
              className="p-6 rounded-2xl bg-[#121622] border border-white/5 hover:border-[#FF3B30]/50 hover:bg-[#161B29] cursor-pointer transition-all duration-300 flex flex-col justify-between group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-3">
                  <span className="px-2.5 py-0.5 rounded bg-[#181E2E] text-[#FF3B30] border border-[#FF3B30]/30 font-bold uppercase tracking-wider">
                    {item.tag}
                  </span>
                  <span className="text-slate-400">{item.date}</span>
                </div>

                <h3 className="text-base font-bold font-montserrat text-white group-hover:text-[#FF3B30] transition-colors leading-snug mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-300 group-hover:text-white">
                <span className="text-[#00E5FF] font-semibold">Read Technical Memo</span>
                <ArrowRight className="w-4 h-4 text-[#FF3B30] group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121622] border border-white/15 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl animate-fadeIn">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-[#181E2E] hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#FF3B30] font-bold">
                <span>{selectedArticle.tag}</span>
                <span>•</span>
                <span className="text-slate-400">{selectedArticle.date}</span>
              </div>
              <h2 className="text-2xl font-bold font-montserrat text-white leading-snug">
                {selectedArticle.title}
              </h2>
            </div>

            <div className="text-xs font-mono px-3 py-1.5 rounded bg-[#0C0F17] text-[#00E5FF] border border-white/10">
              CATEGORY: {selectedArticle.category}
            </div>

            <div className="text-sm font-sans text-slate-200 leading-relaxed space-y-4 whitespace-pre-line border-t border-b border-white/10 py-4 max-h-72 overflow-y-auto pr-2">
              {selectedArticle.fullBody}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-slate-400">ThermaLift AI • AKT Oil Services</span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2.5 rounded-lg bg-[#FF3B30] hover:bg-[#E02E24] text-white font-mono text-xs font-bold transition-all uppercase"
              >
                Close Memo
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

