/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Flame, Cpu, Globe, Sparkles, Terminal, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

interface EmptyCategoryPanelProps {
  category: string;
}

export default function EmptyCategoryPanel({ category }: EmptyCategoryPanelProps) {
  // Simulated dynamic terminal logs
  const [logs, setLogs] = useState<string[]>([]);
  const [compileProgress, setCompileProgress] = useState(42);

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
          // Reset to initial
          return meta.logsCandidates.slice(0, 4);
        }
        const nextLog = remaining[Math.floor(Math.random() * remaining.length)];
        const nextList = [...prev.slice(-5), nextLog];
        return nextList;
      });

      // Advance compile progress occasionally
      setCompileProgress((prev) => {
        if (prev >= 98) return 40;
        return prev + Math.floor(Math.random() * 8) + 1;
      });
    }, 3200);

    return () => clearInterval(interval);
  }, [category]);

  const handleInquireVance = () => {
    const textQuery = `Hi Vance! I noticed there are no completed case studies published yet in "${category}". Can you explain what R&D work or system projects you are currently building in this category, and when they will be deployed?`;
    const event = new CustomEvent("loreweaver-trigger", {
      detail: { query: textQuery }
    });
    window.dispatchEvent(event);
  };

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

      {/* LEFT: Information Panel */}
      <div className="flex-1 flex flex-col justify-between space-y-6 relative z-10">
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
            onClick={handleInquireVance}
            className={`px-5 py-3 rounded-full text-[10.5px] uppercase font-extrabold tracking-wider text-white ${meta.btnBg} transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/40`}
          >
            <span>Inquire with Vance Custodian</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <div className="text-[9px] font-mono text-white/40 tracking-wide bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-2.5 text-center sm:text-left">
            ESTIMATED DEP_VER: <span className="text-white font-bold">{meta.eta}</span>
          </div>
        </div>
      </div>

      {/* RIGHT: Active Compiler Logs Screen */}
      <div className="w-full lg:w-[350px] shrink-0 flex flex-col justify-between bg-black/40 border border-white/[0.06] rounded-[1.7rem] p-4 font-mono text-[10px] space-y-4 relative z-10 select-none shadow-inner">
        <div>
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-[9px] text-white/40 font-mono tracking-wider">
            <span className="flex items-center gap-1.5 uppercase">
              <Terminal className="w-3 h-3 text-[#EC4899] animate-spin" />
              Live Compile Daemon
            </span>
            <span className="animate-pulse bg-[#EC4899]/10 border border-[#EC4899]/30 text-[#EC4899] text-[8px] px-1.5 py-0.5 rounded tracking-tighter uppercase font-bold">
              SYS_BUSY
            </span>
          </div>

          {/* Terminal log list */}
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
            {/* Blinking block cursor */}
            <div className="flex items-center gap-1">
              <span className="text-[#EC4899]">&gt;</span>
              <span className="w-1.5 h-3 bg-white/60 animate-pulse"></span>
            </div>
          </div>
        </div>

        {/* Compile percentage meter */}
        <div className="border-t border-white/[0.06] pt-3 text-[9px] space-y-1">
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
        </div>
      </div>
    </motion.div>
  );
}
