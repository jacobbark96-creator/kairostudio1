import React, { useState, useEffect } from 'react';
import { ArrowRight, Heart, Diamond, Club, Spade } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useUI } from '../context/UIContext';
import confetti from 'canvas-confetti';

// Kairo Logo Component for the Slot Machine
import logoNb from '../Logo/kairologo-nbg.png';

const KairoLogo = ({ className }: { className?: string }) => (
  <img src={logoNb} alt="Kairo Logo" className={className} />
);

const SYMBOLS = [
  { id: 'kairo', component: KairoLogo, color: 'text-brand-500' },
  { id: 'heart', component: Heart, color: 'text-red-500' },
  { id: 'diamond', component: Diamond, color: 'text-blue-500' },
  { id: 'club', component: Club, color: 'text-green-500' },
  { id: 'spade', component: Spade, color: 'text-purple-500' },
];

export default function RandomOffer() {
  const { openContactModal, triggerJackpot } = useUI();
  const [step, setStep] = useState<'initial' | 'spinning' | 'revealed'>('initial');
  const [offer, setOffer] = useState<{ title: string; description: string; price: number } | null>(null);
  const [slots, setSlots] = useState([SYMBOLS[1], SYMBOLS[2], SYMBOLS[3]]);
  const [isLeverPulled, setIsLeverPulled] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [stopDelays, setStopDelays] = useState<number[]>([1500, 1500, 1500]);

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
    // Slower spin for jackpot to create tension
    const intervalTime = 100;
    const startTime = Date.now();
    
    // Reel stop delays (in ms)
    // Check if it's a "near miss" (2 match) or jackpot (3 match) for slow reveal
    const isSlowReveal = outcomeType === '3_match' || outcomeType === '2_match';
    
    const newStopDelays = isSlowReveal
        ? [2000, 4000, 6000] // Slow reveal for JP and 2-match
        : [1500, 1500, 1500]; // Normal for 1-match or no match
    
    setStopDelays(newStopDelays);
    const spinStartTime = Date.now();
    setStartTime(spinStartTime);

    const spinInterval = setInterval(() => {
        const elapsedTime = Date.now() - spinStartTime;
        
        // Update slots state
        setSlots(prevSlots => {
            const newSlots = [...prevSlots];
            
            // Reel 1 - Stops first
            if (elapsedTime < newStopDelays[0]) {
                newSlots[0] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            } else {
                newSlots[0] = targetSymbols[0];
            }
            
            // Reel 2 - Stops second
            if (elapsedTime < newStopDelays[1]) {
                newSlots[1] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            } else {
                newSlots[1] = targetSymbols[1];
            }
            
            // Reel 3 - Stops last
            if (elapsedTime < newStopDelays[2]) {
                newSlots[2] = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            } else {
                newSlots[2] = targetSymbols[2];
            }
            
            return newSlots;
        });

        // Check if all reels have stopped
        if (elapsedTime > Math.max(...newStopDelays)) {
            clearInterval(spinInterval);
            setOffer(offerDetails);
            setStep('revealed');
            
            // Celebration effects
            if (outcomeType === '3_match') {
                triggerConfetti(true);
                triggerJackpot(true);
            }
            else {
                triggerConfetti(false);
            }
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
    <div className="w-full h-full min-h-[350px] sm:min-h-[400px] bg-white/80 dark:bg-black/80 backdrop-blur-none sm:backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-visible group border-2 border-black dark:border-white transition-all hover:border-brand-500/30 dark:hover:border-brand-500/30">
        
        {/* Racing Light Effect (Desktop Only) */}
        <div className="border-beam-container hidden sm:block">
            <div className="border-beam-light" />
        </div>

        {/* Decorative elements (Desktop Only) */}
        <div className="hidden sm:block absolute top-0 right-0 w-64 h-64 bg-brand-400/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
        <div className="hidden sm:block absolute bottom-0 left-0 w-64 h-64 bg-purple-400/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 animate-pulse animation-delay-2000" />
        
        {/* Slot Machine Display */}
        <div className={`relative z-10 w-full max-w-sm mb-6 transition-all duration-[3000ms] ease-out ${step === 'spinning' && (Math.random() < 0.2) ? 'scale-110 sm:scale-125' : 'scale-100'}`}>
            <div className="flex justify-center gap-1 sm:gap-3 p-3 bg-gray-100 dark:bg-gray-900 rounded-xl border-4 border-gray-300 dark:border-gray-700 shadow-inner">
                {slots.map((Symbol, index) => (
                    <div key={index} className={`w-16 h-20 sm:w-20 sm:h-28 bg-white dark:bg-black rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden relative transition-all duration-500 
                        ${step === 'spinning' && index === 1 && Date.now() - startTime > stopDelays[0] ? 'scale-110 border-brand-500 z-20' : ''} 
                        ${step === 'spinning' && index === 2 && Date.now() - startTime > stopDelays[1] ? 'scale-125 border-brand-500 shadow-brand-500/50 z-30' : ''}`}>
                         {/* Blur effect while spinning - remove blur when reel stops */}
                         {step === 'spinning' && (Date.now() - startTime < stopDelays[index]) && (
                             <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/50 to-white/0 dark:via-white/10 animate-pulse z-10" />
                         )}
                        <Symbol.component className={`w-8 h-8 sm:w-10 sm:h-10 ${Symbol.color} transform transition-all duration-100 ${step === 'spinning' && (Date.now() - startTime < stopDelays[index]) ? 'blur-sm scale-90' : 'scale-100'}`} />
                    </div>
                ))}
            </div>
            
            {/* Slot Machine Lever (Visual Representation) */}
            <div className="absolute top-1/2 -right-10 sm:-right-14 -translate-y-1/2 w-8 h-24 sm:w-10 sm:h-32 pointer-events-none hidden sm:block">
                 {/* Base */}
                 <div className="absolute bottom-0 left-0 w-full h-10 bg-gray-300 dark:bg-gray-700 rounded-lg border-2 border-gray-400 dark:border-gray-600"></div>
                 {/* Stick */}
                 <div className={`absolute left-1/2 -translate-x-1/2 w-2 bg-gray-400 dark:bg-gray-500 transition-all duration-300 origin-bottom ${isLeverPulled ? 'h-8 rotate-[180deg] top-[60%]' : 'h-20 top-0'}`}></div>
                 {/* Knob */}
                 <div className={`absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-red-600 shadow-lg border-2 border-red-700 transition-all duration-300 ${isLeverPulled ? 'top-[90%]' : '-top-3'}`}></div>
            </div>
        </div>

        {step === 'initial' || step === 'spinning' ? (
            <div className="relative z-10 space-y-4 sm:space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-black dark:text-white">
                        Spin to Win
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-xs mx-auto">
                        Match Kairo logos to unlock exclusive website offers.
                    </p>
                </div>

                <button
                    onClick={spinSlots}
                    disabled={step === 'spinning'}
                    className={`group relative inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-sm sm:text-base hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-brand-500/20 overflow-hidden ${step === 'spinning' ? 'cursor-not-allowed opacity-80' : ''}`}
                >
                    {step === 'spinning' ? (
                        <>
                            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            <span>Spinning...</span>
                        </>
                    ) : (
                        <>
                            <span>PULL THE LEVER</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        ) : (
            <div className="relative z-10 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-md">
                <div className="relative p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl border border-brand-100 dark:border-brand-800">
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white mb-1 leading-tight">
                        {offer?.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                        {offer?.description}
                    </p>
                </div>
                
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => {
                            const finalPrice = offer?.price !== undefined ? offer.price : 0;
                            openContactModal(offer?.title, finalPrice);
                        }}
                        className="w-full py-3 bg-gradient-to-r from-brand-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-base"
                    >
                        Claim This Offer
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => {
                            setStep('initial');
                            setSlots([SYMBOLS[1], SYMBOLS[2], SYMBOLS[3]]);
                        }}
                        className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        Spin Again
                    </button>
                </div>
            </div>
        )}
    </div>
  );
}
