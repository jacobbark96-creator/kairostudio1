"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Code, Layout, ArrowRight } from 'lucide-react';

// The simulated typing sequence
const codeSequence = [
  { text: "import { motion } from 'framer-motion';", color: "text-purple-400", type: "import" },
  { text: "export default function Hero() {", color: "text-blue-400", type: "function" },
  { text: "  return (", color: "text-purple-400", type: "return" },
  { text: "    <motion.div", color: "text-red-400", type: "tag" },
  { text: "      initial={{ opacity: 0, scale: 0.8 }}", color: "text-orange-300", type: "prop", triggerAnimation: "initial" },
  { text: "      animate={{ opacity: 1, scale: 1 }}", color: "text-orange-300", type: "prop", triggerAnimation: "animate" },
  { text: "      whileHover={{ rotate: 3 }}", color: "text-orange-300", type: "prop", triggerAnimation: "hover" },
  { text: "      className=\"premium-glass-card\"", color: "text-green-400", type: "prop", triggerAnimation: "style" },
  { text: "    >", color: "text-red-400", type: "tag" },
  { text: "      Digital Excellence", color: "text-white", type: "content", triggerAnimation: "content" },
  { text: "    </motion.div>", color: "text-red-400", type: "tag" },
  { text: "  );", color: "text-purple-400", type: "return" },
  { text: "}", color: "text-blue-400", type: "function" }
];

