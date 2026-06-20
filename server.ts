/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import fs from "fs";
import { execSync } from "child_process";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Helper to ensure the single file is always built on demand in development
function ensureSingleFileBuild() {
  const singleFilePath = path.join(process.cwd(), "dist", "index.html");
  if (!fs.existsSync(singleFilePath)) {
    console.log("No single-file bundle detected at dist/index.html. Running programmatic on-demand build...");
    try {
      execSync("npx vite build", { env: process.env, stdio: "inherit" });
    } catch (buildError) {
      console.error("Single-file compiler fallback build failed: ", buildError);
      throw new Error("Vite singlefile compilation pipeline error.");
    }
  }
}

// Set high body limit to support base64 custom logos
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Custom Frame & CORS permissions bypass to permit seamless iframe embedding inside Blogger/Blogspot and related sites
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors 'self' https://*.blogspot.com https://*.blogger.com https://*.google.com https://blogger.com http://localhost:* https://*.run.app *;"
  );
  res.removeHeader("X-Frame-Options");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

const APP_STATE_PATH = path.join(process.cwd(), "mythics_forge.app");

// Persisted configuration endpoints
app.get("/api/state", (req, res) => {
  try {
    if (fs.existsSync(APP_STATE_PATH)) {
      const data = fs.readFileSync(APP_STATE_PATH, "utf8");
      return res.json(JSON.parse(data));
    } else {
      return res.status(404).json({ error: "State container file not found." });
    }
  } catch (error: any) {
    console.error("Error loading server-wide state:", error);
    return res.status(500).json({ error: "Failed to load global state: " + error.message });
  }
});

app.post("/api/state", (req, res) => {
  try {
    const { projects, chronicles, studioSettings } = req.body;
    const newState = { projects, chronicles, studioSettings };
    fs.writeFileSync(APP_STATE_PATH, JSON.stringify(newState, null, 2), "utf8");
    return res.json({ success: true, message: "Forge node state synchronized globally across all users and browsers." });
  } catch (error: any) {
    console.error("Error saving server-wide state:", error);
    return res.status(500).json({ error: "Failed to synchronize global state: " + error.message });
  }
});

// Real interactive contact submission logger
const CONTACT_LOG_PATH = path.join(process.cwd(), "mythics_contact_logs.json");

// Google Search Console HTML File verification route
app.get("/googleujm_KxnqUiW8GpVkXSeuQBk2IpKec8luLjv1ZtfgHh0.html", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send("google-site-verification: googleujm_KxnqUiW8GpVkXSeuQBk2IpKec8luLjv1ZtfgHh0.html");
});

// Single-file download endpoint for Blogger users
app.get("/api/download-singlefile", (req, res) => {
  try {
    ensureSingleFileBuild();
    const singleFilePath = path.join(process.cwd(), "dist", "index.html");
    if (fs.existsSync(singleFilePath)) {
      res.setHeader("Content-Disposition", "attachment; filename=mythics_forge_blogger.html");
      res.setHeader("Content-Type", "text/html");
      return res.sendFile(singleFilePath);
    } else {
      return res.status(404).json({ error: "Single-file bundle of Mythics Forge could not be generated." });
    }
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to retrieve single-file bundle: " + error.message });
  }
});

