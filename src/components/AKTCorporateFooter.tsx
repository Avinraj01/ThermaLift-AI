import React, { useState } from 'react';
import { Flame, Mail, Phone, MapPin, Check, ChevronUp, ExternalLink, Shield } from 'lucide-react';

interface AKTCorporateFooterProps {
  onOpenDocs: () => void;
  onReplayIntro?: () => void;
}

export const AKTCorporateFooter: React.FC<AKTCorporateFooterProps> = ({ onOpenDocs, onReplayIntro }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setNewsletterEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="bg-[#060810] border-t border-akt-border pt-16 pb-8 px-4 lg:px-8">
      <div className="max-w-[1400px] mx-auto space-y-12">
        
        {/* Newsletter Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-akt-border">
          <div>
            <span className="text-[10px] font-mono text-akt-flame font-bold uppercase tracking-widest">ENGINEERING DISPATCH</span>
            <h2 className="text-xl sm:text-2xl font-black font-montserrat text-white uppercase mt-1">
              Field Telemetry & Technical Reports
            </h2>
            <p className="text-xs text-akt-body mt-1 max-w-md">
              Exclusive advanced technical reports on Baghewala CSS cycles, SRP kinematics, and heavy oil digital twins.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2 max-w-md w-full">
            <input
              type="email"
              placeholder="Enter engineering email..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 bg-akt-base border border-akt-border rounded-md px-3.5 py-2.5 text-xs text-white placeholder-akt-dim focus:outline-none focus:border-akt-flame font-mono transition-colors"
              required
            />
            <button
              type="submit"
              className="akt-btn-primary !py-2.5 !px-5 flex items-center gap-1.5 !text-[10px]"
            >
              {subscribed ? <Check className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
              <span>{subscribed ? 'SUBSCRIBED' : 'SUBSCRIBE'}</span>
            </button>
          </form>
        </div>

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-akt-surface border border-akt-flame/30 p-1 flex items-center justify-center">
                <img src="/logo.png" alt="ThermaLift AI Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-sm font-black font-montserrat text-white">ThermaLift AI</span>
              </div>
            </div>
            <p className="text-xs text-akt-body leading-relaxed">
              Developed for Oil India Limited under Smart India Hackathon 2026. Autonomous Well-to-Surface Digital Twin for Cyclic Steam Stimulation & Sucker Rod Pump optimization.
            </p>
            <div className="flex items-center gap-2 text-[9px] font-mono text-akt-muted">
              <Shield className="w-3 h-3 text-akt-emerald" />
              <span>v2.4.0-Enterprise (SIL-2 Rated)</span>
            </div>
          </div>

          {/* Regional HQ */}
          <div className="space-y-3">
            <h4 className="font-montserrat font-bold text-white text-[11px] uppercase tracking-wider">
              Asset Operations
            </h4>
            <div className="space-y-3 text-xs text-akt-body">
              <div>
                <div className="text-akt-flame font-mono text-[10px] font-bold mb-0.5">RAJASTHAN FIELD HQ</div>
                <p>Oil India Limited Asset Base<br/>Baghewala Heavy Crude Field<br/>Bikaner-Nagaur Basin, Rajasthan</p>
              </div>
              <div>
                <div className="text-akt-flame font-mono text-[10px] font-bold mb-0.5">TECHNICAL R&D HUB</div>
                <p>Oil India Limited CoE<br/>Duliajan, Assam</p>
              </div>
            </div>
          </div>

          {/* Documentation */}
          <div className="space-y-3">
            <h4 className="font-montserrat font-bold text-white text-[11px] uppercase tracking-wider">
              Technical Documentation
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                'System Technical Blueprint',
                '1D Gibbs Wave Equation Specs',
                'Marx-Langenheim Heat Decay Model',
                'Walther ASTM D341 Viscosity',
                'SIL-2 Safety & Interlocks',
              ].map((doc, idx) => (
                <li key={idx}>
                  <button 
                    onClick={onOpenDocs} 
                    className="text-akt-body hover:text-akt-cyan transition-colors flex items-center gap-1.5 font-mono text-[10px]"
                  >
                    <ExternalLink className="w-3 h-3 text-akt-dim" />
                    {doc}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Standards Compliance */}
          <div className="space-y-3">
            <h4 className="font-montserrat font-bold text-white text-[11px] uppercase tracking-wider">
              Standards Compliance
            </h4>
            <div className="space-y-2 text-[10px] font-mono text-akt-body">
              {[
                'API Spec 11E — Sucker Rod Pumping',
                'API RP 11L — Rod Pump Design',
                'ASTM D341 — Viscosity-Temperature',
                'ISO 13628-6 — Subsea Production',
                'IEC 62443 — Industrial Cybersecurity',
                'IEEE 1451 — Smart Transducers',
              ].map((std, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-akt-emerald" />
                  {std}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 border-t border-akt-border flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono text-akt-dim">
          <div>
            © {new Date().getFullYear()} ThermaLift AI — Oil India Limited & Smart India Hackathon. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            {onReplayIntro && (
              <>
                <button
                  onClick={onReplayIntro}
                  className="text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1 cursor-pointer font-semibold"
                  title="Replay system startup animation"
                >
                  <span>Replay System Intro</span>
                </button>
                <span className="text-akt-border">|</span>
              </>
            )}
            <span className="hover:text-akt-body cursor-pointer transition-colors">Terms & Conditions</span>
            <span className="text-akt-border">|</span>
            <span className="hover:text-akt-body cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-akt-border">|</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-white flex items-center gap-1 transition-colors"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
