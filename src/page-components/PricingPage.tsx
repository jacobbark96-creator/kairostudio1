"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { useUI } from '../context/UIContext';
import Link from 'next/link';

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  billing_period: string;
  features: string[];
  is_popular: boolean;
  button_text: string;
  sort_order: number;
}

export default function PricingPage({ initialPlans = null }: { initialPlans?: any }) {
  const { openContactModal } = useUI();
  const [plans, setPlans] = useState<PricingPlan[]>(initialPlans || []);
  const [loading, setLoading] = useState(!initialPlans);
  const [currency, setCurrency] = useState<'GBP' | 'USD' | 'AUD'>('GBP');

  // Hardcoded conversion rates relative to GBP (for display purposes)
  // In a real app, you might fetch live rates from an API
  const rates = {
    GBP: 1,
    USD: 1.25, // £1 = $1.25
    AUD: 1.95  // £1 = $1.95
  };

  const currencySymbols = {
    GBP: '£',
    USD: '$',
    AUD: 'A$'
  };

  const formatPrice = (priceStr: string, targetCurrency: 'GBP' | 'USD' | 'AUD') => {
    // If the price string is completely empty or just says "Custom" or has no numbers
    if (!priceStr || !/\d/.test(priceStr) || priceStr.toLowerCase().includes('custom')) {
      return "Custom";
    }

    // Extract just the numbers and decimals
    const numericMatch = priceStr.match(/[\d.]+/);
    if (!numericMatch) {
      return "Custom";
    }

    const numericPrice = parseFloat(numericMatch[0]);
    if (isNaN(numericPrice)) {
        return "Custom";
    }

    const converted = numericPrice * rates[targetCurrency];
    
    // Round to nearest whole number
    const rounded = Math.round(converted);
    
    return `${currencySymbols[targetCurrency]}${rounded}`;
  };

  useEffect(() => {
    if (!initialPlans) {
      fetchPlans();
    }
  }, [initialPlans]);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_plans')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      
      if (data) {
        setPlans(data as PricingPlan[]);
      }
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
      // Fallback data if table doesn't exist yet
      setPlans([
        {
          id: '1',
          name: 'Starter',
          description: 'Perfect for small businesses just getting online.',
          price: '£99',
          billing_period: 'per month',
          features: ['Custom Design', 'Mobile Responsive', 'Basic SEO', 'Fast Hosting'],
          is_popular: false,
          button_text: 'Get Started',
          sort_order: 1
        },
        {
          id: '2',
          name: 'Professional',
          description: 'Our most popular plan for growing companies.',
          price: '£249',
          billing_period: 'per month',
          features: ['Everything in Starter', 'CMS Integration', 'Advanced SEO', 'Analytics Dashboard', 'Priority Support'],
          is_popular: true,
          button_text: 'Get Started',
          sort_order: 2
        },
        {
          id: '3',
          name: 'Enterprise',
          description: 'Full-scale digital transformation.',
          price: 'Custom',
          billing_period: '',
          features: ['Everything in Pro', 'Custom Web App', 'E-Commerce', 'Dedicated Account Manager', 'Unlimited Revisions'],
          is_popular: false,
          button_text: 'Contact Us',
          sort_order: 3
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Pricing | Kairo Studio" 
        description="Transparent, value-driven pricing for custom web design, development, and digital strategy." 
      />
      
      <div className="min-h-screen pt-48 sm:pt-56 pb-24 px-4 sm:px-6 lg:px-8 relative z-0">
        {/* Background */}
        <div className="absolute inset-0 w-full h-full -z-20 overflow-hidden">
            <img 
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop" 
                alt="Night Sky" 
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white/95 dark:from-black/70 dark:via-black/90 dark:to-black pointer-events-none transition-opacity duration-500" />
        </div>

        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-60 sm:opacity-80 mix-blend-multiply dark:mix-blend-overlay">
          <div className="absolute top-[10%] left-[10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-brand-400/50 dark:bg-brand-500/20 rounded-full blur-[80px] sm:blur-[120px] animate-blob will-change-transform" />
          <div className="absolute bottom-[20%] right-[10%] w-[250px] sm:w-[450px] h-[250px] sm:h-[450px] bg-purple-400/50 dark:bg-purple-500/20 rounded-full blur-[80px] sm:blur-[120px] animate-blob animation-delay-2000 will-change-transform" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-10 mt-8 sm:mt-16">
                <h1 className="text-5xl md:text-7xl font-display font-black text-gray-900 dark:text-white mb-6 tracking-tight drop-shadow-sm animate-fade-in-up animation-delay-200">
                    Invest in your <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-400 dark:to-purple-400">digital future</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light animate-fade-in-up animation-delay-400 mb-8">
                    Simple, predictable pricing. No hidden fees, just exceptional value designed to help your business scale.
                </p>

                {/* Currency Switcher */}
                <div className="flex justify-center animate-fade-in-up animation-delay-500">
                    <div className="bg-gray-100 dark:bg-gray-900/80 backdrop-blur-sm p-1.5 rounded-full inline-flex border border-gray-200 dark:border-gray-800 shadow-inner">
                        <button
                            onClick={() => setCurrency('GBP')}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                                currency === 'GBP' 
                                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md' 
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                            }`}
                        >
                            GBP (£)
                        </button>
                        <button
                            onClick={() => setCurrency('USD')}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                                currency === 'USD' 
                                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md' 
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                            }`}
                        >
                            USD ($)
                        </button>
                        <button
                            onClick={() => setCurrency('AUD')}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                                currency === 'AUD' 
                                    ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md' 
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                            }`}
                        >
                            AUD (A$)
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
                </div>
            ) : (
                <div className="relative">
                    {/* Swipe indicator hint for mobile */}
                    <div className="md:hidden text-center mb-4 text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2 animate-pulse">
                        <span>Swipe to compare plans</span>
                        <ArrowRight className="w-4 h-4" />
                    </div>
                    
                    <div className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto items-center overflow-x-auto pb-8 pt-4 px-4 sm:px-0 snap-x snap-mandatory hide-scrollbar">
                        {plans.map((plan, index) => (
                            <div 
                                key={plan.id} 
                                className={`relative rounded-[2.5rem] p-8 sm:p-10 transition-all duration-500 animate-fade-in-up flex-shrink-0 w-[85vw] sm:w-[400px] md:w-auto snap-center group
                                    ${plan.is_popular 
                                        ? 'bg-gray-900/95 dark:bg-white/95 backdrop-blur-2xl text-white dark:text-gray-900 shadow-[0_8px_30px_rgb(0,0,0,0.15)] dark:shadow-[0_8px_30px_rgba(255,255,255,0.15)] scale-100 md:scale-105 z-10 border border-gray-800 dark:border-gray-200' 
                                        : 'bg-white/70 dark:bg-black/40 backdrop-blur-xl text-gray-900 dark:text-white border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]'
                                    } hover:-translate-y-2`}
                                style={{ animationDelay: `${(index + 3) * 200}ms` }}
                            >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent opacity-50 rounded-[2.5rem] pointer-events-none" />
                            {plan.is_popular && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-gray-900/10 to-transparent skew-x-12 translate-x-[-200%] animate-[shimmer_3s_infinite] rounded-[2.5rem] pointer-events-none" />
                            )}
                            
                            <div className="relative z-10">
                                {plan.is_popular && (
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                                        <div className="bg-gradient-to-r from-brand-600 to-purple-600 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg shadow-brand-500/30 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3 animate-pulse" />
                                            Most Popular
                                        </div>
                                    </div>
                                )}
                                
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold mb-2 tracking-tight">{plan.name}</h3>
                                    <p className={`text-sm h-10 font-medium ${plan.is_popular ? 'text-gray-300 dark:text-gray-600' : 'text-gray-600 dark:text-gray-400'}`}>
                                        {plan.description}
                                    </p>
                                </div>
                                
                                <div className="mb-8 flex items-baseline gap-2">
                                    <span className="text-5xl font-display font-black tracking-tight drop-shadow-sm">
                                        {formatPrice(plan.price, currency)}
                                    </span>
                                    {plan.billing_period && (
                                        <span className={`text-sm font-bold ${plan.is_popular ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>
                                            /{plan.billing_period}
                                        </span>
                                    )}
                                </div>
                                
                                {plan.price.toLowerCase().includes('custom') || plan.name.toLowerCase().includes('custom') ? (
                                    <Link 
                                        href="/book"
                                        className={`w-full py-4 rounded-xl font-bold text-lg mb-8 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 group
                                            ${plan.is_popular 
                                                ? 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white shadow-xl shadow-brand-500/30 border border-brand-400/50' 
                                                : 'bg-white/80 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-white/20 border border-gray-200 dark:border-white/5 shadow-sm'
                                            }`}
                                    >
                                        Talk to us
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ) : (
                                    <button 
                                        onClick={() => openContactModal(`Interested in ${plan.name} Plan`)}
                                        className={`w-full py-4 rounded-xl font-bold text-lg mb-8 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 group
                                            ${plan.is_popular 
                                                ? 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white shadow-xl shadow-brand-500/30 border border-brand-400/50' 
                                                : 'bg-white/80 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-white/20 border border-gray-200 dark:border-white/5 shadow-sm'
                                            }`}
                                    >
                                        {plan.button_text}
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                )}
                                
                                <div className="space-y-4">
                                    <p className={`text-xs font-bold uppercase tracking-wider ${plan.is_popular ? 'text-gray-300 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>
                                        What's included
                                    </p>
                                    <ul className="space-y-4">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                                                    plan.is_popular 
                                                        ? 'bg-brand-500/20 text-brand-300 dark:bg-brand-500/10 dark:text-brand-600' 
                                                        : 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                                                }`}>
                                                    <Check className="w-3 h-3 font-bold" />
                                                </div>
                                                <span className={`text-sm font-medium ${plan.is_popular ? 'text-gray-100 dark:text-gray-800' : 'text-gray-700 dark:text-gray-300'}`}>
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            </div>
                    ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </>
  );
}
