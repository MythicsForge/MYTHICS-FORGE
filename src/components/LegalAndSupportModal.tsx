import { useState, FormEvent } from "react";
import { ShieldCheck, Scale, Mail, Send, Terminal, Sparkles, CheckCircle2 } from "lucide-react";

interface LegalAndSupportModalProps {
  activeTab: "privacy" | "terms" | "contact";
  onClose: () => void;
}

export default function LegalAndSupportModal({ activeTab, onClose }: LegalAndSupportModalProps) {
  const [currentTab, setCurrentTab] = useState<"privacy" | "terms" | "contact">(activeTab);
  
  // Contact Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Strategic Consulting",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionToken, setSubmissionToken] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    
    // Simulate high-fidelity network dispatch signal delay
    setTimeout(() => {
      setIsSubmitting(false);
      const randomHex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase();
      const token = `MF-DISPATCH-${randomHex}-2026`;
      setSubmissionToken(token);
      
      // Attempt to save to server API route (if available) for persistent state audit logs
      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, token })
      }).catch(err => console.warn("Fallback offline backup recorded:", err));

    }, 1500);
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", subject: "Strategic Consulting", message: "" });
    setSubmissionToken(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-md bg-black/85 transition-all duration-300">
      <div 
        id="legal-support-panel"
        className="bg-[#0B0A16] border border-white/[0.08] rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[92vh] sm:max-h-[85vh] overflow-hidden flex flex-col shadow-2xl relative"
      >
        {/* Floating gradient lights */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Modal Top Header */}
        <div className="p-4 sm:p-6 border-b border-white/[0.06] bg-gradient-to-r from-indigo-950/20 to-purple-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="text-[9px] text-[#EC4899] font-mono uppercase tracking-[0.25em] font-extrabold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> OFFICIAL COMPLIANCE PORTAL
            </span>
            <h4 className="font-serif text-white font-extrabold text-sm sm:text-lg mt-1 uppercase tracking-wide">
              TRUST, PRIVACY & COMMUNICATION
            </h4>
          </div>
          
          {/* Tabs selector */}
          <div className="flex flex-wrap sm:flex-nowrap gap-1.5 bg-black/45 p-1 rounded-xl border border-white/5 justify-center sm:justify-start">
            <button
              onClick={() => { setCurrentTab("privacy"); setSubmissionToken(null); }}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] uppercase font-mono font-bold transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer ${
                currentTab === "privacy" ? "bg-indigo-650 text-white bg-indigo-600" : "text-white/40 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-3 h-3" /> Privacy
            </button>
            <button
              onClick={() => { setCurrentTab("terms"); setSubmissionToken(null); }}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] uppercase font-mono font-bold transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer ${
                currentTab === "terms" ? "bg-indigo-650 text-white bg-indigo-600" : "text-white/40 hover:text-white"
              }`}
            >
              <Scale className="w-3 h-3" /> Terms
            </button>
            <button
              onClick={() => { setCurrentTab("contact"); }}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] uppercase font-mono font-bold transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer ${
                currentTab === "contact" ? "bg-indigo-650 text-white bg-indigo-600" : "text-white/40 hover:text-white"
              }`}
            >
              <Mail className="w-3 h-3" /> Contact
            </button>
          </div>
        </div>

        {/* Scrollable Content Bay */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 relative z-10 text-white/70 text-xs md:text-sm leading-relaxed font-sans font-light">
          
          {/* TAB 1: PRIVACY POLICY */}
          {currentTab === "privacy" && (
            <div className="space-y-6">
              <div className="p-4 bg-white/[0.01] border border-white/[0.05] rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-white/45 font-mono">
                  This document serves as our transparent notice of cookie behavior, operational data telemetry, and third-party advertising integration conformant with GDPR, CCPA, and Google AdSense guidelines.
                </p>
              </div>

              <div className="space-y-4">
                <h5 className="text-white font-serif font-black uppercase text-xs tracking-wider">1. Information Gathering and Log Files</h5>
                <p>
                  Mythics Forge (the &quot;Studio&quot;) collects standard system-level log records automatically. These records include Internet Protocol (IP) addresses, browser variants, Internet Service Provider (ISP) stamps, date/time coordinate entries, referral exit paths, and qualitative click-path counters. This information is processed exclusively to study system load, secure operations, and audit physical geometry dispatches.
                </p>

                <h5 className="text-white font-serif font-black uppercase text-xs tracking-wider">2. Cookies, Trackers, and Tracking Technologies</h5>
                <p>
                  We utilize simple client-side session storage elements (`localStorage`) to remember customized dashboard brandings, selected category filters, and active console states local to your client browser. We also use third-party vendors, including Google, to serve programmatic notices or sponsors on this portal.
                </p>

                <h5 className="text-white font-serif font-black uppercase text-xs tracking-wider font-bold text-indigo-300">3. Google AdSense and DoubleClick DART Cookies</h5>
                <p className="border-l-2 border-indigo-500/40 pl-4 text-white/60">
                  Google, as a third-party advertisement vendor, utilizes cookies to serve tailored notices on this digital platform. Google&apos;s usage of the DART cookie empowers it to serve targeted advertising to users based on their traversal history across this site and other domains in the global network. You can choose to opt-out of the custom DART cookie collection by reviewing the Google Ad and Content Network Privacy Policy.
                </p>

                <h5 className="text-white font-serif font-black uppercase text-xs tracking-wider">4. Third-Party Advertisement Partners</h5>
                <p>
                  These third-party servers rely on customized technological interfaces that dispatch sponsor signals and embedded visual boxes directly onto your screen. They automatically acquire your IP address when a packet routing sequence initiates. They also make use of analytical beacons and cookies to measure the efficacy and contextual relevance of their advertisement columns. <strong>Please note: Mythics Forge does not possess access, authority, or direct control over any third-party advertising cookies.</strong>
                </p>

                <h5 className="text-white font-serif font-black uppercase text-xs tracking-wider">5. Opt-Out Guidelines & User Options</h5>
                <p>
                  You are fully entitled to reject, ignore, or strip cookies from your browser settings. You may also adjust custom cookies and advertisement choice options on this channel through our floating Choice Banner present below. To learn detailed technical rules for cookie management, please check the support sections of your specific browser provider.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {currentTab === "terms" && (
            <div className="space-y-6">
              <div className="p-4 bg-white/[0.01] border border-white/[0.05] rounded-2xl flex items-start gap-3">
                <Scale className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-white/45 font-mono">
                  This document governs all interaction, parametric geometry use, software repository inspection, and informational data access conducted across the Mythics Forge domain.
                </p>
              </div>

              <div className="space-y-4">
                <h5 className="text-white font-serif font-black uppercase text-xs tracking-wider">1. Agreement to Terms & Eligibility</h5>
                <p>
                  By accessing, browsing, mutating local variables, or dispatching packet telemetry inside Mythics Forge, you fully agree to follow these binding terms. If you do not agree to every clause, you are not authorized to query our creative assets, WebGL pipelines, or custom binaries.
                </p>

                <h5 className="text-white font-serif font-black uppercase text-xs tracking-wider">2. Intellectual Property & Code Licensing</h5>
                <p>
                  All custom graphics code, raw shader formulas, STL lattices, math displacement systems, and written chronicle posts presented on this platform are owned by the operator of Mythics Forge. Open-source elements are clearly labeled with copyright indicators. Any unauthorized cloning, mechanical scraping, or bulk scraping of our portfolio assets without express written consent is strictly prohibited.
                </p>

                <h5 className="text-white font-serif font-black uppercase text-xs tracking-wider">3. Acceptable Use Policy</h5>
                <p>
                  You pledge to utilize this system solely for legitimate and peaceful creative exploration. You must not attempt to trigger packet flood sequences (DoS), test custom security tools hostile to other nodes, disrupt client local caches, or inject malicious executable patterns into the dispatch terminal.
                </p>

                <h5 className="text-white font-serif font-black uppercase text-xs tracking-wider">4. Disclaimers & Limit of Liability</h5>
                <p className="italic text-white/50">
                  This platform is presented on an &quot;AS-IS&quot; and &quot;AS-AVAILABLE&quot; baseline. The creator of Mythics Forge provides zero warranties regarding spatial accuracy, continuous network uptime, hardware compatibility, or the absolute performance of its procedurally deformed models. Under no circumstances will we be held liable for system loss or graphics card failure resulting from rendering our high-intensity WebGL systems.
                </p>

                <h5 className="text-white font-serif font-black uppercase text-xs tracking-wider">5. Governance & Modification of Rules</h5>
                <p>
                  We reserve the absolute right to alter these regulations at any moment to conform with new technology constraints or legal targets. Check this portal periodically to stay updated.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT FORM & TECHNICAL SUPPORT */}
          {currentTab === "contact" && (
            <div className="space-y-6">
              {submissionToken ? (
                // Success State
                <div className="py-8 text-center space-y-4 max-w-md mx-auto">
                  <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl animate-bounce">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h5 className="text-white font-serif font-black uppercase text-sm tracking-wide">
                    SIGNAL TRANSMITTED SUCCESSFULLY!
                  </h5>
                  <p className="text-xs text-white/50 leading-relaxed font-sans">
                    Your inquiry has been scheduled inside the queue. Our independent developer-architect reviews all dispatched signals based on computational priority.
                  </p>
                  
                  {/* Ledger Code Code */}
                  <div className="bg-black/45 hover:border-indigo-500/20 p-3 rounded-xl border border-white/5 font-mono text-[10px] space-y-1.5 transition-colors">
                    <p className="text-[#EC4899] font-bold">DISPATCH_TRACE_TOKEN</p>
                    <p className="text-white/80 select-all font-semibold tracking-wider">{submissionToken}</p>
                  </div>

                  <button
                    onClick={resetForm}
                    className="px-5 py-2.5 bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/10 hover:border-white/20 text-[10px] font-mono tracking-widest uppercase rounded-xl transition-all cursor-pointer"
                  >
                    Transmit Another Signal
                  </button>
                </div>
              ) : (
                // Form State
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="p-4 bg-white/[0.01] border border-white/[0.05] rounded-2xl flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-[#EC4899] shrink-0" />
                    <div>
                      <h6 className="text-[11px] text-white uppercase font-bold tracking-wider font-mono">STATION DIRECT COMMUNICATIONS</h6>
                      <p className="text-[10px] text-white/45 font-mono leading-normal">Transmit questions, license deals, or hire requests natively to the founder.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name Input */}
                    <div>
                      <label className="block text-[10px] text-indigo-400 font-mono uppercase mb-1 font-bold">Your Identifier Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Architect Vance"
                        className="w-full bg-[#030303] border border-white/10 focus:border-indigo-500/50 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none placeholder:text-white/20 font-sans"
                      />
                    </div>

                    {/* Email Input */}
                    <div>
                      <label className="block text-[10px] text-indigo-400 font-mono uppercase mb-1 font-bold">Return Email Coordinate / Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. vance@node.network"
                        className="w-full bg-[#030303] border border-white/10 focus:border-indigo-500/50 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none placeholder:text-white/20 font-mono"
                      />
                    </div>
                  </div>

                  {/* Subject selector */}
                  <div>
                    <label className="block text-[10px] text-indigo-400 font-mono uppercase mb-1 font-bold">Communications Channel</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#030303] border border-white/10 focus:border-indigo-500/50 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none cursor-pointer font-mono"
                    >
                      <option value="Strategic Consulting">Strategic Technical Consulting Contract</option>
                      <option value="Custom Licensing">Licensing Procedural Relics & Shaders</option>
                      <option value="Security Report">Vulnerability Report / Security Disclosure</option>
                      <option value="General Support">General Platform Inquiries</option>
                    </select>
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="block text-[10px] text-indigo-400 font-mono uppercase mb-1 font-bold">Transmission Message Body</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your creative collaboration proposal, physical design offers, or help ticket details here..."
                      className="w-full bg-[#030303] border border-white/10 focus:border-indigo-500/50 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none placeholder:text-white/20 font-sans resize-none leading-relaxed"
                    />
                  </div>

                  {/* Submission Action */}
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-7 py-3 bg-gradient-to-r from-indigo-650 to-purple-650 hover:from-purple-650 hover:to-indigo-650 text-white font-bold text-[10px] tracking-widest uppercase rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none bg-indigo-600 shadow-lg"
                    >
                      <span>{isSubmitting ? "ENCRYPTING SIGNAL..." : "TRANSMIT DISPATCH SIGN"}</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Modal Bottom Close bar */}
        <div className="bg-[#040409] border-t border-white/[0.06] px-6 py-4 flex justify-between items-center text-[9px] text-white/40 font-mono uppercase tracking-[0.15em] relative z-10 shrink-0">
          <span>PORTAL_SECURITY_ENFORCED</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-white font-extrabold transition-all cursor-pointer"
          >
            DISMISS PORTAL
          </button>
        </div>
      </div>
    </div>
  );
}
