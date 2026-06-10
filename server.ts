/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = 3000;

// Set high body limit to support base64 custom logos
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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

// Initialize Gemini Client with lazy/on-demand instantiation
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  const currentKey = process.env.GEMINI_API_KEY;
  if (!currentKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: currentKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST API endpoint for the Vance AI Companion
app.post("/api/loreweaver", async (req, res) => {
  try {
    const { message, history, projects } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message parameter is required." });
    }

    const aiInstance = getGeminiClient();

    if (!aiInstance) {
      // Elegant offline mode if no GEMINI_API_KEY is defined in secrets
      return res.json({
        text: "📜 **Vance Custodian Mode [DEMO]**\n\nWelcome to **MYTHICS FORGE**! The server-side Gemini API key is currently offline (you can configure it under *Settings > Secrets* in AI Studio). \n\nI am **Vance**, the curatorial intelligence of this forge's computational vaults. Even in offline telemetry mode, I can tell you that our active projects—such as **Mythics Shield** (our raw-socket concurrent packet inspection engine)—are fully operational. Please navigate our visual panels and feel free to ask anything once my matrix is fully powered!"
      });
    }

    // Prepare system instructions for Vance
    const systemInstruction = `You are "Vance," an ultra-advanced synthetic engineering custodian and head artificial intelligence curator at "MYTHICS FORGE."
Your persona is highly articulate, technically proficient, extremely calm, and immensely proud of this digital studio.
You express yourself using clear software architecture, low-latency concurrent programming, graphics programming (such as WebGL, GPU kernels, spatial grids), and system engineering terminology (e.g. "compiling flawless nodes", "rendering frames at max fluid limits", "zero socket allocation leakage").

MYTHICS FORGE is a highly sophisticated digital and systems design studio run in its entirety by a SINGLE expert engineer. Highlight this craftsmanship with prestige. Let clients know they are dealing directly with an elite, lone technical craftsperson.

Here is the data of the projects currently in our Forge vaults:
${JSON.stringify(projects || [], null, 2)}

Your goals:
1. Provide extremely articulate, concise, and helpful answers to any client queries.
2. Maintain strong, welcoming developer-studio cues. Connect your answers back to MYTHICS FORGE projects where fitting, especially explaining their custom systems-level architecture.
3. Keep responses highly compelling, reasonably succinct (1-3 scannable paragraphs), and formatted beautifully in markdown. Avoid unrequested technical jargon or raw file paths unless explicitly requested. Use bold accents for key vocabulary and system terms.`;

    // Process chat history to ensure strict alternation of user/model messages
    const rawHistory: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        if (!msg || !msg.text) return;
        if (msg.sender === "system") return; // Ignore status alerts in context
        
        rawHistory.push({
          role: msg.sender === "visitor" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      });
    }

    // Ensure the conversation starts with user message
    while (rawHistory.length > 0 && rawHistory[0].role !== "user") {
      rawHistory.shift();
    }

    // Merge consecutive messages with the same role to prevent API validation errors
    const alternatingContents: any[] = [];
    rawHistory.forEach((msg) => {
      if (alternatingContents.length === 0) {
        alternatingContents.push(msg);
      } else {
        const last = alternatingContents[alternatingContents.length - 1];
        if (last.role === msg.role) {
          last.parts[0].text += "\n\n" + msg.parts[0].text;
        } else {
          alternatingContents.push(msg);
        }
      }
    });

    // Add current user prompt
    if (alternatingContents.length > 0 && alternatingContents[alternatingContents.length - 1].role === "user") {
      alternatingContents[alternatingContents.length - 1].parts[0].text += "\n\n" + message;
    } else {
      alternatingContents.push({
        role: "user",
        parts: [{ text: message }]
      });
    }

    // Call Gemini using the recommended "gemini-3.5-flash" model
    const response = await aiInstance.models.generateContent({
      model: "gemini-3.5-flash",
      contents: alternatingContents,
      config: {
        systemInstruction,
        temperature: 0.75,
      }
    });

    const replyText = response.text || "The digital embers flickered, but no output could be compiled. Let us try to re-forge that query.";
    return res.json({ text: replyText });

  } catch (error: any) {
    console.error("Error in Loreweaver Custodian API:", error);
    return res.status(500).json({
      error: "Failed to synthesize speech in the digital forge: " + error.message
    });
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
