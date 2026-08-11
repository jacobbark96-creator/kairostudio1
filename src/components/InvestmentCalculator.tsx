"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Check, Briefcase, RefreshCw, Search, Palette, ShoppingCart, Calendar } from 'lucide-react';
import { useUI } from '../context/UIContext';
import Link from 'next/link';

interface CalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const questions = [
  {
    id: 'business_type',
    question: 'What type of business?',
    options: [
      { label: 'Small Business / Trades', icon: Briefcase, value: 'small' },
      { label: 'E-commerce / Retail', icon: ShoppingCart, value: 'ecommerce' },
      { label: 'Professional Services', icon: Briefcase, value: 'pro' },
      { label: 'Tech / Startup', icon: Briefcase, value: 'tech' }
    ]
  },
  {
    id: 'project_type',
    question: 'New website or redesign?',
    options: [
      { label: 'New Website', icon: Palette, value: 'new' },
      { label: 'Redesign Existing', icon: RefreshCw, value: 'redesign' }
    ]
  },
  {
    id: 'needs_seo',
    question: 'Do you need SEO?',
    options: [
      { label: 'Yes, I want to rank on Google', icon: Search, value: 'yes' },
      { label: 'No, not at this stage', icon: X, value: 'no' }
    ]
  },
  {
    id: 'needs_branding',
    question: 'Do you need branding/logo design?',
    options: [
      { label: 'Yes, full branding', icon: Palette, value: 'yes' },
      { label: 'No, I have my own', icon: Check, value: 'no' }
    ]
  },
  {
    id: 'needs_systems',
    question: 'Need booking system or eCommerce?',
    options: [
      { label: 'Yes, Booking/eCommerce', icon: ShoppingCart, value: 'yes' },
      { label: 'No, standard site', icon: Check, value: 'no' }
    ]
  }
];

export default function InvestmentCalculator({ isOpen, onClose }: CalculatorProps) {
  const { openContactModal } = useUI();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[currentStep].id]: value };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = (finalAnswers: Record<string, string>) => {
    // Recommendation Logic
    // Starter: Small business, no ecommerce, no complex systems
    // Professional: Redesign, SEO needed, or Pro services
    // Enterprise: Ecommerce, complex systems, or full branding + SEO
    
    let recommendation = 'Starter';
    
    if (finalAnswers.needs_systems === 'yes' || finalAnswers.business_type === 'ecommerce') {
      recommendation = 'Enterprise';
    } else if (finalAnswers.needs_seo === 'yes' || finalAnswers.project_type === 'redesign' || finalAnswers.business_type === 'pro') {
      recommendation = 'Professional';
    }

    const plans: any = {
      Starter: {
        name: 'Starter Plan',
        price: '£99',
        period: 'per month',
        description: 'Perfect for local businesses and tradespeople looking for a high-quality online presence.',
        cta: 'Book Consultation'
      },
      Professional: {
        name: 'Professional Plan',
        price: '£249',
        period: 'per month',
        description: 'Our most popular choice for growing service businesses needing advanced SEO and lead generation.',
        cta: 'Book Consultation'
      },
      Enterprise: {
        name: 'Enterprise / Custom',
        price: 'Custom',
        period: 'Contact for quote',
        description: 'Full-scale digital systems including eCommerce, custom booking, and comprehensive branding.',
        cta: 'Talk to an Expert'
      }
    };

    setResult(plans[recommendation]);
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-xl bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors z-50"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8 sm:p-12">
              {!result ? (
                <div>
                  <div className="mb-8">
                    <div className="flex gap-2 mb-4">
                      {questions.map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1.5 flex-grow rounded-full transition-all duration-500 ${
                            i <= currentStep ? 'bg-brand-500' : 'bg-gray-100 dark:bg-gray-800'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
                      Question {currentStep + 1} of {questions.length}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-display font-black text-gray-900 dark:text-white mt-2 leading-tight">
                      {questions[currentStep].question}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {questions[currentStep].options.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(option.value)}
                        className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-brand-500 dark:hover:border-brand-500 hover:bg-white dark:hover:bg-black transition-all duration-300 group text-left"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors">
                          <option.icon className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-brand-500" />
                  </div>
                  <h3 className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-2">
                    Your Recommendation
                  </h3>
                  <h2 className="text-4xl font-display font-black text-gray-900 dark:text-white mb-4">
                    {result.name}
                  </h2>
                  <div className="mb-6">
                    <span className="text-5xl font-display font-black text-gray-900 dark:text-white">
                      {result.price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 font-bold ml-2">
                      {result.period}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-sm mx-auto">
                    {result.description}
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => {
                        onClose();
                        openContactModal(`${result.name} (from Calculator)`, undefined, answers);
                      }}
                      className="w-full py-5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-brand-600 dark:hover:bg-brand-400 dark:hover:text-white transition-all shadow-xl shadow-brand-500/20"
                    >
                      {result.cta}
                      <Calendar className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={reset}
                      className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors py-2"
                    >
                      Start Over
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
