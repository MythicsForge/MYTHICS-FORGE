/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, ChroniclePost } from "./types";
// @ts-ignore
import shieldImage from "./assets/images/regenerated_image_1781023425937.png";

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "mythics-shield",
    title: "Mythics Shield",
    subtitle: "Real-Time Synthesized Network Scanner",
    category: "Creative Code",
    summary: "An immersive packet-level network scanner featuring real-time diagnostic grids, parallel system threat mapping, and automated active port analysis.",
    description: "### System Architecture & Logic\n\n**Mythics Shield** compiles down to a lightweight standalone network analysis tool. It utilizes a custom raw-socket polling loop, visualizes active network nodes through high-framerate dynamic rendering, and applies a heuristic signature engine to analyze ongoing packet traffic.\n\n### Key Technical Strengths:\n\n* **Synchronous Thread Solvers**: Spawns concurrent network probes designed with zero socket allocation leakage to prevent performance degradation under peak strain.\n* **Threat Mapping**: Real-time identification of standard ports (SSH, HTTP, database tunnels) mapping malicious signatures against the forge's security matrices.\n* **Sci-Fi Diagnostics Console**: An exquisite, visual-rich web control panel rendering socket flows down to sub-millisecond updates.\n\n### Developer Implementation Notes\n\nTo capture packets natively, the backend system implements memory-mapped ring buffers (`mmap`). This avoids repeated kernel-space copying, enabling maximum throughput. The UI frontend receives stream updates through low-overhead binary frames, keeping client-side state lag below 0.5ms.",
    image: shieldImage,
    bannerImage: shieldImage,
    tags: ["Network Scanner", "Raw Sockets", "Packet Inspection"],
    role: "Independent Developer (FOUNDER)",
    client: "Internal R&D / Open-source security community",
    timeline: "May 2026 - Present",
    gumroadUrl: "https://mythicsforge.gumroad.com/l/ronce",
    isFeatured: true,
    stats: [
      { label: "Analysis Rate", value: "1.2M pps" },
      { label: "Threat Catch Rate", value: "99.8%" },
      { label: "Console Latency", value: "<0.5ms" }
    ]
  }
];

export const INITIAL_CHRONICLES: ChroniclePost[] = [];