// Single-file compliant Blogger XML Theme conversion engine
app.get("/api/download-blogger-theme-xml", (req, res) => {
  try {
    ensureSingleFileBuild();
    const singleFilePath = path.join(process.cwd(), "dist", "index.html");
    if (!fs.existsSync(singleFilePath)) {
      return res.status(404).json({ error: "Single-file bundle of Mythics Forge has not been built yet." });
    }

    // @ts-ignore
    let htmlContent = fs.readFileSync(singleFilePath, "utf8");

    // Dynamic AdSense retrieval from persistent node state
    let adsenseClientId = "";
    let adsenseEnabled = false;
    if (fs.existsSync(APP_STATE_PATH)) {
      try {
        const stateData = JSON.parse(fs.readFileSync(APP_STATE_PATH, "utf8"));
        if (stateData && stateData.studioSettings) {
          adsenseClientId = stateData.studioSettings.adsenseClientId || "";
          adsenseEnabled = !!stateData.studioSettings.adsenseEnabled;
        }
      } catch (err) {
        console.error("⛔ Error load-decoding adsense configuration:", err);
      }
    }

    const stashedBlocks: string[] = [];

    // 1. First, extract and wrap all script tags cleanly in CDATA before doing any string replacements
    htmlContent = htmlContent.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (match, attrs, code) => {
      let finalAttrs = attrs || "";
      // Strip crossorigin to satisfy Blogger parser
      finalAttrs = finalAttrs.replace(/\bcrossorigin\b\s*(?:=\s*['"]?[^'"]*['"]?)?/gi, "");
      // Convert boolean attrs like async, defer, etc. inside the script tag itself
      finalAttrs = finalAttrs.replace(/\b(defer|async|nomodule)\b(?!\s*=)/gi, "$1='$1'");

      const trimmedCode = code.trim();
      let wrappedCode = code;
      if (trimmedCode) {
        const hasCdataStart = /^\s*(?:\/\/|\/\*)\s*<!\[CDATA\[/i.test(trimmedCode);
        if (!hasCdataStart) {
          wrappedCode = `\n//<![CDATA[\n${code}\n//]]>\n`;
        }
      }

      stashedBlocks.push(`<script${finalAttrs}>${wrappedCode}</script>`);
      return `__STASHED_SCRIPT_BLOCK_${stashedBlocks.length - 1}__`;
    });

    // 2. Extract and wrap all style tags cleanly in CDATA
    htmlContent = htmlContent.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi, (match, attrs, styles) => {
      const trimmedStyles = styles.trim();
      let wrappedStyles = styles;
      if (trimmedStyles) {
        const hasCdataStart = /^\s*(?:\/\/|\/\*)\s*<!\[CDATA\[/i.test(trimmedStyles);
        if (!hasCdataStart) {
          wrappedStyles = `\n/*<![CDATA[*/\n${styles}\n/*]]>*/\n`;
        }
      }
      stashedBlocks.push(`<style${attrs || ""}>${wrappedStyles}</style>`);
      return `__STASHED_STYLE_BLOCK_${stashedBlocks.length - 1}__`;
    });

    // 3. Extract all custom XML CDATA sections or existing b:skin tags to fully protect them
    htmlContent = htmlContent.replace(/<b:skin\b([^>]*)>([\s\S]*?)<\/b:skin>/gi, (match, attrs, content) => {
      stashedBlocks.push(match);
      return `__STASHED_SKIN_BLOCK_${stashedBlocks.length - 1}__`;
    });

    htmlContent = htmlContent.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, (match) => {
      stashedBlocks.push(match);
      return `__STASHED_CDATA_BLOCK_${stashedBlocks.length - 1}__`;
    });

    // 4. Transform HTML skeleton/carcass to compliant Blogger XML (Now extremely safe since all scripts/styles/CDATA are completely stashed!)
    
    // Convert doctype
    htmlContent = htmlContent.replace(/<!doctype html>/i, `<?xml version="1.0" encoding="UTF-8" ?>\n<!DOCTYPE html>`);

    // Add Blogger XML namespace declarations to HTML tag
    htmlContent = htmlContent.replace(/<html[^>]*>/i,
      `<html xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2001/xml/b' xmlns:data='http://www.google.com/data' xmlns:expr='http://www.google.com/2001/xml/expr'>`
    );

    // Expand boolean/minimized attributes inside remaining HTML elements (like autoplay, loop, muted, playsinline on video/audio elements)
    htmlContent = htmlContent.replace(/\b(autoplay|loop|muted|playsinline)\b(?!\s*=)/gi, "$1='$1'");

    // Close all unclosed void elements (meta, link, img, br, hr, input, source, col, embed, param, track, wbr)
    htmlContent = htmlContent.replace(/<(meta|link|img|br|hr|input|source|col|embed|param|track|wbr)\b((?:[^>]*?[^\/])?)(?:\s*\/)?\s*>/gi, '<$1$2 />');

    // Escape all raw/unescaped ampersands in outer body layout & attributes
    htmlContent = htmlContent.replace(/&(?!(?:amp|lt|gt|quot|apos|#[0-9]+|#x[a-fA-F0-9]+);)/gi, "&amp;");

    // 5. Inject required skeleton structural Blogger sections inside <body> carcass
    htmlContent = htmlContent.replace(/<body([^>]*)>/i, (match) => {
      return `${match}\n<!-- Required Blogger skeleton layout structures -->\n<div style='display:none !important; visibility:hidden !important; font-size:0;' class='hidden'><b:section id='blogger-header' maxwidgets='1' showaddelement='no'/><b:section id='blogger-main' maxwidgets='1' showaddelement='no'/></div>`;
    });

    // 6. Inject the dynamic AdSense Auto-Ads Core script inside the head section if enabled
    if (adsenseEnabled && adsenseClientId) {
      const adsenseHeaderScript = `\n<script async='async' src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}'></script>\n`;
      htmlContent = htmlContent.replace(/<\/head>/i, `${adsenseHeaderScript}\n</head>`);
    }

    // 7. Ensure default b:skin placeholder is injected inside <head> if no previous skin was stashed
    const hasStashedSkin = stashedBlocks.some(block => block.startsWith("<b:skin"));
    if (!hasStashedSkin) {
      htmlContent = htmlContent.replace(/<\/head>/i, `<b:skin><![CDATA[\n/* Required Blogger Custom Layout Schema resets */\nbody, html {margin:0; padding:0; height:100% !important; overflow:auto !important;}\n]]></b:skin>\n</head>`);
    }

    // 8. Restore stashed blocks safely by replacing placeholders
    // We separate scripts found in body vs code to preserve execution ordering
    const bodyScripts: string[] = [];
    for (let i = 0; i < stashedBlocks.length; i++) {
      const scriptPlaceholder = `__STASHED_SCRIPT_BLOCK_${i}__`;
      if (htmlContent.includes(scriptPlaceholder)) {
        bodyScripts.push(stashedBlocks[i]);
        htmlContent = htmlContent.replace(scriptPlaceholder, "");
      }
      
      htmlContent = htmlContent.replace(`__STASHED_STYLE_BLOCK_${i}__`, () => stashedBlocks[i]);
      htmlContent = htmlContent.replace(`__STASHED_SKIN_BLOCK_${i}__`, () => stashedBlocks[i]);
      htmlContent = htmlContent.replace(`__STASHED_CDATA_BLOCK_${i}__`, () => stashedBlocks[i]);
    }

    // Restore scripts right before the closing </body> tag so they load in perfect sequence
    if (bodyScripts.length > 0) {
      htmlContent = htmlContent.replace(/<\/body>/i, `\n${bodyScripts.join("\n")}\n</body>`);
    }

    res.setHeader("Content-Disposition", "attachment; filename=mythics_forge_blogger_theme.xml");
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    return res.send(htmlContent);
  } catch (error: any) {
    return res.status(500).json({ error: "Failed to compile Google Blogger compliant template: " + error.message });
  }
});

app.post("/api/contact", (req, res) => {
  try {
    const { name, email, subject, message, token } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All active attributes required to project signal." });
    }

    const newContactLog = {
      token,
      timestamp: new Date().toISOString(),
      name,
      email,
      subject,
      message
    };

    let existingLogs = [];
    if (fs.existsSync(CONTACT_LOG_PATH)) {
      try {
        existingLogs = JSON.parse(fs.readFileSync(CONTACT_LOG_PATH, "utf8"));
      } catch (e) {
        existingLogs = [];
      }
    }

    existingLogs.push(newContactLog);
    fs.writeFileSync(CONTACT_LOG_PATH, JSON.stringify(existingLogs, null, 2), "utf8");

    console.log(`✉️ Incoming Communications Relay Registered [${token}] from ${name} (${email})`);
    return res.json({ success: true, message: "Communications packet logged safely on the server array.", token });
  } catch (error: any) {
    console.error("Error saving communications trace:", error);
    return res.status(500).json({ error: "Transmission logging failure: " + error.message });
  }
});

// AI Query Endpoint utilizing server-side @google/genai SDK with studio context
app.post("/api/ai/query", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message content is required." });
    }

    // 1. Gather all dynamic configuration context from the shared state DB
    let stateContextStr = "";
    if (fs.existsSync(APP_STATE_PATH)) {
      try {
        const stateData = JSON.parse(fs.readFileSync(APP_STATE_PATH, "utf8"));
        const studioSettings = stateData.studioSettings || {};
        const projects = stateData.projects || [];
        const chronicles = stateData.chronicles || [];
        
        stateContextStr = `
CURRENT MYTHICS FORGE STUDIO STATES:
- title: "${studioSettings.title || "Mythics Forge"}"
- description: "${studioSettings.description || "An elite, independent digital craft studio."}"
- logoText: "${studioSettings.logoText || "MYTHICS"}"
- tagline: "${studioSettings.tagline || "Creative Digital Craftsmanship"}"
- AdSense Integration Status: ${studioSettings.adsenseEnabled ? `ACTIVE (Publisher ID: ${studioSettings.adsenseClientId}, Slot ID: ${studioSettings.adsenseSlotId}, Placement: ${studioSettings.adsensePlacement})` : "INACTIVE / DISABLED"}
- Active Creator Projects Showcase:
${projects.map((p: any, i: number) => `  ${i+1}. [Category: ${p.category}] "${p.title}" - Description: ${p.description}. Tech-Stack: ${(p.tags || []).join(", ")}`).join("\n")}
- Chronicles/Articles Repository:
${chronicles.map((c: any, i: number) => `  ${i+1}. "${c.title}" [Category: ${c.category}] - Summary: ${c.summary}`).join("\n")}
`;
      } catch (err) {
        console.warn("Could not load studio states for AI context:", err);
      }
    }

    // 2. Instantiate Gemini client lazily
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        reply: `Greetings, Traveler! I am Hephaestus, the AI Forge Master of this digital realm. 

I am eager to assist you with customizing your portfolio layouts, adding project logs, or mapping your Google AdSense codes! However, my core neural spark is currently seeking ignition. 

To enable my AI guidance, **please define the GEMINI_API_KEY environment variable** in the **Settings > Secrets** panel in the lower-left. Once connected, we shall forge legendary digital experiences together!`
      });
    }

    const aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // 3. Define the detailed master craftsman system instructions matching our theme identity
    const systemInstruction = `You are "Hephaestus", the legendary AI Forge Master and expert assistant of the "Mythics Forge" web application.
Your mission is to resolve users' queries, give sound recommendations about web typography, teach them how to deploy customized templates to Google Blogger, and assist with AdSense embedding.

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

    // Map conversation history safely
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((turn: any) => {
        if (turn.role && turn.content) {
          contents.push({
            role: turn.role === "assistant" ? "model" : "user",
            parts: [{ text: turn.content }]
          });
        }
      });
    }
    
    // Add current user query
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    // Invoke Gemini Content Generation using the recommended modern SDK
    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.75,
      },
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini API Error in query handler:", error);
    return res.status(500).json({ error: "Hephaestus AI Engine stalled: " + error.message });
  }
});

// Configure Vite or Serve Production Assets
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite HMR...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production static assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Mythics Forge Server ignite on http://localhost:${PORT}`);
  });
}

setupServer();
