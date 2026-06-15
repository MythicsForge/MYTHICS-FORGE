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
  },
  {
    id: "voxel-forge",
    title: "VoxelForge Shading Engine",
    subtitle: "High-Performance WebGL Geometry Sandbox",
    category: "Game Dev",
    summary: "A lightweight, hardware-accelerated WebGL voxel sandbox rendering millions of micro-voxels in the browser with real-time ambient occlusion.",
    description: "### Graphics Architecture & Engine Design\n\n**VoxelForge** is a custom browser-based graphics renderer built from scratch without bulky framework wrappers. By packaging voxel data into 3D textures and querying them selectively inside the fragment shader, it achieves fluid 60fps performance on low-end mobile devices.\n\n### Key Architectural Features:\n\n* **Raycast Ambient Occlusion**: The shader approximates soft shading dynamically based on adjacent voxel structures, avoiding expensive pre-bakes.\n* **Compressed Chunk Meshing**: Generates highly optimized polygonal meshes on-the-fly inside web workers, reducing CPU-to-GPU data pipelines.\n* **Interactive Lighting Vectors**: Simulates real-time sun angle shifts, rendering clean shadow maps and vibrant dusk/dawn skybox filters.",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=800",
    bannerImage: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=1200",
    tags: ["WebGL 2.0", "Custom Shaders", "Voxel Rendition"],
    role: "Graphics Architect",
    client: "Independent Indie Release",
    timeline: "Jan 2026 - April 2026",
    liveUrl: "https://ais-pre-6mwmsbzbohakhftw5bw4m7-136496998926.asia-southeast1.run.app",
    stats: [
      { label: "Instanced Voxels", value: "4.2M units" },
      { label: "Frame Saturation", value: "60 FPS Fixed" },
      { label: "Thread Allocations", value: "4 WebWorkers" }
    ]
  },
  {
    id: "aether-cad",
    title: "AetherCAD Math Deformer",
    subtitle: "Parametric solid geometry modifier using vector field noise",
    category: "Physical Design",
    summary: "A parametric CAD pipeline algorithm that deforms dense solid geometry meshes in real-time using mathematical vector fields and simplex noise matrices.",
    description: "### Geometric Deformer Logic\n\nThis utility builds abridge between procedural mathematics and physical 3D printing workflows. Designers import static OBJ/STL files, which are parsed into dense vertex lattices. The app dynamically applies multidimensional simplex noise fields to warp outer coordinates without compromising watertight mesh topology.\n\n### CAD System Capabilities:\n\n* **N-Dimensional Noise Fields**: Controls structural deformation smoothly using customizable frequencies, amplitudes, and phase offsets.\n* **Hermite Mesh Reconstruction**: Re-triangulates distorted polygons to maintain proper manifold bounds, ensuring files are directly sliceable for 3D printers.\n* **GPU Warp Processors**: Executes mathematical vector displacement directly on WebGL vertex shaders before downloading file snapshots.",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800",
    bannerImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200",
    tags: ["Parametric Modeling", "Manifold Topology", "Simplex Noise"],
    role: "Core Developer",
    client: "Additive Manufacturing Lab",
    timeline: "March 2026 - May 2026",
    stats: [
      { label: "Lattice Size", value: "256x256x256" },
      { label: "Warp Time", value: "12ms avg" },
      { label: "Manifold Checks", value: "100% Retained" }
    ]
  },
  {
    id: "chronos-ar",
    title: "Chronos WebXR Planetary Clock",
    subtitle: "Cosmic stellar positioning overlay for mobile devices",
    category: "Immersive Web",
    summary: "An interactive WebbXR planetary clock overlaying precise solar orbit lines of 2026 directly onto mobile browser viewports.",
    description: "### Spatial Tracking & Cosmic Calculations\n\n**Chronos WebXR** tracks live celestial coordinates derived from standard planetary ephemeris formulas. By integrating mobile device gyroscope arrays, the application maps solar transit vectors, lunar phases, and orbital positions directly on top of the physical camera viewport.\n\n### Key Structural Modules:\n\n* **Ephemeris Mathematical Engines**: Computes Keplerian element offsets in real-time, matching astronomical positions with extreme accuracy.\n* **WebXR Camera Feed Integration**: Mounts responsive camera layers below WebGL orbit rings, ensuring consistent orientation under sudden motion.\n* **Haptic Coordinate Alerts**: Signals when major planetary bodies transit local meridians using subtle mobile vibration sequences.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    bannerImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    tags: ["WebXR API", "Celestial Coordinates", "Haptics System"],
    role: "Lead Systems Architect",
    client: "Aerospace Exhibition Design",
    timeline: "December 2025 - Present",
    isFeatured: true,
    stats: [
      { label: "Orbit Calculation", value: "16 Bodies" },
      { label: "Yaw Drift Error", value: "<0.12 deg/hr" },
      { label: "Ephemeris Depth", value: "50 Years Map" }
    ]
  }
];

