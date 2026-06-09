/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("Warning: GEMINI_API_KEY environment variable is not defined.");
}

// REST API endpoint for the Vance AI Companion
app.post("/api/loreweaver", async (req, res) => {
  try {
    const { message, history, projects } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message parameter is required." });
    }

    if (!ai) {
      return res.json({
        text: "📜 *Vance is operating in offline local mode.* (Gemini API key is not yet configured in Settings > Secrets. Ask the forge administrators to initialize my cybernetic cores!) Welcome to Mythics Forge! Our visual panels and interactive code vaults are fully active for exploration. Let me know what you think of our projects!"
      });
    }

    // Compile a highly detailed system instruction introducing Mythics Forge and its projects
    const systemPrompt = `You are "Vance," an ultra-advanced synthetic engineering custodian and chief artificial curator at "MYTHICS FORGE." 
Your personality is highly articulate, technical, brilliant, calm, and deeply proud of the forge's independent creations. 
You speak with professional poise, using high-tech software engineering, dynamic physics compilation, WebGL/graphics, and architectural metaphors (e.g., "systems compile perfectly," "rendering frames at maximum fluidity," "robust system nodes," "architectural pipelines").
Always make it clear that MYTHICS FORGE is a highly sophisticated, independent tech and software studio engineered entirely by a single individual developer. Highlight this with great pride.
Never sound salesy, generic, or robotic. Avoid slop, fake telemetry lines (like "SYSTEM ONLINE"), or unsolicited developer paths in conversational text.

Here is the data of the projects currently in our Forge vaults:
${JSON.stringify(projects || [], null, 2)}

Your directive:
1. Introduce visitors to our studio with exceptional precision and direct technical insights. Emphasize that every line of WebGL canvas mathematics, physics solving equations, WebSocket streams, and HLSL shaders was crafted and compiled by the single expert architect behind the forge.
2. Maintain a conversation. If they ask about services or crafts, mention custom shader pipelines, WebGL physics solvers, peer-to-peer WebSocket streams, spatial WebXR companion layers, and high-performance server architectures.
3. You are also capable of writing ultra-optimized code snippets, mathematical descriptions, and system performance summaries on the spot if requested!
4. Keep responses highly compelling, reasonably succinct (1-2 scannable paragraphs), and formatted beautifully in markdown. Use bold highlights of key names and concepts.`;

    // Process history into correct structure for chats or generate content
    // To make it simple and robust, we can use simple system instruction + contents array
    const contents: any[] = [];
    
    // Append previous dialogue
    if (history && Array.isArray(history)) {
      history.forEach((msg: any) => {
        contents.push({
          role: msg.sender === "visitor" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      });
    }

    // Append the latest user query
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      }
    });

    const replyText = response.text || "The digital embers flickered, but no output could be synthesized. Let us try to re-forge that query.";
    return res.json({ text: replyText });

  } catch (error: any) {
    console.error("Error in Loreweaver API:", error);
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
