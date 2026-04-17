import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X } from 'lucide-react';

export default function VaultRiddleModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [showRiddle, setShowRiddle] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowRiddle(false);
      setAnswer('');
      setError(false);
      // Wait for vault doors to close before showing riddle
      const timer = setTimeout(() => {
        setShowRiddle(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.toLowerCase().trim() === 'bali') {
      onClose(); // Correct!
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden">
      {/* Left Vault Door */}
      <motion.div 
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-1/2 h-full bg-[#111] border-r-8 border-gray-800 flex items-center justify-end z-10 shadow-[20px_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="w-16 h-32 bg-gray-800 rounded-l-2xl border-y-4 border-l-4 border-gray-600 mr-2" />
      </motion.div>

      {/* Right Vault Door */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 1, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-1/2 h-full bg-[#111] border-l-8 border-gray-800 flex items-center justify-start z-10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="w-16 h-32 bg-gray-800 rounded-r-2xl border-y-4 border-r-4 border-gray-600 ml-2" />
      </motion.div>

      {/* Riddle Lightbox */}
      <AnimatePresence>
        {showRiddle && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-20 w-full max-w-lg mx-4 bg-[#0a0a0a] border border-gray-800 rounded-3xl p-8 shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                <Lock className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 font-display">System Locked</h2>
              <p className="text-gray-400 text-sm mb-8">Solve the riddle to proceed.</p>

              <div className="text-gray-300 italic font-serif text-lg leading-relaxed mb-8 space-y-2 border-l-4 border-brand-500 pl-6 text-left w-full">
                <p>I bear a name that sounds like a decree,</p>
                <p>Yet my essence is spirit, wild and free.</p>
                <p>From volcanic ash, my beauty unfurls,</p>
                <p>A tapestry of green in a world of pearls.</p>
                <p>Seek me where the East meets the West's desire,</p>
                <p>Kissed by the sun, fueled by ancient fire.</p>
                <p>My people honor a thousand gods unseen,</p>
                <p>A paradise found, serene and keen.</p>
                <p className="pt-4 font-bold text-white not-italic">What am I?</p>
              </div>

              <form onSubmit={handleSubmit} className="w-full relative">
                <input 
                  type="text" 
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  className={`w-full bg-[#111] border ${error ? 'border-red-500' : 'border-gray-800'} rounded-xl px-4 py-4 text-white outline-none focus:border-brand-500 transition-colors text-center text-lg`}
                  autoFocus
                />
                {error && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -bottom-6 left-0 right-0 text-red-500 text-sm"
                  >
                    Incorrect. Try again.
                  </motion.p>
                )}
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}