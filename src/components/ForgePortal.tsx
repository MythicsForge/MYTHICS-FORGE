/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Project, ChroniclePost, StudioSettings 
} from "../types";
import { 
  Flame, Cpu, Globe, Disc, Shield, Clock, BookOpen, 
  Search, ArrowRight, Github, ExternalLink, SlidersHorizontal, Sparkles, Terminal,
  MessageSquareCode, Send, User, Bot, X
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

export default function ForgePortal({ 
  projects, 
  setProjects, 
  chronicles, 
  setChronicles, 
  studioSettings,
  setStudioSettings,
  onReset 
}: ForgePortalProps) {
  // Navigation & Filtering
  const [selectedCategory, setSelectedCategory] = useState<string>("All Works");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
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
      content: `Greetings, traveler. I am Hephaestus, the AI Forge Master. What legendary designs, portfolio items, or Blogger integration scripts shall we sculpt today?`
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatError(null);
    
    const updatedHistory = [...chatHistory, { role: "user" as const, content: userMessage }];
    setChatHistory(updatedHistory);
    setIsChatLoading(true);

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
        throw new Error(`AI communication broke with status ${res.status}`);
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setChatHistory([
        ...updatedHistory,
        { role: "assistant" as const, content: data.reply || "My bellows went cold. Ask again..." }
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

  // Reusable Google AdSense Unit Component with real scripts and fallback styling
  const GoogleAdSenseUnit = ({ placement }: { placement: "header" | "footer" | "sidebar" }) => {
    if (!studioSettings.adsenseEnabled) return null;
    if (studioSettings.adsensePlacement !== placement) return null;

    const clientId = studioSettings.adsenseClientId || "ca-pub-1234567890123456";
    const slotId = studioSettings.adsenseSlotId || "9876543210";

    return (
      <div 
        id={`adsense-unit-${placement}`}
        className={`w-full relative mx-auto my-6 px-4 py-3 rounded-2xl border border-dashed transition-all duration-300 ${
          placement === "header" 
            ? "max-w-4xl bg-gradient-to-r from-amber-500/5 via-[#F9AB00]/10 to-amber-500/5 border-[#F9AB00]/20" 
            : placement === "sidebar"
            ? "max-w-xs bg-amber-500/5 border-[#F9AB00]/25"
            : "max-w-5xl bg-gradient-to-r from-[#F9AB00]/5 via-amber-500/5 to-[#F9AB00]/5 border-[#F9AB00]/15"
        }`}
      >
        {/* Subtle decorative AdSense logo element */}
        <div id="adsense-glow-wrapper" className="flex items-center justify-between text-[10px] font-mono text-[#F9AB00] mb-2 border-b border-white/5 pb-1.5 leading-none">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F9AB00] animate-pulse"></span>
            <span>Google AdSense Authorized Partner</span>
          </div>
          <span className="bg-[#F9AB00]/10 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-normal">
            AD UNIT ACTIVE
          </span>
        </div>

        {/* Ad container with real adsbygoogle slot */}
        <div className="flex items-center justify-center p-2 bg-black/40 border border-white/5 rounded-xl min-h-[90px] overflow-hidden relative">
          <ins 
            className="adsbygoogle"
            style={{ display: "block", minWidth: "250px", height: placement === "sidebar" ? "250px" : "90px" }}
            data-ad-client={clientId}
            data-ad-slot={slotId}
            data-ad-format={placement === "sidebar" ? "rectangle" : "horizontal"}
            data-full-width-responsive="true"
          />
          
          {/* Ethereal background grid accent */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] opacity-25 pointer-events-none"></div>

          {/* Fallback mockup preview helper inside AI Studio development frame */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 text-center pointer-events-none select-none p-3 border border-dashed border-[#F9AB00]/30 rounded-xl">
            <div className="text-[11px] font-serif font-bold text-slate-200 tracking-tight">
              Interactive Google AdSense Advertisement Unit
            </div>
            <div className="text-[9px] font-mono text-amber-400 mt-1 uppercase">
              Publisher: {clientId} | Slot ID: {slotId}
            </div>
            <div className="text-[9px] font-sans text-slate-400 mt-0.5">
              Live banner matches Blogger theme viewport dynamically.
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
    <div className="min-h-screen relative flex flex-col justify-between selection:bg-[#4F46E5] selection:text-white bg-[#080712]">
      {/* Outcrowd style premium soft glowing glass gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Glows */}
        <div className="absolute top-[-300px] left-[-200px] w-[800px] h-[800px] bg-gradient-to-br from-[#4F46E5] via-[#7C3AED] to-transparent opacity-[0.16] rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute top-[30%] right-[-100px] w-[600px] h-[600px] bg-gradient-to-tr from-[#EC4899] via-fuchsia-600 to-transparent opacity-[0.12] rounded-full blur-[160px] animate-pulse" style={{ animationDuration: '14s' }}></div>
        <div className="absolute bottom-[-100px] left-[20%] w-[700px] h-[700px] bg-gradient-to-br from-[#FF5E13] via-[#4F46E5] to-transparent opacity-[0.1] rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '12s' }}></div>

        {/* Floating smooth glow rings */}
        <div className="absolute bottom-20 left-[15%] w-3 h-3 bg-[#EC4899]/40 rounded-full sparkle-particle" style={{ animationDelay: "0s", animationDuration: "9s" }}></div>
        <div className="absolute top-40 left-[45%] w-4 h-4 bg-[#4F46E5]/30 rounded-full sparkle-particle" style={{ animationDelay: "2s", animationDuration: "12s" }}></div>
        <div className="absolute bottom-1/3 left-[75%] w-3 h-3 bg-[#FF5E13]/30 rounded-full sparkle-particle" style={{ animationDelay: "4s", animationDuration: "8s" }}></div>
        <div className="absolute top-2/3 left-[85%] w-4 h-4 bg-emerald-400/20 rounded-full sparkle-particle" style={{ animationDelay: "1s", animationDuration: "11s" }}></div>
      </div>

      {/* Main Container Content */}
      <main className="flex-1 w-full relative z-10 px-6 py-6 md:py-10 max-w-7xl mx-auto space-y-12">
        {/* Top Branding Nav Header - Dynamic Alignment, Scale, and Positioning */}
        <header className={
          studioSettings.logoAlignment === "left"
            ? "flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-8 pt-4 gap-6 text-center md:text-left w-full mx-auto"
            : studioSettings.logoAlignment === "right"
            ? "flex flex-col md:flex-row-reverse md:items-center justify-between border-b border-white/5 pb-8 pt-4 gap-6 text-center md:text-right w-full mx-auto"
            : "flex flex-col items-center justify-center text-center border-b border-white/5 pb-8 pt-4 gap-6 w-full mx-auto"
        }>
          <div className={
            studioSettings.logoAlignment === "left"
              ? "flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 max-w-2xl text-center md:text-left w-full"
              : studioSettings.logoAlignment === "right"
              ? "flex flex-col md:flex-row-reverse items-center md:items-start gap-4 md:gap-6 max-w-2xl text-center md:text-right w-full"
              : "flex flex-col items-center justify-center gap-4 max-w-2xl text-center w-full mx-auto"
          }>
            {/* Customizable Logo - Floating frameless silhouette with soft edge-fading and ethereal aura */}
            <motion.div 
              className={`relative group shrink-0 select-none z-10 ${
                studioSettings.logoAlignment === "center" ? "mx-auto" : "mx-auto md:mx-0"
              }`}
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 1.2, -1.2, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 6.5, 
                ease: "easeInOut" 
              }}
            >
              {/* Ethereal backing aura that diffuses light behind the floating picture */}
              <div className="absolute inset-2 bg-gradient-to-tr from-[#4F46E5] to-[#EC4899] opacity-45 blur-2xl group-hover:opacity-65 transition duration-700 pointer-events-none scale-110 rounded-full"></div>
              
              <div 
                className={`relative flex items-center justify-center transition-all duration-500 hover:scale-[1.04] mx-auto ${
                  studioSettings.logoScale === "small"
                    ? "w-28 h-28"
                    : studioSettings.logoScale === "large"
                    ? "w-56 h-56"
                    : "w-40 h-40"
                }`}
                style={{
                  WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0.72) 85%, rgba(0,0,0,0) 100%)',
                  maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 60%, rgba(0,0,0,0.72) 85%, rgba(0,0,0,0) 100%)'
                }}
              >
                {studioSettings.logoImageUrl ? (
                  <img 
                    src={studioSettings.logoImageUrl} 
                    alt="Logo" 
                    className={`w-full h-full object-contain mx-auto object-${studioSettings.logoObjectPosition || "center"} transition-transform duration-500`}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className={`relative mx-auto font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/65 tracking-wide filter drop-shadow-[0_2px_8px_rgba(79,70,229,0.5)] ${
                    studioSettings.logoScale === "small"
                      ? "text-2xl"
                      : studioSettings.logoScale === "large"
                      ? "text-5xl"
                      : "text-3xl"
                  }`}>
                    {studioSettings.logoText || "MF"}
                  </span>
                )}
              </div>
            </motion.div>
 
            <div className={
              studioSettings.logoAlignment === "left"
                ? "space-y-1.5 mt-2 md:mt-0 text-center md:text-left"
                : studioSettings.logoAlignment === "right"
                ? "space-y-1.5 mt-2 md:mt-0 text-center md:text-right"
                : "space-y-1.5 mt-2 text-center w-full mx-auto flex flex-col items-center justify-center"
            }>
              <h1 className="font-serif font-black text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 tracking-tight leading-none select-none text-center">
                {studioSettings.title || "Mythics Forge"}
              </h1>
              <p className={
                studioSettings.logoAlignment === "left"
                  ? "text-xs text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#EC4899] font-sans tracking-widest uppercase font-extrabold text-center md:text-left"
                  : studioSettings.logoAlignment === "right"
                  ? "text-xs text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#EC4899] font-sans tracking-widest uppercase font-extrabold text-center md:text-right"
                  : "text-xs text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#EC4899] font-sans tracking-widest uppercase font-extrabold text-center"
              }>
                {studioSettings.tagline || "We Build Future"}
              </p>
              <p className={
                studioSettings.logoAlignment === "left"
                  ? "text-xs text-white/50 max-w-xl font-sans font-light tracking-wide leading-relaxed mx-auto md:mx-0"
                  : studioSettings.logoAlignment === "right"
                  ? "text-xs text-white/50 max-w-xl font-sans font-light tracking-wide leading-relaxed mx-auto md:mr-0"
                  : "text-xs text-white/50 max-w-xl font-sans font-light tracking-wide leading-relaxed mx-auto text-center"
              }>
                {studioSettings.description || "An elite, independent digital craft studio."}
              </p>
            </div>
          </div>
 
          {/* Quick Stats Grid & Clock (Sleek Centered Hub) */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <div className="bg-white/[0.03] border border-white/[0.06] px-4 py-2 rounded-2xl flex items-center gap-2.5 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.2)]">
              <Clock className="w-4 h-4 text-[#EC4899] animate-pulse shrink-0" />
              <div className="text-left">
                <p className="text-[9px] text-white/30 uppercase tracking-widest font-mono font-bold">SYSTEM_CHRONO_TIME</p>
                <p className="text-white/80 text-xs font-medium whitespace-nowrap mt-0.5">{currentTime || "SYNCING..."}</p>
              </div>
            </div>
 
            <button
              onClick={() => setShowConsole(!showConsole)}
              id="toggle-console-head"
              className="px-4 py-2.5 bg-white/[0.03] hover:bg-gradient-to-r hover:from-[#4F46E5]/10 hover:to-[#EC4899]/10 hover:text-white text-white/70 border border-white/[0.06] hover:border-[#4F46E5]/30 text-xs font-mono rounded-2xl flex items-center gap-2 cursor-pointer transition-all duration-300 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.2)]"
            >
              <Terminal className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span>{showConsole ? "Close Console" : "Creator Console"}</span>
            </button>
          </div>
        </header>

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

        {/* Google AdSense top banner slot */}
        <GoogleAdSenseUnit placement="header" />

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

        {/* Google AdSense sidebar ad container block */}
        <GoogleAdSenseUnit placement="sidebar" />

        {/* 2. THE VAULT PORTFOLIO REGISTRY SECTION */}
        {projects.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.06] pb-4 gap-4">
              <div className="space-y-1.5">
                <h3 className="text-xs font-serif tracking-[0.25em] font-extrabold text-[#EC4899] uppercase">
                  Curated Fabrications
                </h3>
                <p className="text-xs text-white/50 font-sans tracking-wide font-light">
                  Filter and query active code matrices, physical design structures, and immersive stories.
                </p>
              </div>

              {/* Search Input bar */}
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Query active domains or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/[0.08] focus:border-[#4F46E5]/60 focus:bg-white/[0.06] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white outline-none placeholder:text-white/30 transition-all font-sans backdrop-blur-md"
                />
              </div>
            </div>

            {/* Category Filter tabs */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              {CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 border rounded-full text-[10px] uppercase tracking-widest font-extrabold font-sans transition-all duration-300 flex items-center gap-2 cursor-pointer backdrop-blur-md ${
                      active 
                        ? "bg-gradient-to-r from-[#4F46E5] to-[#EC4899] text-white border-transparent shadow-[0_8px_25px_-5px_rgba(79,70,229,0.4)] scale-[1.02]" 
                        : "bg-white/[0.02] border-white/[0.08] text-white/60 hover:border-white/25 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    {getCategoryIcon(cat)}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>

            {/* Bento-styled catalog view grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((proj) => (
                  <motion.article
                    key={proj.id}
                    layoutId={`project-card-${proj.id}`}
                    onClick={() => setSelectedProject(proj)}
                    className="group relative bg-white/[0.02] border border-white/[0.06] hover:border-white/20 p-5 rounded-[2.2rem] transition-all duration-500 flex flex-col justify-between overflow-hidden cursor-pointer h-full hover:bg-white/[0.05] hover:shadow-[0_24px_50px_rgba(79,70,229,0.08)] backdrop-blur-md"
                  >
                    <div className="space-y-4">
                      {/* Cover photo slot */}
                      <div className="aspect-[16/9] w-full overflow-hidden rounded-[1.7rem] bg-black relative border border-white/[0.05]">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.8] group-hover:brightness-[0.9]"
                        />
                        {/* Interactive metadata badge overlay */}
                        <span className="absolute top-3 left-3 px-3 py-1 bg-black/75 backdrop-blur-md border border-white/10 text-[9px] font-mono uppercase tracking-[0.15em] rounded-lg text-white/90">
                          {proj.category}
                        </span>
                      </div>

                      <div className="space-y-1.5 px-1 pb-1">
                        <h4 className="font-serif text-base text-white font-extrabold group-hover:text-[#EC4899] transition-colors duration-300 uppercase tracking-wide">
                          {proj.title}
                        </h4>
                        <p className="text-xs text-white/60 leading-relaxed font-light">
                          {proj.summary}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/[0.06] mt-4 shrink-0 px-1 pb-1">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {proj.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] text-white/50 text-[9px] font-mono rounded-lg"
                          >
                            {tag}
                          </span>
                        ))}
                        {proj.tags.length > 3 && (
                          <span className="text-[9px] font-mono text-white/30 px-1 py-1">
                            +{proj.tags.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Operational launch panel overlay */}
                      <div className="flex items-center justify-between text-[10px] font-mono pt-1">
                        <div className="flex items-center gap-3.5 flex-wrap">
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#EC4899] tracking-widest uppercase font-extrabold transition-all duration-300 flex items-center gap-1.5">
                            INSPECT CASE STUDY <ArrowRight className="w-3.5 h-3.5 text-[#EC4899] group-hover:translate-x-1 transition-transform" />
                          </span>

                          {proj.gumroadUrl && (
                            <a
                              href={proj.gumroadUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-1 bg-gradient-to-r from-[#22C55E] to-[#10B981] hover:from-[#10B981] hover:to-[#22C55E] text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg flex items-center gap-1 shadow-md hover:scale-105 transition-all duration-200 border border-emerald-400/20"
                            >
                              <span>Buy from Gumroad</span>
                              <ExternalLink className="w-3 h-3 text-white" />
                            </a>
                          )}
                        </div>

                        {/* Display Performance spec pill */}
                        {proj.stats?.[0] && (
                          <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
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
                      <div className="col-span-full py-16 text-center border border-dashed border-white/10 rounded-[2.2rem] space-y-3 bg-white/[0.01]">
                        <p className="text-sm text-white/50 font-mono tracking-wider">
                          🔍 NO ACTIVE RELICS REGISTERED IN DATABASE FOR THAT QUERY
                        </p>
                        <button
                          onClick={() => { setSelectedCategory("All Works"); setSearchQuery(""); }}
                          className="px-5 py-2.5 bg-white/[0.03] border border-white/10 text-white hover:border-[#4F46E5]/40 text-xs rounded-full font-serif tracking-wide uppercase transition-colors shrink-0"
                        >
                          CLEAR SEARCH FILTER
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
          <section id="intellectual-chronicles-hub" className="space-y-6 pt-6 relative z-10">
            <div className="border-b border-white/[0.06] pb-4">
              <h3 className="text-xs font-serif tracking-[0.25em] font-extrabold text-[#EC4899] uppercase flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#EC4899]" /> RESEARCH LEDGER & INTELLECTUAL CHRONICLES
              </h3>
              <p className="text-xs text-white/50 font-sans tracking-wide font-light">
                Detailed developer diagnostics, WebGL mesh blueprint analysis, parametric math equations, and user trust guidelines.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {chronicles.map((post) => (
                <article
                  key={post.id}
                  id={`chronicle-card-${post.id}`}
                  onClick={() => setSelectedChronicle(post)}
                  className="group bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.05] hover:border-[#4F46E5]/40 transition-all duration-300 rounded-[2rem] p-5 flex flex-col justify-between cursor-pointer space-y-4 hover:shadow-[0_15px_35px_rgba(79,70,229,0.05)] backdrop-blur-md"
                >
                  <div className="space-y-3.5">
                    <div className="aspect-[16/10] overflow-hidden rounded-[1.4rem] border border-white/[0.05] relative bg-black">
                      <img
                        src={post.image}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75 group-hover:brightness-90 animate-fade-in"
                      />
                      <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 bg-black/85 backdrop-blur-md border border-white/10 text-[8px] font-mono uppercase tracking-widest rounded-lg text-white/90">
                        {post.category}
                      </span>
                    </div>

                    <div className="space-y-1.5 px-0.5">
                      <span className="text-[9px] text-[#EC4899] font-mono tracking-wider uppercase font-bold">{post.date}</span>
                      <h4 className="font-serif text-sm text-white font-extrabold line-clamp-2 uppercase group-hover:text-[#EC4899] transition-colors leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-white/50 text-[11px] leading-relaxed line-clamp-3 font-light font-sans mt-1">
                        {post.summary}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-[9px] font-mono text-white/45 group-hover:text-white/70 transition-colors px-0.5">
                    <span>{post.readTime}</span>
                    <span className="text-indigo-400 font-bold flex items-center gap-1 group-hover:underline">
                      READ LOG <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Google AdSense footer widget slot */}
      <div className="max-w-7xl mx-auto px-6">
        <GoogleAdSenseUnit placement="footer" />
      </div>

      {/* FOOTER */}
      <footer className="shrink-0 bg-[#070611]/60 backdrop-blur-xl border-t border-white/[0.06] mt-16 p-6 md:p-8 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap gap-12">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] uppercase tracking-[0.2em] opacity-35 font-bold font-sans">Status</span>
              <span className="text-xs font-mono text-[#10B981] tracking-tighter uppercase font-bold">FORGE_ACTIVE // 98% LOAD</span>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] uppercase tracking-[0.2em] opacity-35 font-bold font-sans">Completed</span>
              <span className="text-xs font-mono text-white/90 tracking-tighter font-semibold">42_DEPLOYED_MODULES</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] uppercase tracking-[0.2em] opacity-35 font-bold font-sans">Location</span>
              <span className="text-xs font-mono text-white/70 tracking-tighter">LAT_40.7128_N_74.0060_W</span>
            </div>

            {/* Legal Trust compliance pathways (Cookie Notice, Terms, Support Hub) */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] uppercase tracking-[0.2em] opacity-35 font-bold font-sans">Trust & Compliance</span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono">
                <button 
                  onClick={() => setActiveLegalTab("privacy")} 
                  className="hover:text-[#EC4899] text-white/60 transition-colors cursor-pointer text-left text-xs"
                >
                  Privacy Policy
                </button>
                <span className="text-white/10 select-none hidden sm:inline">•</span>
                <button 
                  onClick={() => setActiveLegalTab("terms")} 
                  className="hover:text-[#EC4899] text-white/60 transition-colors cursor-pointer text-left text-xs"
                >
                  Terms of Service
                </button>
                <span className="text-white/10 select-none hidden sm:inline">•</span>
                <button 
                  onClick={() => setActiveLegalTab("contact")} 
                  className="hover:text-[#EC4899] text-[#EC4899]/90 font-bold transition-colors cursor-pointer text-left text-xs"
                >
                  Support & Contacts
                </button>
              </div>
            </div>

            {/* Social Media applications hub */}
            <div className="flex flex-col gap-1.5 min-w-[150px]">
              <span className="text-[9px] uppercase tracking-[0.2em] opacity-40 font-bold font-sans text-white">Social Nexus</span>
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
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="w-7 h-7 flex items-center justify-center bg-white/5 hover:bg-white/10 hover:text-white rounded-lg border border-white/10 text-slate-400 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

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
                      {/* Standard text split with light dynamic custom paragraph rendering */}
                      {msg.content.split("\n").map((line, lIdx) => (
                        <p key={lIdx} className={line.trim() === "" ? "h-2" : "mb-1 text-slate-250"}>
                          {line}
                        </p>
                      ))}
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
