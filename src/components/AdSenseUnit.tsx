import { useEffect, useState, MouseEvent } from "react";
import { StudioSettings } from "../types";
import { ExternalLink, ShieldCheck, Cpu, Code2 } from "lucide-react";

interface AdSenseUnitProps {
  studioSettings: StudioSettings;
  slotId?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

// Custom hook to securely inject the script tag dynamically
export function useAdSenseLoader(clientId?: string, autoAdsEnabled?: boolean) {
  useEffect(() => {
    if (!clientId) return;

    // Clean up any stale AdSense script tags
    const existingScript = document.querySelector('script[src*="pagead2.googlesyndication.com"]');
    if (existingScript) {
      if (existingScript.getAttribute("data-client-id") !== clientId) {
        existingScript.remove();
      } else {
        return;
      }
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-client-id", clientId);
    
    // Enable automated page ads
    if (autoAdsEnabled) {
      script.setAttribute("data-ad-client", clientId);
    }

    document.head.appendChild(script);

    // Initialise pushed ads safely
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).onload = function() {
        console.log("🔥 Google AdSense Core Library bootstrapped!");
      };
    } catch (e) {
      console.warn("Could not bind loaded callback to AdSense window state", e);
    }

    return () => {
      script.remove();
    };
  }, [clientId, autoAdsEnabled]);
}

export default function AdSenseUnit({
  studioSettings,
  slotId = "default-slot",
  format = "auto",
  className = ""
}: AdSenseUnitProps) {
  const [adError, setAdError] = useState(false);
  const clientId = studioSettings.adsenseClientId || (import.meta as any).env?.VITE_ADSENSE_CLIENT_ID;

  // Track mock ad slide rotation index
  const [mockIndex, setMockIndex] = useState(0);

  useEffect(() => {
    if (!clientId) return;

    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.warn("Google AdSense push error (Normal during offline sandbox environments):", err);
      // Fallback to beautiful placeholder in case loading fails or block lists exist
    }
  }, [clientId]);

  // Rotator for developer sponsorships when no live ad id is connected
  useEffect(() => {
    if (clientId) return;
    const interval = setInterval(() => {
      setMockIndex((prev) => (prev + 1) % 3);
    }, 8000);
    return () => clearInterval(interval);
  }, [clientId]);

  // If client ID is connected, render the standard Google element inside container
  if (clientId && !adError) {
    return (
      <div id={`adsense-wrapper-${slotId}`} className={`my-6 mx-auto overflow-hidden text-center transition-all duration-300 ${className}`}>
        <div className="text-[9px] font-mono text-purple-400 mb-1 tracking-widest uppercase opacity-40">
          SPONSOR UNIT • NATIVE GOOGLE ADSENSE
        </div>
        
        <div className="bg-white/[0.01] border border-white/[0.05] p-3 rounded-2xl min-h-[90px] flex items-center justify-center">
          {/* Official Google AdSense Ins Element */}
          <ins
            className="adsbygoogle"
            style={{ display: "block", width: "100%", height: "100%", minHeight: "90px" }}
            data-ad-client={clientId}
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive="true"
            onError={() => {
              setAdError(true);
            }}
          />
        </div>
      </div>
    );
  }

  // Fallback visual mock displays (Charming, informative and visually high-fidelity placeholders)
  const MOCK_SPONSORS = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#22C55E]" />,
      title: "Deploy native raw packet analysis with Mythics Shield",
      desc: "Instant Linux packet extraction bypasses performance limits to check socket tunnels at flawless 1.2M pps.",
      btnText: "Discover Native System Relay",
      link: "https://mythicsforge.gumroad.com/l/ronce"
    },
    {
      icon: <Cpu className="w-5 h-5 text-amber-500" />,
      title: "Unlock full code-level configurations on Gumroad",
      desc: "Save hundreds of hours by grabbing premium blueprints, custom templates, and system architecture archives.",
      btnText: "Browse Relics on Gumroad",
      link: "https://mythicsforge.gumroad.com/l/ronce"
    },
    {
      icon: <Code2 className="w-5 h-5 text-purple-400" />,
      title: "Monetization Ready • Connect Your Google AdSense Account",
      desc: "Earn advertising revenue by entering your Google Publisher ID directly inside the Creator Console.",
      btnText: "Configure AdSense ID",
      link: "#"
    }
  ];

  const sponsor = MOCK_SPONSORS[mockIndex];

  const handleActionClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (sponsor.link === "#") {
      e.preventDefault();
      // Locate open console buttons or unlock admin console
      const adminBtn = document.getElementById("admin-unlock-btn") || document.getElementById("forge-relic-btn");
      if (adminBtn) {
        adminBtn.scrollIntoView({ behavior: "smooth" });
        adminBtn.click();
      }
    }
  };

  return (
    <div className={`my-6 mx-auto transition-all duration-500 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-mono text-purple-500/40 tracking-widest uppercase">
          SPONSOR RELIC • DEMO MODE ACTIVE
        </span>
        <span className="text-[9px] font-mono text-white/20 tracking-wider">
          ROTATING SPONSOR: {mockIndex + 1}/3
        </span>
      </div>

      <div className="relative group bg-gradient-to-r from-white/[0.01] to-[#1A0E23]/10 border border-white/[0.04] hover:border-purple-500/30 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300 shadow-xl overflow-hidden">
        {/* Decorative dynamic ambient glow */}
        <div className="absolute -right-24 -top-24 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/10 transition-all duration-300" />
        <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start gap-3.5 max-w-xl text-left">
          <div className="p-2.5 bg-white/[0.02] border border-white/[0.05] rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-inner flex items-center justify-center shrink-0">
            {sponsor.icon}
          </div>
          <div>
            <h6 className="text-[13px] text-white font-semibold leading-snug group-hover:text-purple-300 transition-colors">
              {sponsor.title}
            </h6>
            <p className="text-white/40 text-[11px] leading-relaxed mt-1 font-light">
              {sponsor.desc}
            </p>
          </div>
        </div>

        <a
          href={sponsor.link}
          target={sponsor.link === "#" ? undefined : "_blank"}
          rel="noreferrer"
          onClick={handleActionClick}
          className="px-5 py-2.5 bg-white/[0.02] hover:bg-purple-600 border border-white/[0.08] hover:border-purple-400 text-white hover:text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer select-none group-hover:translate-x-0.5"
        >
          <span>{sponsor.btnText}</span>
          <ExternalLink className="w-3 h-3 text-white" />
        </a>
      </div>
    </div>
  );
}
