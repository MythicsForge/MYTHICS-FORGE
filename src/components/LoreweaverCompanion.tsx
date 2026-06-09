/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, ShieldAlert, Sparkles, MessageSquareCode, CornerDownLeft, Loader2 } from "lucide-react";
import { LoreMessage, Project } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface LoreweaverCompanionProps {
  projects: Project[];
}

const QUICK_PROMPTS = [
  "Vance, how does one individual engineer all these complex systems?",
  "What core services and tech consulting domains do you specialize in?",
  "Provide a deep architectural breakdown of elite solo software craftsmanship.",
  "Are you currently accepting new contracts or consulting projects?"
];

export default function LoreweaverCompanion({ projects }: LoreweaverCompanionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<LoreMessage[]>([
    {
      id: "welcome",
      sender: "loreweaver",
      text: "Greetings, visitor. I am **Vance**, the ultra-advanced Synthetic Curator and Engineering Custodian of *Mythics Forge*. \n\nMy cores are online and fully optimized to guide you through the solo engineer's technical portfolio, WebGL graphics pipelines, database architectures, or custom consulting options. Speak your query, and we shall compile it!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  const listEndRef = useRef<HTMLDivElement>(null);

  // Rotate loading actions to make wait times fun and high-tech aligned
  const LOADING_MESSAGES = [
    "Connecting Vance cognitive cores...",
    "Scanning active registry metrics...",
    "Compiling system architectural logs...",
    "Querying deep neural weights...",
    "Resolving query semantic nodes..."
  ];

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (isOpen) {
      listEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: LoreMessage = {
      id: Date.now().toString(),
      sender: "visitor",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);
    setLoadingMsgIdx(0);

    try {
      const response = await fetch("/api/loreweaver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-8), // Send up to last 8 messages for context
          projects: projects // Feed active state projects so model always knows what's in the catalog!
        })
      });

      if (!response.ok) {
        throw new Error("Lore synthesis fractured inside the boiler.");
      }

      const data = await response.json();
      
      const machineMsg: LoreMessage = {
        id: (Date.now() + 1).toString(),
        sender: "loreweaver",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages((prev) => [...prev, machineMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "_err",
          sender: "system",
          text: `⚠️ **A dynamic valve failure occurred:** ${err.message || "Failed to stoke the API model."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Turn markdown markers into simple styled text segments
  const formatText = (text: string) => {
    // Escape markdown structures safely
    const lines = text.split("\n");
    return lines.map((line, lIdx) => {
      // Split by bold patterns **
      let parts = line.split("**");
      let renderedParts = parts.map((part, pIdx) => {
        if (pIdx % 2 === 1) {
          return <strong key={pIdx} className="text-amber-300 font-semibold">{part}</strong>;
        }
        // Check for italic *
        let italicParts = part.split("*");
        return italicParts.map((subPart, sIdx) => {
          if (sIdx % 2 === 1) {
            return <em key={sIdx} className="text-slate-250 italic">{subPart}</em>;
          }
          return subPart;
        });
      });
      return <p key={lIdx} className="min-h-[1.25rem] text-sm leading-relaxed mb-2 last:mb-0">{renderedParts}</p>;
    });
  };

  return (
    <>
      {/* Floating launcher badge */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          onClick={() => setIsOpen(true)}
          id="open-vance-btn"
          aria-label="Consult Vance Companion"
          className="relative px-4 py-3.5 bg-amber-500 hover:bg-amber-600 border border-amber-600/25 shadow-lg shadow-amber-500/20 text-black font-semibold rounded-full flex items-center gap-2.5 transition-transform duration-200 cursor-pointer text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageSquareCode className="w-5 h-5 animate-pulse" />
          <span>Vance AI</span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border border-[#0c0d0e] rounded-full"></span>
        </motion.button>
      </div>

      {/* Drawer overlay Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end md:p-6 p-0 bg-black/40 backdrop-blur-sm">
            {/* Click shield */}
            <div className="absolute inset-0" onClick={() => setIsOpen(false)}></div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: "spring", duration: 0.4 }}
              id="vance-panel"
              className="relative w-full max-w-lg h-full md:h-[90vh] bg-[#0c0e10] border-l md:border border-amber-500/20 md:rounded-xl shadow-2xl flex flex-col overflow-hidden self-end"
            >
              {/* Terminal Header */}
              <div className="px-5 py-4 bg-gradient-to-r from-amber-950/20 to-stone-900 border-b border-amber-500/10 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
                  <div>
                    <h3 className="font-serif text-slate-100 text-sm font-bold tracking-wider">
                      VANCE CORE COGNITIVE
                    </h3>
                    <p className="text-[10px] text-amber-500 font-mono tracking-widest mt-0.5 uppercase">
                      Vance Unit v3.5
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  id="close-vance-btn"
                  className="p-1.5 hover:bg-amber-500/10 hover:text-amber-400 text-slate-400 rounded-full transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${
                      msg.sender === "visitor" ? "ml-auto items-end" : "mr-auto items-start"
                    }`}
                  >
                    {/* Header line */}
                    <span className="text-[10px] text-slate-500 font-mono uppercase mb-1">
                      {msg.sender === "visitor" ? "VISITOR" : msg.sender === "loreweaver" ? "VANCE" : "FORGE CORE"} • {msg.timestamp}
                    </span>

                    {/* Speech box */}
                    <div
                      className={`p-3.5 rounded-lg border text-slate-250 ${
                        msg.sender === "visitor"
                          ? "bg-amber-500/10 border-amber-500/25 text-amber-100 rounded-tr-none"
                          : msg.sender === "system"
                          ? "bg-red-950/20 border-red-950 text-red-300 font-mono text-xs"
                          : "bg-slate-900/60 border-slate-800/80 rounded-tl-none"
                      }`}
                    >
                      {msg.sender === "system" ? formatText(msg.text) : formatText(msg.text)}
                    </div>
                  </div>
                ))}

                {/* Processing State */}
                {isLoading && (
                  <div className="flex flex-col items-start max-w-[80%] mr-auto gap-1 text-slate-400">
                    <span className="text-[10px] text-amber-500/50 font-mono uppercase">
                      VANCE • COGNITIVE SYNAPSE
                    </span>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg rounded-tl-none text-xs font-mono">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-500" />
                      <span>{LOADING_MESSAGES[loadingMsgIdx]}</span>
                    </div>
                  </div>
                )}
                <div ref={listEndRef} />
              </div>

              {/* Suggestion Prompts */}
              {messages.length === 1 && !isLoading && (
                <div className="px-5 py-3 border-t border-slate-900 bg-black/20 shrink-0 space-y-2">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                    SUGGESTED SCRIPTS:
                  </p>
                  <div className="flex flex-col gap-1.5">
                    {QUICK_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-left text-xs text-amber-400 hover:text-white bg-slate-900/40 hover:bg-amber-500/5 border border-slate-800/50 hover:border-amber-500/20 p-2 rounded transition-all duration-200 cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Submitting Footer Panel */}
              <div className="p-4 bg-gradient-to-t from-black/80 to-[#101214] border-t border-slate-900 flex flex-col shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(inputText);
                  }}
                  className="flex gap-2 relative"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Whisper system queries to Vance..."
                    className="flex-1 bg-black/60 border border-slate-800/80 focus:border-amber-500/50 rounded-lg pl-3.5 pr-12 py-3 text-sm text-slate-200 outline-none focus:ring-1 focus:ring-amber-500/20"
                  />
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {inputText.trim() && (
                      <span className="hidden md:flex items-center gap-0.5 text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono border border-slate-700">
                        <CornerDownLeft className="w-2.5 h-2.5" />
                      </span>
                    )}
                    <button
                      type="submit"
                      disabled={!inputText.trim() || isLoading}
                      aria-label="Emit query"
                      className="p-1 px-2 text-amber-500 hover:text-amber-400 cursor-pointer disabled:opacity-30"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
                <div className="mt-2 text-[9px] text-center text-slate-500 tracking-wider font-mono">
                  FORGE PORTAL SECURED & DECRYPTED
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