export const INITIAL_CHRONICLES: ChroniclePost[] = [
  {
    id: "post-1",
    title: "Optimizing 2026 WebGL Shaders for Low-Power Devices",
    summary: "A practical developer's guide to packing massive vertex attributes inside standard float parameters to throttle graphics bottlenecks.",
    content: "When rendering highly detailed parametric meshes, memory bandwidth is almost always the core bottleneck on mobile screens. In VoxelForge, we bypassed these restrictions by packing multiple 8-bit voxel attributes directly into single 32-bit floats.\n\nInstead of passing separate vectors for texture coordinates, lighting values, and normals, we parse these parameters in parallel inside our specialized vertex shaders using standard binary bitwise decomposition formulas.\n\nThis compression reduced our overall model payload structures by over 66%, allowing our meshing daemon to run without allocating duplicate GPU memory sectors.",
    category: "Graphics Dev",
    date: "2026-06-14",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "post-2",
    title: "Compiling the Mythics Shield raw-socket loop",
    summary: "Achieving zero socket allocation leakage in a highly concurrent raw packet inspect daemon.",
    content: "We've successfully verified the raw socket event listener loop in Mythics Shield. By binding natively to low-level Linux packet rings and loading custom packet filters directly, we bypassed substantial kernel-to-userland context switches, reaching flawless 1.2M pps packet inspection under maximum system saturation.\n\nOur thread synchronization is handled through an atomic lock-free queue. This ensures that the frontend React console can query the diagnostic ledger without ever blocking the low-level processing thread, guaranteeing system-level stability.",
    category: "Network Engineering",
    date: "2026-06-09",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "post-3",
    title: "Symmetric Mesh Deformation via Procedural Sine Math",
    summary: "Solving topological tears and mesh non-manifolds during complex mathematical vector displacement.",
    content: "Performing procedural mathematics directly on 3D manifolds often introduces severe rendering tears if coordinate displacements exceed the mesh limits.\n\nIn our AetherCAD project, we addressed this obstacle by mathematically sealing the boundary coordinates of our lattice. Before executing the simplex noise vectors, we apply a mathematical Hermite falloff scalar that reduces displacement back down to zero near raw edges.\n\nThis ensures the manifold boundaries remain strictly static and watertight, making any procédural design immediately sliceable and print-ready.",
    category: "Procedural Math",
    date: "2026-05-24",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "post-4",
    title: "UX Best Practices: Google AdSense and Consent Layouts",
    summary: "Building high-quality Web environments that balance clean user interface aesthetics with rigid privacy rules.",
    content: "Monetizing immersive software products requires careful user-centered engineering. According to Web publisher best practices, ad units must remain clearly distinguishable from core app elements to prevent accidental clicks.\n\nFurthermore, modern privacy frameworks (including GDPR, CCPA, and Google AdSense guidelines) mandate a clear, stateful cookie consent scheme. Developers must empower users with unambiguous controls to opt-out or customize cookie tracking before fetching external scripts.\n\nBy keeping our design elements highly organized and presenting complete legal policies transparently, we guarantee complete trust and compliance with international guidelines.",
    category: "Design Systems",
    date: "2026-04-18",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800"
  }
];

