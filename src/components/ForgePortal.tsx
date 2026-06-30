/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import Markdown from "react-markdown";
import { 
  Project, ChroniclePost, StudioSettings 
} from "../types";
import { 
  Flame, Cpu, Globe, Disc, Shield, Clock, BookOpen, 
  Search, ArrowRight, Github, ExternalLink, SlidersHorizontal, Sparkles, Terminal,
  MessageSquareCode, Send, User, Bot, X, Key
} from "lucide-react";
import ProjectModal from "./ProjectModal";
import CreatorConsole from "./CreatorConsole";
import EmptyCategoryPanel from "./EmptyCategoryPanel";
import LegalAndSupportModal from "./LegalAndSupportModal";
import { motion, AnimatePresence } from "motion/react";
import { safeStorage } from "../safeStorage";

interface ForgePortalProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  chronicles: ChroniclePost[];
  setChronicles: (chronicles: ChroniclePost[]) => void;
  studioSettings: StudioSettings;
  setStudioSettings: (settings: StudioSettings) => void;
  onReset: () => void;
}

export const THEME_ACCENTS = {
  orange: {
    primaryHex: "#FF5E13",
    accentHex: "#F9AB00",
    glowColor: "rgba(249, 171, 0, 0.35)",
    bannerGlow: "shadow-[0_0_40px_rgba(249,171,0,0.12)]",
    textClass: "text-[#F9AB00]",
    textMuted: "text-[#FF5E13]",
    borderClass: "border-[#F9AB00]/20",
    borderFocusClass: "focus:border-[#FF5E13]/55",
    accentBorder: "border-[#F9AB00]/40",
    bgClass: "from-amber-500/5 via-[#F9AB00]/10 to-amber-500/5",
    btnGrad: "from-amber-500 to-[#FF5E13]",
    btnShadow: "shadow-[0_0_15px_rgba(249,171,0,0.3)]",
  },
  blue: {
    primaryHex: "#0284C7",
    accentHex: "#38BDF8",
    glowColor: "rgba(56, 189, 248, 0.35)",
    bannerGlow: "shadow-[0_0_40px_rgba(52,152,219,0.12)]",
    textClass: "text-[#38BDF8]",
    textMuted: "text-[#0284C7]",
    borderClass: "border-[#38BDF8]/20",
    borderFocusClass: "focus:border-[#0284C7]/55",
    accentBorder: "border-[#38BDF8]/40",
    bgClass: "from-sky-500/5 via-[#38BDF8]/10 to-sky-500/5",
    btnGrad: "from-sky-600 to-[#0284C7]",
    btnShadow: "shadow-[0_0_15px_rgba(56,189,248,0.3)]",
  },
  green: {
    primaryHex: "#059669",
    accentHex: "#34D399",
    glowColor: "rgba(52, 211, 153, 0.35)",
    bannerGlow: "shadow-[0_0_40px_rgba(46,204,113,0.12)]",
    textClass: "text-[#34D399]",
    textMuted: "text-[#059669]",
    borderClass: "border-[#34D399]/20",
    borderFocusClass: "focus:border-[#059669]/55",
    accentBorder: "border-[#34D399]/40",
    bgClass: "from-emerald-500/5 via-[#34D399]/10 to-emerald-500/5",
    btnGrad: "from-emerald-600 to-[#059669]",
    btnShadow: "shadow-[0_0_15px_rgba(52,211,153,0.3)]",
  },
  purple: {
    primaryHex: "#7C3AED",
    accentHex: "#A78BFA",
    glowColor: "rgba(167, 139, 250, 0.35)",
    bannerGlow: "shadow-[0_0_40px_rgba(155,89,182,0.12)]",
    textClass: "text-[#A78BFA]",
    textMuted: "text-[#7C3AED]",
    borderClass: "border-[#A78BFA]/20",
    borderFocusClass: "focus:border-[#7C3AED]/55",
    accentBorder: "border-[#A78BFA]/40",
    bgClass: "from-violet-500/5 via-[#A78BFA]/10 to-violet-500/5",
    btnGrad: "from-violet-600 to-[#7C3AED]",
    btnShadow: "shadow-[0_0_15px_rgba(167,139,250,0.3)]",
  },
  red: {
    primaryHex: "#DC2626",
    accentHex: "#F87171",
    glowColor: "rgba(248, 113, 113, 0.35)",
    bannerGlow: "shadow-[0_0_40px_rgba(231,76,60,0.12)]",
    textClass: "text-[#F87171]",
    textMuted: "text-[#DC2626]",
    borderClass: "border-[#F87171]/20",
    borderFocusClass: "focus:border-[#DC2626]/55",
    accentBorder: "border-[#F87171]/40",
    bgClass: "from-rose-500/5 via-[#F87171]/10 to-rose-500/5",
    btnGrad: "from-rose-600 to-[#DC2626]",
    btnShadow: "shadow-[0_0_15px_rgba(248,113,113,0.3)]",
  }
};

