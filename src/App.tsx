/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Project, ChroniclePost, StudioSettings } from "./types";
import { INITIAL_PROJECTS, INITIAL_CHRONICLES } from "./data";
import ForgePortal from "./components/ForgePortal";

const DEFAULT_STUDIO_SETTINGS: StudioSettings = {
  title: "MYTHICS FORGE",
  tagline: "We Build Future",
  description: "An elite, independent digital craft studio operated by a solo developer. Designing low-latency system-level tools, high-fidelity WebGL graphics pipelines, and resilient full-stack architectures.",
  logoText: "MF",
  logoImageUrl: "",
  logoAlignment: "center",
  logoObjectPosition: "center",
  logoScale: "medium"
};

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      if (INITIAL_PROJECTS.length === 0) {
        localStorage.removeItem("mythics_forge_projects");
        return [];
      }
      const saved = localStorage.getItem("mythics_forge_projects");
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [chronicles, setChronicles] = useState<ChroniclePost[]>(() => {
    try {
      if (INITIAL_CHRONICLES.length === 0) {
        localStorage.removeItem("mythics_forge_chronicles");
        return [];
      }
      const saved = localStorage.getItem("mythics_forge_chronicles");
      return saved ? JSON.parse(saved) : INITIAL_CHRONICLES;
    } catch {
      return INITIAL_CHRONICLES;
    }
  });

  const [studioSettings, setStudioSettings] = useState<StudioSettings>(() => {
    try {
      const saved = localStorage.getItem("mythics_forge_studio_settings");
      return saved ? JSON.parse(saved) : DEFAULT_STUDIO_SETTINGS;
    } catch {
      return DEFAULT_STUDIO_SETTINGS;
    }
  });

  // Persist files to localStorage when edited
  useEffect(() => {
    try {
      localStorage.setItem("mythics_forge_projects", JSON.stringify(projects));
    } catch (e) {
      console.error("Failed to write to local ledger store:", e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem("mythics_forge_chronicles", JSON.stringify(chronicles));
    } catch (e) {
      console.error("Failed to write to local chronicles store:", e);
    }
  }, [chronicles]);

  useEffect(() => {
    try {
      localStorage.setItem("mythics_forge_studio_settings", JSON.stringify(studioSettings));
    } catch (e) {
      console.error("Failed to write to local studio settings:", e);
    }
  }, [studioSettings]);

  // Reset helper to wipe overrides and stoke database back to defaults
  const handleResetData = () => {
    if (confirm("Metamorphic event: Meltdown active records and restore original seed files?")) {
      setProjects(INITIAL_PROJECTS);
      setChronicles(INITIAL_CHRONICLES);
      setStudioSettings(DEFAULT_STUDIO_SETTINGS);
      localStorage.removeItem("mythics_forge_projects");
      localStorage.removeItem("mythics_forge_chronicles");
      localStorage.removeItem("mythics_forge_studio_settings");
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
