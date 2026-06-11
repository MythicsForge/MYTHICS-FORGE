/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
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
