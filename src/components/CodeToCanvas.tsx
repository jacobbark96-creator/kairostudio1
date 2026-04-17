"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Code, Layout, ArrowRight, RotateCcw } from 'lucide-react';

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
  { text: "      Type 'Showme --secrets' into the", color: "text-white", type: "content" },
  { text: "      code on About page for a surprise", color: "text-white", type: "content", triggerAnimation: "content" },
  { text: "    </motion.div>", color: "text-red-400", type: "tag" },
  { text: "  );", color: "text-purple-400", type: "return" },
  { text: "}", color: "text-blue-400", type: "function" }
];

export default function CodeToCanvas() {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [canvasState, setCanvasState] = useState("idle");
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFlipButton, setShowFlipButton] = useState(false);

  // Typing logic
  useEffect(() => {
    if (!isTyping) return;

    if (currentLineIndex < codeSequence.length) {
      const currentLine = codeSequence[currentLineIndex];
      
      if (currentCharIndex < currentLine.text.length) {
        const timeout = setTimeout(() => {
          setCurrentCharIndex(prev => prev + 1);
        }, 20); // Typing speed
        return () => clearTimeout(timeout);
      } else {
        // Line finished typing
        const timeout = setTimeout(() => {
          if (currentLine.triggerAnimation) {
            setCanvasState(currentLine.triggerAnimation as string);
          }
          
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
          
          // End of block
          if (currentLineIndex === codeSequence.length - 1) {
            setIsTyping(false);
            setShowFlipButton(true);
          }
        }, 300); // Pause between lines
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

  const handleFlip = () => {
    setIsFlipped(true);
  };

  const handleReset = () => {
    setIsFlipped(false);
    setShowFlipButton(false);
    setCurrentLineIndex(0);
    setCurrentCharIndex(0);
    setCanvasState("idle");
    // Wait for flip to complete before restarting typing
    setTimeout(() => {
      setIsTyping(true);
    }, 600);
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
            Watch raw logic compile into breathtaking design. We build pixel-perfect interfaces that move as fast as you do.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto perspective-1000 h-[550px] sm:h-[450px]">
          <motion.div
            className="w-full h-full relative transform-style-3d"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 80, damping: 20 }}
          >
            {/* FRONT: The Code Side */}
            <div 
              className="absolute inset-0 w-full h-full backface-hidden rounded-3xl bg-[#0d1117] border border-gray-800 p-6 sm:p-8 shadow-2xl overflow-hidden group flex flex-col"
            >
              <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                  <span className="ml-3 text-xs font-mono text-gray-500">HeroSection.tsx</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-brand-400 bg-brand-500/10 px-2 py-1 rounded">
                  <div className={`w-2 h-2 rounded-full bg-brand-500 ${isTyping ? 'animate-pulse' : ''}`} />
                  {isTyping ? 'Compiling...' : 'Compiled'}
                </div>
              </div>

              <div className="font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-gray-300 flex-1 relative">
                {codeSequence.map((line, index) => {
                  if (index > currentLineIndex) return null;
                  
                  const isCurrentLine = index === currentLineIndex;
                  const textToShow = isCurrentLine 
                    ? line.text.substring(0, currentCharIndex) 
                    : line.text;

                  const renderHighlightedText = () => {
                    if (line.type === "import" || line.type === "function" || line.type === "return") {
                      return <span className={line.color}>{textToShow}</span>;
                    }
                    if (line.type === "tag") {
                      return <span className={line.color}>{textToShow}</span>;
                    }
                    if (line.type === "prop") {
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
                      {isCurrentLine && isTyping && (
                        <span className="inline-block w-2 h-4 bg-brand-400 animate-pulse ml-1 align-middle" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Flip Overlay Button */}
              <AnimatePresence>
                {showFlipButton && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20"
                  >
                    <button
                      onClick={handleFlip}
                      className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Flip to see results
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* BACK: The Canvas Side */}
            <div 
              className="absolute inset-0 w-full h-full backface-hidden rounded-3xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 p-8 sm:p-12 shadow-2xl overflow-hidden flex flex-col items-center justify-center text-center group"
              style={{ transform: "rotateY(180deg)" }}
            >
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-500/20 rounded-full blur-[80px] pointer-events-none" />
              
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
                className="relative z-10 w-full max-w-sm rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center min-h-[200px]"
              >
                <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-brand-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight drop-shadow-sm leading-snug">
                  Type 'Showme --secrets' into the code on About page for a surprise
                </h3>
              </motion.div>

              {/* Restart Button */}
              <div className="absolute bottom-6 right-6">
                <button
                  onClick={handleReset}
                  className="p-3 rounded-full bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
                  title="Run code again"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
