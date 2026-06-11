/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { 
  Project, ChroniclePost, StudioSettings 
} from "../types";
import { 
  Flame, Cpu, Globe, Disc, Shield, Clock, BookOpen, 
  Search, ArrowRight, Github, ExternalLink, SlidersHorizontal, Sparkles, Terminal
} from "lucide-react";
import ProjectModal from "./ProjectModal";
import CreatorConsole from "./CreatorConsole";
import EmptyCategoryPanel from "./EmptyCategoryPanel";
import { motion, AnimatePresence } from "motion/react";

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
            ? "flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-8 pt-4 gap-6 text-center md:text-left"
            : studioSettings.logoAlignment === "right"
            ? "flex flex-col md:flex-row-reverse md:items-center justify-between border-b border-white/5 pb-8 pt-4 gap-6 text-center md:text-right"
            : "flex flex-col items-center justify-center text-center border-b border-white/5 pb-8 pt-4 gap-6"
        }>
          <div className={
            studioSettings.logoAlignment === "left"
              ? "flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 max-w-2xl text-center md:text-left"
              : studioSettings.logoAlignment === "right"
              ? "flex flex-col md:flex-row-reverse items-center md:items-start gap-4 md:gap-6 max-w-2xl text-center md:text-right"
              : "flex flex-col items-center gap-4 max-w-2xl text-center"
          }>
            {/* Customizable Logo - Floating frameless silhouette with soft edge-fading and ethereal aura */}
            <motion.div 
              className="relative group shrink-0 select-none z-10"
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
                className={`relative flex items-center justify-center transition-all duration-500 hover:scale-[1.04] ${
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
                    className={`w-full h-full object-contain object-${studioSettings.logoObjectPosition || "center"} transition-transform duration-500`}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className={`relative font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/65 tracking-wide filter drop-shadow-[0_2px_8px_rgba(79,70,229,0.5)] ${
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
                : "space-y-1.5 mt-2 text-center"
            }>
              <h1 className="font-serif font-black text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 tracking-tight leading-none select-none">
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
                  : "text-xs text-white/50 max-w-xl font-sans font-light tracking-wide leading-relaxed mx-auto"
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
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#EC4899] tracking-widest uppercase font-extrabold transition-all duration-300 flex items-center gap-1.5">
                          INSPECT CASE STUDY <ArrowRight className="w-3.5 h-3.5 text-[#EC4899] group-hover:translate-x-1 transition-transform" />
                        </span>

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

      </main>

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
    </div>
  );
}
