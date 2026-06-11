/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  Flame, Cpu, Globe, Sparkles, Terminal, ArrowRight, 
  CheckCircle2, Mail, Send, Copy, RefreshCw, Layers, ShieldCheck, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface EmptyCategoryPanelProps {
  category: string;
}

export default function EmptyCategoryPanel({ category }: EmptyCategoryPanelProps) {
  // Simulated dynamic terminal logs
  const [logs, setLogs] = useState<string[]>([]);
  const [compileProgress, setCompileProgress] = useState(42);

  // Inquiry Composer States
  const [showComposer, setShowComposer] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [urgencyClass, setUrgencyClass] = useState<string>("EXPERIMENTAL_R&D");
  const [customMessage, setCustomMessage] = useState("");
  const [isMessageDirty, setIsMessageDirty] = useState(false);
  const [localLogs, setLocalLogs] = useState<any[]>([]);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);

  const getEmptyCategoryMeta = (cat: string) => {
    switch (cat) {
      case "Game Dev":
        return {
          title: "Next-Gen Gaming & Real-Time Physics",
          subtitle: "ACTIVELY FORGING MECHANICS",
          desc: "We are currently compiling immersive game modules, real-time procedural animations, and interactive engine frameworks. Our focus is low-latency, responsive controls paired with high-fidelity WebGL shading and fluid physical mechanics.",
          eta: "Q4 2026 // PLAYABLE PROTOTYPE",
          specs: ["GPU-Driven Colliders", "PhysX / Rigid Body Solver", "Custom HLSL/GLSL Shaders", "Multiplayer Frame Buffer Sync"],
          icon: <Flame className="w-8 h-8 text-rose-500 animate-pulse" />,
          glowColor: "from-rose-500/10 via-rose-500/5 to-transparent",
          borderColor: "border-rose-500/20 hover:border-rose-500/40",
          badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
          shadowColor: "shadow-rose-500/5",
          btnBg: "bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:scale-[1.02]",
          logsCandidates: [
            "Initializing game_engine_core v1.0.8...",
            "Loading terrain_lod_shader.fsh [OK]",
            "Binding gamepad_input_poller (60hz)...",
            "Allocating physics_rigidbody_solver [0 leaks]",
            "Streaming asset_chunk_loader...",
            "Compiling screen_graph_buffers [100% OK]",
            "System telemetry aligned",
            "Vulkan graphics layout instantiated",
            "Tick thread registered [THREAD_ID:8471]"
          ]
        };
      case "Immersive Web":
        return {
          title: "WebGL 3D Pipelines & WebXR Spatial Tech",
          subtitle: "ACTIVE R&D PIPELINE",
          desc: "Engineering bleeding-edge immersive web systems. We bypass heavy, layout-blocking frameworks to construct custom lightweight matrices, GLSL coordinates, and WebXR sensory projections that render at zero lag.",
          eta: "Q3 2026 // SHADER ENVIRONMENT READY",
          specs: ["WebGL 2.0 Native Kernels", "Matrix Transform Pipelines", "Spatial Haptic Trigger Webs", "Device Inertial Sync Clocks"],
          icon: <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />,
          glowColor: "from-cyan-500/10 via-cyan-500/5 to-transparent",
          borderColor: "border-cyan-500/20 hover:border-cyan-500/40",
          badgeBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
          shadowColor: "shadow-cyan-500/5",
          btnBg: "bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 hover:scale-[1.02]",
          logsCandidates: [
            "Requesting webgl2_rendering_context...",
            "Matrix4x4 uniform projection loaded",
            "Compiling vertex_shader.assembly.vsh...",
            "WebXR spatial tracking listeners attached",
            "Starting render_loop (120 FPS target)",
            "Buffer binding complete: element_array_buffer",
            "Twinkling constellation buffer spawned",
            "Calibrating system WebGL document solver",
            "Interferon canvas size resized [OK]"
          ]
        };
      case "Physical Design":
        return {
          title: "Mechanical CAD Models & Tactile Hardware",
          subtitle: "BLUEPRINTS UNDER FABRICATION",
          desc: "Integrating physical ergonomics with parametric CAD design. Building tactile component models, mechanical gear kinematics, customized hardware sensor wrappers (Fusion 360), and spatial simulator structures.",
          eta: "Q1 2027 // PHYSICAL ASSEMBLY",
          specs: ["Parametric Geometry Models", "Fusion 360 Script Compiles", "G-Code Precision Simulator", "Tactile Ergonomics Analytics"],
          icon: <Globe className="w-8 h-8 text-fuchsia-400 animate-pulse" />,
          glowColor: "from-fuchsia-500/10 via-fuchsia-500/5 to-transparent",
          borderColor: "border-fuchsia-500/20 hover:border-fuchsia-500/40",
          badgeBg: "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30",
          shadowColor: "shadow-fuchsia-500/5",
          btnBg: "bg-gradient-to-r from-fuchsia-600 via-purple-600 to-fuchsia-700 hover:scale-[1.02]",
          logsCandidates: [
            "Loading mechanical_assemblies...",
            "Calibrating micro-motor rotation curves",
            "Checking joint structural tolerances [OK]",
            "Importing stl_mesh_structures (solid body)...",
            "Verifying physical sensory interfaces",
            "Drafting dimensional kinematic matrix...",
            "G-code simulator loaded at origin (0,0,0)",
            "Stress stress_strain_analyzer complete",
            "Heat dissipation mapping aligned [100%]"
          ]
        };
      default:
        return {
          title: "Specialized Projects & Systems",
          subtitle: "SYSTEM-LEVEL PARALLELS",
          desc: "Our independent craft studio is actively detailing, designing, and compiling custom modules for this segment. New system structures are registered into our central development sandbox daily.",
          eta: "ONGOING // DEPLOYED AT RUNTIME",
          specs: ["Independent Code Relics", "Low-Latency Structures", "Highly-Modular Blueprints"],
          icon: <Sparkles className="w-8 h-8 text-[#EC4899] animate-pulse" />,
          glowColor: "from-[#4F46E5]/10 via-[#EC4899]/5 to-transparent",
          borderColor: "border-[#EC4899]/20 hover:border-[#EC4899]/40",
          badgeBg: "bg-[#EC4899]/10 text-[#EC4899] border-[#EC4899]/30",
          shadowColor: "shadow-[#EC4899]/5",
          btnBg: "bg-gradient-to-r from-[#4F46E5] to-[#EC4899] hover:scale-[1.02]",
          logsCandidates: [
            "Querying central forge repositories...",
            "Parsing client state parameters...",
            "Awaiting system creator dispatch signals",
            "No active records in database",
            "Calibrating heat temperature: 1450C",
            "Opening active listening threads...",
            "Compiling core logic blueprints...",
            "Vault security integrity verified",
            "Establishing transmission sync tunnel"
          ]
        };
    }
  };

  const meta = getEmptyCategoryMeta(category);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>(meta.specs);

  // Update selected specs and reset state when category switches
  useEffect(() => {
    setSelectedSpecs(meta.specs);
    setSenderName("");
    setSenderEmail("");
    setUrgencyClass("Inquiry");
    setCustomMessage("");
    setIsMessageDirty(false);
    setDispatchSuccess(false);
    setIsDispatching(false);
  }, [category]);

  // Handle automatic generation of a simple, friendly inquiry draft
  useEffect(() => {
    if (!isMessageDirty) {
      const selectedList = selectedSpecs.length > 0 
        ? `I'm interested in discussing:\n` + selectedSpecs.map(s => `• ${s}`).join("\n")
        : "";

      const generated = `Hi,

I saw your portfolio on Mythics Forge and would love to get in touch with you regarding "${category}" development.

${selectedList}

My Contact Details:
- Name: ${senderName || "[Your Name]"}
- Email: ${senderEmail || "[Your Email Address]"}

Best regards,
${senderName || "Visitor"}`;
      setCustomMessage(generated);
    }
  }, [senderName, senderEmail, selectedSpecs, category, isMessageDirty]);

  // Load local message logs
  useEffect(() => {
    const saved = localStorage.getItem("forge_inquiry_dispatch_history");
    if (saved) {
      try {
        setLocalLogs(JSON.parse(saved));
      } catch (e) {
        setLocalLogs([]);
      }
    }
  }, []);

  const saveLog = (newLog: any) => {
    const updated = [newLog, ...localLogs].slice(0, 4); // Keep last 4 logs
    setLocalLogs(updated);
    localStorage.setItem("forge_inquiry_dispatch_history", JSON.stringify(updated));
  };

  // Slowly shuffle and load logs over time to simulate live compilation activity
  useEffect(() => {
    // Initial logs load
    const initialLogs = meta.logsCandidates.slice(0, 4);
    setLogs(initialLogs);
    setCompileProgress(Math.floor(Math.random() * 25) + 35);

    const interval = setInterval(() => {
      // Add a random log, keeping list to max 6 lines
      setLogs((prev) => {
        const remaining = meta.logsCandidates.filter((l) => !prev.includes(l));
        if (remaining.length === 0) {
          return meta.logsCandidates.slice(0, 4);
        }
        const nextLog = remaining[Math.floor(Math.random() * remaining.length)];
        return [...prev.slice(-5), nextLog];
      });

      // Advance compile progress occasionally
      setCompileProgress((prev) => {
        if (prev >= 98) return 40;
        return prev + Math.floor(Math.random() * 8) + 1;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [category]);

  const handleSpecToggle = (spec: string) => {
    setSelectedSpecs(prev => 
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const handleSendGmail = () => {
    if (!senderName.trim() || !senderEmail.trim()) {
      alert("Please fill in your Name and Email Address first.");
      return;
    }
    
    setIsDispatching(true);

    setTimeout(() => {
      setIsDispatching(false);
      setDispatchSuccess(true);

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newLog = {
        id: Math.random().toString(36).substring(2, 6).toUpperCase(),
        timestamp,
        category,
        method: "Gmail Compose",
        name: senderName
      };
      saveLog(newLog);

      const recipient = "lalit.iglas@gmail.com";
      const subject = `Inquiry regarding ${category} - ${senderName}`;
      // Open Gmail directly with pre-drafted subject and body!
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(customMessage)}`;
      const gmailWindow = window.open(gmailUrl, "_blank");
      
      // Fallback if browser blocked popup: redirect current location
      if (!gmailWindow || gmailWindow.closed || typeof gmailWindow.closed === "undefined") {
        window.location.href = gmailUrl;
      }

      setTimeout(() => {
        setDispatchSuccess(false);
        setShowComposer(false);
      }, 3500);

    }, 800);
  };

  const handleSendDefault = () => {
    if (!senderName.trim() || !senderEmail.trim()) {
      alert("Please fill in your Name and Email Address first.");
      return;
    }
    
    setIsDispatching(true);

    setTimeout(() => {
      setIsDispatching(false);
      setDispatchSuccess(true);

      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newLog = {
        id: Math.random().toString(36).substring(2, 6).toUpperCase(),
        timestamp,
        category,
        method: "Mail App",
        name: senderName
      };
      saveLog(newLog);

      const recipient = "lalit.iglas@gmail.com";
      const subject = `Inquiry regarding ${category} - ${senderName}`;
      const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(customMessage)}`;
      window.location.href = mailtoUrl;

      setTimeout(() => {
        setDispatchSuccess(false);
        setShowComposer(false);
      }, 3500);

    }, 800);
  };

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(customMessage);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  const urgencyOptions = [
    { label: "General Project", value: "General Project", color: "hover:border-[#EC4899]/40 border-[#EC4899]/10" },
    { label: "Bespoke Request", value: "Bespoke Request", color: "hover:border-rose-500/40 border-rose-500/10" },
    { label: "Just Saying Hi!", value: "Just Saying Hi!", color: "hover:border-amber-500/40 border-amber-500/10" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`col-span-full relative p-6 md:p-8 rounded-[2.2rem] border ${meta.borderColor} bg-white/[0.015] backdrop-blur-xl ${meta.shadowColor} shadow-2xl flex flex-col lg:flex-row gap-6 md:gap-8 overflow-hidden`}
    >
      {/* Background glow coordinates */}
      <div className={`absolute -right-24 -bottom-24 w-80 h-80 bg-gradient-to-tr ${meta.glowColor} filter blur-3xl rounded-full opacity-60 pointer-events-none`}></div>
      <div className={`absolute -left-12 -top-12 w-48 h-48 bg-gradient-to-tr ${meta.glowColor} filter blur-3xl rounded-full opacity-20 pointer-events-none`}></div>

      {/* LEFT: Dynamic Toggle Pane (Default View vs Connection Composer) */}
      <div className="flex-1 flex flex-col justify-between relative z-10 min-h-[420px]">
        <AnimatePresence mode="wait">
          {!showComposer ? (
            <motion.div
              key="panel-default"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-6 flex-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 font-mono hover:scale-105 transition-transform text-[9px] uppercase tracking-wider font-extrabold rounded-lg border ${meta.badgeBg}`}>
                    {category} // IN PROGRESS
                  </span>
                  <span className="text-[9.5px] font-mono text-white/30 tracking-widest uppercase">
                    STATUS: LIVE_FORGING
                  </span>
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 p-3 bg-white/[0.03] border border-white/[0.08] rounded-2xl">
                    {meta.icon}
                  </div>
                  <div>
                    <h4 className="font-serif font-black text-xl md:text-2xl text-white tracking-tight leading-tight uppercase">
                      {meta.title}
                    </h4>
                    <p className="text-[9.5px] font-mono tracking-widest mt-1 text-[#EC4899]">
                      {meta.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-white/60 leading-relaxed font-sans font-light max-w-xl">
                  {meta.desc}
                </p>

                {/* Active tech stack elements */}
                <div className="pt-2 text-xs">
                  <span className="text-[9px] uppercase font-mono text-white/40 tracking-wider block mb-2.5">
                    🛠️ SUB-SYSTEM FABRICATIONS UNDER COMPILE:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg">
                    {meta.specs.map((spec, i) => (
                      <div key={i} className="flex items-center gap-2 text-white/70 font-mono text-[10.5px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#EC4899] shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic CTA trigger button */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                  onClick={() => setShowComposer(true)}
                  className={`px-5 py-3 rounded-full text-[10.5px] uppercase font-extrabold tracking-wider text-white ${meta.btnBg} transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/40`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Get in Touch with Developer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <div className="text-[9px] font-mono text-white/40 tracking-wide bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-2.5 text-center sm:text-left">
                  ESTIMATED DEP_VER: <span className="text-white font-bold">{meta.eta}</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="panel-composer"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4 flex-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                  <span className="flex items-center gap-2 font-mono text-[10px] font-bold text-[#EC4899]">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                    CONTACT THE DEVELOPER
                  </span>
                  <button
                    onClick={() => setShowComposer(false)}
                    className="px-2.5 py-1 text-[9.5px] font-mono text-white/50 hover:text-white uppercase transition-all hover:bg-white/5 border border-white/5 rounded-lg"
                  >
                    [ BACK TO DETAILS ]
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-[8.5px] font-mono text-white/30 uppercase tracking-widest mb-1.5">
                      1. Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jane Doe"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-[#EC4899]/60 focus:bg-black/60 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 outline-none transition-all font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[8.5px] font-mono text-white/30 uppercase tracking-widest mb-1.5">
                      2. Your Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. jane@example.com"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 hover:border-white/20 focus:border-[#EC4899]/60 focus:bg-black/60 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 outline-none transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Configurator 3: Spec requirements toggling */}
                <div className="mb-4">
                  <label className="block text-[8.5px] font-mono text-white/30 uppercase tracking-widest mb-2">
                    3. Select topics you want to include in draft:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {meta.specs.map((spec, sIdx) => {
                      const isActive = selectedSpecs.includes(spec);
                      return (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => handleSpecToggle(spec)}
                          className={`px-2.5 py-1 border transition-all duration-200 text-[9.5px] font-mono rounded-lg flex items-center gap-1.5 ${
                            isActive 
                              ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                              : "bg-white/[0.01] border-white/5 text-white/40 hover:text-white/60 hover:border-white/10"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-400" : "bg-white/20"}`}></span>
                          {spec}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subject selection */}
                <div className="mb-4">
                  <label className="block text-[8.5px] font-mono text-white/30 uppercase tracking-widest mb-1.5">
                    4. Message Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {urgencyOptions.map((opt) => {
                      const active = urgencyClass === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setUrgencyClass(opt.value)}
                          className={`px-3 py-1.5 border hover:bg-white/[0.02] text-[9px] rounded-lg font-mono text-center transition-all ${
                            active
                              ? "bg-[#EC4899]/10 border-[#EC4899]/50 text-white font-bold"
                              : "bg-transparent border-white/5 text-white/40"
                          } ${opt.color}`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* message body */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[8.5px] font-mono text-white/30 uppercase tracking-widest">
                      5. Your Message Draft
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMessageDirty(false);
                      }}
                      className="text-[8px] font-mono text-white/40 hover:text-white transition-colors uppercase flex items-center gap-1"
                    >
                      <RefreshCw className="w-2.5 h-2.5" /> reset draft
                    </button>
                  </div>
                  <textarea
                    value={customMessage}
                    onChange={(e) => {
                      setCustomMessage(e.target.value);
                      setIsMessageDirty(true);
                    }}
                    rows={4}
                    className="w-full bg-black/50 border border-white/5 hover:border-white/10 focus:border-[#EC4899]/40 rounded-xl p-3 text-[10.5px] text-white/80 outline-none transition-all font-mono leading-relaxed resize-none h-[110px]"
                  />
                </div>
              </div>

              {/* Form trigger layout */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleSendGmail}
                  disabled={isDispatching || dispatchSuccess || !senderName || !senderEmail}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-pink-600 disabled:from-white/5 disabled:to-white/5 disabled:text-white/20 disabled:cursor-not-allowed hover:from-red-500 hover:to-pink-500 text-white font-mono text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
                >
                  {isDispatching ? (
                    <>
                      <Terminal className="w-3.5 h-3.5 animate-spin" />
                      <span>Drafting Message...</span>
                    </>
                  ) : dispatchSuccess ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-white" />
                      <span>DRAFT COMPLETE!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send with Gmail</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSendDefault}
                  disabled={isDispatching || dispatchSuccess || !senderName || !senderEmail}
                  className="py-3 px-4 bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed text-white/90 font-mono text-[11px] uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Default Mail client</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyDraft}
                  className="px-3 py-3 bg-white/[0.01] border border-white/5 hover:bg-white/[0.04] text-white/60 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs font-mono"
                  title="Copy message to clipboard"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copyStatus ? "COPIED" : "COPY"}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT: Active Compiler Logs Screen & Transmission Registry */}
      <div className="w-full lg:w-[350px] shrink-0 flex flex-col justify-between bg-black/40 border border-white/[0.06] rounded-[1.7rem] p-4 font-mono text-[10px] space-y-4 relative z-10 select-none shadow-inner">
        <div>
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-[9px] text-white/40 font-mono tracking-wider">
            <span className="flex items-center gap-1.5 uppercase">
              <Terminal className="w-3 h-3 text-[#EC4899] animate-spin" />
              {showComposer ? "Mail Draft Status" : "Live Compile Daemon"}
            </span>
            <span className={`animate-pulse border px-1.5 py-0.5 rounded tracking-tighter uppercase font-bold text-[8px] ${
              showComposer 
                ? "bg-emerald-950/50 border-emerald-500/30 text-emerald-400" 
                : "bg-[#EC4899]/10 border-[#EC4899]/30 text-[#EC4899]"
            }`}>
              {showComposer ? "READY" : "SYS_BUSY"}
            </span>
          </div>

          {/* Terminal contents */}
          {!showComposer ? (
            <div className="space-y-1.5 pt-3 text-white/50 text-[9.5px] leading-snug">
              {logs.map((log, lIdx) => {
                const isHighlight = log.includes("[OK]") || log.includes("complete") || log.includes("DONE");
                return (
                  <div key={lIdx} className="flex items-start gap-1">
                    <span className="text-[#EC4899] select-none">&gt;</span>
                    <p className={isHighlight ? "text-cyan-400" : ""}>{log}</p>
                  </div>
                );
              })}
              <div className="flex items-center gap-1">
                <span className="text-[#EC4899]">&gt;</span>
                <span className="w-1.5 h-3 bg-white/60 animate-pulse"></span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 pt-3">
              <div className="text-[9.5px] text-white/40 border-b border-white/[0.03] pb-1.5 flex items-center justify-between font-bold">
                <span>RECIPIENT INFORMATION:</span>
              </div>
              
              <div className="space-y-1 py-1 text-white/75 leading-relaxed font-sans text-xs">
                <p>🧑‍💻 <strong className="text-white">Developer:</strong> Lead Developer</p>
                <p>📩 <strong className="text-white">Direct Email:</strong> <span className="text-[#EC4899] font-mono">lalit.iglas@gmail.com</span></p>
                <p>⏱️ <strong className="text-white">Avg. Response:</strong> less than 24 hours</p>
              </div>

              {localLogs.length > 0 && (
                <div className="mt-2.5">
                  <div className="text-[9.5px] text-white/30 border-b border-white/[0.03] pb-1 font-mono uppercase tracking-wider mb-1.5">
                    Recent drafts opened:
                  </div>
                  <div className="space-y-1 max-h-[80px] overflow-y-auto">
                    {localLogs.map((item) => (
                      <div key={item.id} className="p-1.5 bg-white/[0.01] border border-white/5 rounded-lg flex items-center justify-between text-[8px] font-mono">
                        <span className="text-white/70 truncate max-w-[120px]">{item.name} ({item.method || "Mail"})</span>
                        <span className="text-emerald-400 shrink-0 font-bold">OPENED</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Compile percentage meter / Signal strength indicator */}
        <div className="border-t border-white/[0.06] pt-3 text-[9px] space-y-1">
          {showComposer ? (
            <>
              <div className="flex justify-between items-center text-white/40">
                <span>DRAFT PREPARATION:</span>
                <span className="text-emerald-400 font-extrabold font-sans">
                  {senderName && senderEmail ? "READY TO SEND" : "AWAITING INSTRUCTIONS"}
                </span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${senderName && senderEmail ? "bg-emerald-400 w-full" : "bg-rose-500 w-1/3"}`}
                ></div>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center text-white/40">
                <span>FORGING COMPILATION INDEX:</span>
                <span className="text-white font-black">{compileProgress}%</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#4F46E5] to-[#EC4899]"
                  style={{ width: `${compileProgress}%` }}
                  transition={{ ease: "easeInOut", duration: 0.5 }}
                ></motion.div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

