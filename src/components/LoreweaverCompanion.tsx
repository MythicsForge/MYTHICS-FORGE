/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Project, LoreMessage } from "../types";
import { 
  Sparkles, Send, X, Terminal, Cpu, MessageSquare, Flame, HelpCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LoreweaverCompanionProps {
  projects: Project[];
}

export default function LoreweaverCompanion({ projects }: LoreweaverCompanionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<LoreMessage[]>([
    {
      id: "welcome",
      sender: "loreweaver",
      text: "Greetings, voyager. I am **Vance**, the curatorial custodian of the **Mythics Forge** digital vault. Our mainframe and system projects are compiled and fully online. How can my cybernetic intelligence assist you in navigating our architectures today?",
      timestamp: new Date().toLocaleTimeString(),
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "projects">("chat");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Create user message
    const userMsg: LoreMessage = {
      id: `visitor-${Date.now()}`,
      sender: "visitor",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/loreweaver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
          projects: projects,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with Vance custodian.");
      }

      const data = await response.json();
      
      const vanceMsg: LoreMessage = {
        id: `vance-${Date.now()}`,
        sender: "loreweaver",
        text: data.text || "I was unable to synthesize a response. Let us align our telemetry fields.",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, vanceMsg]);
    } catch (err: any) {
      const errorMsg: LoreMessage = {
        id: `error-${Date.now()}`,
        sender: "system",
        text: `⚠️ **COMM_ERROR**: Transmission lost. Unable to contact Vance AI core. Details: ${err.message}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Custom Event Listener to trigger questions from outer components (like empty categories panel)
  useEffect(() => {
    const handleTrigger = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.query) {
        setIsOpen(true);
        setActiveTab("chat");
        handleSendMessage(customEvent.detail.query);
      }
    };
    window.addEventListener("loreweaver-trigger", handleTrigger);
    return () => {
      window.removeEventListener("loreweaver-trigger", handleTrigger);
    };
  }, [messages]);

  // Helper parser for basic markdown bold, lists, and code blocks
  const parseMarkdown = (plainText: string) => {
    const lines = plainText.split("\n");
    return lines.map((line, idx) => {
      let activeLine = line;

      // Handle simple lists
      const isListItem = activeLine.startsWith("- ") || activeLine.startsWith("* ");
      if (isListItem) {
        activeLine = activeLine.substring(2);
      }

      // Parse bold tags **text** -> strong
      const parts: React.ReactNode[] = [];
      let currentString = activeLine;
      let matchIdx = currentString.indexOf("**");

      let keyCounter = 0;
      while (matchIdx !== -1) {
        if (matchIdx > 0) {
          parts.push(<span key={`text-${keyCounter}`}>{currentString.substring(0, matchIdx)}</span>);
        }
        currentString = currentString.substring(matchIdx + 2);
        const endIdx = currentString.indexOf("**");
        if (endIdx !== -1) {
          parts.push(
            <strong key={`bold-${keyCounter}`} className="font-semibold text-white text-[#EC4899]">
              {currentString.substring(0, endIdx)}
            </strong>
          );
          currentString = currentString.substring(endIdx + 2);
        } else {
          parts.push(<span key={`stray-${keyCounter}`}>**{currentString}</span>);
          currentString = "";
        }
        matchIdx = currentString.indexOf("**");
        keyCounter++;
      }

      if (currentString.length > 0) {
        parts.push(<span key={`text-end`}>{currentString}</span>);
      }

      if (isListItem) {
        return (
          <li key={idx} className="ml-4 list-disc text-white/90 mb-1 leading-relaxed">
            {parts}
          </li>
        );
      }

      return (
        <p key={idx} className="mb-2 leading-relaxed text-white/95">
          {parts}
        </p>
      );
    });
  };

  // Preset quick chips
  const PRESET_CHIPS = [
    { label: "Design specifications", query: "Can you detail the design philosophy of the studio projects?" },
    { label: "Systems Architecture", query: "What technical systems engineering does Mythics Forge specialize in?" },
    { label: "Who is Vance?", query: "Introduce yourself, Vance. What is your curatorial mission?" },
    { label: "Mythics Shield details", query: "Explain the features of Mythics Shield network scanner and why it reaches 1.2M pps packet inspection." }
  ];

  return (
    <>
      {/* FLOATING ACTION TRIGGER */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          id="vance-floating-trigger"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative group w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#121124] to-[#1a1836] border border-white/10 hover:border-[#EC4899]/50 text-[#EC4899] hover:text-white shadow-[0_4px_24px_rgba(236,72,153,0.15)] hover:shadow-[0_4px_30px_rgba(236,72,153,0.3)] transition-all cursor-pointer"
        >
          {/* Glowing pulse ring */}
          <span className="absolute inset-0 rounded-full bg-[#EC4899] opacity-10 animate-ping"></span>
          
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -45, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <Sparkles className="w-5 h-5 absolute animate-pulse text-orange-400 opacity-60" />
                <Terminal className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* COMPANION SIDEBAR PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="vance-portal-console"
            initial={{ opacity: 0, x: 150, y: 50, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 150, y: 50, scale: 0.92 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed bottom-24 right-6 w-[92vw] sm:w-[460px] h-[72vh] max-h-[640px] z-40 bg-[#0D0B1C]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col font-sans"
          >
            {/* Header Status grid */}
            <div className="bg-black/80 px-4 py-3.5 border-b border-white/[0.06] flex items-center justify-between relative overflow-hidden">
              {/* Subtle visual grid highlight line */}
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#EC4899]/40 to-transparent"></div>
              
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#EC4899] shadow-[0_0_8px_#EC4899] flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-white opacity-80 animate-ping"></span>
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-1.5">
                    VANCE AI CUSTODIAN
                    <span className="text-[9px] text-[#EC4899] opacity-70">v3.5 // FLASH</span>
                  </h4>
                  <p className="text-[9px] text-white/40 font-mono tracking-wider uppercase mt-0.5">
                    FORGE_INTELLIGENCE // CRYPTO_TUNNELS_SECURED
                  </p>
                </div>
              </div>

              {/* Toggle panels tab */}
              <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-lg border border-white/5">
                <button
                  onClick={() => setActiveTab("chat")}
                  className={`px-2 py-1 rounded text-[9px] font-mono tracking-wider uppercase transition-all ${
                    activeTab === "chat" 
                      ? "bg-gradient-to-r from-[#4F46E5] to-[#EC4899] text-white font-semibold" 
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  CONSOLE
                </button>
                <button
                  onClick={() => setActiveTab("projects")}
                  className={`px-2 py-1 rounded text-[9px] font-mono tracking-wider uppercase transition-all ${
                    activeTab === "projects" 
                      ? "bg-gradient-to-r from-[#4F46E5] to-[#EC4899] text-white font-semibold" 
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  SPECS ({projects.length})
                </button>
              </div>
            </div>

            {/* TAB CONTENT: CHAT CONSOLE */}
            {activeTab === "chat" && (
              <>
                {/* Conversations display */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/5">
                  {messages.map((msg) => {
                    if (msg.sender === "system") {
                      return (
                        <div key={msg.id} className="p-3 bg-red-950/25 border border-red-900/30 rounded-xl text-xs text-red-300 font-mono flex items-start gap-2 animate-pulse">
                          <span>{msg.text}</span>
                        </div>
                      );
                    }

                    const isVance = msg.sender === "loreweaver";
                    return (
                      <div 
                        key={msg.id} 
                        className={`flex flex-col max-w-[85%] ${isVance ? "self-start" : "self-end ml-auto"}`}
                      >
                        {/* Sender tag indicators */}
                        <div className="flex items-center gap-1.5 mb-1 opacity-45 px-1 font-mono text-[8px] uppercase tracking-widest text-white">
                          {isVance ? (
                            <>
                              <Cpu className="w-2.5 h-2.5 text-[#EC4899]" />
                              <span>VANCE_INTEL</span>
                            </>
                          ) : (
                            <>
                              <MessageSquare className="w-2.5 h-2.5 text-indigo-400" />
                              <span>VOYAGER_LINK</span>
                            </>
                          )}
                          <span>• {msg.timestamp}</span>
                        </div>

                        {/* Speech Bubble */}
                        <div className={`p-3.5 rounded-2xl text-xs leading-relaxed transition-all ${
                          isVance 
                            ? "bg-white/5 border border-white/5 rounded-tl-sm text-slate-100" 
                            : "bg-gradient-to-br from-[#EC4899]/10 to-[#4F46E5]/5 border border-[#EC4899]/30 rounded-tr-sm text-white"
                        }`}>
                          <div className="space-y-1">
                            {parseMarkdown(msg.text)}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* AI Typing loading output state */}
                  {isTyping && (
                    <div className="flex flex-col max-w-[50%] self-start">
                      <div className="flex items-center gap-1.5 mb-1 opacity-45 px-1 font-mono text-[8px] uppercase tracking-widest text-[#EC4899]">
                        <Terminal className="w-2.5 h-2.5 animate-spin" />
                        <span>COMPILING_AI_RESONANCE...</span>
                      </div>
                      <div className="p-3.5 bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899] animate-bounce" style={{ animationDelay: "0s" }}></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899] animate-bounce" style={{ animationDelay: "0.15s" }}></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899] animate-bounce" style={{ animationDelay: "0.3s" }}></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Instant prompt suggestion chips for rapid query engagement */}
                <div className="px-4 py-2 border-t border-white/[0.05] bg-black/30 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none shrink-0">
                  {PRESET_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip.query)}
                      className="px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#EC4899]/30 text-[10px] text-white/70 hover:text-white font-mono hover:bg-white/10 transition-all cursor-pointer select-none"
                    >
                      💡 {chip.label}
                    </button>
                  ))}
                </div>

                {/* Input action controller panel */}
                <div className="p-3 bg-black/60 border-t border-white/[0.05] flex gap-2 items-center relative shrink-0">
                  <input
                    type="text"
                    value={inputText}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage(inputText);
                    }}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Input digital transmission queries here..."
                    className="flex-1 px-3.5 py-2.5 bg-white/5 text-xs text-white rounded-xl placeholder:text-white/20 border border-white/5 focus:border-[#EC4899]/30 focus:outline-none transition-all font-mono"
                  />
                  <button
                    disabled={!inputText.trim() || isTyping}
                    onClick={() => handleSendMessage(inputText)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#EC4899] hover:from-[#EC4899] hover:to-[#4F46E5] border border-white/10 text-white font-extrabold cursor-pointer transition-all ${
                      (!inputText.trim() || isTyping) ? "opacity-30 cursor-not-allowed" : "shadow-[0_0_12px_rgba(79,70,229,0.3)]"
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {/* TAB CONTENT: SPECS DRAWER (Quickly browse project data directly inside chat companion) */}
            {activeTab === "projects" && (
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-black/25">
                <div className="p-3 bg-gradient-to-r from-[#EC4899]/5 to-transparent border border-white/5 rounded-xl flex items-center gap-2.5">
                  <Cpu className="w-4.5 h-4.5 text-[#EC4899]" />
                  <div>
                    <span className="text-[10px] text-white/50 block font-mono">INTELLIGENCE_REGISTRY</span>
                    <h5 className="text-[11px] text-white font-bold font-mono uppercase">MYTHICS VAULT HARDWARE DEFINED</h5>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {projects.map((proj) => (
                    <div 
                      key={proj.id} 
                      className="p-3 bg-white/5 border border-white/5 hover:border-[#EC4899]/20 rounded-xl transition-all"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[8px] font-mono text-[#EC4899] uppercase tracking-wider">{proj.category}</span>
                          <h6 className="text-xs text-white font-bold leading-tight uppercase mt-0.5">{proj.title}</h6>
                          <p className="text-[10px] text-white/60 font-mono mt-1 font-light leading-snug">{proj.subtitle}</p>
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab("chat");
                            handleSendMessage(`Can you explain the specifications for the "${proj.title}" project?`);
                          }}
                          className="text-[9px] text-[#EC4899] font-mono bg-white/5 border border-white/10 hover:bg-[#EC4899] hover:text-white hover:border-transparent px-2.5 py-1 rounded transition-all cursor-pointer font-bold uppercase shrink-0"
                        >
                          SOLVE
                        </button>
                      </div>

                      {/* Display minor badges */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {proj.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="text-[8px] font-mono bg-white/5 text-white/40 px-1.5 py-0.5 rounded border border-white/5">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
