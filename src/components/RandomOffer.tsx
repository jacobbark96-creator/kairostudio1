import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useUI } from '../context/UIContext';

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
    <div className="w-full h-full min-h-[400px] bg-white dark:bg-black rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl relative overflow-hidden group border border-gray-100 dark:border-gray-800">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-100 dark:bg-brand-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-20 pointer-events-none" />

        {step === 'initial' ? (
            <div className="relative z-10 space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-brand-100 to-purple-100 dark:from-brand-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-6 transition-transform duration-500">
                    <Sparkles className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                </div>
                
                <div className="space-y-2">
                    <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                        Feeling Lucky?
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                        Click below to reveal a unique, limited-time offer tailored just for you.
                    </p>
                </div>

                <button
                    onClick={revealOffer}
                    disabled={loading}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:bg-brand-600 dark:hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                    {loading ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Revealing...</span>
                        </>
                    ) : (
                        <>
                            <span>Reveal Offer</span>
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
                            Maybe next time
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
