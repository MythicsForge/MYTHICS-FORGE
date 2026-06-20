/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { 
  Terminal, ShieldCheck, Key, RefreshCw, Plus, 
  Trash2, Edit, Save, Undo2, LogOut, CheckCircle2, 
  Download, Upload, HeartHandshake, Eye, EyeOff,
  HelpCircle, Code
} from "lucide-react";
import { Project, ChroniclePost, StudioSettings } from "../types";
// @ts-ignore
import shieldImage from "../assets/images/regenerated_image_1781023425937.png";
// @ts-ignore
import logoSvg from "../assets/images/logo.svg";

interface CreatorConsoleProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  chronicles: ChroniclePost[];
  setChronicles: (chronicles: ChroniclePost[]) => void;
  studioSettings: StudioSettings;
  setStudioSettings: (settings: StudioSettings) => void;
  onReset: () => void;
}

export default function CreatorConsole({ 
  projects, 
  setProjects, 
  chronicles, 
  setChronicles, 
  studioSettings,
  setStudioSettings,
  onReset 
}: CreatorConsoleProps) {
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showBloggerGuide, setShowBloggerGuide] = useState(false);
  const [errorWord, setErrorWord] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Studio Settings Form state
  const [settingsForm, setSettingsForm] = useState({
    title: studioSettings.title,
    tagline: studioSettings.tagline,
    description: studioSettings.description,
    logoText: studioSettings.logoText,
    logoImageUrl: studioSettings.logoImageUrl,
    logoAlignment: studioSettings.logoAlignment || "center",
    logoObjectPosition: studioSettings.logoObjectPosition || "center",
    logoScale: studioSettings.logoScale || "medium",
    facebookUrl: studioSettings.facebookUrl || "",
    discordUrl: studioSettings.discordUrl || "",
    gumroadUrl: studioSettings.gumroadUrl || "",
    redditUrl: studioSettings.redditUrl || "",
    linkedinUrl: studioSettings.linkedinUrl || "",
    instagramUrl: studioSettings.instagramUrl || "",
    adsenseClientId: studioSettings.adsenseClientId || "",
    adsenseSlotId: studioSettings.adsenseSlotId || "",
    adsenseEnabled: studioSettings.adsenseEnabled || false,
    adsensePlacement: studioSettings.adsensePlacement || "footer"
  });

  const [isDraggingLogo, setIsDraggingLogo] = useState(false);

  const handleLogoFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      triggerAlertMessage("❌ DETECTOR ERROR: ONLY IMAGE CONSTRUCTS ARE VALUED!");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSettingsForm(prev => ({
          ...prev,
          logoImageUrl: event.target!.result as string
        }));
        triggerAlertMessage("✨ NEW LOGO SIGNED AND MOUNTED CORRECTLY!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Keep local settings in sync with prop updates
  useEffect(() => {
    setSettingsForm({
      title: studioSettings.title,
      tagline: studioSettings.tagline,
      description: studioSettings.description,
      logoText: studioSettings.logoText,
      logoImageUrl: studioSettings.logoImageUrl,
      logoAlignment: studioSettings.logoAlignment || "center",
      logoObjectPosition: studioSettings.logoObjectPosition || "center",
      logoScale: studioSettings.logoScale || "medium",
      facebookUrl: studioSettings.facebookUrl || "",
      discordUrl: studioSettings.discordUrl || "",
      gumroadUrl: studioSettings.gumroadUrl || "",
      redditUrl: studioSettings.redditUrl || "",
      linkedinUrl: studioSettings.linkedinUrl || "",
      instagramUrl: studioSettings.instagramUrl || "",
      adsenseClientId: studioSettings.adsenseClientId || "",
      adsenseSlotId: studioSettings.adsenseSlotId || "",
      adsenseEnabled: studioSettings.adsenseEnabled || false,
      adsensePlacement: studioSettings.adsensePlacement || "footer"
    });
  }, [studioSettings]);

  const handleSaveSettings = (e: FormEvent) => {
    e.preventDefault();
    setStudioSettings({
      title: settingsForm.title,
      tagline: settingsForm.tagline,
      description: settingsForm.description,
      logoText: settingsForm.logoText,
      logoImageUrl: settingsForm.logoImageUrl,
      logoAlignment: settingsForm.logoAlignment as "left" | "center" | "right",
      logoObjectPosition: settingsForm.logoObjectPosition as "center" | "top" | "bottom" | "left" | "right",
      logoScale: settingsForm.logoScale as "small" | "medium" | "large",
      facebookUrl: settingsForm.facebookUrl,
      discordUrl: settingsForm.discordUrl,
      gumroadUrl: settingsForm.gumroadUrl,
      redditUrl: settingsForm.redditUrl,
      linkedinUrl: settingsForm.linkedinUrl,
      instagramUrl: settingsForm.instagramUrl,
      adsenseClientId: settingsForm.adsenseClientId,
      adsenseSlotId: settingsForm.adsenseSlotId,
      adsenseEnabled: settingsForm.adsenseEnabled,
      adsensePlacement: settingsForm.adsensePlacement as "header" | "footer" | "sidebar" | "none"
    });
    triggerAlertMessage("🔥 BRANDING & COMPANY IDENTITY METAMORPHED SUCCESSFULLY!");
  };

  // Editing state variables
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState<{
    id: string;
    title: string;
    subtitle: string;
    category: "Game Dev" | "Immersive Web" | "Creative Code" | "Physical Design";
    summary: string;
    description: string;
    image: string;
    bannerImage: string;
    tags: string;
    role: string;
    client: string;
    timeline: string;
    githubUrl: string;
    liveUrl: string;
    stat1Label: string;
    stat1Value: string;
    stat2Label: string;
    stat2Value: string;
    isFeatured: boolean;
  }>({
    id: "",
    title: "",
    subtitle: "",
    category: "Game Dev",
    summary: "",
    description: "",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80",
    bannerImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80",
    tags: "",
    role: "",
    client: "",
    timeline: "",
    githubUrl: "",
    liveUrl: "",
    stat1Label: "",
    stat1Value: "",
    stat2Label: "",
    stat2Value: "",
    isFeatured: false
  });

  const triggerAlertMessage = (text: string) => {
    setSuccessMsg(text);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleUnlock = (e: FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase().trim() === "mitaksh") {
      setIsUnlocked(true);
      setErrorWord("");
      triggerAlertMessage("🔥 ROOT ACCESS SECURED: Forge embers set to active.");
    } else {
      setErrorWord("⛔ WRONG RUNIC KEY: Check ancient glyphs and try again.");
    }
  };

  const handleLaunchEdit = (proj: Project) => {
    setEditingProjectId(proj.id);
    setIsAddingNew(false);
    setFormData({
      id: proj.id,
      title: proj.title,
      subtitle: proj.subtitle,
      category: proj.category,
      summary: proj.summary,
      description: proj.description,
      image: proj.image,
      bannerImage: proj.bannerImage,
      tags: proj.tags.join(", "),
      role: proj.role,
      client: proj.client,
      timeline: proj.timeline,
      githubUrl: proj.githubUrl || "",
      liveUrl: proj.liveUrl || "",
      stat1Label: proj.stats?.[0]?.label || "",
      stat1Value: proj.stats?.[0]?.value || "",
      stat2Label: proj.stats?.[1]?.label || "",
      stat2Value: proj.stats?.[1]?.value || "",
      isFeatured: !!proj.isFeatured
    });
  };

  const handleLaunchNew = () => {
    setIsAddingNew(true);
    setEditingProjectId(null);
    setFormData({
      id: "project_" + Date.now().toString().slice(-4),
      title: "",
      subtitle: "",
      category: "Game Dev",
      summary: "",
      description: "### Overview\nDescribe the creation process here...\n\n### Technical Achievements\n- High frame rates\n- Seamless shaders",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80",
      bannerImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
      tags: "React, WebGL, GLSL",
      role: "Lead Creative Technologist",
      client: "Bespoke Commission",
      timeline: "Q2 2026",
      githubUrl: "",
      liveUrl: "",
      stat1Label: "Framerates",
      stat1Value: "90 FPS",
      stat2Label: "Latency",
      stat2Value: "<15ms",
      isFeatured: false
    });
  };

  const handleSaveProject = (e: FormEvent) => {
    e.preventDefault();
    
    // Parse tags array
    const tagsArr = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // Build stats array
    const statsArr = [];
    if (formData.stat1Label && formData.stat1Value) {
      statsArr.push({ label: formData.stat1Label, value: formData.stat1Value });
    }
    if (formData.stat2Label && formData.stat2Value) {
      statsArr.push({ label: formData.stat2Label, value: formData.stat2Value });
    }

    const updatedProject: Project = {
      id: formData.id.trim().toLowerCase().replace(/\s+/g, "-"),
      title: formData.title,
      subtitle: formData.subtitle,
      category: formData.category,
      summary: formData.summary,
      description: formData.description,
      image: formData.image,
      bannerImage: formData.bannerImage,
      tags: tagsArr,
      role: formData.role,
      client: formData.client,
      timeline: formData.timeline,
      githubUrl: formData.githubUrl || undefined,
      liveUrl: formData.liveUrl || undefined,
      stats: statsArr.length > 0 ? statsArr : undefined,
      isFeatured: formData.isFeatured
    };

    if (isAddingNew) {
      // Check if ID already exists
      if (projects.some((p) => p.id === updatedProject.id)) {
        setErrorWord("⛔ PROJECT ID ALREADY TAKEN: Please input a matching ID.");
        return;
      }
      setProjects([...projects, updatedProject]);
      triggerAlertMessage(`Successfully forged project: ${updatedProject.title}`);
    } else {
      setProjects(projects.map((p) => (p.id === editingProjectId ? updatedProject : p)));
      triggerAlertMessage(`Successfully updated project: ${updatedProject.title}`);
    }

    setEditingProjectId(null);
    setIsAddingNew(false);
  };

  const handleDeleteProject = (projId: string) => {
    if (confirm("Verify action: Melt down this project permanently?")) {
      setProjects(projects.filter((p) => p.id !== projId));
      triggerAlertMessage("Project melted back into liquid copper successfully.");
    }
  };

  // Export as config combined .app structure
  const handleExportData = () => {
    const backup = {
      projects,
      chronicles,
      studioSettings
    };
    const dataStr = "data:application/octet-stream;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "mythics_forge.app");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerAlertMessage("🔥 COMBINED PROGRAM STATE (.app) EXPORTED SUCCESSFULLY!");
  };

  // Fetch and download single-file Blogger bundle via robust blob triggers
  const handleDownloadSingleFile = async () => {
    try {
      const response = await fetch("/api/download-singlefile");
      if (!response.ok) {
        throw new Error("Critical fallback: Could not retrieve compiled single-file bundle from the engine.");
      }
      const data = await response.text();
      const blob = new Blob([data], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", url);
      downloadAnchor.setAttribute("download", "mythics_forge_blogger.html");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(url);
      triggerAlertMessage("🔥 COGNITIVE GRID METAMORPH: Blogger HTML bundle extracted successfully!");
    } catch (error: any) {
      console.error(error);
      triggerAlertMessage("⛔ PIPELINE INTERRUPTED: Failed to fetch single-file dataset.");
    }
  };

  // Fetch and download single-file Blogger XML template theme
  const handleDownloadBloggerXML = async () => {
    try {
      const response = await fetch("/api/download-blogger-theme-xml");
      if (!response.ok) {
        throw new Error("Critical fallback: Could not retrieve compiled single-file XML Theme from the engine.");
      }
      const data = await response.text();
      const blob = new Blob([data], { type: "application/xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", url);
      downloadAnchor.setAttribute("download", "mythics_forge_blogger_theme.xml");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(url);
      triggerAlertMessage("🔥 BLOGGER THEME MATRIX: Compliant XML Theme template downloaded successfully!");
    } catch (error: any) {
      console.error(error);
      triggerAlertMessage("⛔ PIPELINE INTERRUPTED: Failed to compile Blogger XML Theme.");
    }
  };

  // Import custom .app or .json program file
  const handleImportData = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && (Array.isArray(parsed.projects) || parsed.studioSettings)) {
          if (Array.isArray(parsed.projects)) {
            setProjects(parsed.projects);
          }
          if (Array.isArray(parsed.chronicles)) {
            setChronicles(parsed.chronicles);
          }
          if (parsed.studioSettings) {
            setStudioSettings(parsed.studioSettings);
          }
          triggerAlertMessage("🔥 COMBINED PROGRAM STATE (.app) MOUNTED SUCCESSFULLY! Forge system-nodes active!");
        } else {
          setErrorWord("⛔ BAD FORMAT: Uploaded program element lacked required fields.");
        }
      } catch (err: any) {
        setErrorWord("⛔ DECAY ERROR: Failed to parse structural program container.");
      }
    };
    fileReader.readAsText(file);
  };

  return (
    <section className="bg-white/[0.02] border border-white/[0.08] p-6 rounded-[2rem] mt-12 max-w-7xl mx-auto overflow-hidden shadow-[0_24px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      {/* Console bar banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/[0.06] pb-4 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-[#EC4899]" />
          <div>
            <h3 className="font-serif text-white font-extrabold text-base leading-tight uppercase tracking-wider">
              CREATOR_VAULT_CONSOLE
            </h3>
            <p className="text-[9px] text-[#EC4899] font-mono tracking-widest mt-0.5">
              SECURE DEPLOYMENT TERMINAL
            </p>
          </div>
        </div>

        {/* Lock Badges */}
        <div className="flex flex-wrap items-center gap-3">
          {isUnlocked ? (
            <>
              <button
                onClick={handleExportData}
                id="export-ledger-btn"
                className="px-3 py-1.5 bg-gradient-to-r from-[#4F46E5]/20 to-[#EC4899]/20 hover:from-[#4F46E5]/30 hover:to-[#EC4899]/30 border border-[#4F46E5]/30 hover:border-[#4F46E5]/55 text-slate-200 text-xs font-mono rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Download unified .app state package containing all settings, projects, and logs"
              >
                <Download className="w-3.5 h-3.5 text-[#EC4899]" />
                Export .app Container
              </button>

              <button
                onClick={handleDownloadSingleFile}
                id="blogger-export-btn"
                className="px-3 py-1.5 bg-gradient-to-r from-[#FF5E13]/25 to-[#EC4899]/25 hover:from-[#FF5E13]/40 hover:to-[#EC4899]/40 border border-[#FF5E13]/40 hover:border-[#FF5E13]/65 text-[#FFD1B3] hover:text-white text-xs font-mono rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Download the entire application as a single self-contained HTML file"
              >
                <Download className="w-3.5 h-3.5 text-[#FF5E13]" />
                Blogger HTML Bundle
              </button>

              <button
                onClick={handleDownloadBloggerXML}
                id="blogger-xml-export-btn"
                className="px-3 py-1.5 bg-gradient-to-r from-[#10B981]/25 to-[#3B82F6]/25 hover:from-[#10B981]/40 hover:to-[#3B82F6]/40 border border-[#10B981]/40 hover:border-[#10B981]/65 text-[#D1FAE5] hover:text-white text-xs font-mono rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Download the completely error-proof Blogger XML Theme template"
              >
                <Code className="w-3.5 h-3.5 text-[#10B981]" />
                Blogger XML Theme
              </button>

              <button
                type="button"
                onClick={() => setShowBloggerGuide(!showBloggerGuide)}
                id="blogger-guide-toggle-btn"
                className={`px-3 py-1.5 border text-xs font-mono rounded-lg flex items-center gap-1.5 cursor-pointer transition-all ${
                  showBloggerGuide
                    ? "bg-[#FF5E13]/30 border-[#FF5E13] text-white shadow-[0_0_15px_rgba(255,94,19,0.3)]"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300"
                }`}
                title="Show step-by-step setup guide to fix Blogger white screens"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#FF5E13]" />
                Blogger Guide
              </button>

              <label className="px-3 py-1.5 bg-gradient-to-r from-[#4F46E5]/20 to-[#EC4899]/20 hover:from-[#4F46E5]/30 hover:to-[#EC4899]/30 border border-[#EC4899]/30 hover:border-[#EC4899]/55 text-slate-200 text-xs font-mono rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-[#EC4899]" />
                Mount .app Container
                <input 
                  type="file" 
                  accept=".app,.json" 
                  onChange={handleImportData} 
                  className="hidden" 
                />
              </label>

              <button
                onClick={onReset}
                id="reset-forge-btn"
                className="px-3 py-1.5 bg-white/5 hover:bg-[#EC4899]/10 border border-white/10 hover:border-[#EC4899]/30 text-[#EC4899] text-xs font-mono rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Melt database back to original defaults"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Melt Back to Seed
              </button>

              <button
                onClick={() => {
                  setIsUnlocked(false);
                  setPassword("");
                }}
                id="logout-forge-btn"
                className="px-3 py-1.5 bg-red-950/20 hover:bg-red-900/20 border border-red-900/30 text-red-400 text-xs font-mono rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Melt Access
              </button>
            </>
          ) : (
            <span className="hidden md:flex text-[10px] bg-red-950/20 border border-red-900/20 text-red-400 font-mono px-3 py-1.5 rounded-md">
              STATUS: ENCRYPTED
            </span>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-950/20 border border-emerald-920 text-emerald-400 p-3.5 rounded-lg mb-6 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorWord && (
        <div className="bg-red-950/20 border border-red-950 text-red-400 p-3.5 rounded-lg mb-6 text-xs font-mono flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-red-500" />
          <span>{errorWord}</span>
        </div>
      )}

      {showBloggerGuide && (
        <div className="bg-[#111216] border border-[#FF5E13]/30 p-6 rounded-2xl mb-8 space-y-6 shadow-2xl relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#FF5E13]/10 to-transparent rounded-full pointer-events-none blur-xl animate-pulse"></div>
          
          <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
            <HelpCircle className="w-5 h-5 text-[#FF5E13]" />
            <h4 className="text-[#FFD1B3] text-sm font-mono uppercase tracking-wider font-bold">
              Blogger Integration Protocol (Google AdSense Ready)
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
            {/* COLUMN 1: HOSTED IFRAME METHOD (RECOMMENDED) */}
            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white uppercase bg-[#FF5E13]/25 px-2.5 py-1 rounded">
                  Method A: Clean Iframe (Highly Recommended ⭐)
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Zero Code Modification</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Best for embedding pages or articles inside any blog post. Blogger's editor often strips modern React scripts. Using an iframe completely circumvents Blogger's restrictions and renders your interactive gallery perfectly!
              </p>
              
              <div className="space-y-2">
                <label className="text-[10px] text-[#FF9E66] font-mono uppercase">Your Pasteable HTML Code:</label>
                <div className="relative">
                  <pre className="bg-black/60 p-3 rounded-lg text-[10px] text-slate-300 font-mono overflow-x-auto border border-white/5 leading-relaxed max-h-[140px]">
{`<div style="width:100%; height:820px; overflow:hidden; border:none; border-radius:16px; background-color:#0d0e12; box-shadow:0 15px 40px rgba(0,0,0,0.65);">
  <iframe 
    src="${window.location.origin}" 
    style="width: 100%; height: 100%; border: none; outline: none; margin: 0; padding: 0;"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
    allowfullscreen="true">
  </iframe>
</div>`}
                  </pre>
                  <button 
                    onClick={() => {
                      const code = `<div style="width:100%; height:820px; overflow:hidden; border:none; border-radius:16px; background-color:#0d0e12; box-shadow:0 15px 40px rgba(0,0,0,0.65);">\n  <iframe \n    src="${window.location.origin}" \n    style="width: 100%; height: 100%; border: none; outline: none; margin: 0; padding: 0;"\n    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"\n    allowfullscreen="true">\n  </iframe>\n</div>`;
                      navigator.clipboard.writeText(code);
                      triggerAlertMessage("📋 HTML iframe code copied to clipboard!");
                    }}
                    className="absolute right-2 bottom-2 px-2 py-0.5 bg-white/5 hover:bg-white/15 text-[9px] font-mono text-slate-200 border border-white/10 rounded active:scale-95 transition-all"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <ol className="text-[11px] text-slate-400 space-y-1.5 list-decimal list-inside leading-relaxed block pl-1">
                <li>Create/edit a Post or Page in Blogger.</li>
                <li>Switch from <strong>Compose View</strong> to <strong>HTML View</strong> (top-left pencil/brackets icon).</li>
                <li>Paste the copied iframe snippet and Publish!</li>
              </ol>
            </div>

            {/* COLUMN 2: CUSTOM THEME UPLOAD (XML) */}
            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-white uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded">
                  Method B: Full Blog Theme (Full Domain Customization)
                </span>
                <span className="text-[10px] text-amber-400 font-mono">Expert</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Best if you want your entire Blogger domain (e.g., <code>yourblog.blogspot.com</code>) to load Mythics Forge as its main homepage. This creates a fully custom stand-alone website portal.
              </p>

              <div className="bg-[#161d2d]/30 border border-[#3b82f6]/20 p-3.5 rounded-lg space-y-2">
                <h5 className="text-[11px] font-mono font-bold text-[#93c5fd]">Why the download template prevents white screens:</h5>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Our custom build-compiler transforms the standard Vite single file bundle into an XML package, automatically wrapping all scripts in <code>{"//<![CDATA["}</code> tags and declaring Blogger layouts so the theme parses with 100% compliance.
                </p>
              </div>

              <ol className="text-[11px] text-slate-400 space-y-2 list-decimal list-inside leading-relaxed block pl-1">
                <li>Click the <strong>Blogger XML Theme</strong> button above to download the template file.</li>
                <li>In Blogger dashboard, go to <strong>Theme</strong> menu in the side drawer.</li>
                <li>Click the dropdown arrow next to <strong>Customize</strong> and select <strong>Edit HTML</strong>.</li>
                <li>Delete everything inside, paste the contents of your downloaded XML theme file, and hit save!</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* LOCK / PASSPORT SCREEN */}
      {!isUnlocked ? (
        <div className="max-w-md mx-auto py-12 px-6 bg-black/45 border border-white/10 rounded-[2rem] text-center space-y-6">
          <div className="w-12 h-12 bg-[#EC4899]/10 border border-[#EC4899]/30 text-[#EC4899] rounded-full flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(236,72,153,0.15)]">
            <Key className="w-5 h-5" />
          </div>

          <div className="space-y-2">
            <h4 className="font-serif font-black text-white text-base uppercase tracking-wider">
              AUTHORIZE STATION ACCESS
            </h4>
            <p className="text-xs text-white/50 max-w-xs mx-auto leading-relaxed font-sans font-light">
              Input the ancient forgemaster runic security code to add or modify live projects displayed to the public. 
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Cryptic Passphrase..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#030303] border border-white/10 focus:border-[#4F46E5]/50 rounded-xl pl-3.5 pr-10 py-2.5 text-sm text-center text-slate-200 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            <button
              type="submit"
              id="confirm-unlock-btn"
              className="w-full py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#EC4899] hover:from-[#EC4899] hover:to-[#4F46E5] text-white font-extrabold text-xs rounded-xl transition-all uppercase tracking-widest cursor-pointer shadow-[0_4px_20px_rgba(79,70,229,0.35)]"
            >
              Verify Core Encryption
            </button>
          </form>

          <p className="text-[10px] text-[#EC4899] font-mono tracking-widest bg-[#EC4899]/5 border border-[#EC4899]/10 px-3 py-1.5 rounded-lg inline-block">
            STATION GLYPH CLUE: <span className="text-white hover:underline select-all cursor-copy">forge</span>
          </p>
        </div>
      ) : (
        /* ACTIVATED TERMINAL WORKSTATION */
        <div className="space-y-8">
          {/* STUDIO / COMPANY PROFILE CUSTOMIZER CARD */}
          {!editingProjectId && !isAddingNew && (
            <div className="bg-white/[0.02] border border-[#EC4899]/20 hover:border-[#EC4899]/40 p-5 rounded-[2rem] grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-300">
              <div className="lg:col-span-1 space-y-3">
                <span className="text-[9px] bg-[#EC4899]/10 border border-[#EC4899]/20 text-[#EC4899] font-mono px-2.5 py-1 rounded-md uppercase tracking-offset font-black inline-block">
                  Studio Customization Center
                </span>
                <h4 className="font-serif text-white font-extrabold text-base uppercase tracking-wider">
                  Company Identity
                </h4>
                <p className="text-xs text-white/50 leading-relaxed font-sans font-light">
                  Use this terminal to configure your primary brand metadata dynamically, including the global company tagline, custom logo, or title. Any modifications apply directly to the header!
                </p>
                
                {/* Information about what Creator Console is */}
                <div className="p-3.5 bg-black/45 border border-white/5 rounded-xl text-[11px] text-white/50 space-y-1.5 font-sans leading-relaxed">
                  <div className="text-[#EC4899] font-mono text-[9px] uppercase tracking-wider font-bold">🛠️ WHAT IS THE CREATOR CONSOLE?</div>
                  <p>
                    The <strong>Creator Console</strong> is a secure dynamic management terminal. It empowers you to:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-white/40 font-mono text-[10px]">
                    <li>Edit company branding, logo symbols, or paste custom images</li>
                    <li>Toggle public tags and customize your primary tagline</li>
                    <li>Add, update, or melt down (delete) live showcase relics</li>
                    <li>Export and restore full registry ledgers using offline backups</li>
                  </ul>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title Input */}
                  <div>
                    <label className="block text-[10px] text-[#FF5E13] font-mono uppercase mb-1 font-bold">Company / Studio Title</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.title}
                      onChange={(e) => setSettingsForm({ ...settingsForm, title: e.target.value })}
                      placeholder="e.g. MYTHICS FORGE"
                      className="w-full bg-[#030303] border border-white/10 focus:border-[#FF5E13]/50 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none"
                    />
                  </div>

                  {/* Tagline Input */}
                  <div>
                    <label className="block text-[10px] text-[#FF5E13] font-mono uppercase mb-1 font-bold">Company Tagline (e.g., We Build Future)</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.tagline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      placeholder="e.g. We Build Future"
                      className="w-full bg-[#030303] border border-white/10 focus:border-[#FF5E13]/55 rounded-xl px-3.5 py-2 text-xs text-slate-100 outline-none font-bold text-[#FF5E13]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Logo Text Symbol */}
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] text-[#FF5E13] font-mono uppercase mb-1 font-bold">Logo Alt Text (2-4 Chars)</label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={settingsForm.logoText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, logoText: e.target.value })}
                      placeholder="MF"
                      className="w-full bg-[#030303] border border-white/10 focus:border-[#FF5E13]/52 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none text-center font-mono font-bold"
                    />
                  </div>

                  {/* Logo Image - PERMANENT ORIGINAL LOGO NOTICE */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-[#FF5E13] font-mono uppercase mb-1 font-bold">
                      Logo Asset Status
                    </label>
                    <div className="bg-[#030303] border border-emerald-900/30 rounded-xl p-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full border border-emerald-500/20 overflow-hidden bg-black shrink-0 flex items-center justify-center relative">
                          <img
                            src={logoSvg}
                            alt="Mythics Forge Original Logo"
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-emerald-400 font-bold font-sans">🛡️ Original Logo Permanent</p>
                          <p className="text-[10px] text-white/40 font-mono">Original branding enforced across all networks</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-950/40 border border-emerald-900/40 rounded text-[9px] font-mono text-emerald-400 uppercase tracking-widest">
                        LOCKED
                      </span>
                    </div>
                  </div>
                </div>

                {/* Brand Alignment & Sizing Layout customization controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                  {/* Logo Alignment */}
                  <div>
                    <label className="block text-[10px] text-[#FF5E13] font-mono uppercase mb-1.5 font-bold">Header Layout Alignment</label>
                    <div className="flex gap-1 bg-[#030303] p-1 border border-white/5 rounded-lg select-none">
                      {(["left", "center", "right"] as const).map((align) => (
                        <button
                          key={align}
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, logoAlignment: align })}
                          className={`flex-1 py-1.5 rounded text-[10px] uppercase font-mono font-bold transition-all cursor-pointer ${
                            settingsForm.logoAlignment === align
                              ? "bg-[#FF5E13] text-white shadow-sm"
                              : "text-white/40 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {align}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Logo Scale */}
                  <div>
                    <label className="block text-[10px] text-[#FF5E13] font-mono uppercase mb-1.5 font-bold">Logo Container Scale</label>
                    <div className="flex gap-1 bg-[#030303] p-1 border border-white/5 rounded-lg select-none">
                      {(["small", "medium", "large"] as const).map((sc) => (
                        <button
                          key={sc}
                          type="button"
                          onClick={() => setSettingsForm({ ...settingsForm, logoScale: sc })}
                          className={`flex-1 py-1.5 rounded text-[10px] uppercase font-mono font-bold transition-all cursor-pointer ${
                            settingsForm.logoScale === sc
                              ? "bg-[#FF5E13] text-white shadow-sm"
                              : "text-white/40 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {sc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Logo Object Position (Fit crop position) */}
                  <div>
                    <label className="block text-[10px] text-[#FF5E13] font-mono uppercase mb-1.5 font-bold">
                      Logo Crop Focus / Position
                    </label>
                    <select
                      disabled={!settingsForm.logoImageUrl}
                      value={settingsForm.logoObjectPosition}
                      onChange={(e) => setSettingsForm({ ...settingsForm, logoObjectPosition: e.target.value as any })}
                      className="w-full bg-[#030303] border border-white/10 focus:border-[#FF5E13]/50 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-200 outline-none disabled:opacity-40 select-none cursor-pointer"
                    >
                      <option value="center">Center Focus (Balanced)</option>
                      <option value="top">Top Focus (Header)</option>
                      <option value="bottom">Bottom Focus (Footer)</option>
                      <option value="left">Left Focus (Side)</option>
                      <option value="right">Right Focus (Side)</option>
                    </select>
                  </div>
                </div>

                {/* Studio Description */}
                <div>
                  <label className="block text-[10px] text-[#FF5E13] font-mono uppercase mb-1 font-bold">Studio Corporate Description</label>
                  <textarea
                    rows={3}
                    value={settingsForm.description}
                    onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
                    placeholder="Short, highly polished, informative background overview about your services..."
                    className="w-full bg-[#030303] border border-white/10 focus:border-[#FF5E13]/50 rounded-xl px-3.5 py-2 text-xs text-slate-350 outline-none leading-relaxed"
                  />
                </div>

                {/* Social Portfolio Links */}
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl space-y-3">
                  <h5 className="text-[10px] text-[#FF5E13] font-mono uppercase tracking-wider font-bold">
                    🌐 Social Portfolio Links & Nexus Channels
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Facebook Link */}
                    <div>
                      <label className="block text-[9px] text-slate-400 font-mono uppercase mb-1">Facebook URL</label>
                      <input
                        type="url"
                        value={settingsForm.facebookUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                        placeholder="https://facebook.com/yourpage"
                        className="w-full bg-[#030303] border border-white/10 focus:border-[#FF5E13]/50 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none"
                      />
                    </div>
                    {/* Discord Link */}
                    <div>
                      <label className="block text-[9px] text-slate-400 font-mono uppercase mb-1">Discord Server Invite</label>
                      <input
                        type="url"
                        value={settingsForm.discordUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, discordUrl: e.target.value })}
                        placeholder="https://discord.gg/invitecode"
                        className="w-full bg-[#030303] border border-white/10 focus:border-[#FF5E13]/50 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none"
                      />
                    </div>
                    {/* Gumroad Link */}
                    <div>
                      <label className="block text-[9px] text-slate-400 font-mono uppercase mb-1">Gumroad URL</label>
                      <input
                        type="url"
                        value={settingsForm.gumroadUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, gumroadUrl: e.target.value })}
                        placeholder="https://gumroad.com/yourstore"
                        className="w-full bg-[#030303] border border-white/10 focus:border-[#FF5E13]/50 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none"
                      />
                    </div>
                    {/* Reddit Link */}
                    <div>
                      <label className="block text-[9px] text-slate-400 font-mono uppercase mb-1">Reddit Community URL</label>
                      <input
                        type="url"
                        value={settingsForm.redditUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, redditUrl: e.target.value })}
                        placeholder="https://reddit.com/r/yourcommunity"
                        className="w-full bg-[#030303] border border-white/10 focus:border-[#FF5E13]/50 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none"
                      />
                    </div>
                    {/* LinkedIn Link */}
                    <div>
                      <label className="block text-[9px] text-slate-400 font-mono uppercase mb-1">LinkedIn Profile/Company URL</label>
                      <input
                        type="url"
                        value={settingsForm.linkedinUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, linkedinUrl: e.target.value })}
                        placeholder="https://linkedin.com/company/yourcompany"
                        className="w-full bg-[#030303] border border-white/10 focus:border-[#FF5E13]/50 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none"
                      />
                    </div>
                    {/* Instagram Link */}
                    <div>
                      <label className="block text-[9px] text-slate-400 font-mono uppercase mb-1">Instagram Profile URL</label>
                      <input
                        type="url"
                        value={settingsForm.instagramUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                        placeholder="https://instagram.com/yourprofile"
                        className="w-full bg-[#030303] border border-white/10 focus:border-[#FF5E13]/50 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Google AdSense monetization center */}
                <div id="blogger-adsense-monetization-center" className="bg-[#181924]/40 border border-[#F9AB00]/20 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#F9AB00] animate-pulse"></div>
                      <h4 className="text-[#FFD1B3] text-xs font-mono uppercase tracking-wider font-bold">
                        Google AdSense Integration Center
                      </h4>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={settingsForm.adsenseEnabled}
                        onChange={(e) => setSettingsForm({ ...settingsForm, adsenseEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#F9AB00]/40 peer-checked:after:bg-[#F9AB00]"></div>
                      <span className="ml-2 text-[10px] font-mono text-slate-300 uppercase">
                        {settingsForm.adsenseEnabled ? "Connected" : "Disabled"}
                      </span>
                    </label>
                  </div>
                  
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    Turn on the switch to connect your Google AdSense account. Your ad publisher scripts will automatically compile inside your custom exported Blogger XML template in full compliance with Google Webmaster policies.
                  </p>

                  {settingsForm.adsenseEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                      <div>
                        <label className="block text-[9px] text-[#F9AB00] font-mono uppercase mb-1">AdSense Publisher Client ID</label>
                        <input
                          type="text"
                          value={settingsForm.adsenseClientId}
                          onChange={(e) => setSettingsForm({ ...settingsForm, adsenseClientId: e.target.value })}
                          placeholder="ca-pub-1234567890123456"
                          className="w-full bg-[#030303] border border-white/10 focus:border-[#F9AB00]/50 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-[#F9AB00] font-mono uppercase mb-1">AdSense Ad Slot ID</label>
                        <input
                          type="text"
                          value={settingsForm.adsenseSlotId}
                          onChange={(e) => setSettingsForm({ ...settingsForm, adsenseSlotId: e.target.value })}
                          placeholder="9876543210"
                          className="w-full bg-[#030303] border border-white/10 focus:border-[#F9AB00]/50 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] text-[#F9AB00] font-mono uppercase mb-1">Ad Display Placement</label>
                        <select
                          value={settingsForm.adsensePlacement}
                          onChange={(e) => setSettingsForm({ ...settingsForm, adsensePlacement: e.target.value as any })}
                          className="w-full bg-[#030303] border border-white/10 focus:border-[#F9AB00]/50 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none"
                        >
                          <option value="footer">Footer Wide Banner</option>
                          <option value="header">Top Page Banner</option>
                          <option value="sidebar">Sidebar Widget Box</option>
                          <option value="none">Auto Ads Only (Header Script)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#FF5E13] hover:bg-[#FF4500] text-white font-extrabold text-xs rounded-xl transition-all uppercase tracking-widest cursor-pointer shadow-[0_0_15px_rgba(255,94,19,0.2)] flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Save Studio Configuration
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Main Action Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h4 className="font-sans text-xs text-white/50 tracking-wider">
              TOTAL RECORDED RELICS: <span className="text-[#FF5E13] font-mono font-bold">{projects.length}</span>
            </h4>
            
            {!editingProjectId && !isAddingNew && (
              <button
                onClick={handleLaunchNew}
                id="forge-relic-btn"
                className="px-4 py-2 bg-[#FF5E13] hover:bg-[#FF4500] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Forge New Relic
              </button>
            )}
          </div>

          {/* ACTIVE EDITING / CREATING SCREEN VIEWPORTS */}
          {(editingProjectId || isAddingNew) && (
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-3">
                <span className="font-sans text-sm font-black text-[#FF5E13] flex items-center gap-2 uppercase tracking-wider">
                  <Terminal className="w-4 h-4" />
                  {isAddingNew ? "CASTING NEW PROJECT RELIC" : `METAMORPHING: ${formData.title}`}
                </span>

                <button
                  onClick={() => {
                    setEditingProjectId(null);
                    setIsAddingNew(false);
                  }}
                  id="cancel-edit-btn"
                  className="p-1 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white text-xs font-mono rounded flex items-center gap-1.5 cursor-pointer"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  Melt Action
                </button>
              </div>

              {/* INPUT FIELDS FORM */}
              <form onSubmit={handleSaveProject} className="space-y-5 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* ID */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Vault Key Name (Alphanumeric/Unique)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. aethelgard-mod"
                      disabled={!isAddingNew}
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      className="w-full bg-[#030303] border border-white/10 focus:border-[#FF5E13]/50 roundedpx px-3.5 py-2 text-xs text-slate-200 outline-none disabled:opacity-40"
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Epic Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aethelgard: The Whispering Woods"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800/80 focus:border-amber-500/50 rounded px-3.5 py-2 text-xs text-slate-200 outline-none"
                    />
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Lyrical Subtitle</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. A Procedural Action RPG"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800/80 focus:border-amber-500/50 rounded px-3.5 py-2 text-xs text-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Foundry Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800/80 focus:border-amber-500/50 rounded px-3.5 py-2 text-xs text-slate-200 outline-none"
                    >
                      <option value="Game Dev">Game Dev</option>
                      <option value="Immersive Web">Immersive Web</option>
                      <option value="Creative Code">Creative Code</option>
                      <option value="Physical Design">Physical Design</option>
                    </select>
                  </div>

                  {/* Crew Role */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Your Crew Role</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Principal Architect"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800/80 focus:border-amber-500/50 rounded px-3.5 py-2 text-xs text-slate-200 outline-none"
                    />
                  </div>

                  {/* Patron */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Patron / Client</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Internal Experiment"
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800/80 focus:border-amber-500/50 rounded px-3.5 py-2 text-xs text-slate-200 outline-none"
                    />
                  </div>

                  {/* Timeline */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Casting Timeline</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Q4 2025"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800/80 focus:border-amber-500/50 rounded px-3.5 py-2 text-xs text-slate-200 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Image Card URL */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Image Catalog URL (Unsplash or Static Link)</label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/photo-..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800/80 focus:border-amber-500/50 rounded px-3.5 py-2 text-xs text-slate-200 outline-none text-left"
                    />
                  </div>

                  {/* Image Banner URL */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Case Study Banner Image URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/photo-..."
                      value={formData.bannerImage}
                      onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800/80 focus:border-amber-500/50 rounded px-3.5 py-2 text-xs text-slate-200 outline-none text-left"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* GitHub URL */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Runic Repository Link (GitHub - Optional)</label>
                    <input
                      type="url"
                      placeholder="https://github.com/mythics-forge/..."
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800/80 focus:border-amber-500/50 rounded px-3.5 py-2 text-xs text-slate-200 outline-none text-left"
                    />
                  </div>

                  {/* Live URL */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Ignite Portal Link (Live Demo - Optional)</label>
                    <input
                      type="url"
                      placeholder="https://your-sandbox-url.com"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800/80 focus:border-amber-500/50 rounded px-3.5 py-2 text-xs text-slate-200 outline-none text-left"
                    />
                  </div>
                </div>

                {/* Performance stats values */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-black/45 border border-white/5 rounded-2xl">
                  <div>
                    <label className="block text-[9px] text-white/45 font-mono uppercase mb-0.5">PERF TARGET 1 LABEL</label>
                    <input
                      type="text"
                      placeholder="FPS Target"
                      value={formData.stat1Label}
                      onChange={(e) => setFormData({ ...formData, stat1Label: e.target.value })}
                      className="w-full bg-[#030303] border border-white/10 focus:border-[#FF5E13]/50 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-white/45 font-mono uppercase mb-0.5">PERF TARGET 1 VALUE</label>
                    <input
                      type="text"
                      placeholder="90 FPS Stable"
                      value={formData.stat1Value}
                      onChange={(e) => setFormData({ ...formData, stat1Value: e.target.value })}
                      className="w-full bg-[#030303] border border-white/10 focus:border-[#FF5E13]/50 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-white/45 font-mono uppercase mb-0.5">PERF TARGET 2 LABEL</label>
                    <input
                      type="text"
                      placeholder="Polygon Count"
                      value={formData.stat2Label}
                      onChange={(e) => setFormData({ ...formData, stat2Label: e.target.value })}
                      className="w-full bg-[#030303] border border-white/10 focus:border-[#FF5E13]/50 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-white/45 font-mono uppercase mb-0.5">PERF TARGET 2 VALUE</label>
                    <input
                      type="text"
                      placeholder="50K Max"
                      value={formData.stat2Value}
                      onChange={(e) => setFormData({ ...formData, stat2Value: e.target.value })}
                      className="w-full bg-[#030303] border border-white/10 focus:border-[#FF5E13]/50 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Catalog Overview Summary (Aphoristic - Max 140 Chars)</label>
                  <input
                    type="text"
                    required
                    maxLength={160}
                    placeholder="Short, lyrical pitch summarizing the primary mechanic..."
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    className="w-full bg-[#030303] border border-white/10 focus:border-[#FF5E13]/50 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Runic Stack Tags (Comma-Separated)</label>
                  <input
                    type="text"
                    placeholder="React, GLSL, TS, custom-physics"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full bg-[#030303] border border-white/10 focus:border-[#FF5E13]/50 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none block"
                  />
                </div>

                {/* Markdown Case Study */}
                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Deep Case Study Inscription (Markdown Approved)</label>
                  <textarea
                    required
                    rows={8}
                    placeholder="Use ### for and - for bullet runes..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#030303] border border-white/10 focus:border-[#FF5E13]/50 rounded-xl px-3.5 py-2 text-xs text-slate-250 font-mono outline-none block"
                  />
                </div>

                {/* Checkbox Featured */}
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded border-white/10 bg-black text-[#FF5E13] focus:ring-opacity-0 cursor-pointer"
                  />
                  <label htmlFor="isFeatured" className="text-xs text-white/60 font-mono uppercase cursor-pointer select-none">
                    Engrave into Featured Hero Slideshow Carousel
                  </label>
                </div>

                <button
                  type="submit"
                  id="submit-relic-btn"
                  className="w-full py-3 bg-[#FF5E13] hover:bg-[#FF4500] text-white font-extrabold text-xs rounded-xl transition-colors uppercase tracking-widest cursor-pointer shadow-lg shadow-[#FF5E13]/10 flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  Lock Inscriptions into Inode
                </button>
              </form>
            </div>
          )}

          {/* ACTIVE PORTFOLIO INODE SHEET LIST (Only visible when not editing) */}
          {!editingProjectId && !isAddingNew && (
            <div className="border border-white/5 rounded-2xl overflow-hidden shrink-0 bg-white/[0.01]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5 text-[9px] text-white/40 font-mono uppercase tracking-wider">
                    <th className="py-3 px-4">Title Ledger</th>
                    <th className="py-3 px-4 hidden sm:table-cell col-span-1">Category</th>
                    <th className="py-3 px-4 hidden md:table-cell">Casting Timeline</th>
                    <th className="py-3 px-4 text-center">Operation Panel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors text-white/80">
                      <td className="py-3 px-4 font-sans focus-within:none">
                        <div className="font-extrabold text-white text-xs uppercase tracking-wide">{proj.title}</div>
                        <div className="text-[10px] text-white/40 font-mono max-w-[200px] sm:max-w-xs truncate">{proj.subtitle}</div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <span className="px-2.5 py-1 bg-[#FF5E13]/10 border border-[#FF5E13]/20 text-[#FF5E13] text-[9px] uppercase font-bold rounded-md">
                          {proj.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell text-[#E0E0E0]/60">
                        {proj.timeline || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2.5">
                          <button
                            onClick={() => handleLaunchEdit(proj)}
                            id={`edit-item-${proj.id}`}
                            aria-label={`Edit ${proj.title}`}
                            className="p-1.5 px-3 bg-white/5 hover:bg-[#FF5E13]/10 border border-white/10 hover:border-[#FF5E13]/30 text-white/70 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                          >
                            <Edit className="w-3.5 h-3.5 text-[#FF5E13]" />
                            Cast
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            id={`delete-item-${proj.id}`}
                            aria-label={`Melt ${proj.title}`}
                            className="p-1.5 px-3 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 rounded-xl transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            Melt
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="p-4 bg-white/5 border border-white/10 text-[11px] text-white/60 rounded-2xl flex items-start gap-3">
            <HeartHandshake className="w-4 h-4 text-[#FF5E13] shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans font-light">
              <strong className="text-white font-bold">Dynamic Public Dispatch Active:</strong> Storing new creations updates your live screen instantly. Users browsing this server interact with your exact customized portfolio registry in real time!
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
