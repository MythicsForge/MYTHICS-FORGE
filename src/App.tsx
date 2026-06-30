/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Project, ChroniclePost, StudioSettings } from "./types";
import { INITIAL_PROJECTS, INITIAL_CHRONICLES } from "./data";
import ForgePortal from "./components/ForgePortal";
import { safeStorage } from "./safeStorage";
// @ts-ignore
import shieldImage from "./assets/images/regenerated_image_1781023425937.png";
// @ts-ignore
import logoSvg from "./assets/images/logo.svg";

const DEFAULT_STUDIO_SETTINGS: StudioSettings = {
  title: "MYTHICS FORGE",
  tagline: "We Build Future",
  description: "An elite, independent digital craft studio operated by a solo developer. Designing low-latency system-level tools, high-fidelity WebGL graphics pipelines, and resilient full-stack architectures.",
  logoText: "Mythics Forge",
  logoImageUrl: logoSvg,
  logoAlignment: "center",
  logoObjectPosition: "center",
  logoScale: "medium",
  facebookUrl: "https://www.facebook.com/people/Mythics-Forge/61590690214970/",
  discordUrl: "https://discord.gg/rvXTmMCwJA",
  gumroadUrl: "https://mythicsforge.gumroad.com",
  redditUrl: "https://www.reddit.com/user/MythicsForge",
  linkedinUrl: "https://www.linkedin.com/company/mythics-forge",
  instagramUrl: "https://www.instagram.com/mythics_forge",
  adsenseClientId: "",
  adsenseSlotId: "",
  adsenseEnabled: false,
  adsensePlacement: "footer",
  accentPreset: "orange"
};

