"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import { useUI } from '../context/UIContext';

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

export default function PricingPage() {
  const { openContactModal } = useUI();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

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
      
      <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative z-0">
        {/* Background */}
        <div className="absolute inset-0 w-full h-full -z-20 overflow-hidden">
            <img 
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop" 
                alt="Night Sky" 
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white dark:from-black/50 dark:via-black/80 dark:to-black pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20 mt-8 sm:mt-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-sm font-bold uppercase tracking-wider mb-6 animate-fade-in-up">
                    <Sparkles className="w-4 h-4" />
                    Transparent Pricing
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-black text-gray-900 dark:text-white mb-6 tracking-tight drop-shadow-sm animate-fade-in-up animation-delay-200">
                    Invest in your <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-400 dark:to-purple-400">digital future</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light animate-fade-in-up animation-delay-400">
                    Simple, predictable pricing. No hidden fees, just exceptional value designed to help your business scale.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                    {plans.map((plan, index) => (
                        <div 
                            key={plan.id} 
                            className={`relative rounded-[2.5rem] p-8 sm:p-10 transition-all duration-500 animate-fade-in-up 
                                ${plan.is_popular 
                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-2xl scale-100 md:scale-105 z-10 border border-gray-800 dark:border-gray-200' 
                                    : 'bg-white dark:bg-gray-900/60 backdrop-blur-md text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 shadow-xl'
                                }`}
                            style={{ animationDelay: `${(index + 3) * 200}ms` }}
                        >
                            {plan.is_popular && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                                    <div className="bg-gradient-to-r from-brand-500 to-purple-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" />
                                        Most Popular
                                    </div>
                                </div>
                            )}
                            
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className={`text-sm h-10 ${plan.is_popular ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {plan.description}
                                </p>
                            </div>
                            
                            <div className="mb-8 flex items-baseline gap-2">
                                <span className="text-5xl font-display font-black tracking-tight">{plan.price}</span>
                                {plan.billing_period && (
                                    <span className={`text-sm font-medium ${plan.is_popular ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>
                                        /{plan.billing_period}
                                    </span>
                                )}
                            </div>
                            
                            <button 
                                onClick={() => openContactModal(`Interested in ${plan.name} Plan`)}
                                className={`w-full py-4 rounded-xl font-bold text-lg mb-8 transition-transform active:scale-95 flex items-center justify-center gap-2
                                    ${plan.is_popular 
                                        ? 'bg-gradient-to-r from-brand-500 to-purple-500 text-white shadow-lg hover:shadow-brand-500/25' 
                                        : 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20'
                                    }`}
                            >
                                {plan.button_text}
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            
                            <ul className="space-y-4">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center
                                            ${plan.is_popular ? 'bg-brand-500/20 text-brand-400 dark:text-brand-600' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}
                                        `}>
                                            <Check className="w-3 h-3 stroke-[3]" />
                                        </div>
                                        <span className={`text-sm font-medium ${plan.is_popular ? 'text-gray-300 dark:text-gray-700' : 'text-gray-600 dark:text-gray-300'}`}>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </>
  );
}
