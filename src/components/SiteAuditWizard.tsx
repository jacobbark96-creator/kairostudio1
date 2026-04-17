"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X, CheckCircle, ChevronRight, Activity, Globe, Zap, Code } from 'lucide-react';
import { supabase } from '../lib/supabase';

export interface AuditQuestion {
  id: string;
  order_index: number;
  question_text: string;
  option_1: string;
  option_2: string;
  option_3: string;
  option_1_score: number;
  option_2_score: number;
  option_3_score: number;
}

interface SiteAuditWizardProps {
  isOpen: boolean;
  onClose: () => void;
  auditUrl: string;
  onComplete: (answers: any) => void;
  embedded?: boolean;
}

export default function SiteAuditWizard({ isOpen, onClose, auditUrl, onComplete, embedded = false }: SiteAuditWizardProps) {
  const [questions, setQuestions] = useState<AuditQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { answer: string, score: number }>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Fake scanning logs
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchQuestions();
      setLogs(["[SYSTEM] Connection established.", `[SCAN] Initializing diagnostics for ${auditUrl}...`]);
    } else {
      setCurrentStep(0);
      setAnswers({});
      setIsAnalyzing(false);
      setLogs([]);
    }
  }, [isOpen, auditUrl]);

  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    try {
      const { data, error } = await supabase
        .from('audit_questions')
        .select('*')
        .order('order_index', { ascending: true });
        
      if (error) throw error;
      setQuestions(data || []);
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSelectOption = (idx: number, opt: string) => {
    const q = questions[currentStep];
    const score = idx === 0 ? q.option_1_score : idx === 1 ? q.option_2_score : q.option_3_score;
    
    setAnswers(prev => ({
      ...prev,
      [q.id]: { answer: opt, score }
    }));

    // Add fake log
    setLogs(prev => [...prev, `[DATA] Analyzed vector ${currentStep + 1}: ${opt.substring(0, 15)}...`, "[OK] Optimizing..."]);

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      finishAudit();
    }
  };

  const finishAudit = async () => {
    setIsAnalyzing(true);
    setLogs(prev => [...prev, "[SCAN] Compiling final report...", "[SYS] Generating score metrics..."]);
    // Simulate analyzing delay
    await new Promise(r => setTimeout(r, 2000));
    
    const finalAnswers = Object.entries(answers).map(([question_id, data]) => ({
      question_id,
      answer_text: data.answer,
      score: data.score
    }));
    
    await onComplete(finalAnswers);
  };

  // Auto-scroll logs
  useEffect(() => {
    const el = document.getElementById('audit-logs');
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs]);

  if (!isOpen) return null;

  const currentQ = questions[currentStep];

  const content = (
    <div className={`relative w-full h-full flex flex-col md:flex-row overflow-hidden ${embedded ? 'rounded-[2rem] bg-[#0a0a0a] border border-white/10 shadow-2xl min-h-[500px]' : ''}`}>
      
      {/* Background Radar Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-brand-500/30 border-dashed animate-[spin_20s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-purple-500/20 animate-[spin_15s_linear_infinite_reverse]" />
        <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-b from-transparent via-brand-500/10 to-transparent h-32 animate-[marquee_4s_linear_infinite]" />
      </div>

      {/* LEFT: Live Diagnostics Sidebar */}
      <div className="w-full md:w-1/3 bg-black/40 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col z-10">
        <div className="flex items-center gap-3 mb-8">
          <Activity className="w-5 h-5 text-brand-500 animate-pulse" />
          <h2 className="text-sm font-bold tracking-widest text-white uppercase font-mono">Live Diagnostics</h2>
        </div>

        <div className="space-y-6 flex-1">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-500 font-mono mb-1">TARGET URL</p>
            <div className="flex items-center gap-2 text-brand-400 font-mono text-sm truncate">
              <Globe className="w-4 h-4 shrink-0" />
              <span className="truncate">{auditUrl}</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex-1 flex flex-col max-h-[250px]">
            <p className="text-xs text-gray-500 font-mono mb-3">SYSTEM LOGS</p>
            <div id="audit-logs" className="flex-1 overflow-y-auto space-y-2 font-mono text-[10px] sm:text-xs text-gray-400 no-scrollbar pb-2">
              {logs.map((log, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className={log.includes('[WARN]') ? 'text-yellow-400' : log.includes('[OK]') ? 'text-green-400' : log.includes('[SCAN]') ? 'text-brand-400' : 'text-gray-400'}
                >
                  {log}
                </motion.div>
              ))}
              {isAnalyzing && (
                <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-3 bg-brand-500 mt-1" />
              )}
            </div>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="mt-auto pt-6 flex gap-2">
          {questions.map((q, idx) => (
            <div 
              key={q.id} 
              className={`h-1.5 rounded-full transition-all duration-500 ${
                currentStep > q.order_index 
                  ? 'w-8 bg-brand-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]' 
                  : currentStep === q.order_index 
                    ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
                    : 'w-2 bg-white/20'
              }`} 
            />
          ))}
        </div>
      </div>

      {/* RIGHT: Glassmorphic Question Area */}
      <div className="w-full md:w-2/3 p-6 sm:p-12 flex flex-col justify-center relative z-10 perspective-1000">
        {!embedded && (
          <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors z-50 backdrop-blur-md border border-white/10"
          >
              <X className="w-5 h-5" />
          </button>
        )}

        {loadingQuestions ? (
          <div className="flex flex-col items-center justify-center text-center h-full">
            <Loader2 className="w-10 h-10 animate-spin text-brand-500 mb-4" />
            <p className="text-white font-mono text-sm animate-pulse">Establishing secure connection...</p>
          </div>
        ) : isAnalyzing ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center h-full"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-brand-500/20 blur-xl rounded-full" />
              <div className="w-20 h-20 bg-white/5 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-xl relative z-10">
                <Code className="w-10 h-10 text-brand-400 animate-pulse" />
              </div>
              <svg className="absolute -inset-4 w-28 h-28 animate-[spin_3s_linear_infinite]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(14,165,233,0.3)" strokeWidth="2" strokeDasharray="10 20" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-3xl text-white mb-2 tracking-tight">Compiling Report</h3>
            <p className="text-gray-400 max-w-sm text-sm font-light">
              Our engines are crunching the numbers and preparing your personalized digital strategy.
            </p>
          </motion.div>
        ) : (
          <div className="relative h-full w-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 50, rotateX: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, rotateX: -10, scale: 1.1 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
                className="w-full max-w-lg bg-white/5 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 sm:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden group"
              >
                {/* Internal Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-purple-500/10 opacity-50" />
                
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight mb-8 relative z-10 drop-shadow-md">
                  {currentQ?.question_text}
                </h3>
                
                <div className="space-y-4 relative z-10">
                  {[currentQ?.option_1, currentQ?.option_2, currentQ?.option_3].map((opt, idx) => (
                    opt && (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx, opt)}
                        className="w-full text-left rounded-xl border border-white/10 hover:border-brand-500/50 bg-white/5 hover:bg-brand-500/10 transition-all duration-300 p-4 sm:p-5 flex justify-between items-center group/btn shadow-sm hover:shadow-[0_0_20px_rgba(14,165,233,0.2)]"
                      >
                        <span className="text-gray-300 group-hover/btn:text-white font-medium text-sm sm:text-base tracking-wide">{opt}</span>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover/btn:text-brand-400 group-hover/btn:translate-x-1 transition-all" />
                      </button>
                    )
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );

  if (embedded) return content;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-5xl h-[600px] bg-[#0a0a0a] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-white/10"
      >
        {content}
      </motion.div>
    </div>
  );
}