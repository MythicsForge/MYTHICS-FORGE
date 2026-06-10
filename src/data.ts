/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, ChroniclePost } from "./types";

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "mythics-shield",
    title: "Mythics Shield",
    subtitle: "Real-Time Synthesized Network Scanner",
    category: "Creative Code",
    summary: "An immersive packet-level network scanner featuring real-time diagnostic grids, parallel system threat mapping, and automated active port analysis.",
    description: "### System Architecture & Logic\n\n**Mythics Shield** compiles down to a lightweight standalone network analysis tool. It utilizes a custom raw-socket polling loop, visualizes active network nodes through high-framerate dynamic rendering, and applies a heuristic signature engine to analyze ongoing packet traffic.\n\n### Key Technical Strengths:\n\n* **Synchronous Thread Solvers**: Spawns concurrent network probes designed with zero socket allocation leakage.\n* **Threat Mapping**: Real-time identification of standard ports (SSH, HTTP, database tunnels) mapping malicious signatures against the forge's security matrices.\n* **Sci-Fi Diagnostics Console**: An exquisite, visual-rich web control panel rendering socket flows down to sub-millisecond updates.",
    image: "/src/assets/images/regenerated_image_1781023425937.png",
    bannerImage: "/src/assets/images/regenerated_image_1781023425937.png",
    tags: ["Network Scanner", "Raw Sockets", "Packet Inspection"],
    role: "Independent Developer (FOUNDER)",
    client: "Internal R&D / Open-source security community",
    timeline: "May 2026 - Present",
    isFeatured: true,
    stats: [
      { label: "Analysis Rate", value: "1.2M pps" },
      { label: "Threat Catch Rate", value: "99.8%" },
      { label: "Console Latency", value: "<0.5ms" }
    ]
  }
];

export const INITIAL_CHRONICLES: ChroniclePost[] = [
  {
    id: "post-2",
    title: "Compiling the Mythics Shield raw-socket loop",
    summary: "Achieving zero socket allocation leakage in a highly concurrent raw packet inspect daemon.",
    content: "We've successfully verified the raw socket event listener loop in Mythics Shield. By binding natively to low-level Linux packet rings and loading custom packet filters directly, we bypassed substantial kernel-to-userland context switches, reaching flawless 1.2M pps packet inspection under maximum system saturation.",
    category: "Security",
    date: "2026-06-09",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
  }
];