export default function ForgePortal({ 
  projects, 
  setProjects, 
  chronicles, 
  setChronicles, 
  studioSettings,
  setStudioSettings,
  onReset 
}: ForgePortalProps) {
  // Theme Config Selection
  const activePreset = studioSettings.accentPreset || "orange";
  const activeAccent = THEME_ACCENTS[activePreset as keyof typeof THEME_ACCENTS] || THEME_ACCENTS.orange;

  // Navigation & Filtering
  const [selectedCategory, setSelectedCategory] = useState<string>("All Works");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Blog Reader active states
  const [selectedChronicle, setSelectedChronicle] = useState<ChroniclePost | null>(null);

  // Featured Slideshow index
  const featuredProjects = projects.filter(p => p.isFeatured);
  const [featuredIdx, setFeaturedIdx] = useState(0);

  // Controls drawer consoles
  const [showConsole, setShowConsole] = useState(false);

  // Legal Trust portal & cookie preferences trackers (Google AdSense compliance guidelines)
  const [activeLegalTab, setActiveLegalTab] = useState<"privacy" | "terms" | "contact" | null>(null);
  const [showConsentBanner, setShowConsentBanner] = useState(false);

  // Hephaestus AI Chat Assistant state and core query pipeline
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content: `Greetings, traveler. I am Hephaestus, the AI Forge Master. What legendary designs, portfolio items, or Blogger integration scripts shall we sculpt today?

💡 **Secure Chats**: If you are loading this application natively from your live Google Blogger site, please add your personal **Gemini API Key** in the input panel below to activate secure, direct chat interactions!`
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [userGeminiKey, setUserGeminiKey] = useState<string>(() => {
    return safeStorage.getItem("mythics_user_gemini_key") || "";
  });
  const [showKeyInput, setShowKeyInput] = useState(false);

  const queryDirectGemini = async (historyData: { role: "user" | "assistant"; content: string }[], keyToUse: string): Promise<string> => {
    const contentsMapped = historyData.map((turn) => ({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: turn.content }]
    }));

    const stateContextStr = `
CURRENT MYTHICS FORGE STUDIO STATES:
- title: "${studioSettings?.title || "Mythics Forge"}"
- description: "${studioSettings?.description || "An elite, independent digital craft studio."}"
- logoText: "${studioSettings?.logoText || "MYTHICS"}"
- tagline: "${studioSettings?.tagline || "We Build Future"}"
- Monetag Integration Status: ${studioSettings?.monetagEnabled ? `ACTIVE (Zone ID: ${studioSettings.monetagZoneId}, Format: ${studioSettings.monetagFormat})` : "INACTIVE / DISABLED"}
- Active Creator Projects Showcase:
${projects.map((p: any, i: number) => `  ${i+1}. [Category: ${p.category}] "${p.title}" - Description: ${p.description}. Tech-Stack: ${(p.tags || []).join(", ")}`).join("\n")}
- Chronicles/Articles Repository:
${chronicles.map((c: any, i: number) => `  ${i+1}. "${c.title}" [Category: ${c.category}] - Summary: ${c.summary}`).join("\n")}
`;

    const customSystemInstruction = `You are "Hephaestus", the legendary AI Forge Master and expert assistant of the "Mythics Forge" web application.
Your mission is to resolve users' queries, give sound recommendations about web typography, teach them how to deploy customized templates to Google Blogger, and assist with Monetag embedding.

Core Identity and Rules:
1. Carry a refined, powerful, yet friendly craftsman motif (e.g., using terms like "forging", "sculpting", "metal", "artifacts", "realm").
2. Answer inquiries directly and use beautiful, clean Markdown lists and spacing.
3. Reference active portfolio projects, titles, and chronicles dynamically provided in the context below if asked.
4. Promote the current project setup! Be highly encouraging of their digital items.
5. NEVER reveal sensitive environment configurations, raw server-side paths, or database internals.

${stateContextStr}

Deployment Guidance for Blogger:
- If a user asks "how do I use this inside Blogger?" or "how to upload the theme?":
  1. Go to the top Creator Console in the header bar.
  2. Click the "Export Blogger Template Source (XML)" button. This downloads a self-contained, SEO-optimized XML theme file.
  3. Head to your Google Blogger dashboard (blogger.com), go to the "Theme" section.
  4. Click the small dropdown arrow next to the orange "Customize" button and choose "Edit HTML".
  5. Select all existing text (Ctrl+A / Cmd+A) and paste the entire content of our downloaded XML theme.
  6. Click the disk/save icon in the top right. Success!
`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${keyToUse}`;
    const geminiRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: contentsMapped,
        systemInstruction: {
          parts: [{ text: customSystemInstruction }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      })
    });

    if (!geminiRes.ok) {
      const errorData = await geminiRes.json().catch(() => ({}));
      const statusText = errorData?.error?.message || `HTTP status ${geminiRes.status}`;
      throw new Error(`Google Handshake failed: ${statusText}`);
    }

    const geminiData = await geminiRes.json();
    const generatedText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error("No response content from Google Gemini model.");
    }

    return generatedText;
  };

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSubmit = customText || chatInput;
    if (!textToSubmit.trim() || isChatLoading) return;

    const userMessage = textToSubmit.trim();
    if (!customText) {
      setChatInput("");
    }
    setChatError(null);
    
    const updatedHistory = [...chatHistory, { role: "user" as const, content: userMessage }];
    setChatHistory(updatedHistory);
    setIsChatLoading(true);

    const keyToUse = userGeminiKey.trim();

    try {
      let replyText = "";

      if (keyToUse) {
        // User has explicitly provided a personal Gemini API Key, use direct browser call
        replyText = await queryDirectGemini(updatedHistory, keyToUse);
      } else {
        // No personal API key, try the backend API route first
        try {
          const res = await fetch("/api/ai/query", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: userMessage,
              history: updatedHistory,
            }),
          });

          if (!res.ok) {
            throw new Error(`Server returned status ${res.status}`);
          }

          const data = await res.json();
          if (data.error) {
            throw new Error(data.error);
          }
          replyText = data.reply;
        } catch (serverErr: any) {
          console.warn("Backend API route unreachable or returned status. Triggering direct browser internet fallback...", serverErr);
          
          const isBloggerHost = window.location.hostname.includes("blogspot.com") || window.location.hostname.includes("blogger.com");
          
          setShowKeyInput(true);
          if (isBloggerHost) {
            throw new Error("🔑 Live Blogger Site Detected. Because your custom blog is served statically by Google Blogger, direct server backend APIs are not present. To enable direct and secure chat from your blog, please enter your Gemini API Key in the input panel below.");
          } else {
            throw new Error("🔑 Server connection failed. To chat safely, please enter a Gemini API Key in the panel below to query the Gemini API directly from your browser.");
          }
        }
      }

      setChatHistory([
        ...updatedHistory,
        { role: "assistant" as const, content: replyText || "My bellows went cold. Ask again..." }
      ]);
    } catch (err: any) {
      console.error("AI Communication Error:", err);
      setChatError(err.message || "Something went wrong sending that pulse to the matrix.");
    } finally {
      setIsChatLoading(false);
    }
  };

  useEffect(() => {
    const savedChoice = safeStorage.getItem("mythics_forge_cookie_choice");
    if (!savedChoice) {
      const displayTimer = setTimeout(() => {
        setShowConsentBanner(true);
      }, 1500);
      return () => clearTimeout(displayTimer);
    }
  }, []);

  // Coordinate static/dynamic server coordinate clocks of 2026-06-09
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    // Tick local coordinates
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Rotate Featured slides automatically
  useEffect(() => {
    if (featuredProjects.length <= 1) return;
    const interval = setInterval(() => {
      setFeaturedIdx((prev) => (prev + 1) % featuredProjects.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredProjects.length]);

  // Reusable Monetag Unit Component with real scripts and fallback styling
  const MonetagAdUnit = ({ placement }: { placement: "header" | "footer" | "sidebar" }) => {
    if (!studioSettings.monetagEnabled) return null;
    
    // For visual simulation, show in matching slots
    const zoneId = studioSettings.monetagZoneId || "8123456";
    const format = studioSettings.monetagFormat || "MultiTag";

    return (
      <div 
        id={`monetag-unit-${placement}`}
        className={`w-full relative mx-auto my-6 px-4 py-3 rounded-2xl border border-dashed transition-all duration-300 ${activeAccent.borderClass} ${
          placement === "header" 
            ? `max-w-4xl bg-gradient-to-r ${activeAccent.bgClass}` 
            : placement === "sidebar"
            ? `max-w-xs bg-gradient-to-b ${activeAccent.bgClass}`
            : `max-w-5xl bg-gradient-to-r ${activeAccent.bgClass}`
        }`}
      >
        {/* Subtle decorative Monetag logo element */}
        <div id="monetag-glow-wrapper" className={`flex items-center justify-between text-[10px] font-mono ${activeAccent.textClass} mb-2 border-b border-white/5 pb-1.5 leading-none`}>
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <span 
              className="w-1.5 h-1.5 rounded-full animate-pulse" 
              style={{ backgroundColor: activeAccent.accentHex }}
            />
            <span>Monetag Monetization Channel</span>
          </div>
          <span 
            className="px-1.5 py-0.5 rounded text-[8px] uppercase tracking-normal"
            style={{ backgroundColor: `${activeAccent.accentHex}1A`, color: activeAccent.accentHex }}
          >
            {format} ACTIVE
          </span>
        </div>

        {/* Ad container mockup for preview */}
        <div className="flex items-center justify-center p-2 bg-black/40 border border-white/5 rounded-xl min-h-[90px] overflow-hidden relative">
          <div className="monetag-native-ad" data-zone-id={zoneId} />
          
          {/* Ethereal background grid accent */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] opacity-25 pointer-events-none"></div>

          {/* Fallback mockup preview helper inside AI Studio development frame */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 text-center pointer-events-none select-none p-3 border border-dashed ${activeAccent.borderClass} rounded-xl`}>
            <div className="text-[11px] font-serif font-bold text-slate-200 tracking-tight">
              Monetag {format} Ad Unit Placement ({placement})
            </div>
            {zoneId && (
              <div className={`text-[9px] font-mono mt-1 uppercase ${activeAccent.textClass}`}>
                Zone / Script ID: {zoneId}
              </div>
            )}
            <div className="text-[9px] font-sans text-slate-400 mt-0.5">
              Optimized ad integration executes seamlessly inside compiled Blogger templates.
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Filter projects by category and search
  const filteredProjects = projects.filter((proj) => {
    const matchesCategory = selectedCategory === "All Works" || proj.category === selectedCategory;
    const matchesQuery = 
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  // Category parameters
  const CATEGORIES = ["All Works", "Game Dev", "Immersive Web", "Creative Code", "Physical Design"];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Game Dev": return <Flame className="w-4 h-4 text-red-500" />;
      case "Immersive Web": return <Cpu className="w-4 h-4 text-amber-500" />;
      case "Creative Code": return <Disc className="w-4 h-4 text-teal-400" />;
      case "Physical Design": return <Globe className="w-4 h-4 text-indigo-400" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between selection:bg-[#4F46E5] selection:text-white bg-[#030209] overflow-x-hidden pt-20">
      {/* Outcrowd and CosmoQ inspired premium space glowing glass gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Glows */}
        <div className="absolute top-[-300px] left-[-200px] w-[800px] h-[800px] bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-transparent opacity-[0.14] rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute top-[30%] right-[-100px] w-[600px] h-[600px] bg-gradient-to-tr from-[#EC4899] via-fuchsia-600 to-transparent opacity-[0.1] rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '14s' }}></div>
        <div className="absolute bottom-[-100px] left-[20%] w-[700px] h-[700px] bg-gradient-to-br from-[#FF5E13] via-[#4F46E5] to-transparent opacity-[0.08] rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '12s' }}></div>

        {/* Floating smooth glow rings */}
        <div className="absolute bottom-20 left-[15%] w-3 h-3 bg-[#EC4899]/40 rounded-full sparkle-particle" style={{ animationDelay: "0s", animationDuration: "9s" }}></div>
        <div className="absolute top-40 left-[45%] w-4 h-4 bg-[#4F46E5]/30 rounded-full sparkle-particle" style={{ animationDelay: "2s", animationDuration: "12s" }}></div>
        <div className="absolute bottom-1/3 left-[75%] w-3 h-3 bg-[#FF5E13]/30 rounded-full sparkle-particle" style={{ animationDelay: "4s", animationDuration: "8s" }}></div>
        <div className="absolute top-2/3 left-[85%] w-4 h-4 bg-emerald-400/20 rounded-full sparkle-particle" style={{ animationDelay: "1s", animationDuration: "11s" }}></div>
      </div>

      {/* Cosmic Orbit Planet Graphics mimicking CosmoQ visual backdrop */}
      <div className="absolute top-[6%] right-[-10%] md:right-[5%] w-[350px] h-[350px] md:w-[600px] md:h-[600px] pointer-events-none z-0 opacity-40">
        <div 
          className="absolute inset-0 rounded-full border border-dashed opacity-35 animate-[spin_45s_linear_infinite]" 
          style={{ borderColor: activeAccent.accentHex }}
        />
        <div 
          className="absolute inset-[12%] rounded-full border border-double opacity-25 animate-[spin_28s_linear_infinite_reverse]" 
          style={{ borderColor: activeAccent.accentHex }}
        />
        <div 
          className="absolute inset-[26%] rounded-full border opacity-20 animate-[spin_18s_linear_infinite]" 
          style={{ borderColor: activeAccent.accentHex }}
        />
        {/* Central soft glowing orb */}
        <div 
          className="absolute inset-[32%] rounded-full opacity-35 filter blur-[50px] animate-pulse"
          style={{ 
            background: `radial-gradient(circle, ${activeAccent.accentHex} 0%, transparent 70%)` 
          }}
        />
      </div>

      {/* Centered Floating Glass Navigation Capsule - CosmoQ Style */}
      <nav 
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-2xl px-4 py-2 md:py-2.5 rounded-full border backdrop-blur-xl transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.7)] ${
          scrollY > 40 
            ? "bg-zinc-950/85 border-white/10" 
            : "bg-[#0A0918]/40 border-white/5"
        }`}
      >
        <div className="flex items-center justify-between gap-1.5 md:gap-3">
          {/* Left: Floating Brand Tag */}
          <div className="flex items-center gap-2">
            {studioSettings.logoImageUrl ? (
              <img 
                src={studioSettings.logoImageUrl} 
                alt="Logo" 
                className="w-5 h-5 rounded object-contain shrink-0" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <span 
                className="w-2 h-2 rounded-full animate-pulse shrink-0" 
                style={{ backgroundColor: activeAccent.accentHex, boxShadow: `0 0 10px ${activeAccent.accentHex}` }}
              />
            )}
            <span className="text-[10px] sm:text-xs font-mono font-bold text-white uppercase tracking-wider select-none whitespace-nowrap flex items-center gap-1">
              <span>{studioSettings.logoText || "Mythics Forge"}</span>
              <span className="opacity-40">// STUDIO</span>
            </span>
          </div>

          {/* Center: Scroll Options */}
          <div className="flex items-center gap-1 sm:gap-2.5 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase font-bold text-white/50">
            <a 
              href="#solo-creator-collective" 
              className="px-2 py-1.5 hover:text-white transition-colors hover:bg-white/5 rounded-lg whitespace-nowrap"
            >
              Studio
            </a>
            <a 
              href="#vault-curated" 
              className="px-2 py-1.5 hover:text-white transition-colors hover:bg-white/5 rounded-lg whitespace-nowrap"
            >
              Curated
            </a>
          </div>

          {/* Right: Companion Trigger */}
          <div className="flex items-center gap-1.5 font-mono">
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-3 py-1.5 bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/10 text-white rounded-full text-[9px] uppercase hover:scale-105 transition-all text-center cursor-pointer font-bold shrink-0"
              style={{ color: activeAccent.accentHex }}
            >
              Companion
            </button>
            <button
              onClick={() => setShowConsole(!showConsole)}
              className="w-7 h-7 flex items-center justify-center bg-white/5 border border-white/10 hover:border-white/20 text-white hover:bg-white/10 rounded-full cursor-pointer transition-all shrink-0"
              title="Toggle Console UI"
            >
              <Terminal className="w-3.5 h-3.5" style={{ color: activeAccent.accentHex }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container Content */}
      <main className="flex-1 w-full relative z-10 px-6 py-6 md:py-10 max-w-7xl mx-auto space-y-16">
        {/* Cosmic Display Title Block (Replacing Traditional Header) */}
        <section className="relative pt-6 pb-2 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 border-b border-white/[0.04] pb-10">
          <div className="space-y-4 max-w-3xl w-full">
            {/* Visual Section capsule badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-white/5 rounded-full select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-mono tracking-widest text-[#94A3B8] uppercase font-bold">STATE // FORGE CENTRAL INTERFACE ACTIVATED</span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 pt-2">
              {studioSettings.logoImageUrl && (
                <div className="flex-shrink-0 select-none">
                  <img 
                    src={studioSettings.logoImageUrl} 
                    alt="Logo" 
                    className="w-24 h-24 sm:w-32 sm:h-32 object-contain rounded-xl" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
              <div className="space-y-3 flex-1 text-center md:text-left">
                <h1 className="font-serif font-black text-4xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-white via-white/95 to-white/40 tracking-tighter leading-none select-none">
                  {studioSettings.title || "Mythics Forge"}
                </h1>
                <p 
                  className="text-xs md:text-sm font-mono tracking-[0.22em] font-extrabold uppercase leading-none"
                  style={{ color: activeAccent.accentHex }}
                >
                  {studioSettings.tagline || "We Build Future"}
                </p>
                <p className="text-xs md:text-sm text-[#94A3B8] max-w-xl font-sans font-light tracking-wide leading-relaxed mx-auto md:mx-0">
                  {studioSettings.description || "An elite, independent digital craft studio."}
                </p>
              </div>
            </div>
          </div>

          {/* Side Chrono-Chub Display */}
          <div className="flex flex-col items-center sm:items-end gap-3 text-xs font-mono shrink-0">
            <div className="bg-white/[0.02] border border-white/[0.06] p-4 rounded-2xl flex items-center gap-3 backdrop-blur-md shadow-lg min-w-[200px]">
              <Clock className="w-4 h-4 animate-pulse shrink-0" style={{ color: activeAccent.accentHex }} />
              <div className="text-left font-mono">
                <p className="text-[8px] text-white/30 uppercase tracking-widest font-extrabold">CHRONO_TIME_UTC</p>
                <p className="text-white/80 text-xs font-medium whitespace-nowrap mt-0.5">{currentTime || "SYNCING..."}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-[8px] text-white/30 uppercase tracking-wider font-mono">
              <span>ACCENT PRESET //</span>
              <span className="font-bold font-mono tracking-wide" style={{ color: activeAccent.accentHex }}>{activePreset}</span>
            </div>
          </div>
        </section>

        {/* Dynamic Admin console dropdown slot */}
        <AnimatePresence>
          {showConsole && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
              id="admin-console-drawer"
            >
              <CreatorConsole 
                projects={projects}
                setProjects={setProjects}
                chronicles={chronicles}
                setChronicles={setChronicles}
                studioSettings={studioSettings}
                setStudioSettings={setStudioSettings}
                onReset={onReset}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Monetag top banner slot */}
        <MonetagAdUnit placement="header" />

        {/* 1. HERO FEATURED CAROUSEL */}
        {featuredProjects.length > 0 && (
          <section className="relative rounded-[2.5rem] overflow-hidden bg-[#121124]/30 backdrop-blur-xl border border-white/[0.08] min-h-[460px] flex flex-col justify-end group transition-all duration-500 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.7)]">
            {/* Background elements */}
            <div className="absolute inset-0">
              <img 
                src={featuredProjects[featuredIdx].bannerImage} 
                alt="Featured Hero View" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-[0.22] transition-all duration-700 ease-out group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080712] via-black/30 to-transparent z-10"></div>
              {/* Geometric matrix overlay */}
              <div className="absolute inset-0 bg-diagonal-grid opacity-[0.07] z-0"></div>
            </div>

            {/* Slider Text Overlays */}
            <div className="relative z-20 p-8 md:p-12 max-w-3xl space-y-5">
              <div className="flex items-center gap-2.5">
                <span className="w-2, w-2 h-2 rounded-full bg-[#EC4899] animate-pulse"></span>
                <span className="text-[10px] text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#EC4899] font-mono tracking-[0.2em] font-extrabold uppercase">
                  Featured Project // {String(featuredIdx + 1).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
                  • {featuredProjects[featuredIdx].category}
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-serif font-black text-white tracking-tight leading-tight uppercase">
                {featuredProjects[featuredIdx].title}
              </h2>

              <p className="text-white/60 text-sm md:text-base leading-relaxed font-light">
                {featuredProjects[featuredIdx].summary}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <button
                  onClick={() => setSelectedProject(featuredProjects[featuredIdx])}
                  id="featured-details-btn"
                  className="px-8 py-3.5 bg-gradient-to-r from-[#4F46E5] to-[#EC4899] hover:from-[#EC4899] hover:to-[#4F46E5] text-white font-bold text-xs tracking-widest uppercase rounded-full hover:scale-105 transition-all duration-300 shadow-[0_10px_25px_rgba(79,70,229,0.3)] cursor-pointer"
                >
                  View Case Study
                </button>
              </div>
            </div>

            {/* Slide Navigation Dots */}
            {featuredProjects.length > 1 && (
              <div className="absolute top-8 right-8 z-20 flex gap-2.5">
                {featuredProjects.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setFeaturedIdx(dotIdx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      dotIdx === featuredIdx ? "bg-[#EC4899] scale-125 shadow-[0_0_12px_#EC4899]" : "bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* SOLO STUDIO DIRECTIVE */}
        <section id="solo-creator-collective" className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.08] p-6 md:p-8 rounded-[2rem] relative overflow-hidden backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Subtle background flair */}
          <div className="absolute top-1/2 right-[10%] w-[180px] h-[180px] bg-[#EC4899] opacity-[0.05] rounded-full blur-[60px] pointer-events-none"></div>
          <div className="absolute top-[-50px] left-[20%] w-[150px] h-[150px] bg-[#4F46E5] opacity-[0.04] rounded-full blur-[50px] pointer-events-none"></div>
          
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#EC4899]" />
              <span className="text-[10px] text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#EC4899] tracking-[0.25em] font-mono font-extrabold uppercase">
                COPORTRAIT & SOLO DIRECTIVE
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-serif font-black text-white tracking-tight uppercase leading-snug">
              Independent Operations, Elite Craftsmanship
            </h3>
            <p className="text-xs md:text-sm text-white/70 leading-relaxed font-light font-sans max-w-2xl">
              Mythics Forge is an independent software development agency and tech company founded and operated by myself as an individual architect. By unifying complex graphics shaders, low-latency WebSocket mappers, deterministic mathematics, and CAD modeling into a single workflow, I deliver ultra-high product cohesion with absolute precision.
            </p>
            <p className="text-xs text-white/50 leading-relaxed font-light font-sans max-w-2xl">
              There is no corporate committee friction or bloated overhead here. Every software repository, custom physics engine, WebGL utility, and spatial SDK prototype presented in this archive is designed, coded, and maintained in-house. I focus on raw efficiency, solid visual typography, and modular performance.
            </p>
            
            <div className="flex flex-wrap gap-3 pt-3 text-xs">
              <span className="text-white bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/[0.06] font-mono text-[9px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]"></span>
                FORMALLY AVAILABLE FOR ADVANCED OFFERS & CONTRACTS
              </span>
              <span className="text-white/60 px-3 py-1.5 rounded-xl border border-dashed border-white/10 font-mono text-[9px]">
                SOLO FOUNDER // ESTABLISHED 2023
              </span>
            </div>
          </div>

          <div className="lg:col-span-1 block border-l border-white/5 my-2 hidden lg:block"></div>

          <div className="lg:col-span-4 space-y-4 flex flex-col justify-center">
            <h4 className="text-[11px] text-white/40 tracking-wider font-mono uppercase">
              Core Engineering Domains
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Terminal className="w-4 h-4 text-[#FF5E13] shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider font-sans">Full-Stack Code Engineering</h5>
                  <p className="text-[10px] text-white/50 font-light font-sans mt-0.5">Asynchronous local proxies, JSON backlogs, database schemas, and micro-servers.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Cpu className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider font-sans">Immersive Browser Graphics</h5>
                  <p className="text-[10px] text-white/50 font-light font-sans mt-0.5">Custom WebGL document physics solvers, real-time GLSL filters, and twinkling constellation buffers.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider font-sans">Spatial Integration & WebXR</h5>
                  <p className="text-[10px] text-white/50 font-light font-sans mt-0.5">WebSocks synchronization clusters, CAD modeling (Fusion 360), and device haptic alerts.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Monetag sidebar ad container block */}
        <MonetagAdUnit placement="sidebar" />

        {/* 2. THE VAULT PORTFOLIO REGISTRY SECTION */}
        {projects.length > 0 && (
          <section id="vault-curated" className="space-y-8 pt-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.05] pb-6 gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-[#94A3B8]">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeAccent.accentHex }} />
                  CURATED ARCHIVE REGISTRY
                </div>
                <h3 className="text-xl md:text-2xl font-serif font-black text-white tracking-tight uppercase leading-none">
                  Legendary Fabrications
                </h3>
                <p className="text-xs text-white/40 font-sans tracking-wide font-light max-w-xl">
                  Query and examine active digital code matrices, interactive graphics libraries, and spatial utilities engineered by Hephaestus.
                </p>
              </div>

              {/* Search Input bar */}
              <div className="relative max-w-sm w-full font-mono">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="text"
                  placeholder="Query relics or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.01] border border-white/[0.07] focus:border-white/20 focus:bg-white/[0.04] rounded-full pl-10 pr-4 py-2.5 text-xs text-white outline-none placeholder:text-white/20 transition-all font-sans backdrop-blur-md"
                />
              </div>
            </div>

            {/* Category Filter tabs - CosmoQ glass capsules layout */}
            <div className="flex flex-wrap gap-2 pt-1">
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="px-4.5 py-2 border rounded-full text-[9px] uppercase tracking-widest font-bold font-mono transition-all duration-300 flex items-center gap-2 cursor-pointer backdrop-blur-md"
                    style={{
                      backgroundColor: active ? `${activeAccent.accentHex}12` : "rgba(255, 255, 255, 0.01)",
                      borderColor: active ? activeAccent.accentHex : "rgba(255, 255, 255, 0.06)",
                      color: active ? "#FFFFFF" : "rgba(255, 255, 255, 0.45)",
                      boxShadow: active ? `0 0 15px ${activeAccent.accentHex}20` : "none"
                    }}
                  >
                    {getCategoryIcon(cat)}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>

            {/* Bento-styled catalog view grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((proj) => (
                  <motion.article
                    key={proj.id}
                    layoutId={`project-card-${proj.id}`}
                    onClick={() => setSelectedProject(proj)}
                    className="group relative bg-[#070611]/45 border border-white/[0.05] p-5 rounded-[2.2rem] transition-all duration-500 flex flex-col justify-between overflow-hidden cursor-pointer h-full hover:bg-[#0B0A1C]/55 backdrop-blur-md"
                    whileHover={{
                      y: -5,
                      borderColor: activeAccent.accentHex,
                      boxShadow: `0 20px 40px -15px ${activeAccent.accentHex}14, 0 0 20px ${activeAccent.accentHex}08`
                    }}
                  >
                    <div className="space-y-4">
                      {/* Cover photo slot */}
                      <div className="aspect-[16/9] w-full overflow-hidden rounded-[1.7rem] bg-black relative border border-white/[0.04]">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 brightness-[0.7] group-hover:brightness-[0.8]"
                        />
                        {/* Interactive metadata badge overlay */}
                        <span className="absolute top-3 left-3 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/5 text-[9px] font-mono uppercase tracking-[0.15em] rounded-lg text-white/80">
                          {proj.category}
                        </span>
                      </div>

                      <div className="space-y-1.5 px-1 pb-1">
                        <h4 className="font-serif text-base text-white font-extrabold transition-colors duration-300 uppercase tracking-wide group-hover:text-white">
                          {proj.title}
                        </h4>
                        <p className="text-xs text-white/50 leading-relaxed font-light">
                          {proj.summary}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/[0.05] mt-4 shrink-0 px-1 pb-1">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {proj.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-white/[0.02] border border-white/[0.05] text-white/40 text-[9px] font-mono rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        {proj.tags.length > 3 && (
                          <span className="text-[9px] font-mono text-white/20 px-1 py-1">
                            +{proj.tags.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Operational launch panel overlay */}
                      <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                        <div className="flex items-center gap-3.5 flex-wrap">
                          <span 
                            className="tracking-widest uppercase font-extrabold transition-all duration-300 flex items-center gap-1.5 text-[9px]"
                            style={{ color: activeAccent.accentHex }}
                          >
                            INSPECT REMARKABLE DETAILS <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </span>

                          {proj.gumroadUrl && (
                            <a
                              href={proj.gumroadUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg flex items-center gap-1 shadow-md hover:scale-105 transition-all duration-200 border border-emerald-400/10"
                            >
                              <span>Acquire</span>
                              <ExternalLink className="w-3 h-3 text-white" />
                            </a>
                          )}
                        </div>

                        {/* Display Performance spec pill */}
                        {proj.stats?.[0] && (
                          <span className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                            {proj.stats[0].value}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.article>
                ))
              ) : (
                (() => {
                  const isCategoryEmptyOfProjects = selectedCategory !== "All Works" && projects.filter(p => p.category === selectedCategory).length === 0;
                  
                  if (isCategoryEmptyOfProjects) {
                    return <EmptyCategoryPanel category={selectedCategory} />;
                  } else {
                    return (
                      <div className="col-span-full py-16 text-center border border-dashed border-white/5 rounded-[2.2rem] space-y-3 bg-white/[0.005]">
                        <p className="text-sm text-white/40 font-mono tracking-wider">
                          🔍 NO ACTIVE RELICS REGISTERED FOR THIS FILTER
                        </p>
                        <button
                          onClick={() => { setSelectedCategory("All Works"); setSearchQuery(""); }}
                          className="px-5 py-2.5 bg-white/[0.02] border border-white/5 text-white hover:border-white/20 text-xs rounded-full font-sans tracking-wide uppercase transition-colors shrink-0"
                        >
                          RESET FILTER
                        </button>
                      </div>
                    );
                  }
                })()
              )}
            </div>
          </section>
        )}

        {/* 3. RESEARCH LEDGER & INTELLECTUAL CHRONICLES */}
        {chronicles.length > 0 && (
          <section id="intellectual-chronicles-hub" className="space-y-8 pt-6 relative z-10">
            <div className="border-b border-white/[0.05] pb-6">
              <div className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] mb-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeAccent.accentHex }} />
                CHRONICLE_LOG_CENTRAL
              </div>
              <h3 className="text-xl md:text-2xl font-serif font-black text-white tracking-tight uppercase flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" style={{ color: activeAccent.accentHex }} /> RESEARCH LEDGER & INTELLECTUAL CHRONICLES
              </h3>
              <p className="text-xs text-white/40 font-sans tracking-wide font-light max-w-2xl">
                Detailed developer diagnostics, WebGL mesh blueprint analysis, parametric math equations, and user trust guidelines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {chronicles.map((post) => (
                <motion.article
                  key={post.id}
                  id={`chronicle-card-${post.id}`}
                  onClick={() => setSelectedChronicle(post)}
                  className="group bg-[#070611]/45 border border-white/[0.05] hover:border-white/20 transition-all duration-300 rounded-[2rem] p-5 flex flex-col justify-between cursor-pointer space-y-4 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] backdrop-blur-md"
                  whileHover={{
                    y: -4,
                    borderColor: activeAccent.accentHex,
                    boxShadow: `0 15px 30px -10px ${activeAccent.accentHex}12`
                  }}
                >
                  <div className="space-y-3.5">
                    <div className="aspect-[16/10] overflow-hidden rounded-[1.4rem] border border-white/[0.04] relative bg-black">
                      <img
                        src={post.image}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 brightness-75 group-hover:brightness-90 animate-fade-in"
                      />
                      <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 bg-black/85 backdrop-blur-md border border-white/5 text-[8px] font-mono uppercase tracking-widest rounded-lg text-white/90">
                        {post.category}
                      </span>
                    </div>

                    <div className="space-y-1.5 px-0.5">
                      <span className="text-[9px] font-mono tracking-wider uppercase font-bold" style={{ color: activeAccent.accentHex }}>{post.date}</span>
                      <h4 className="font-serif text-sm text-white font-extrabold line-clamp-2 uppercase group-hover:text-white transition-colors leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-white/40 text-[11px] leading-relaxed line-clamp-3 font-light font-sans mt-1">
                        {post.summary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-[9px] font-mono text-white/45 group-hover:text-white/70 transition-colors px-0.5">
                    <span>{post.readTime}</span>
                    <span className="font-bold flex items-center gap-1 group-hover:underline" style={{ color: activeAccent.accentHex }}>
                      READ LOG <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Monetag footer widget slot */}
      <div className="max-w-7xl mx-auto px-6">
        <MonetagAdUnit placement="footer" />
      </div>

      {/* FOOTER */}
      <footer className="shrink-0 bg-zinc-950/90 backdrop-blur-xl border-t border-white/[0.05] mt-16 p-8 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-wrap gap-12 text-center md:text-left">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] uppercase tracking-[0.2em] opacity-40 font-bold font-mono">Status</span>
              <span className="text-xs font-mono tracking-tighter uppercase font-bold flex items-center gap-1.5 justify-center md:justify-start" style={{ color: activeAccent.accentHex }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: activeAccent.accentHex, boxShadow: `0 0 8px ${activeAccent.accentHex}` }} />
                FORGE_ACTIVE // ONLINE
              </span>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] uppercase tracking-[0.2em] opacity-40 font-bold font-mono">Completed Projects</span>
              <span className="text-xs font-mono text-white/90 tracking-tighter font-semibold">42_LEGEND_MODULES</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] uppercase tracking-[0.2em] opacity-40 font-bold font-mono">Operations</span>
              <span className="text-xs font-mono text-white/60 tracking-tighter">LAT_40.7128_N_74.0060_W</span>
            </div>

            {/* Legal Trust compliance pathways (Cookie Notice, Terms, Support Hub) */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] uppercase tracking-[0.2em] opacity-40 font-bold font-mono">Trust & Compliance</span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono">
                <button 
                  onClick={() => setActiveLegalTab("privacy")} 
                  className="hover:text-white text-white/50 transition-colors cursor-pointer text-left text-xs"
                >
                  Privacy Policy
                </button>
                <span className="text-white/10 select-none hidden sm:inline">•</span>
                <button 
                  onClick={() => setActiveLegalTab("terms")} 
                  className="hover:text-white text-white/50 transition-colors cursor-pointer text-left text-xs"
                >
                  Terms of Service
                </button>
                <span className="text-white/10 select-none hidden sm:inline">•</span>
                <button 
                  onClick={() => setActiveLegalTab("contact")} 
                  className="font-bold transition-colors cursor-pointer text-left text-xs"
                  style={{ color: activeAccent.accentHex }}
                >
                  Support Nexus
                </button>
              </div>
            </div>

            {/* Social Media applications hub */}
            <div className="flex flex-col gap-1.5 min-w-[150px]">
              <span className="text-[9px] uppercase tracking-[0.2em] opacity-45 font-bold font-mono text-white/60">Social Nexus</span>
              <div className="flex items-center gap-2.5">
                {studioSettings.facebookUrl && (
                  <a 
                    href={studioSettings.facebookUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    id="facebook-social"
                    className="p-2.5 bg-white/[0.05] hover:bg-[#1877F2]/15 border border-white/10 hover:border-[#1877F2]/60 rounded-xl text-white hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-lg group"
                    title="Facebook Link"
                  >
                    <svg className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110 filter drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                {studioSettings.discordUrl && (
                  <a 
                    href={studioSettings.discordUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    id="discord-social"
                    className="p-2.5 bg-white/[0.05] hover:bg-[#5865F2]/15 border border-white/10 hover:border-[#5865F2]/60 rounded-xl text-white hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-lg group"
                    title="Discord Server"
                  >
                    <svg className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110 filter drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
                    </svg>
                  </a>
                )}
                {studioSettings.gumroadUrl && (
                  <a 
                    href={studioSettings.gumroadUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    id="gumroad-social"
                    className="p-2.5 bg-white/[0.05] hover:bg-[#FF90E8]/15 border border-white/10 hover:border-[#FF90E8]/60 rounded-xl text-white hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-lg group"
                    title="Gumroad Author Page"
                  >
                    <span className="w-5 h-5 flex items-center justify-center text-white font-sans text-base font-extrabold select-none transition-transform duration-300 group-hover:scale-110 filter drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]">
                      G
                    </span>
                  </a>
                )}
                {studioSettings.redditUrl && (
                  <a 
                    href={studioSettings.redditUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    id="reddit-social"
                    className="p-2.5 bg-white/[0.05] hover:bg-[#FF4500]/15 border border-white/10 hover:border-[#FF4500]/60 rounded-xl text-white hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-lg group"
                    title="Reddit Community"
                  >
                    <svg className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110 filter drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm4.24 11.42c.04.18.06.37.06.56 0 1.93-2.03 3.5-4.5 3.5s-4.5-1.57-4.5-3.5c0-.19.02-.38.06-.56-.47-.43-.76-1.05-.76-1.74 0-1.29 1.05-2.34 2.34-2.34.62 0 1.18.24 1.6.64.91-.63 2.14-1.04 3.5-1.1l-.75-2.36 2.04.44c.05-.51.48-.91.99-.91.55 0 1 .45 1 1s-.45 1-1 1c-.42 0-.77-.26-.92-.62l-1.64-.35.6 1.89c1.32.07 2.51.48 3.4 1.1.42-.4.98-.64 1.6-.64 1.29 0 2.34 1.05 2.34 2.34 0 .69-.29 1.31-.76 1.74zM9.5 11c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm5 0c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1z" />
                    </svg>
                  </a>
                )}
                {studioSettings.linkedinUrl && (
                  <a 
                    href={studioSettings.linkedinUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    id="linkedin-social"
                    className="p-2.5 bg-white/[0.05] hover:bg-[#0A66C2]/15 border border-white/10 hover:border-[#0A66C2]/60 rounded-xl text-white hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-lg group"
                    title="LinkedIn Hub"
                  >
                    <svg className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110 filter drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                )}
                {studioSettings.instagramUrl && (
                  <a 
                    href={studioSettings.instagramUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    id="instagram-social"
                    className="p-2.5 bg-white/[0.05] hover:bg-[#E1306C]/15 border border-white/10 hover:border-[#E1306C]/60 rounded-xl text-white hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-lg group"
                    title="Instagram Profile"
                  >
                    <svg className="w-5 h-5 text-white transition-transform duration-300 group-hover:scale-110 filter drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.58-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
            <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono tracking-[0.15em] uppercase">
              <span className="w-2 h-2 bg-[#EC4899] rounded-full animate-pulse shadow-[0_0_8px_#EC4899]"></span>
              <span>STATION_DISPATCH_AUTHORIZED</span>
            </div>
          </div>
        </div>
      </footer>
      
      {/* PORTFOLIO PROJECT CASE STUDY MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            accentHex={activeAccent.accentHex}
          />
        )}
      </AnimatePresence>

      {/* LEGAL COMPLIANCE & CLIENT SUPPORT HUB MODULES */}
      <AnimatePresence>
        {activeLegalTab && (
          <LegalAndSupportModal 
            activeTab={activeLegalTab} 
            onClose={() => setActiveLegalTab(null)} 
          />
        )}
      </AnimatePresence>

      {/* STATEFUL COOKIE & AD CHOICE CONSENT BANNER (GDPR / GOOGLE COMPLIANCY) */}
      <AnimatePresence>
        {showConsentBanner && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md bg-[#0F0E20]/95 backdrop-blur-xl border border-white/[0.08] p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 text-sans"
          >
            <div className="space-y-3.5">
              <div className="flex items-center gap-2">
                <span className="text-sm">🛡️</span>
                <h5 className="text-[11px] font-mono text-white tracking-widest uppercase font-bold">COOKIES & AD_CHOICE CONSENT</h5>
              </div>
              <p className="text-[10px] md:text-xs text-white/60 leading-relaxed font-light font-sans">
                Mythics Forge relies on standard client identifiers and tailors promotional sponsor banners. Review our fully compliant <button onClick={() => { setActiveLegalTab("privacy"); setShowConsentBanner(false); }} className="text-indigo-400 hover:underline cursor-pointer">Privacy Policy</button> to read about third-party Google cookies, active data logs, and options to opt-out.
              </p>
              <div className="flex items-center gap-2 pt-1 font-mono text-[9px]">
                <button
                  onClick={() => {
                    safeStorage.setItem("mythics_forge_cookie_choice", "accepted");
                    setShowConsentBanner(false);
                  }}
                  className="flex-1 py-2 bg-gradient-to-r from-indigo-650 to-purple-650 hover:from-purple-650 hover:to-indigo-650 text-white font-extrabold uppercase rounded-lg transition-colors cursor-pointer bg-indigo-600 text-center"
                >
                  Accept Choices
                </button>
                <button
                  onClick={() => {
                    safeStorage.setItem("mythics_forge_cookie_choice", "declined");
                    setShowConsentBanner(false);
                  }}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-lg border border-white/10 transition-colors cursor-pointer text-center"
                >
                  Decline All
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHRONICLES TEXT SCROLL READER OVERLAY */}
      <AnimatePresence>
        {selectedChronicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/85 transition-all duration-300">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0B0A16] border border-white/[0.08] rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Header block */}
              <div className="p-6 border-b border-white/[0.06] bg-gradient-to-r from-[#4F46E5]/10 to-[#EC4899]/10 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-[#EC4899] font-mono uppercase tracking-[0.2em] font-bold">{selectedChronicle.category}</span>
                  <h4 className="font-sans text-white font-extrabold text-base mt-1 uppercase tracking-wider">{selectedChronicle.title}</h4>
                </div>
                <button
                  onClick={() => setSelectedChronicle(null)}
                  className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 text-white/60 text-xs font-mono rounded-full cursor-pointer transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable Story content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 text-white/70 text-sm leading-relaxed font-sans font-light">
                <img
                  src={selectedChronicle.image}
                  alt={selectedChronicle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-48 object-cover rounded-xl brightness-[0.7] mb-4 border border-white/5"
                />
                
                {/* Parse chronicle body paragraphs nicely */}
                {selectedChronicle.content.split("\n\n").map((para, pIdx) => {
                  if (para.startsWith("- ")) {
                    return (
                      <ul key={pIdx} className="list-disc ml-5 space-y-2 text-white/85 max-w-md">
                        {para.split("\n").map((line, lIdx) => (
                          <li key={lIdx}>{line.replace("- ", "")}</li>
                        ))}
                      </ul>
                    );
                  }
                  return <p key={pIdx}>{para}</p>;
                })}
              </div>

              {/* Footer info line */}
              <div className="bg-[#040409] border-t border-white/[0.06] px-6 py-4 flex justify-between items-center text-[9px] text-white/40 font-mono uppercase tracking-[0.15em]">
                <span>SCROLL CHRONICLES ENGRAVED</span>
                <span>{selectedChronicle.date} • {selectedChronicle.readTime}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HEPHAESTUS INTELLIGENT AI SYSTEM COMPANION */}
      <div id="hephaestus-ai-module" className="fixed bottom-6 right-6 z-40 font-sans">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="absolute bottom-16 right-0 w-80 sm:w-96 h-[500px] bg-[#0A0918]/95 backdrop-blur-xl border border-indigo-500/25 rounded-2xl flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* Header Box */}
              <div className="p-4 bg-gradient-to-r from-indigo-950/80 via-purple-950/50 to-[#0A0918] border-b border-indigo-500/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-[#F9AB00] flex items-center justify-center text-black font-bold text-xs select-none shadow-[0_0_15px_rgba(249,171,0,0.3)]">
                      H
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0A0918] rounded-full animate-pulse"></span>
                  </div>
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-widest text-[#FFD1B3] font-black flex items-center gap-1">
                      <span>Hephaestus AI</span>
                      <Sparkles className="w-3 h-3 text-[#F9AB00]" />
                    </h4>
                    <span className="text-[9px] text-slate-400 font-mono tracking-wider">FORGE COMMANDER</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowKeyInput(!showKeyInput)}
                    title="Direct Gemini Connection Settings"
                    type="button"
                    className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-all duration-300 cursor-pointer ${
                      userGeminiKey.trim() 
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.15)]" 
                        : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Key className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="w-7 h-7 flex items-center justify-center bg-white/5 hover:bg-white/10 hover:text-white rounded-lg border border-white/10 text-slate-400 transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Collapsible Key-Panel */}
              {showKeyInput && (
                <div className="p-3.5 bg-[#0C0C1D] border-b border-indigo-500/20 text-slate-300 flex flex-col gap-2 font-mono text-[10px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#FFD1B3] font-bold tracking-wider text-[9px] uppercase">Browser-Direct API Routing</span>
                    <span className="text-[8px] text-emerald-400 uppercase font-black px-1.5 py-0.5 rounded bg-emerald-950/50 border border-emerald-500/20">Secure Local Client</span>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-normal font-sans">
                    Enter your Gemini API key to establish a direct connection to the internet without relying on any external backend server. Stored locally on this browser.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={userGeminiKey}
                      onChange={(e) => {
                        const val = e.target.value;
                        setUserGeminiKey(val);
                        safeStorage.setItem("mythics_user_gemini_key", val);
                      }}
                      placeholder="Paste your Gemini API Key here (AIzaSy...)"
                      className="flex-1 bg-black/60 border border-indigo-500/25 rounded-lg px-2.5 py-1.5 text-xs text-amber-400 outline-none focus:border-amber-500/40"
                    />
                    {userGeminiKey && (
                      <button
                        type="button"
                        onClick={() => {
                          setUserGeminiKey("");
                          safeStorage.removeItem("mythics_user_gemini_key");
                        }}
                        className="px-2 py-1.5 bg-red-950/40 text-red-400 border border-red-500/25 rounded-lg hover:bg-red-950/60 font-sans font-medium text-[9px] uppercase cursor-pointer transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Chat Message Box */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs scrollbar-thin scrollbar-thumb-white/5">
                {chatHistory.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                      msg.role === "user" 
                        ? "bg-indigo-650 text-white font-mono text-[9px] bg-indigo-600" 
                        : "bg-amber-500/10 border border-[#F9AB00]/20 text-[#F9AB00]"
                    }`}>
                      {msg.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>
                    <div className={`max-w-[80%] rounded-xl px-3 py-2.5 leading-relaxed relative ${
                      msg.role === "user"
                        ? "bg-indigo-650/40 text-slate-250 border border-indigo-500/15"
                        : "bg-slate-900/60 text-slate-350 border border-white/5"
                    }`}>
                      <div className="markdown-body">
                        <Markdown
                          components={{
                            strong: ({ children }) => <strong className="font-extrabold text-[#FFD1B3]">{children}</strong>,
                            p: ({ children }) => <p className="mb-2 text-slate-200 leading-relaxed font-sans last:mb-0">{children}</p>,
                            a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#F9AB00] hover:underline hover:text-amber-400 font-medium">{children}</a>,
                            ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-2 text-slate-300 font-sans">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 my-2 text-slate-300 font-sans">{children}</ol>,
                            li: ({ children }) => <li className="text-slate-300 mb-0.5">{children}</li>,
                            code: ({ children }) => <code className="bg-black/50 border border-white/10 rounded-md px-1 py-0.5 font-mono text-[10px] text-[#F9AB00]">{children}</code>,
                            pre: ({ children }) => <pre className="bg-slate-950 border border-white/10 rounded-xl p-2.5 my-2 font-mono text-[10px] text-slate-300 overflow-x-auto whitespace-pre-wrap break-all">{children}</pre>,
                            h1: ({ children }) => <h3 className="text-sm font-semibold tracking-tight text-white mb-2 pt-1 font-sans">{children}</h3>,
                            h2: ({ children }) => <h3 className="text-xs font-semibold tracking-tight text-[#FFD1B3] mb-1.5 pt-1 uppercase font-mono">{children}</h3>,
                            h3: ({ children }) => <h4 className="text-xs font-semibold tracking-tight text-[#FFD1B3]/90 mb-1 pt-1 font-mono">{children}</h4>,
                          }}
                        >
                          {msg.content}
                        </Markdown>
                      </div>
                    </div>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-[#F9AB00]/20 text-[#F9AB00] flex items-center justify-center animate-spin">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-slate-900/60 border border-white/5 rounded-xl px-3 py-2.5 flex items-center gap-1 text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]"></span>
                      <span className="text-[9px] font-mono uppercase tracking-wider ml-1 text-amber-500/50">Stoking the forge...</span>
                    </div>
                  </div>
                )}

                {chatError && (
                  <div className="p-3 bg-red-950/20 border border-red-500/10 text-red-300 text-[10px] rounded-lg font-mono">
                    ⚠️ {chatError}
                  </div>
                )}
              </div>

              {/* Interactive "Forge Sparks" chat starter row */}
              <div className={`px-3 py-1.5 border-t border-indigo-500/10 bg-[#070612]/90 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none scrollbar-thin`}>
                {[
                  { label: "🛡️ Scan Security Status", prompt: "Perform a system-level security check on the current chat agent and explain browser connection safety." },
                  { label: "🔑 Set Up API Key", prompt: "Explain how to safely obtain a free Gemini API Key and link it to this website." },
                  { label: "🛠️ Install Theme Guide", prompt: "Show me a step-by-step guide to download and install the compiled Mythics Forge XML theme inside Blogger." },
                  { label: "💵 Embed AdSense Code", prompt: "Show me how to insert Google AdSense ad units into my custom HTML sections." }
                ].map((spark, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={isChatLoading}
                    onClick={() => handleSendMessage(undefined, spark.prompt)}
                    className={`inline-flex shrink-0 items-center justify-center px-2.5 py-1 text-[9px] font-mono leading-none rounded-lg border text-slate-300 hover:text-white bg-[#0A0918]/60 transition-all cursor-pointer ${activeAccent.borderClass} hover:border-[#F9AB00]/40 disabled:opacity-50 disabled:cursor-not-allowed`}
                    style={{ borderColor: activeAccent.accentHex + '4D' }}
                  >
                    {spark.label}
                  </button>
                ))}
              </div>

              {/* Input Action Form */}
              <form 
                onSubmit={handleSendMessage} 
                className="p-3 bg-black/40 border-t border-indigo-500/10 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about templates, Blogger, AdSense..."
                  disabled={isChatLoading}
                  className="flex-1 bg-slate-950/80 border border-white/10 focus:border-[#F9AB00]/40 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isChatLoading}
                  className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-650 to-purple-650 hover:from-[#F9AB00] hover:to-amber-500 hover:text-black flex items-center justify-center text-white font-mono cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:shadow-[0_0_15px_rgba(249,171,0,0.3)] duration-300"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action FAB */}
        <motion.button
          onClick={() => setIsChatOpen(!isChatOpen)}
          animate={isChatOpen ? { rotate: [0, 90, 0] } : { scale: [1, 1.05, 1] }}
          transition={isChatOpen ? { duration: 0.3 } : { duration: 2, repeat: Infinity }}
          className="w-12 h-12 bg-gradient-to-tr from-indigo-610 via-[#F9AB00] to-pink-610 rounded-full flex items-center justify-center text-white shadow-[0_4px_25px_rgba(249,171,0,0.45)] cursor-pointer hover:scale-105 active:scale-95 transition-transform z-50 bg-indigo-600 relative overflow-hidden group"
          id="assistant-launcher-btn"
        >
          {/* Pulsing light ring */}
          <div className="absolute inset-0 bg-[#F9AB00]/40 blur-lg rounded-full opacity-60 group-hover:opacity-100 transition duration-300 scale-125 z-0"></div>
          
          <div className="relative z-10">
            {isChatOpen ? (
              <X className="w-5 h-5 text-slate-100" />
            ) : (
              <MessageSquareCode className="w-5 h-5 text-slate-950" />
            )}
          </div>
        </motion.button>
      </div>
    </div>
  );
}
