"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, User, Bot, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Question {
  id: string;
  order_index: number;
  question_text: string;
}

export default function BaliChatbotModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchQuestions();
    } else {
      // Reset
      setCurrentStep(0);
      setAnswers({});
      setMessages([]);
      setInput('');
      setIsFinished(false);
    }
  }, [isOpen]);

  const fetchQuestions = async () => {
    setIsTyping(true);
    const { data } = await supabase.from('bali_chatbot_questions').select('*').order('order_index');
    setIsTyping(false);
    if (data && data.length > 0) {
      setQuestions(data);
      setMessages([{ role: 'bot', text: data[0].question_text }]);
    } else {
      setMessages([{ role: 'bot', text: "Welcome to the Bali Easter Egg! However, no questions have been configured in the CRM yet." }]);
      setIsFinished(true);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping || isFinished) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    
    const currentQ = questions[currentStep];
    setAnswers(prev => ({ ...prev, [currentQ.question_text]: userText }));

    setIsTyping(true);
    
    // Simulate thinking delay
    setTimeout(async () => {
      if (currentStep < questions.length - 1) {
        const nextQ = questions[currentStep + 1];
        setMessages(prev => [...prev, { role: 'bot', text: nextQ.question_text }]);
        setCurrentStep(prev => prev + 1);
        setIsTyping(false);
      } else {
        // Finished
        setMessages(prev => [...prev, { role: 'bot', text: "Thank you for completing the sequence. Your responses have been recorded." }]);
        setIsFinished(true);
        setIsTyping(false);
        
        // Save to DB
        await supabase.from('bali_chatbot_responses').insert({
          responses: { ...answers, [currentQ.question_text]: userText }
        });
      }
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg h-[600px] bg-[#0a0a0a] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-800"
      >
        {/* Header */}
        <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-[#111]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center border border-brand-500/30">
              <Bot className="w-4 h-4 text-brand-400" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Project Bali</h3>
              <p className="text-brand-400 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                Online
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-brand-500 text-white rounded-tr-sm' 
                  : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-200" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#111] border-t border-gray-800">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isFinished || isTyping}
              placeholder={isFinished ? "Session ended." : "Type your message..."}
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl pl-4 pr-12 py-3 text-white outline-none focus:border-brand-500 transition-colors disabled:opacity-50 text-sm"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isFinished || isTyping}
              className="absolute right-2 p-2 bg-brand-500 text-white rounded-lg disabled:opacity-50 disabled:bg-gray-800 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}