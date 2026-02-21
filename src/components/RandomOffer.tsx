import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function RandomOffer() {
  const [step, setStep] = useState<'initial' | 'revealed'>('initial');
  const [offer, setOffer] = useState<{ title: string; description: string } | null>(null);
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
        const availableOffers = data.filter(o => o.current_claims < o.max_claims);
        
        if (availableOffers.length > 0) {
          const random = availableOffers[Math.floor(Math.random() * availableOffers.length)];
          setOffer(random);
          setStep('revealed');
        } else {
          // No offers available
          setOffer({ title: "All out!", description: "Check back later for more ridiculous offers." });
          setStep('revealed');
        }
      } else {
         setOffer({ title: "No offers right now", description: "Catch us next time!" });
         setStep('revealed');
      }
    } catch (err) {
      console.error('Error fetching offer:', err);
      setOffer({ title: "Error", description: "Something went wrong. Try again." });
      setStep('revealed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full min-h-[400px] bg-black dark:bg-black rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group border border-gray-800">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all duration-500" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-all duration-500" />

        {step === 'initial' ? (
            <div className="relative z-10 space-y-8 animate-in fade-in zoom-in duration-500">
                <Sparkles className="w-12 h-12 text-yellow-400 mx-auto animate-pulse" />
                <h3 className="text-3xl sm:text-4xl font-bold text-white max-w-sm mx-auto leading-tight">
                    We're in the mood.
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mt-2 block">
                        Claim a ridiculous offer
                    </span>
                </h3>
                <button
                    onClick={revealOffer}
                    disabled={loading}
                    className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 mx-auto text-lg"
                >
                    {loading ? 'Consulting the oracles...' : 'See yours now'}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
            </div>
        ) : (
            <div className="relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-md">
                <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                    <h3 className="text-3xl font-bold text-white mb-4">
                        {offer?.title}
                    </h3>
                    <p className="text-gray-300 text-lg">
                        {offer?.description}
                    </p>
                </div>
                
                {offer?.title !== "All out!" && offer?.title !== "No offers right now" && offer?.title !== "Error" ? (
                    <Link
                        to="/login"
                        className="inline-flex px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-full hover:from-cyan-400 hover:to-blue-400 transition-all transform hover:scale-105 active:scale-95 shadow-lg items-center gap-2 text-lg"
                    >
                        I want it
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                ) : (
                     <button
                        onClick={() => setStep('initial')}
                        className="text-gray-400 hover:text-white transition-colors underline text-sm"
                    >
                        Try again
                    </button>
                )}
            </div>
        )}
    </div>
  );
}
