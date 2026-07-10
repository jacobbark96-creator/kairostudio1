"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Calculator } from 'lucide-react';
import Link from 'next/link';

export default function FranchiseCalculatorPage() {
  const [step, setStep] = useState(1);
  const [ideChoice, setIdeChoice] = useState<number | null>(10);
  const [feeChoice, setFeeChoice] = useState<'flat' | 'percent' | null>(null);

  const upfrontBase = 299;
  const flatFeeAmount = 500; // Placeholder for the flat fee amount

  const calculateUpfront = () => {
    return upfrontBase + (ideChoice || 0);
  };

  const calculateMonthly = () => {
    if (feeChoice === 'flat') {
      return `£${(ideChoice || 0) + flatFeeAmount}/mo`;
    }
    return `£${ideChoice || 0}/mo + 10% of Profits`;
  };

  const nextStep = () => {
    if (step === 1 && ideChoice !== null) setStep(2);
    else if (step === 2 && feeChoice !== null) setStep(3);
  };

  return (
    <>
      <div className="min-h-screen bg-black text-white pt-40 pb-20 selection:bg-white/30">
        <div className="max-w-5xl mx-auto px-6">
          
          <div className="mb-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center justify-center p-3 bg-white/5 rounded-full mb-6 ring-1 ring-white/10"
            >
              <Calculator className="w-6 h-6 text-white" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black tracking-tighter mb-4"
            >
              Franchise Calculator
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/60 text-lg max-w-2xl mx-auto"
            >
              Calculate your upfront costs and monthly payments to open your own Kairo Studio office.
            </motion.p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl relative overflow-hidden">
            {/* Progress Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
              <motion.div 
                className="h-full bg-white"
                initial={{ width: '33%' }}
                animate={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Step 1: Choose your IDE</h2>
                    <p className="text-white/60">Select the coding environment for your franchise. (This first month is added to your upfront cost)</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { price: 10, name: "Basic IDE", recommended: true },
                      { price: 30, name: "Pro IDE", recommended: false },
                      { price: 100, name: "Enterprise IDE", recommended: false }
                    ].map((opt) => (
                      <button
                        key={opt.price}
                        onClick={() => setIdeChoice(opt.price)}
                        className={`relative p-6 rounded-2xl border text-left transition-all duration-300 ${
                          ideChoice === opt.price 
                            ? 'bg-white text-black border-white scale-[1.02] shadow-2xl' 
                            : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                        }`}
                      >
                        {opt.recommended && (
                          <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold rounded-full ${
                            ideChoice === opt.price ? 'bg-black text-white' : 'bg-white text-black'
                          }`}>
                            Recommended
                          </span>
                        )}
                        <div className="text-xl font-bold mb-2">{opt.name}</div>
                        <div className="text-3xl font-black tracking-tighter">£{opt.price}<span className={`text-sm font-normal ${ideChoice === opt.price ? 'text-black/60' : 'text-white/60'}`}>/mo</span></div>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end pt-8">
                    <button
                      onClick={nextStep}
                      disabled={ideChoice === null}
                      className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      Next Step <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Step 2: Franchise Fee Structure</h2>
                    <p className="text-white/60">How would you like to pay your franchise fee?</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setFeeChoice('flat')}
                      className={`relative p-6 rounded-2xl border text-left transition-all duration-300 ${
                        feeChoice === 'flat' 
                          ? 'bg-white text-black border-white scale-[1.02] shadow-2xl' 
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold rounded-full ${
                        feeChoice === 'flat' ? 'bg-red-500 text-white' : 'bg-red-500/20 text-red-500'
                      }`}>
                        Not Recommended
                      </span>
                      <div className="text-xl font-bold mb-2">Flat Fee</div>
                      <div className="text-3xl font-black tracking-tighter">£{flatFeeAmount}<span className={`text-sm font-normal ${feeChoice === 'flat' ? 'text-black/60' : 'text-white/60'}`}>/mo</span></div>
                    </button>

                    <button
                      onClick={() => setFeeChoice('percent')}
                      className={`relative p-6 rounded-2xl border text-left transition-all duration-300 ${
                        feeChoice === 'percent' 
                          ? 'bg-white text-black border-white scale-[1.02] shadow-2xl' 
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold rounded-full ${
                        feeChoice === 'percent' ? 'bg-red-500 text-white' : 'bg-red-500/20 text-red-500'
                      }`}>
                        Not Recommended
                      </span>
                      <div className="text-xl font-bold mb-2">Profit Share</div>
                      <div className="text-3xl font-black tracking-tighter">10%<span className={`text-sm font-normal ${feeChoice === 'percent' ? 'text-black/60' : 'text-white/60'}`}> of profits</span></div>
                    </button>
                  </div>

                  <div className="flex justify-between pt-8">
                    <button
                      onClick={() => setStep(1)}
                      className="px-8 py-4 bg-white/5 text-white rounded-full font-bold hover:bg-white/10 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={feeChoice === null}
                      className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      See Results <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-6">
                      <Check className="w-8 h-8 text-black" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter mb-2">Your Franchise Estimate</h2>
                    <p className="text-white/60">Here is the breakdown of your expected costs to start your Kairo Studio office.</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 pt-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <div className="text-white/60 mb-2 font-medium">Total Upfront Cost</div>
                      <div className="text-5xl font-black tracking-tighter mb-6">£{calculateUpfront()}</div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Training & Setup</span>
                          <span>£299</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">First Month IDE</span>
                          <span>£{ideChoice}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-3 border-t border-white/10">
                          <span className="text-white/60">Brand Usage & Emails</span>
                          <span className="text-white/60">Included</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                      <div className="text-white/60 mb-2 font-medium">Estimated Monthly</div>
                      <div className="text-4xl font-black tracking-tighter mb-6">{calculateMonthly()}</div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">IDE Subscription</span>
                          <span>£{ideChoice}/mo</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Franchise Fee</span>
                          <span>{feeChoice === 'flat' ? `£${flatFeeAmount}/mo` : '10% of Profits'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
                    <button
                      onClick={() => { setStep(1); setIdeChoice(10); setFeeChoice(null); }}
                      className="px-8 py-4 bg-white/5 text-white rounded-full font-bold hover:bg-white/10 transition-colors"
                    >
                      Start Over
                    </button>
                    <Link href="/franchise" className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                      Apply Now <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
