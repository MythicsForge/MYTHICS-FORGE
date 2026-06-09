/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProjectStat {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: "Game Dev" | "Immersive Web" | "Creative Code" | "Physical Design";
  summary: string;
  description: string; // Markdown supported
  image: string;
  bannerImage: string;
  tags: string[];
  role: string;
  client: string;
  timeline: string;
  githubUrl?: string;
  liveUrl?: string;
  stats?: ProjectStat[];
  isFeatured?: boolean;
}

export interface ChroniclePost {
  id: string;
  title: string;
  summary: string;
  content: string; // Markdown
  date: string;
  readTime: string;
  category: string;
  image: string;
}

export interface LoreMessage {
  id: string;
  sender: "visitor" | "loreweaver" | "system";
  text: string;
  timestamp: string;
}

export interface StudioSettings {
  title: string;
  tagline: string;
  description: string;
  logoText: string;
  logoImageUrl: string;
  logoAlignment?: "left" | "center" | "right";
  logoObjectPosition?: "center" | "top" | "bottom" | "left" | "right";
  logoScale?: "small" | "medium" | "large";
}
