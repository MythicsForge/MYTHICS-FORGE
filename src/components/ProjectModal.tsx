/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project } from "../types";
import { X, ExternalLink, Github, Calendar, User, Briefcase, BarChart2, Shield } from "lucide-react";
import { motion } from "motion/react";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

// Simple and robust parser to render case study markdown smoothly in React 19 without package conflicts
const parseMarkdown = (text: string) => {
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    if (line.startsWith("### ")) {
      return (
        <h3 key={idx} className="font-sans text-[#FF5E13] text-lg font-bold mt-6 mb-2 tracking-wide flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#FF5E13]/25 border-l-2 border-[#FF5E13] rounded-sm"></span>
          {line.replace("### ", "")}
        </h3>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h2 key={idx} className="font-sans text-white text-xl font-black mt-8 mb-3 tracking-wider border-b border-white/5 pb-1 uppercase">
          {line.replace("## ", "")}
        </h2>
      );
    }
    if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ")) {
      const content = line.substring(3);
      const boldSplit = content.split("**");
      return (
        <div key={idx} className="ml-4 mb-3 flex gap-2">
          <span className="text-[#FF5E13] font-mono font-bold text-sm select-none">{line.substring(0, 2)}</span>
          <p className="text-white/70 text-sm leading-relaxed">
            {boldSplit.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-[#FF5E13] font-bold">{part}</strong> : part)}
          </p>
        </div>
      );
    }
    if (line.startsWith("- ")) {
      const content = line.replace("- ", "");
      const boldSplit = content.split("**");
      return (
        <li key={idx} className="ml-4 mb-2 list-disc text-white/70 text-sm leading-relaxed">
          {boldSplit.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-[#FF5E13] font-bold">{part}</strong> : part)}
        </li>
      );
    }
    if (line.trim() === "") {
      return <div key={idx} className="h-2"></div>;
    }
    // Normal paragraph parsing with simple bold check **
    const boldSplit = line.split("**");
    return (
      <p key={idx} className="text-white/70 text-sm leading-relaxed mb-4 font-sans font-light">
        {boldSplit.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-white font-bold">{part}</strong> : part)}
      </p>
    );
  });
};

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/85 transition-all duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.5 }}
        id={`modal-${project.id}`}
        className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden bg-[#050505] border border-white/10 rounded-2xl shadow-2xl flex flex-col"
      >
        {/* Close Button Pin */}
        <button
          onClick={onClose}
          id="close-modal-btn"
          aria-label="Close details"
          className="absolute top-4 right-4 z-10 p-2 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Banner Area */}
        <div className="relative h-64 md:h-80 shrink-0 overflow-hidden border-b border-white/5">
          <img
            src={project.bannerImage}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover brightness-[0.3]"
          />
          {/* Subtle bottom dark gradient mask */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>

          {/* Banner Details Overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <span className="px-3 py-1 bg-[#FF5E13]/10 border border-[#FF5E13]/25 text-[#FF5E13] text-xs font-mono uppercase tracking-widest rounded-md">
              {project.category}
            </span>
            <h2 className="text-2xl md:text-4xl font-sans font-black text-white mt-3 uppercase tracking-tight">
              {project.title}
            </h2>
            <p className="text-white/60 text-sm md:text-base mt-2 font-sans font-light max-w-2xl">
              {project.subtitle}
            </p>
          </div>
        </div>

        {/* Scrollable Content Pane */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Extensive Case Study (2 cols on large screen) */}
          <div className="md:col-span-2 space-y-6">
            <div className="prose prose-invert max-w-none">
              {parseMarkdown(project.description)}
            </div>
          </div>

          {/* Right Column: Meta-Specs / Technical Ledger */}
          <div className="space-y-6">
            {/* Project Specifications Card */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-4">
              <h4 className="text-[#FF5E13] text-[10px] tracking-[0.2em] font-bold uppercase font-sans border-b border-white/5 pb-2">
                SPECS LEDGER
              </h4>

              {/* Specific Metadata parameters */}
              <div className="space-y-3 font-sans text-xs">
                <div className="flex justify-between items-center text-white/50">
                  <span className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-[#FF5E13]" /> Crew Role</span>
                  <span className="text-white font-medium text-right text-xs max-w-[150px] truncate" title={project.role}>{project.role}</span>
                </div>
                <div className="flex justify-between items-center text-white/50">
                  <span className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5 text-[#FF5E13]" /> Patron</span>
                  <span className="text-white font-medium">{project.client}</span>
                </div>
                <div className="flex justify-between items-center text-white/50">
                  <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-[#FF5E13]" /> Timeline</span>
                  <span className="text-white font-medium">{project.timeline}</span>
                </div>
              </div>
            </div>

            {/* Core Metrics / Real Performance Stats */}
            {project.stats && project.stats.length > 0 && (
              <div className="bg-gradient-to-br from-[#FF5E13]/5 to-[#3B82F6]/5 border border-white/10 p-5 rounded-2xl space-y-4">
                <h4 className="text-[#FF5E13] text-[10px] tracking-[0.2em] font-bold uppercase font-sans flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#FF5E13]" /> PERF TARGETS
                </h4>

                <div className="space-y-3.5">
                  {project.stats.map((stat, sIdx) => (
                    <div key={sIdx} className="border-l-2 border-[#FF5E13]/30 pl-3">
                      <p className="text-[9px] text-white/40 uppercase tracking-widest font-mono">
                        {stat.label}
                      </p>
                      <p className="text-base font-sans font-extrabold text-white mt-0.5">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technologies */}
            <div className="space-y-3">
              <h4 className="text-white/40 text-[9px] tracking-[0.2em] font-bold uppercase font-mono">
                FORGE STACK
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 bg-white/5 border border-white/5 text-white/60 text-xs font-mono rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Launch Links */}
            {(project.githubUrl || project.liveUrl) && (
              <div className="pt-4 border-t border-white/5 space-y-2.5">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 bg-white text-black font-extrabold text-xs tracking-widest uppercase rounded-full hover:bg-[#FF5E13] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-white/5"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ignite Live App
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 bg-white/5 border border-white/10 text-white font-bold text-xs tracking-widest uppercase rounded-full flex items-center justify-center gap-2 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <Github className="w-4 h-4 text-[#FF5E13]" />
                    Inspect Runes
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer info stamp */}
        <div className="bg-[#020202] border-t border-white/5 px-6 py-4 flex justify-between items-center text-[9px] text-white/30 font-mono tracking-widest">
          <span className="flex items-center gap-1.5 uppercase">
            <Shield className="w-3.5 h-3.5 text-[#FF5E13]/40" /> SECURE REPO CHECK OK
          </span>
          <span>VAL_ID: MF_SYS_{project.id.toUpperCase()}</span>
        </div>
      </motion.div>
    </div>
  );
}