export default function CodeToCanvas() {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [canvasState, setCanvasState] = useState("idle");
  const [showPacket, setShowPacket] = useState(false);

  // Typing logic
  useEffect(() => {
    if (!isTyping) return;

    if (currentLineIndex < codeSequence.length) {
      const currentLine = codeSequence[currentLineIndex];
      
      if (currentCharIndex < currentLine.text.length) {
        const timeout = setTimeout(() => {
          setCurrentCharIndex(prev => prev + 1);
        }, 30); // Typing speed
        return () => clearTimeout(timeout);
      } else {
        // Line finished typing
        const timeout = setTimeout(() => {
          if (currentLine.triggerAnimation) {
            // Trigger the visual data packet transfer
            setShowPacket(true);
            setTimeout(() => setShowPacket(false), 600); // Packet travel time
            
            // Update canvas state after packet arrives
            setTimeout(() => {
              setCanvasState(currentLine.triggerAnimation as string);
            }, 600);
          }
          
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
          
          // Pause slightly longer at the end of the whole block before restarting
          if (currentLineIndex === codeSequence.length - 1) {
            setIsTyping(false);
            setTimeout(() => {
              setCurrentLineIndex(0);
              setCurrentCharIndex(0);
              setCanvasState("idle");
              setIsTyping(true);
            }, 3000);
          }
        }, 500); // Pause between lines
        return () => clearTimeout(timeout);
      }
    }
  }, [currentLineIndex, currentCharIndex, isTyping]);

  // Determine what canvas looks like based on state
  const getCanvasStyles = () => {
    switch (canvasState) {
      case "idle":
      case "initial":
        return { opacity: 0.3, scale: 0.8, rotate: 0, backdropFilter: "none" };
      case "animate":
        return { opacity: 1, scale: 1, rotate: 0, backdropFilter: "none" };
      case "hover":
        return { opacity: 1, scale: 1, rotate: 3, backdropFilter: "none" };
      case "style":
      case "content":
        return { opacity: 1, scale: 1, rotate: 3, backdropFilter: "blur(16px)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)" };
      default:
        return { opacity: 0.3, scale: 0.8, rotate: 0 };
    }
  };

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white dark:bg-[#050505]">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 mb-6">
            <Code className="w-4 h-4 text-brand-500" />
            <span className="text-xs font-bold tracking-widest text-brand-500 uppercase">Live Compilation</span>
          </div>
          <h3 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tighter text-gray-900 dark:text-white mb-6">
            Code to Canvas.
          </h3>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
            Watch raw logic instantly compile into breathtaking design. We build pixel-perfect interfaces that move as fast as you do.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Connecting Data Line between boxes */}
          <div className="absolute top-1/2 left-[40%] right-[40%] h-0.5 bg-gray-200 dark:bg-gray-800 -translate-y-1/2 z-0 hidden lg:block" />
          
          {/* Animated Data Packet */}
          <AnimatePresence>
            {showPacket && (
              <motion.div
                initial={{ left: "45%", opacity: 0, scale: 0.5 }}
                animate={{ left: "55%", opacity: 1, scale: 1.5 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute top-1/2 -translate-y-1/2 w-4 h-1 bg-brand-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.8)] z-10 hidden lg:block"
              />
            )}
          </AnimatePresence>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-stretch relative z-10">
            {/* LEFT: The Code Side */}
            <div className="rounded-3xl bg-[#0d1117] border border-gray-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden group h-[450px] flex flex-col">
              <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                  <span className="ml-3 text-xs font-mono text-gray-500">HeroSection.tsx</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-brand-400 bg-brand-500/10 px-2 py-1 rounded">
                  <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                  Compiling...
                </div>
              </div>

              <div className="font-mono text-sm sm:text-base leading-relaxed overflow-x-auto text-gray-300 flex-1 relative">
                {codeSequence.map((line, index) => {
                  if (index > currentLineIndex) return null;
                  
                  const isCurrentLine = index === currentLineIndex;
                  const textToShow = isCurrentLine 
                    ? line.text.substring(0, currentCharIndex) 
                    : line.text;

                  // Basic syntax highlighting rendering based on type
                  const renderHighlightedText = () => {
                    if (line.type === "import" || line.type === "function" || line.type === "return") {
                      return <span className={line.color}>{textToShow}</span>;
                    }
                    if (line.type === "tag") {
                      return <span className={line.color}>{textToShow}</span>;
                    }
                    if (line.type === "prop") {
                      // Split property name and value roughly
                      const parts = textToShow.split('=');
                      if (parts.length > 1) {
                        return (
                          <>
                            <span className="text-orange-300">{parts[0]}</span>=
                            <span className="text-blue-300">{parts.slice(1).join('=')}</span>
                          </>
                        );
                      }
                    }
                    return <span className={line.color}>{textToShow}</span>;
                  };

                  return (
                    <div key={index} className={`whitespace-pre transition-colors duration-300 ${isCurrentLine ? 'bg-white/5 rounded px-1 -ml-1' : ''}`}>
                      {renderHighlightedText()}
                      {isCurrentLine && (
                        <span className="inline-block w-2 h-5 bg-brand-400 animate-pulse ml-1 align-middle" />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent opacity-50 pointer-events-none" />
            </div>

            {/* RIGHT: The Canvas Side */}
            <div className="rounded-3xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center group h-[450px]">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
              
              {/* Glowing background that pulses when receiving data */}
              <motion.div 
                animate={{ 
                  scale: showPacket ? 1.5 : 1,
                  opacity: showPacket ? 0.8 : 0.4
                }}
                transition={{ duration: 0.5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-500/20 rounded-full blur-[80px] pointer-events-none" 
              />
              
              <div className="absolute top-6 right-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 shadow-sm">
                  <Layout className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                  <span className="text-[10px] font-bold tracking-wide text-gray-900 dark:text-white uppercase">Client View</span>
                </div>
              </div>

              {/* The Target Object that reacts to the code */}
              <motion.div 
                animate={getCanvasStyles()}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative z-10 w-full max-w-sm rounded-2xl p-8 flex flex-col items-center justify-center min-h-[200px]"
              >
                {canvasState === "content" || canvasState === "style" ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center mb-4">
                      <Sparkles className="w-6 h-6 text-brand-400" />
                    </div>
                    <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white tracking-tight drop-shadow-sm">
                      Digital Excellence
                    </h3>
                  </>
                ) : (
                  <div className="w-16 h-16 rounded-full border-4 border-dashed border-gray-300 dark:border-gray-700 animate-spin" />
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
