import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useUI } from '../context/UIContext';
import confetti from 'canvas-confetti';

export default function RandomOffer() {
  const { openContactModal } = useUI();
  const [step, setStep] = useState<'initial' | 'revealed'>('initial');
  const [offer, setOffer] = useState<{ title: string; description: string; price: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const revealOffer = async () => {
    setLoading(true);
    try {
      // Fetch active offers
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('active', true);
      
      if (error) throw error;

      if (data && data.length > 0) {
        // Filter those with available claims
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const availableOffers = (data as any[]).filter(o => o.current_claims < o.max_claims);
        
        if (availableOffers.length > 0) {
          const random = availableOffers[Math.floor(Math.random() * availableOffers.length)];
          setOffer(random);
          setStep('revealed');
          
          // Trigger fireworks
          const duration = 3000;
          const animationEnd = Date.now() + duration;
          const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

          const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

          const interval: any = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
              return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
          }, 250);

        } else {
          // No offers available
          setOffer({ title: "All out!", description: "Check back later for more ridiculous offers.", price: 0 });
          setStep('revealed');
        }
      } else {
         setOffer({ title: "No offers right now", description: "Catch us next time!", price: 0 });
         setStep('revealed');
      }
    } catch (err) {
      console.error('Error fetching offer:', err);
      setOffer({ title: "Error", description: "Something went wrong. Try again.", price: 0 });
      setStep('revealed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full min-h-[450px] bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group border-2 border-black dark:border-white transition-all hover:border-brand-500/30 dark:hover:border-brand-500/30">
        {/* Racing Light Effect */}
        <div className="border-beam-container">
            <div className="border-beam-light" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-400/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 animate-pulse animation-delay-2000" />
        
        {/* Animated border gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/0 via-brand-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {step === 'initial' ? (
            <div className="relative z-10 space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="space-y-4">
                    <h3 className="text-4xl sm:text-5xl font-display font-bold text-black dark:text-white animate-pulse-fast">
                        Feeling Lucky?
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xs mx-auto leading-relaxed">
                        Tap into the digital ether and reveal an exclusive offer tailored for your next big idea.
                    </p>
                </div>

                <button
                    onClick={revealOffer}
                    disabled={loading}
                    className="group relative inline-flex items-center gap-3 px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-brand-500/20 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    {loading ? (
                        <>
                            <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            <span>Summoning...</span>
                        </>
                    ) : (
                        <>
                            <span>Reveal Your Destiny</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        ) : (
            <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-md">
                <div className="relative">
                    <div className="absolute -top-6 -left-6 text-6xl opacity-10 font-serif italic text-brand-500 select-none">"</div>
                    <h3 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                        {offer?.title}
                    </h3>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        {offer?.description}
                    </p>
                </div>
                
                {offer?.title !== "All out!" && offer?.title !== "No offers right now" && offer?.title !== "Error" ? (
                    <div className="flex flex-col gap-4">
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
                            onClick={() => setStep('initial')}
                            className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            Try again
                        </button>
                    </div>
                ) : (
                     <button
                        onClick={() => setStep('initial')}
                        className="text-brand-600 dark:text-brand-400 font-medium hover:underline"
                    >
                        Try again
                    </button>
                )}
            </div>
        )}
    </div>
  );
}
