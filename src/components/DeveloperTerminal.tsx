import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { useUI } from '../context/UIContext';

export default function DeveloperTerminal({ onModeChange }: { onModeChange: (isTerminal: boolean) => void }) {
  const [input, setInput] = useState('');
  const [isTerminalMode, setIsTerminalMode] = useState(false);
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [placeholderText, setPlaceholderText] = useState('');
  const { openContactModal } = useUI();
  
  const fullPlaceholder = "Give me a command.... Examples are tellme --more or bookme appointment";
  const inputRef = useRef<HTMLInputElement>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);

  // Typewriter effect for placeholder
  useEffect(() => {
    if (isTerminalMode) return;
    
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      setPlaceholderText(fullPlaceholder.substring(0, currentIndex));
      currentIndex++;
      if (currentIndex > fullPlaceholder.length) {
        clearInterval(intervalId);
      }
    }, 50);
    return () => clearInterval(intervalId);
  }, [isTerminalMode]);

  // Auto scroll to bottom, but we want to prevent the browser from scrolling the whole page
  // when the terminal output updates.
  useEffect(() => {
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [outputLines]);

  const processCommand = async (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    setOutputLines(prev => [...prev, `$ ${cmd}`]);
    
    if (trimmed === 'tellme --more') {
      await simulateTyping([
        "Initializing core systems...",
        "Accessing Kairo Studio databases...",
        "Kairo Studio is a premium digital agency.",
        "We specialize in Next.js, React, and high-performance web applications.",
        "Mission: Engineer Digital Unfair Advantages.",
        "Status: Online and ready for new projects."
      ]);
    } else if (trimmed === 'bookme appointment' || trimmed === 'bookme --appointment') {
      await simulateTyping([
        "Connecting to scheduling server...",
        "Opening contact modal..."
      ]);
      setTimeout(() => {
        openContactModal();
      }, 1000);
    } else if (trimmed === 'clear') {
      setOutputLines([]);
    } else if (trimmed === 'exit') {
      closeTerminal();
    } else if (trimmed === 'help') {
      await simulateTyping([
        "Available commands:",
        "  tellme --more         : Learn more about Kairo Studio",
        "  bookme appointment    : Open the contact form to book a meeting",
        "  clear                 : Clear terminal output",
        "  exit                  : Return to standard UI",
        "  help                  : Show this help message"
      ]);
    } else if (trimmed !== '') {
      await simulateTyping([
        `Command not found: ${trimmed}`,
        "Type 'help' to see available commands."
      ]);
    }
  };

  const simulateTyping = async (lines: string[]) => {
    for (const line of lines) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setOutputLines(prev => [...prev, line]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTerminalMode && input.trim() !== '') {
      setIsTerminalMode(true);
      onModeChange(true);
    }
    const currentInput = input;
    setInput('');
    if (currentInput.trim()) {
      processCommand(currentInput);
    }
  };

  const closeTerminal = () => {
    setIsTerminalMode(false);
    onModeChange(false);
    setOutputLines([]);
    setInput('');
  };

  return (
    <motion.div 
      layout
      className={`w-full max-w-4xl mx-auto origin-top ${isTerminalMode ? 'h-[60vh] my-12' : 'h-16 my-8'}`}
      initial={{ opacity: 0, scaleY: 0.95 }}
      animate={{ opacity: 1, scaleY: 1 }}
      transition={{ 
        opacity: { duration: 0.5 },
        layout: { type: "spring", stiffness: 300, damping: 30 }
      }}
    >
      <div className="w-full h-full rounded-2xl bg-[#0d1117] border border-gray-800 shadow-2xl overflow-hidden flex flex-col font-mono text-sm sm:text-base text-green-400">
        {/* Terminal Header */}
        <div className="h-10 bg-[#161b22] border-b border-gray-800 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer transition-colors" onClick={isTerminalMode ? closeTerminal : undefined} />
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 cursor-pointer transition-colors" />
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 cursor-pointer transition-colors" onClick={() => { if(!isTerminalMode) { setIsTerminalMode(true); onModeChange(true); } }} />
          </div>
          <div className="text-gray-500 text-xs font-semibold flex items-center gap-2">
            <Terminal className="w-3 h-3" /> kairo-os ~ bash
          </div>
          <div className="w-14" /> {/* Spacer for centering */}
        </div>

        {/* Terminal Body */}
        <div className="flex-1 px-4 py-2 overflow-y-auto custom-scrollbar flex flex-col relative" onClick={() => inputRef.current?.focus()}>
          <AnimatePresence>
            {isTerminalMode && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="mb-4"
              >
                <div className="text-blue-400 mb-2">Welcome to Kairo OS v2.0.0</div>
                <div className="text-gray-400 mb-4">Type 'help' to see available commands.</div>
                {outputLines.map((line, i) => (
                  <div key={i} className={`mb-1 ${line.startsWith('$') ? 'text-white mt-2' : line.startsWith('Command not found') ? 'text-red-400' : 'text-green-400'}`}>
                    {line}
                  </div>
                ))}
                <div ref={outputEndRef} />
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className={`flex items-center ${!isTerminalMode ? 'absolute inset-0 px-4' : 'mt-2'}`}>
            <span className="text-purple-400 mr-2 font-bold">~</span>
            <span className="text-blue-400 mr-2 font-bold">❯</span>
            <div className="relative flex-1 flex items-center h-full">
              {!isTerminalMode && !input && (
                <div className="absolute left-0 text-gray-500 pointer-events-none whitespace-nowrap overflow-hidden">
                  {placeholderText}
                  <motion.span 
                    animate={{ opacity: [1, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2 h-4 bg-gray-500 ml-1 align-middle"
                  />
                </div>
              )}
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-white focus:ring-0 p-0 caret-transparent"
                spellCheck={false}
                autoComplete="off"
              />
              {/* Custom blinking cursor for input */}
              {(isTerminalMode || input) && (
                <motion.div 
                  className="absolute pointer-events-none"
                  style={{ left: `${input.length}ch` }}
                  animate={{ opacity: [1, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.8 }}
                >
                  <div className="w-2 h-4 bg-white ml-1 align-middle" />
                </motion.div>
              )}
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}