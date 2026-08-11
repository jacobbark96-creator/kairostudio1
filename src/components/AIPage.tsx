"use client";
import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, ArrowLeft, Bot, MessageSquare, PhoneCall, Zap, Users, Shield, Sparkles, Server, Clock, Database } from 'lucide-react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

import { useUI } from '../context/UIContext';
import SEO from './SEO';

// --- Audio Transcript Mockup ---
const AudioTranscriptMockup = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const transcript = [
    { time: 0, role: 'ai', text: 'Hello! I am your custom AI agent. How can I help you scale today?' },
    { time: 4, role: 'user', text: 'I am interested in your AI receptionists. What can they do?' },
    { time: 7, role: 'ai', text: 'I can answer FAQs, book appointments directly to your calendar, and route urgent calls 24/7.' },
    { time: 13, role: 'user', text: 'That sounds amazing. What about sales?' },
    { time: 16, role: 'ai', text: 'I can qualify leads, send personalized follow-ups, and book meetings with high-intent prospects.' },
    { time: 22, role: 'user', text: 'And what is the cost benefit?' },
    { time: 24, role: 'ai', text: 'I work 24/7/365 without breaks, sick days, or overtime, for a fraction of a human employee\'s salary.' }
  ];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const visibleMessages = transcript.filter(m => currentTime >= m.time);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages.length]);

  return (
    <div className="w-full max-w-lg mx-auto bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[450px] transform-gpu hover:shadow-brand-500/10 transition-shadow duration-500">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-[#0a0a0a]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          Live AI Call Demo
        </span>
      </div>
      
      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto flex flex-col gap-5 scroll-smooth">
        {visibleMessages.map((m, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm sm:text-base leading-relaxed ${
              m.role === 'user' 
                ? 'bg-brand-600 text-white rounded-br-sm shadow-md' 
                : 'bg-gray-100 dark:bg-[#222] text-gray-800 dark:text-gray-200 rounded-bl-sm border border-gray-200 dark:border-gray-700/50'
            }`}>
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Audio Player Controls */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0a0a0a] flex items-center gap-4">
        <audio 
          ref={audioRef}
          src="/demo-call.mp3"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
        <button 
          onClick={togglePlay}
          className="w-12 h-12 flex items-center justify-center bg-brand-600 hover:bg-brand-500 text-white rounded-full transition-colors shadow-md flex-shrink-0"
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
          )}
        </button>
        <div className="flex-1">
          <div className="text-xs font-medium text-gray-500 mb-1">
            {isPlaying ? 'Playing Demo Call...' : 'Press Play to Listen'}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-brand-500 h-full transition-all duration-200 ease-linear" 
              style={{ width: `${audioRef.current && audioRef.current.duration ? (currentTime / audioRef.current.duration) * 100 : 0}%` }}
            />
          </div>
        </div>
        <div className="text-xs text-gray-500 font-mono w-10 text-right">
          {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};

// --- Magnetic Feature Card ---
const MagneticAICard = ({ service }: { service: any }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative p-8 sm:p-10 bg-white dark:bg-[#111] rounded-[2rem] border border-gray-200 dark:border-gray-800 hover:border-brand-500/50 transition-colors duration-500 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-2xl ${service.colSpan}`}
    >
      {/* Background Gradient Reveal */}
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-[2rem]">
        <div className="absolute inset-0 bg-gray-900/90 dark:bg-black/90 z-0" />
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-[spin_20s_linear_infinite] opacity-70 z-10 mix-blend-screen"
             style={{
               background: `conic-gradient(from 0deg, ${service.colors[0]}, ${service.colors[1]}, ${service.colors[2]}, ${service.colors[0]})`,
               filter: 'blur(60px)'
             }} 
        />
        <div className="absolute top-0 left-0 w-full h-full animate-[pulse_4s_ease-in-out_infinite] opacity-50 z-20 mix-blend-screen"
             style={{
               background: `radial-gradient(circle at center, ${service.colors[1]} 0%, transparent 70%)`,
               filter: 'blur(40px)'
             }}
        />
      </div>

      <div className="relative z-10 transform-gpu" style={{ transform: "translateZ(30px)" }}>
        <div className="w-14 h-14 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-brand-500 transition-all duration-500">
          <service.icon className="w-6 h-6 text-gray-900 dark:text-white group-hover:text-white transition-colors" />
        </div>
        
        <h3 className="text-2xl sm:text-3xl font-display font-bold mb-4 text-gray-900 dark:text-white group-hover:text-white tracking-tight transition-colors drop-shadow-md">
          {service.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-300 mb-10 leading-relaxed font-light text-lg transition-colors">
          {service.description}
        </p>
      </div>
      
      <ul className="space-y-3 relative z-10 transform-gpu" style={{ transform: "translateZ(20px)" }}>
        {service.features.map((feature: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 group-hover:bg-brand-400 transition-colors duration-500" />
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

// --- Holographic Pricing Card Component ---
const HolographicPricingCard = ({ title, price, desc, features, icon: Icon, isPremium }: any) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative p-8 sm:p-12 rounded-[2.5rem] border overflow-hidden group transition-transform duration-500 hover:-translate-y-2 ${
        isPremium 
          ? 'bg-black border-gray-800 shadow-2xl' 
          : 'bg-gray-50 dark:bg-[#111] border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl'
      }`}
    >
      {/* Holographic Foil Overlay */}
      {isPremium && (
        <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2.5rem] overflow-hidden mix-blend-screen">
          <div 
            className="absolute inset-0 opacity-60"
            style={{
              background: `conic-gradient(from ${mousePos.x * 0.5}deg at ${mousePos.x}px ${mousePos.y}px, #0ea5e9, #8b5cf6, #ec4899, #0ea5e9)`,
              filter: 'blur(40px)',
              transform: 'scale(1.5)'
            }}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.3), transparent 40%)`
            }}
          />
        </div>
      )}
      
      {!isPremium && (
        <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2.5rem] overflow-hidden mix-blend-screen">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `conic-gradient(from ${mousePos.x * 0.5}deg at ${mousePos.x}px ${mousePos.y}px, #3b82f6, #0ea5e9, #3b82f6)`,
              filter: 'blur(40px)',
              transform: 'scale(1.5)'
            }}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.1), transparent 40%)`
            }}
          />
        </div>
      )}

      <div className="relative z-10 pointer-events-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${
              isPremium ? 'bg-[#222] border-gray-700' : 'bg-white dark:bg-[#222] border-gray-100 dark:border-gray-700 shadow-sm'
            }`}>
              <Icon className={`w-5 h-5 ${isPremium ? 'text-white' : 'text-gray-900 dark:text-white'}`} />
            </div>
            <h3 className={`text-2xl sm:text-3xl font-display font-bold ${isPremium ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              {title}
            </h3>
          </div>
          <span className={`inline-flex px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
            isPremium ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30'
          }`}>
            {price}
          </span>
        </div>
        
        <p className={`text-lg leading-relaxed font-light mb-8 ${isPremium ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
          {desc}
        </p>
        
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((item: string, i: number) => (
            <div key={i} className={`flex items-center gap-3 ${isPremium ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
              <CheckCircle className={`w-5 h-5 ${isPremium ? 'text-gray-600' : 'text-brand-400 dark:text-brand-500'}`} />
              <span className="font-medium text-sm sm:text-base">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function AIPage() {
  const { openContactModal } = useUI();

  const services = [
    {
      icon: PhoneCall,
      title: 'AI Receptionists',
      description: 'Never miss a call again. Our AI receptionists handle inbound inquiries 24/7, book appointments, and route urgent calls seamlessly.',
      features: ['24/7 Availability', 'Natural Voice Synthesis', 'Calendar Integration', 'Custom Call Routing'],
      colSpan: 'md:col-span-2 lg:col-span-2',
      colors: ['#0ea5e9', '#3b82f6', '#8b5cf6']
    },
    {
      icon: Users,
      title: 'AI Sales Staff',
      description: 'Scale your outbound outreach infinitely. AI agents that qualify leads, pitch your services, and book meetings directly onto your calendar.',
      features: ['Lead Qualification', 'Outbound Calling', 'Objection Handling'],
      colSpan: 'md:col-span-1 lg:col-span-1',
      colors: ['#10b981', '#3b82f6', '#0ea5e9']
    },
    {
      icon: MessageSquare,
      title: 'Lead Generation Bots',
      description: 'Convert website traffic into qualified leads instantly. Intelligent chatbots that engage visitors, answer FAQs, and capture contact details.',
      features: ['Omnichannel Support', 'CRM Syncing', 'Instant Responses'],
      colSpan: 'md:col-span-1 lg:col-span-1',
      colors: ['#f59e0b', '#ef4444', '#ec4899']
    },
    {
      icon: Bot,
      title: 'Automated Admin',
      description: 'Free your human staff from repetitive tasks. AI agents that handle data entry, email triage, and workflow automation behind the scenes.',
      features: ['Workflow Automation', 'Email Parsing', 'Data Synchronization', 'Error Reduction'],
      colSpan: 'md:col-span-2 lg:col-span-2',
      colors: ['#8b5cf6', '#d946ef', '#f43f5e']
    },
  ];

  return (
    <>
      <SEO 
        title="Custom AI Agents" 
        description="Hire custom AI agents for your business. From 24/7 AI receptionists to automated sales staff and lead generation—all for one monthly fee." 
      />
      
      {/* Hero Section */}
      <section className="relative pt-40 sm:pt-48 pb-20 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[85vh] flex items-center bg-gray-50 dark:bg-[#050505]">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-500/20 dark:bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-300 mb-8 sm:mb-12 group text-sm font-medium tracking-wide uppercase"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column: Text & CTA */}
            <div className="flex flex-col items-start relative">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold leading-[1.05] tracking-tighter text-gray-900 dark:text-white mb-6">
                Hire your ultimate<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-600">
                  AI workforce.
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light mb-10 max-w-xl">
                Custom AI agents for inbound and outbound services. From receptionists to sales staff—scale your business infinitely for one predictable monthly fee.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-12 w-full sm:w-auto">
                <button 
                  onClick={() => openContactModal()}
                  className="w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full hover:bg-brand-600 dark:hover:bg-brand-400 transition-all duration-300 text-lg font-bold shadow-xl hover:shadow-brand-500/25 hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  Deploy Your AI Team
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Trust Signals */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 pt-8 border-t border-gray-200 dark:border-gray-800 w-full max-w-xl">
                <div>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold mb-1">
                    <Clock className="w-4 h-4 text-brand-500" />
                    24/7/365
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Zero downtime</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold mb-1">
                    <Server className="w-4 h-4 text-brand-500" />
                    99.9%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">SLA guarantee</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold mb-1">
                    <Database className="w-4 h-4 text-brand-500" />
                    CRM Sync
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Native integration</div>
                </div>
              </div>
            </div>

            {/* Right Column: Audio Transcript Mockup */}
            <div className="relative w-full">
              <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/20 to-purple-500/20 blur-2xl rounded-[3rem] opacity-50 dark:opacity-30" />
              <AudioTranscriptMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0a0a0a] border-y border-gray-200 dark:border-gray-800 perspective-1000">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
              AI Capabilities
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md font-light leading-relaxed">
              Tireless, perfectly trained, and always on-brand. Discover what our custom AI agents can do for your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <MagneticAICard key={index} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 dark:text-white tracking-tight mb-6">
              Simple, Predictable Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-light max-w-2xl mx-auto">
              Replace entire departments with highly efficient AI agents for a fraction of the cost of a single human employee.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <HolographicPricingCard 
              title="Single Agent"
              price="One Monthly Fee"
              desc="Perfect for specific bottlenecks. Deploy a dedicated AI receptionist or lead generation bot."
              features={['Custom Knowledge Base Training', '24/7 Uptime', 'CRM & Calendar Integration', 'Monthly Performance Tuning']}
              icon={Bot}
              isPremium={false}
            />

            <HolographicPricingCard 
              title="Full AI Department"
              price="Custom Quote"
              desc="A complete, interconnected AI workforce handling inbound, outbound, and internal admin simultaneously."
              features={['Multiple Specialized Agents', 'Cross-Agent Communication', 'Advanced API Integrations', 'Dedicated AI Engineer']}
              icon={Shield}
              isPremium={true}
            />
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-black text-white border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.15)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-8 leading-tight tracking-tight">
            Ready to hire your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-500">first AI employee?</span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-400 mb-12 font-light max-w-2xl mx-auto">
            Book a complimentary demo to see our AI agents in action and discuss how they can transform your operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => openContactModal()}
              className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-full hover:bg-gray-200 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 text-lg font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Book a Demo
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}