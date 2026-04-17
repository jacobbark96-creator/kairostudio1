import React, { useState, useEffect } from 'react';
import { X, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuditQuestion {
  id: string;
  question_text: string;
  option_1: string;
  option_2: string;
  option_3: string;
  order_index: number;
}

interface SiteAuditWizardProps {
  isOpen: boolean;
  onClose: () => void;
  auditUrl: string;
  auditEmail: string;
  onComplete: (answers: Record<number, string>) => void;
  embedded?: boolean;
}

export default function SiteAuditWizard({ isOpen, onClose, auditUrl, auditEmail, onComplete, embedded = false }: SiteAuditWizardProps) {
  const [questions, setQuestions] = useState<AuditQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [direction, setDirection] = useState<'right' | 'left'>('right');

  useEffect(() => {
    if (isOpen) {
      fetchQuestions();
      setCurrentStep(1);
      setAnswers({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const fetchQuestions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('audit_questions')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (!error && data) {
      setQuestions(data);
    }
    setLoading(false);
  };

  const handleSelectOption = (optionIndex: number, optionText: string) => {
    setAnswers(prev => ({ ...prev, [currentStep]: optionText }));
    
    if (currentStep < questions.length) {
      setDirection('right');
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 300); // Wait for swipe animation
    } else {
      // Final step
      handleSubmit({...answers, [currentStep]: optionText});
    }
  };

  const handleSubmit = async (finalAnswers: Record<number, string>) => {
    setIsSubmitting(true);
    await onComplete(finalAnswers);
  };

  if (!isOpen) return null;

  const content = (
    <>
        {/* Header */}
        <div className={`px-6 py-4 flex justify-between items-center relative z-10 bg-transparent ${!embedded ? 'border-b border-gray-100 dark:border-gray-800' : 'pb-2'}`}>
          <div className="flex gap-2">
            {questions.map((q, idx) => (
              <div 
                key={q.id} 
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentStep > q.order_index 
                    ? 'w-6 bg-brand-500' 
                    : currentStep === q.order_index 
                      ? 'w-6 bg-brand-400' 
                      : 'w-2 bg-gray-200 dark:bg-gray-800'
                }`} 
              />
            ))}
          </div>
          {!embedded && (
            <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className={`relative overflow-hidden flex flex-col ${embedded ? 'p-2 pt-0' : 'p-8 min-h-[300px] sm:min-h-[400px]'}`}>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
              <p className="text-gray-500 dark:text-gray-400">Preparing your audit...</p>
            </div>
          ) : isSubmitting ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 animate-spin text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className={`font-display font-bold text-gray-900 dark:text-white ${embedded ? 'text-xl' : 'text-2xl'}`}>Analysing {auditUrl}...</h3>
              <p className="text-center text-gray-500 dark:text-gray-400 max-w-sm text-sm sm:text-base">
                We are scanning your website and compiling your custom report.
              </p>
            </div>
          ) : (
            <div className={`relative w-full ${embedded ? '' : 'h-full'}`}>
              {questions.map((q) => (
                <div 
                  key={q.id}
                  className={`${embedded ? (currentStep === q.order_index ? 'block animate-in slide-in-from-right fade-in duration-500' : 'hidden') : `absolute inset-0 w-full transition-all duration-500 transform ${
                    currentStep === q.order_index 
                      ? 'translate-x-0 opacity-100 z-10' 
                      : currentStep > q.order_index 
                        ? '-translate-x-full opacity-0 z-0' 
                        : 'translate-x-full opacity-0 z-0'
                  }`}`}
                >
                  <h3 className={`${embedded ? 'text-xl sm:text-2xl mb-4' : 'text-2xl sm:text-3xl mb-8'} font-display font-bold text-gray-900 dark:text-white leading-tight`}>
                    {q.question_text}
                  </h3>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {[q.option_1, q.option_2, q.option_3].map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx, opt)}
                        className={`w-full text-left rounded-2xl border-2 border-gray-100 dark:border-gray-800 hover:border-brand-500 dark:hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/10 transition-all duration-300 group flex justify-between items-center ${embedded ? 'p-3 sm:p-4' : 'p-5'}`}
                      >
                        <span className={`${embedded ? 'text-base' : 'text-lg'} font-medium text-gray-700 dark:text-gray-300 group-hover:text-brand-700 dark:group-hover:text-brand-300`}>
                          {opt}
                        </span>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 rounded-full border-2 border-gray-200 dark:border-gray-700 group-hover:border-brand-500 flex items-center justify-center transition-colors ml-4">
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-brand-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </>
  );

  if (embedded) {
      return (
          <div className="w-full h-full relative z-10">
              {content}
          </div>
      );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {content}
      </div>
    </div>
  );
}