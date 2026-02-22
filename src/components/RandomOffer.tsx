import React, { useState, useEffect } from 'react';
import { ArrowRight, Heart, Diamond, Club, Spade } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useUI } from '../context/UIContext';
import confetti from 'canvas-confetti';

// Kairo Logo Component for the Slot Machine
const KairoLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor">
    <path d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z" />
  </svg>
);

const SYMBOLS = [
  { id: 'kairo', component: KairoLogo, color: 'text-brand-500' },
  { id: 'heart', component: Heart, color: 'text-red-500' },
  { id: 'diamond', component: Diamond, color: 'text-blue-500' },
  { id: 'club', component: Club, color: 'text-green-500' },
  { id: 'spade', component: Spade, color: 'text-purple-500' },
];

export default function RandomOffer() {
  const { openContactModal } = useUI();
  const [step, setStep] = useState<'initial' | 'spinning' | 'revealed'>('initial');
  const [offer, setOffer] = useState<{ title: string; description: string; price: number } | null>(null);
  const [slots, setSlots] = useState([SYMBOLS[1], SYMBOLS[2], SYMBOLS[3]]);
  const [isLeverPulled, setIsLeverPulled] = useState(false);

  const spinSlots = async () => {
    if (step === 'spinning') return;
    
    setStep('spinning');
    setIsLeverPulled(true);
    
    // Animate lever return
    setTimeout(() => setIsLeverPulled(false), 500);

    // Determine outcome based on logic
    // 1 Kairo = £800 offer
    // 2 Kairos = £500 offer
    // 3 Kairos = £200 offer
    
    // Randomly decide outcome first (weighted for excitement but realistic)
    const rand = Math.random();
    let outcomeType: '3_match' | '2_match' | '1_match' | 'no_match' = 'no_match';
    
    // For demo purposes, let's make winning relatively likely
    if (rand < 0.2) outcomeType = '3_match';      // 20% chance of jackpot (£200)
    else if (rand < 0.5) outcomeType = '2_match'; // 30% chance of £500
    else outcomeType = '1_match';                 // 50% chance of £800
    
    // Set target symbols based on outcome
    let targetSymbols = [];
    if (outcomeType === '3_match') {
        targetSymbols = [SYMBOLS[0], SYMBOLS[0], SYMBOLS[0]];
    } else if (outcomeType === '2_match') {
        targetSymbols = [SYMBOLS[0], SYMBOLS[0], SYMBOLS[Math.floor(Math.random() * 4) + 1]];
        // Shuffle to randomize position of non-match
        targetSymbols.sort(() => Math.random() - 0.5);
    } else {
        // 1 match
        targetSymbols = [SYMBOLS[0], SYMBOLS[Math.floor(Math.random() * 4) + 1], SYMBOLS[Math.floor(Math.random() * 4) + 1]];
        targetSymbols.sort(() => Math.random() - 0.5);
    }

    // Determine Offer Text/Price
    let offerDetails = { title: "Error", description: "Something went wrong", price: 0 };
    if (outcomeType === '3_match') {
        offerDetails = { title: "JACKPOT! £200 Site", description: "You matched 3 Kairo Logos! Get a full website for just £200.", price: 200 };
    } else if (outcomeType === '2_match') {
        offerDetails = { title: "£500 Website Offer", description: "Two matches! Get a premium website for only £500.", price: 500 };
    } else {
        offerDetails = { title: "£800 Website Offer", description: "You got a match! Claim your professional website for £800.", price: 800 };
    }

    // Animation Loop
    const spinDuration = 2000;
    const intervalTime = 100;
    const startTime = Date.now();

    const spinInterval = setInterval(() => {
        setSlots([
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
            SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
        ]);

        if (Date.now() - startTime > spinDuration) {
            clearInterval(spinInterval);
            setSlots(targetSymbols);
            setOffer(offerDetails);
            setStep('revealed');
            
            // Celebration effects
            if (outcomeType === '3_match') triggerConfetti(true);
            else triggerConfetti(false);
        }
    }, intervalTime);
  };

  const triggerConfetti = (isJackpot: boolean) => {
    const duration = isJackpot ? 3000 : 1500;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    <div className="w-full h-full min-h-[400px] sm:min-h-[450px] bg-white/80 dark:bg-black/80 backdrop-blur-none sm:backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-12 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-visible group border-2 border-black dark:border-white transition-all hover:border-brand-500/30 dark:hover:border-brand-500/30">
        
        {/* Racing Light Effect (Desktop Only) */}
        <div className="border-beam-container hidden sm:block">
            <div className="border-beam-light" />
        </div>

        {/* Decorative elements (Desktop Only) */}
        <div className="hidden sm:block absolute top-0 right-0 w-64 h-64 bg-brand-400/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
        <div className="hidden sm:block absolute bottom-0 left-0 w-64 h-64 bg-purple-400/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 animate-pulse animation-delay-2000" />
        
        {/* Slot Machine Display */}
        <div className="relative z-10 w-full max-w-sm mb-8">
            <div className="flex justify-center gap-2 sm:gap-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-xl border-4 border-gray-300 dark:border-gray-700 shadow-inner">
                {slots.map((Symbol, index) => (
                    <div key={index} className="w-20 h-24 sm:w-24 sm:h-32 bg-white dark:bg-black rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden relative">
                         {/* Blur effect while spinning */}
                         {step === 'spinning' && (
                             <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/50 to-white/0 dark:via-white/10 animate-pulse z-10" />
                         )}
                        <Symbol.component className={`w-10 h-10 sm:w-12 sm:h-12 ${Symbol.color} transform transition-all duration-100 ${step === 'spinning' ? 'blur-sm scale-90' : 'scale-100'}`} />
                    </div>
                ))}
            </div>
            
            {/* Slot Machine Lever (Visual Representation) */}
            <div className="absolute top-1/2 -right-12 sm:-right-16 -translate-y-1/2 w-8 h-32 sm:w-10 sm:h-40 pointer-events-none hidden sm:block">
                 {/* Base */}
                 <div className="absolute bottom-0 left-0 w-full h-12 bg-gray-300 dark:bg-gray-700 rounded-lg border-2 border-gray-400 dark:border-gray-600"></div>
                 {/* Stick */}
                 <div className={`absolute left-1/2 -translate-x-1/2 w-2 bg-gray-400 dark:bg-gray-500 transition-all duration-300 origin-bottom ${isLeverPulled ? 'h-10 rotate-[180deg] top-[60%]' : 'h-24 top-0'}`}></div>
                 {/* Knob */}
                 <div className={`absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-red-600 shadow-lg border-2 border-red-700 transition-all duration-300 ${isLeverPulled ? 'top-[90%]' : '-top-4'}`}></div>
            </div>
        </div>

        {step === 'initial' || step === 'spinning' ? (
            <div className="relative z-10 space-y-6 sm:space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-black dark:text-white">
                        Spin to Win
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-xs mx-auto">
                        Match Kairo logos to unlock exclusive website offers.
                    </p>
                </div>

                <button
                    onClick={spinSlots}
                    disabled={step === 'spinning'}
                    className={`group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-base sm:text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-brand-500/20 overflow-hidden ${step === 'spinning' ? 'cursor-not-allowed opacity-80' : ''}`}
                >
                    {step === 'spinning' ? (
                        <>
                            <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            <span>Spinning...</span>
                        </>
                    ) : (
                        <>
                            <span>PULL THE LEVER</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        ) : (
            <div className="relative z-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-md">
                <div className="relative p-6 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-100 dark:border-brand-800">
                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                        {offer?.title}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        {offer?.description}
                    </p>
                </div>
                
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => {
                            const finalPrice = offer?.price !== undefined ? offer.price : 0;
                            openContactModal(offer?.title, finalPrice);
                        }}
                        className="w-full py-4 bg-gradient-to-r from-brand-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                    >
                        Claim This Offer
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => {
                            setStep('initial');
                            setSlots([SYMBOLS[1], SYMBOLS[2], SYMBOLS[3]]);
                        }}
                        className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        Spin Again
                    </button>
                </div>
            </div>
        )}
    </div>
  );
}