function migrateStudioSettings(settings: StudioSettings): StudioSettings {
  const updated = { ...settings };
  if (!updated.facebookUrl || updated.facebookUrl === "https://facebook.com/mythics-forge") {
    updated.facebookUrl = "https://www.facebook.com/people/Mythics-Forge/61590690214970/";
  }
  if (!updated.discordUrl || updated.discordUrl === "https://discord.gg/mythics-forge") {
    updated.discordUrl = "https://discord.gg/rvXTmMCwJA";
  }
  if (!updated.gumroadUrl || updated.gumroadUrl === "https://gumroad.com/mythics-forge") {
    updated.gumroadUrl = "https://mythicsforge.gumroad.com";
  }
  if (!updated.redditUrl || updated.redditUrl === "https://reddit.com/r/mythics-forge") {
    updated.redditUrl = "https://www.reddit.com/user/MythicsForge";
  }
  if (!updated.linkedinUrl || updated.linkedinUrl === "https://linkedin.com/company/mythics-forge") {
    updated.linkedinUrl = "https://www.linkedin.com/company/mythics-forge";
  }
  if (!updated.instagramUrl || updated.instagramUrl === "https://instagram.com/mythics-forge") {
    updated.instagramUrl = "https://www.instagram.com/mythics_forge";
  }
  if (updated.adsenseEnabled === undefined) {
    updated.adsenseEnabled = false;
  }
  if (updated.adsenseClientId === undefined) {
    updated.adsenseClientId = "";
  }
  if (updated.adsenseSlotId === undefined) {
    updated.adsenseSlotId = "";
  }
  if (updated.adsensePlacement === undefined) {
    updated.adsensePlacement = "footer";
  }
  if (updated.accentPreset === undefined) {
    updated.accentPreset = "orange";
  }
  return updated;
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      if (INITIAL_PROJECTS.length === 0) {
        safeStorage.removeItem("mythics_forge_projects_v2");
        return [];
      }
      const saved = safeStorage.getItem("mythics_forge_projects_v2");
      if (saved) {
        const parsed = JSON.parse(saved) as Project[];
        // Filter out any projects that are no longer in our base code definition
        const filtered = parsed.filter(p => INITIAL_PROJECTS.some(ip => ip.id === p.id));
        
        // Auto-seed or update attributes (such as newly updated image paths and creator role)
        INITIAL_PROJECTS.forEach((initProj) => {
          const existingIdx = filtered.findIndex(p => p.id === initProj.id);
          if (existingIdx === -1) {
            filtered.push(initProj);
          } else {
            // Keep user customized text but sync visual attributes and updated roles from data definition
            filtered[existingIdx].bannerImage = initProj.bannerImage;
            filtered[existingIdx].image = initProj.image;
            filtered[existingIdx].role = initProj.role;
            filtered[existingIdx].gumroadUrl = initProj.gumroadUrl;
          }
        });
        return filtered;
      }
      return INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [chronicles, setChronicles] = useState<ChroniclePost[]>(() => {
    try {
      if (INITIAL_CHRONICLES.length === 0) {
        safeStorage.removeItem("mythics_forge_chronicles");
        return [];
      }
      const saved = safeStorage.getItem("mythics_forge_chronicles");
      if (saved) {
        const parsed = JSON.parse(saved) as ChroniclePost[];
        // Filter out deleted posts present in local storage
        const filtered = parsed.filter(c => INITIAL_CHRONICLES.some(ic => ic.id === c.id));
        
        INITIAL_CHRONICLES.forEach((initChron) => {
          const existingIdx = filtered.findIndex(c => c.id === initChron.id);
          if (existingIdx === -1) {
            filtered.push(initChron);
          } else {
            filtered[existingIdx].image = initChron.image;
          }
        });
        return filtered;
      }
      return INITIAL_CHRONICLES;
    } catch {
      return INITIAL_CHRONICLES;
    }
  });

  const [studioSettings, setStudioSettings] = useState<StudioSettings>(() => {
    try {
      const saved = safeStorage.getItem("mythics_forge_studio_settings");
      if (saved) {
        const parsed = JSON.parse(saved) as StudioSettings;
        parsed.logoImageUrl = logoSvg;
        return migrateStudioSettings({ ...DEFAULT_STUDIO_SETTINGS, ...parsed });
      }
      return DEFAULT_STUDIO_SETTINGS;
    } catch {
      return DEFAULT_STUDIO_SETTINGS;
    }
  });

  const [hasLoadedFromServer, setHasLoadedFromServer] = useState(false);

  // Load unified system state from persistent server file on startup
  useEffect(() => {
    fetch("/api/state")
      .then((res) => {
        if (!res.ok) throw new Error("Could not reach server state matrix.");
        return res.json();
      })
      .then((serverState) => {
        if (serverState) {
          if (Array.isArray(serverState.projects) && serverState.projects.length > 0) {
            const sanitized = serverState.projects
              .filter((proj: Project) => INITIAL_PROJECTS.some(p => p.id === proj.id))
              .map((proj: Project) => {
                const matched = INITIAL_PROJECTS.find(p => p.id === proj.id);
                if (matched) {
                  return {
                    ...proj,
                    image: matched.image,
                    bannerImage: matched.bannerImage,
                    gumroadUrl: matched.gumroadUrl,
                  };
                }
                return proj;
              });
            // Merge any missing initial projects
            INITIAL_PROJECTS.forEach((initProj) => {
              if (!sanitized.some(p => p.id === initProj.id)) {
                sanitized.push(initProj);
              }
            });
            setProjects(sanitized);
          }
          if (Array.isArray(serverState.chronicles) && serverState.chronicles.length > 0) {
            const sanitizedChron = serverState.chronicles.filter(c => INITIAL_CHRONICLES.some(ic => ic.id === c.id));
            // Merge any missing initial chronicles
            INITIAL_CHRONICLES.forEach((initChron) => {
              if (!sanitizedChron.some(c => c.id === initChron.id)) {
                sanitizedChron.push(initChron);
              }
            });
            setChronicles(sanitizedChron);
          }
          if (serverState.studioSettings) {
            const loadedSettings = migrateStudioSettings({ ...DEFAULT_STUDIO_SETTINGS, ...serverState.studioSettings });
            loadedSettings.logoImageUrl = logoSvg;
            setStudioSettings(loadedSettings);
          }
        }
        setHasLoadedFromServer(true);
      })
      .catch((err) => {
        console.warn("Could not synchronize server state, staying on local telemetry cache:", err);
        setHasLoadedFromServer(true); // Allow local modifications to still try syncing later
      });
  }, []);

  // Persist files locally when edited (Client fallback caching)
  useEffect(() => {
    try {
      safeStorage.setItem("mythics_forge_projects_v2", JSON.stringify(projects));
    } catch (e) {
      console.error("Failed to write to local ledger store:", e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      safeStorage.setItem("mythics_forge_chronicles", JSON.stringify(chronicles));
    } catch (e) {
      console.error("Failed to write to local chronicles store:", e);
    }
  }, [chronicles]);

  useEffect(() => {
    try {
      safeStorage.setItem("mythics_forge_studio_settings", JSON.stringify(studioSettings));
    } catch (e) {
      console.error("Failed to write to local studio settings:", e);
    }
  }, [studioSettings]);

  // Sync state globally to the server (saves logo and projects permanently for all sessions/devices)
  useEffect(() => {
    if (!hasLoadedFromServer) return;

    // Debounce updates slightly to batch rapid user settings changes
    const timer = setTimeout(() => {
      fetch("/api/state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects, chronicles, studioSettings })
      })
        .then((res) => {
          if (!res.ok) throw new Error("Network response not OK");
          return res.json();
        })
        .then((data) => {
          console.log("🔥 Server ledger sync status:", data.message);
        })
        .catch((err) => {
          console.error("⛔ Failed to synchronize global configuration with server:", err);
        });
    }, 1200);

    return () => clearTimeout(timer);
  }, [projects, chronicles, studioSettings, hasLoadedFromServer]);

  // Reset helper to wipe overrides and stoke database back to defaults
  const handleResetData = () => {
    if (confirm("Metamorphic event: Meltdown active records and restore original seed files?")) {
      setProjects(INITIAL_PROJECTS);
      setChronicles(INITIAL_CHRONICLES);
      setStudioSettings(DEFAULT_STUDIO_SETTINGS);
      safeStorage.removeItem("mythics_forge_projects_v2");
      safeStorage.removeItem("mythics_forge_chronicles");
      safeStorage.removeItem("mythics_forge_studio_settings");
    }
  };

  return (
    <div id="mythics-forge-app-wrapper" className="min-h-screen bg-[#0c0d0e] text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-black">
      <ForgePortal
        projects={projects}
        setProjects={setProjects}
        chronicles={chronicles}
        setChronicles={setChronicles}
        studioSettings={studioSettings}
        setStudioSettings={setStudioSettings}
        onReset={handleResetData}
      />
    </div>
  );
}
