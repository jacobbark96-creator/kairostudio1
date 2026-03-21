
import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Gift } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useUI } from '../context/UIContext';
import confetti from 'canvas-confetti';

// Kairo Logo Component
import logoNb from '../Logo/kairologo-nbg.png';

const KairoLogo = ({ className }: { className?: string }) => (
  <img src={logoNb} alt="Kairo Logo" className={className} />
);

export default function RandomOffer() {
  const { openContactModal, triggerJackpot } = useUI();
  const [isFlipped, setIsFlipped] = useState(false);
  const [offer, setOffer] = useState<{ title: string; description: string; price: number } | null>(null);
  const [cards, setCards] = useState([0, 1, 2]); // Array representing 3 cards
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [outcome, setOutcome] = useState<'jackpot' | 'tier2' | 'tier1' | null>(null);
  
  // Fetch available offers logic
  const fetchOffer = async () => {
    // 1. Fetch probabilities
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from('site_content').select('value').eq('key', 'offer_probabilities').single() as any);
    let probs = { jackpot: 20, tier2: 30, tier1: 50 };
    if (data?.value) {
        try {
            probs = JSON.parse(data.value);
        } catch (e) {
            console.error('Error parsing probabilities', e);
        }
    }

    // 2. Determine Outcome
    const rand = Math.random() * 100;
    let outcomeType: 'jackpot' | 'tier2' | 'tier1' = 'tier1';
    
    if (rand < probs.jackpot) outcomeType = 'jackpot';
    else if (rand < probs.jackpot + probs.tier2) outcomeType = 'tier2';
    else outcomeType = 'tier1';
    
    setOutcome(outcomeType);

    // 3. Fetch Offers from DB
    const { data: offersData } = await supabase.from('offers').select('*').eq('active', true);
    
    if (!offersData || offersData.length === 0) {
        setOffer({ title: "Special Discount", description: "Get 10% off your first project!", price: 0 });
        return;
    }

    // 4. Select Offer based on outcome
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const offers = offersData as any[];
    let selectedOffer = null;

    const tierOffers = offers.filter(o => o.tier === outcomeType);
    if (tierOffers.length > 0) {
        selectedOffer = tierOffers[Math.floor(Math.random() * tierOffers.length)];
    } else {
        // Fallback
        selectedOffer = offers[Math.floor(Math.random() * offers.length)];
    }

    if (selectedOffer) {
        setOffer({
            title: selectedOffer.title,
            description: selectedOffer.description || "",
            price: selectedOffer.price || 0
        });
        
        if (outcomeType === 'jackpot') {
            triggerJackpot(true);
        }
    }
  };

  const handleReveal = async () => {
    if (isFlipped) return;
    
    setIsFlipped(true);
    await fetchOffer();
    
    // Animate cards flipping one by one
    setTimeout(() => setFlippedCards(prev => [...prev, 0]), 100);
    setTimeout(() => setFlippedCards(prev => [...prev, 1]), 600);
    setTimeout(() => {
        setFlippedCards(prev => [...prev, 2]);
        triggerConfetti();
    }, 1100);
  };

  const triggerConfetti = () => {
    const duration = 2000;
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

  const resetCards = () => {
    setIsFlipped(false);
    setFlippedCards([]);
    setOffer(null);
    setOutcome(null);
  };

  // Helper to determine card content based on outcome
  const getCardContent = (index: number) => {
      // Logic:
      // Jackpot = 3 Kairo Logos
      // Tier 2 = 2 Kairo Logos
      // Tier 1 = 1 Kairo Logo
      
      let isKairoLogo = false;
      
      if (outcome === 'jackpot') {
          isKairoLogo = true;
      } else if (outcome === 'tier2') {
          // Show logos on card 0 and 2 (visual preference) or random
          isKairoLogo = index !== 1; 
      } else if (outcome === 'tier1') {
          // Show logo on middle card only
          isKairoLogo = index === 1;
      }

      if (isKairoLogo) {
          return <KairoLogo className="w-12 h-12 sm:w-14 sm:h-14 animate-bounce" />;
      } else {
           return <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 animate-pulse" />;
      }
  };

  return (
    <div className="w-full h-full min-h-[350px] sm:min-h-[400px] bg-white dark:bg-black sm:bg-white/80 sm:dark:bg-black/80 backdrop-blur-none sm:backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-visible group border-2 border-black dark:border-white transition-all hover:border-brand-500/30 dark:hover:border-brand-500/30 perspective-1000">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-400/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 animate-pulse animation-delay-2000 pointer-events-none" />
        
        {/* Card Container */}
        <div className="flex justify-center gap-4 mb-8 perspective-1000">
            {cards.map((index) => (
                <div 
                    key={index}
                    className={`relative w-20 h-28 sm:w-24 sm:h-36 transition-all duration-700 transform-style-3d ${flippedCards.includes(index) ? 'rotate-y-180' : ''}`}
                >
                    {/* Card Back (Face Down) */}
                    <div className="absolute inset-0 w-full h-full bg-gray-900 dark:bg-white rounded-xl shadow-lg border-2 border-brand-500/50 flex items-center justify-center backface-hidden z-20">
                        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 absolute inset-0" />
                        <KairoLogo className="w-12 h-12 sm:w-14 sm:h-14 opacity-50 grayscale invert dark:invert-0" />
                    </div>

                    {/* Card Front (Face Up - Revealed) */}
                    <div className="absolute inset-0 w-full h-full bg-white dark:bg-gray-900 rounded-xl shadow-xl border-2 border-brand-500 flex items-center justify-center backface-hidden rotate-y-180 z-10 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-purple-500/10" />
                        {outcome ? getCardContent(index) : <Sparkles className="w-8 h-8 text-gray-400" />}
                    </div>
                </div>
            ))}
        </div>

        {/* Content Area */}
        <div className="relative z-10 w-full max-w-sm min-h-[120px] flex flex-col items-center justify-center">
            {!isFlipped ? (
                <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                    <button
                        onClick={handleReveal}
                        className="group relative inline-flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-brand-500/20"
                    >
                        <span>Flip to Win</span>
                        <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            ) : (
                <div className={`space-y-4 w-full transition-opacity duration-500 ${flippedCards.length === 3 ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-2xl border border-brand-100 dark:border-brand-800/50">
                        <h3 className="text-xl sm:text-2xl font-display font-bold text-gray-900 dark:text-white mb-1">
                            {offer?.title || "Loading..."}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            {offer?.description}
                        </p>
                    </div>
                    
                    <div className="flex flex-col gap-2 w-full">
                        <button
                            onClick={() => {
                                const finalPrice = offer?.price !== undefined ? offer.price : 0;
                                openContactModal(offer?.title, finalPrice);
                            }}
                            className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                        >
                            Claim Offer
                        </button>
                        <button
                            onClick={resetCards}
                            className="text-xs font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}
