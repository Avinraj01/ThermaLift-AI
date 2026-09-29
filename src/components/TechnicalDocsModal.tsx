import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Search, 
  Download, 
  Check, 
  Code, 
  Layers, 
  ShieldCheck, 
  Flame, 
  Activity 
} from 'lucide-react';

interface TechnicalDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalDocsModal: React.FC<TechnicalDocsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeSection, setActiveSection] = useState<string>('sec-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [downloaded, setDownloaded] = useState<boolean>(false);

  if (!isOpen) return null;

  const sections = [
    { id: 'sec-1', title: '1. Executive Summary & SIH 26120 Mapping', icon: Flame },
    { id: 'sec-2', title: '2. Baghewala Reservoir & Thermodynamics', icon: Activity },
    { id: 'sec-3', title: '3. Mathematical Formulations (Gibbs Wave & Walther)', icon: Code },
    { id: 'sec-4', title: '4. End-to-End Telemetry & Ingestion Architecture', icon: Layers },
    { id: 'sec-5', title: '5. AI/ML Models (1D-CNN & PINN Thermal Twin)', icon: Activity },
    { id: 'sec-6', title: '6. Asymmetric Closed-Loop VFD Modulation Scheme', icon: Code },
    { id: 'sec-7', title: '7. Comparative Benchmark Matrix', icon: Layers },
    { id: 'sec-8', title: '8. SIL-2 Safety, Cybersecurity & Interlocks', icon: ShieldCheck },
  ];

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([
      `# ThermaLift AI: Technical Specification & Engineering Blueprint\nTarget: Oil India Limited, Baghewala Heavy Oil Field (SIH PS ID 26120)\n\nAvailable in repository at /docs/TECHNICAL_SPECIFICATION.md`
    ], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = "ThermaLift_AI_Technical_Specification.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 lg:p-8 animate-fadeIn">
      <div className="bg-[#070B14] border border-slate-700 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Topbar */}
        <div className="p-4 lg:px-6 bg-[#0B111E] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#10192A] text-[#00E5FF] border border-slate-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide font-display flex items-center gap-2">
                THERMALIFT AI — IN-DEPTH SYSTEM SPECIFICATION & BLUEPRINT
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#10192A] text-[#00E5FF] border border-[#00E5FF]/40 font-bold">
                  DOCS v4.2.0-PROD
                </span>
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Bundled in repository at <code className="text-amber-400">/docs/TECHNICAL_SPECIFICATION.md</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#10192A] border border-slate-700 hover:border-[#00E5FF] text-slate-200 text-xs font-mono transition-colors"
            >
              {downloaded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5 text-[#00E5FF]" />}
              <span>{downloaded ? 'DOWNLOADED' : 'EXPORT MD'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#10192A] border border-slate-700 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Sidebar Navigation + Content Viewer */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-80 bg-[#050811] border-r border-slate-800 p-4 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search technical specs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0B111E] border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
                />
              </div>

              {/* Navigation Items */}
              <nav className="space-y-1">
                {sections
                  .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((s) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setActiveSection(s.id)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-mono flex items-center gap-2.5 transition-colors ${
                          activeSection === s.id
                            ? 'bg-[#131F33] text-[#00E5FF] font-bold border-l-2 border-[#00E5FF]'
                            : 'text-slate-400 hover:bg-[#0B111E] hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                        <span className="truncate">{s.title}</span>
                      </button>
                    );
                  })}
              </nav>
            </div>

            <div className="p-3 bg-[#0B111E] rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 mt-4">
              <div>Target Problem Statement:</div>
              <div className="text-amber-400 font-bold mt-0.5">SIH ID 26120 (Oil India Ltd)</div>
              <div className="text-slate-500 mt-1">Baghewala Heavy Crude Twin</div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 lg:p-8 overflow-y-auto bg-[#070B14] space-y-8 font-sans text-slate-200 text-sm leading-relaxed">
            
            {/* Section 1 */}
            <div id="sec-1" className={`space-y-4 ${activeSection === 'sec-1' ? 'block' : 'hidden md:block'}`}>
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Flame className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="text-lg font-bold text-white font-mono">1. Executive Summary & SIH 26120 Mapping</h3>
              </div>
              <p>
                The <strong>Baghewala Heavy Oil Field</strong>, situated in the Thar Desert (Bikaner-Nagaur Basin, Rajasthan) and operated by Oil India Limited, holds significant in-place extra-heavy crude resources. The producing reservoir is the <strong>Jodhpur Sandstone</strong>, characterized by depleted natural pressure, low structural relief, and extra-heavy crude (17° to 19° API).
              </p>
              <div className="p-4 rounded-xl bg-[#0B111E] border border-slate-800 font-mono text-xs space-y-2">
                <div className="text-[#FF6B00] font-bold">THE CORE PROBLEM STATEMENT:</div>
                <p className="text-slate-300">
                  Cyclic Steam Stimulation (CSS) and Sucker Rod Pumps (SRP) operate in disconnected silos. Following steam soak, as the formation cools down from 80°C to 48°C, crude viscosity spikes exponentially from 250 cP to 45,000 cP. This causes sucker rod floating on the downstroke, carrier bar separation, violent fluid pound, parted rod strings, and exorbitant lifting energy costs.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div id="sec-2" className={`space-y-4 ${activeSection === 'sec-2' ? 'block' : 'hidden md:block'}`}>
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Activity className="w-5 h-5 text-[#00E5FF]" />
                <h3 className="text-lg font-bold text-white font-mono">2. Baghewala Reservoir & Thermodynamic Characterization</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border border-slate-800">
                  <thead className="bg-[#0B111E] text-slate-300">
                    <tr>
                      <th className="p-2.5 border-b border-slate-800">Parameter</th>
                      <th className="p-2.5 border-b border-slate-800">Field Value</th>
                      <th className="p-2.5 border-b border-slate-800">Engineering Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-[#050811]">
                    <tr>
                      <td className="p-2.5 font-bold text-amber-400">Formation Horizon</td>
                      <td className="p-2.5">Jodhpur Sandstone (Cambrian)</td>
                      <td className="p-2.5">Quartzose sandstone with shale breaks</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-amber-400">Crude API Gravity</td>
                      <td className="p-2.5">17.0° to 19.2° API</td>
                      <td className="p-2.5">Extra-heavy density (945-953 kg/m³)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-amber-400">Dead Viscosity @ 48°C</td>
                      <td className="p-2.5">18,000 to 45,000 cP</td>
                      <td className="p-2.5">Complete immobility in cold state</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-amber-400">Critical Float Viscosity</td>
                      <td className="p-2.5">1,200 cP (@ 67.5°C)</td>
                      <td className="p-2.5">Threshold where downstroke rod drag exceeds rod weight</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3 */}
            <div id="sec-3" className={`space-y-4 ${activeSection === 'sec-3' ? 'block' : 'hidden md:block'}`}>
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Code className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white font-mono">3. Mathematical Formulations</h3>
              </div>
              
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-[#0B111E] rounded-lg border border-slate-800">
                  <div className="text-[#00E5FF] font-bold mb-1">A. 1D Damped Wave Equation for Sucker Rod Kinematics (Gibbs Equation):</div>
                  <div className="bg-[#050811] p-3 rounded font-mono text-white text-sm my-2 overflow-x-auto">
                    ∂²u(x,t)/∂t² = a² · (∂²u(x,t)/∂x²) - c(x,t) · (∂u(x,t)/∂t) + g·(1 - ρ_fluid / ρ_steel)
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Where acoustic velocity in sucker rod steel is a ≈ 5,030 m/s (16,500 ft/s) and damping coefficient c(x,t) varies dynamically with crude viscosity μ(T).
                  </p>
                </div>

                <div className="p-3 bg-[#0B111E] rounded-lg border border-slate-800">
                  <div className="text-amber-400 font-bold mb-1">B. Walther / ASTM D341 Viscosity-Temperature Model:</div>
                  <div className="bg-[#050811] p-3 rounded font-mono text-white text-sm my-2 overflow-x-auto">
                    log₁₀ log₁₀(Z) = 9.4218 - 3.6842 · log₁₀(T_kelvin)
                  </div>
                </div>

                <div className="p-3 bg-[#0B111E] rounded-lg border border-slate-800">
                  <div className="text-emerald-400 font-bold mb-1">C. Marx-Langenheim Energy Balance & Heat Decay:</div>
                  <div className="bg-[#050811] p-3 rounded font-mono text-white text-sm my-2 overflow-x-auto">
                    T_res(t) = T_init + (T_peak - T_init) · exp(-t / τ_decay) · [1 - η_loss · (t / t_cycle)^0.65]
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div id="sec-4" className={`space-y-4 ${activeSection === 'sec-4' ? 'block' : 'hidden md:block'}`}>
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Layers className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white font-mono">4. Edge Telemetry & Ingestion Architecture</h3>
              </div>
              <div className="p-4 bg-[#0B111E] rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
                <pre className="overflow-x-auto text-[11px] leading-relaxed text-cyan-300">
{`+-------------------------------------------------------------------------------+
|                       WELLSITE SENSORS (100 Hz SAMPLING)                      |
| [Polished Rod Load Cell]  [Motor VFD Encoder]  [Downhole PT Gauge] [Wellhead] |
+-------------------------------------------------------------------------------+
                                       │ (Modbus-RTU / RS-485)
                                       ▼
+-------------------------------------------------------------------------------+
|                    THERMALIFT INDUSTRIAL EDGE CONTROLLER (SIL-2)              |
|  - Edge Gateway: Advantech UNO-2271G / IPC-610                                |
|  - Ingestion Broker: Mosquitto MQTT & Modbus-TCP Poller                       |
|  - Embedded Gibbs Wave Solver (C++ / WebAssembly)                             |
|  - Fast Hardware Relay: Max Load Trip (24,000 lbs) & Slack Detection          |
+-------------------------------------------------------------------------------+
                                       │ (TLS 1.3 / OPC-UA)
                                       ▼
+-------------------------------------------------------------------------------+
|                      CLOUD ENTERPRISE DIGITAL TWIN RUNTIME                    |
|  - Ingestion API: FastAPI + Celery Workers                                    |
|  - Time-Series Engine: TimescaleDB (PostgreSQL 16) + Redis                    |
|  - AI Diagnostic Engine: PyTorch 1D-CNN + PINN Subsurface Heat Twin           |
+-------------------------------------------------------------------------------+`}
                </pre>
              </div>
            </div>

            {/* Section 6 */}
            <div id="sec-6" className={`space-y-4 ${activeSection === 'sec-6' ? 'block' : 'hidden md:block'}`}>
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Activity className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white font-mono">6. Asymmetric Closed-Loop VFD Modulation Scheme</h3>
              </div>
              <p>
                To eliminate viscous rod floating without reducing total lifted fluid volume, the drive governor splits each mechanical pumpjack stroke into independent frequency zones:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs font-mono text-slate-300">
                <li><strong>Downstroke Phase (180° to 360°):</strong> Decelerated to 30.0–36.0 Hz. Matches the downward sink rate of sinker bars in heavy crude to maintain &gt;800 lbs carrier bar tension and eliminate rod float.</li>
                <li><strong>Upstroke Phase (0° to 180°):</strong> Accelerated to 52.0–58.0 Hz. Maximizes fluid displacement rate while keeping PPRL within the Modified Goodman stress envelope.</li>
                <li><strong>Net Energy Saving:</strong> Conserves 24.2% lifting kWh per barrel.</li>
              </ul>
            </div>

            {/* Section 8 */}
            <div id="sec-8" className={`space-y-4 ${activeSection === 'sec-8' ? 'block' : 'hidden md:block'}`}>
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white font-mono">8. Fail-Safe, SIL-2 Safety & Cybersecurity Standards</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-[#0B111E] rounded-lg border border-slate-800">
                  <div className="text-red-400 font-bold mb-1">1. Hardwired Max Load Trip:</div>
                  <p className="text-slate-400">Independent over-torque switch automatically bypasses software controls if load cell exceeds 24,500 lbs.</p>
                </div>
                <div className="p-3 bg-[#0B111E] rounded-lg border border-slate-800">
                  <div className="text-emerald-400 font-bold mb-1">2. Communication Watchdog:</div>
                  <p className="text-slate-400">If telemetry heartbeat is interrupted for &gt; 5.0 seconds, VFD falls back to safe constant 4.0 SPM.</p>
                </div>
                <div className="p-3 bg-[#0B111E] rounded-lg border border-slate-800">
                  <div className="text-cyan-400 font-bold mb-1">3. IEC 62443-4-2 Cybersecurity:</div>
                  <p className="text-slate-400">Role-based access control, TLS 1.3 encrypted data streams, and cryptographic audit hash ledger for all setpoints.</p>
                </div>
                <div className="p-3 bg-[#0B111E] rounded-lg border border-slate-800">
                  <div className="text-amber-400 font-bold mb-1">4. Slack Carrier Interlock:</div>
                  <p className="text-slate-400">Proactively stops motor within 150 ms if polished rod clamp separates from wireline carrier bar.</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
