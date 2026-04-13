"use client";

import React from 'react';
import { Palette, Code, Zap, ArrowRight, Layout, Search, Globe, CheckCircle } from 'lucide-react';
import { useUI } from '../../context/UIContext';

export default function MobileServices() {
  const { openContactModal } = useUI();
  
  const services = [
    {
      icon: Layout,
      title: 'Digital Presence',
      desc: 'We build, host, and manage your entire website. No huge upfront costs, just a high-performing site that works.',
      features: ['Custom Design & Build', 'Premium Hosting Included', 'Unlimited Edits', '24/7 Technical Support'],
    },
    {
      icon: Search,
      title: 'Search Optimization',
      desc: 'Your site isn’t a digital brochure—it’s an engine. We continually optimize your presence so customers can actually find you on Google.',
      features: ['Local SEO', 'Keyword Strategy', 'Performance Monitoring'],
    },
    {
      icon: Palette,
      title: 'Brand Identity',
      desc: 'Look like the premium business you are. We craft logos and visual systems that build immediate trust with your future customers.',
      features: ['Logo Design', 'Brand Guidelines', 'Visual Identity'],
    },
    {
      icon: Zap,
      title: 'Performance & Scale',
      desc: 'Lightning-fast load times and scalable architecture designed to grow seamlessly as your business expands.',
      features: ['Speed Optimization', 'Scalable Architecture', 'Security Audits'],
    },
  ];

  return (
    <div className="pb-24 relative overflow-hidden z-0 bg-white dark:bg-[#0a0a0a]">
      
      {/* Hero Section */}
      <div className="pt-20 px-6 relative z-10 text-left mb-16">
        <h1 className="text-[2.75rem] font-display font-bold text-gray-900 dark:text-white tracking-tighter leading-[1.05] mb-6">
            Digital excellence.<br/>
            <span className="text-gray-400 dark:text-gray-500">Engineered for growth.</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg font-light leading-relaxed max-w-[18rem]">
            We don't just build websites. We engineer digital ecosystems designed to elevate your brand.
        </p>
      </div>
      
      {/* Services Section */}
      <div className="px-4 z-10 relative mb-20 space-y-4">
        {services.map((s, i) => (
          <div 
            key={i} 
            className="p-6 bg-gray-50 dark:bg-[#111] rounded-[2rem] border border-gray-200 dark:border-gray-800"
          >
            <div className="w-12 h-12 bg-white dark:bg-[#222] rounded-xl flex items-center justify-center mb-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <s.icon className="w-5 h-5 text-gray-900 dark:text-white" />
            </div>
            <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight mb-3">
                {s.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed font-light mb-6">
                {s.desc}
            </p>
            <ul className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                {s.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                    {feature}
                </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Investment Options */}
      <div className="px-4 mb-20">
        <h2 className="text-[2.5rem] font-display font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-8">
            Tailored for<br />
            <span className="text-gray-400 dark:text-gray-500">every ambition.</span>
        </h2>
        
        <div className="space-y-4">
            {/* The Studio Retainer */}
            <div className="p-6 bg-gray-50 dark:bg-[#111] rounded-[2rem] border border-gray-200 dark:border-gray-800">
                <div className="w-10 h-10 bg-white dark:bg-[#222] rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-gray-700">
                    <Globe className="w-4 h-4 text-gray-900 dark:text-white" />
                </div>
                <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">The Studio Retainer</h3>
                <span className="inline-block px-3 py-1 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-300 text-xs font-medium rounded-full mb-4">From £899 / mo</span>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-6">
                    Our most popular model. An elite design and development team on standby, treating your digital presence as an evolving product.
                </p>
                <div className="space-y-3">
                    {['Unlimited Design Requests', 'Ongoing Development', 'Premium Hosting & Security', 'Priority Support'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                        <CheckCircle className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                        <span className="font-medium text-xs">{item}</span>
                    </div>
                    ))}
                </div>
            </div>

            {/* Custom Projects */}
            <div className="p-6 bg-gray-900 dark:bg-[#151515] rounded-[2rem] border border-gray-800 dark:border-gray-800">
                <div className="w-10 h-10 bg-gray-800 dark:bg-[#222] rounded-full flex items-center justify-center mb-4 border border-gray-700">
                    <Layout className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2">Custom Projects</h3>
                <span className="inline-block px-3 py-1 bg-gray-800 text-gray-300 text-xs font-medium rounded-full mb-4 border border-gray-700">Bespoke Quoting</span>
                <p className="text-sm text-gray-400 font-light leading-relaxed mb-6">
                    For comprehensive digital transformations, complex web applications, and complete brand overhauls.
                </p>
                <div className="space-y-3">
                    {['Dedicated Project Manager', 'Bespoke Architecture', 'Full Brand Guidelines', 'Complete Ownership'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-300">
                        <CheckCircle className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-xs">{item}</span>
                    </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-12 z-10 relative">
        <div className="bg-[#050505] text-white rounded-[2.5rem] p-8 border border-white/10 shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-6 text-center">
                <h3 className="text-3xl font-display font-bold tracking-tight">Let's build<br/>something<br/>extraordinary.</h3>
                <p className="text-gray-400 text-sm font-light leading-relaxed">
                    Book a complimentary consultation to discuss your vision, timeline, and how we can elevate your brand.
                </p>
                <button 
                    onClick={() => openContactModal()}
                    className="w-full py-4 bg-white text-black rounded-full font-bold text-base shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                >
                    Start the conversation
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
