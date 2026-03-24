"use client";

import React, { useState } from 'react';
import { Palette, Code, Zap, Rocket, Users, Award, Sparkles, ArrowRight, ChevronDown } from 'lucide-react';
import { useUI } from '../../context/UIContext';

export default function MobileServices() {
  const { openContactModal } = useUI();
  const [openCard, setOpenCard] = useState<number | null>(null);

  const toggleCard = (index: number) => {
      setOpenCard(openCard === index ? null : index);
  };
  
  const services = [
    { 
        icon: Palette, 
        title: 'Brand Identity', 
        desc: 'Crafting logos and visual systems that make your brand unforgettable.',
        color: 'from-pink-500 to-rose-500',
        bgImage: 'https://images.unsplash.com/photo-1626785774573-4b7993143a26?q=80&w=2070&auto=format&fit=crop'
    },
    { 
        icon: Code, 
        title: 'Web Development', 
        desc: 'Building lightning-fast, responsive websites tailored to your needs.',
        color: 'from-blue-500 to-cyan-500',
        bgImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop'
    },
    { 
        icon: Zap, 
        title: 'Digital Strategy', 
        desc: 'Data-driven SEO and content strategies to dominate your market.',
        color: 'from-amber-400 to-orange-500',
        bgImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop'
    },
    { 
        icon: Rocket, 
        title: 'Growth Marketing', 
        desc: 'Targeted campaigns that convert visitors into loyal customers.',
        color: 'from-purple-500 to-indigo-500',
        bgImage: 'https://images.unsplash.com/photo-1557838923-2985c318be48?q=80&w=2031&auto=format&fit=crop'
    },
    { 
        icon: Users, 
        title: 'Operations', 
        desc: 'Streamlining your workflow with smart tech integrations.',
        color: 'from-emerald-400 to-green-600',
        bgImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop'
    },
    { 
        icon: Award, 
        title: 'Management', 
        desc: 'Ongoing support and updates to keep your digital assets pristine.',
        color: 'from-red-500 to-pink-600',
        bgImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop'
    },
  ];

  return (
    <div className="space-y-12 pb-24 relative overflow-hidden z-0">
       {/* Night Sky Background - Fixed Top */}
       <div className="absolute top-0 left-0 w-full h-[70vh] -z-20 overflow-hidden">
            <img 
                src="https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=2940&auto=format&fit=crop" 
                alt="Pyramids Night Sky" 
                className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Light Mode "Fade" Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white dark:opacity-0 transition-opacity duration-500 pointer-events-none" />
            {/* Bottom Fade to Plain Background */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-dark-bg to-transparent" />
        </div>

      <div className="space-y-4 pt-12 px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-600 dark:text-brand-300 text-[10px] font-bold uppercase tracking-wider shadow-sm mx-auto">
          <Sparkles className="w-3 h-3" />
          What We Do
        </div>
        <h1 className="text-5xl font-display font-black text-gray-900 dark:text-white tracking-tight leading-[0.9]">
            Our <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">Services</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg font-light max-w-xs mx-auto">
            Comprehensive solutions designed to accelerate your digital growth.
        </p>
      </div>
      
      <div className="flex flex-col gap-4 px-4 z-10 relative">
        {services.map((s, i) => {
          const isOpen = openCard === i;
          
          return (
            <div 
              key={i} 
              onClick={() => toggleCard(i)}
              className="group relative overflow-hidden rounded-[2rem] shadow-xl transition-all duration-300 border border-white/10 cursor-pointer"
            >
              {/* Background Image with Gradient Overlay */}
              <div className="absolute inset-0 z-0">
                  <img 
                      src={s.bgImage} 
                      alt={s.title} 
                      className={`w-full h-full object-cover transition-transform duration-700 ${isOpen ? 'scale-110 grayscale-0' : 'grayscale'}`}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${s.color} mix-blend-multiply transition-opacity duration-500 ${isOpen ? 'opacity-80' : 'opacity-90'}`} />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${isOpen ? 'opacity-95' : 'opacity-90'}`} />
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg transition-transform duration-500 ${isOpen ? 'rotate-12' : ''}`}>
                              <s.icon className="w-6 h-6" />
                          </div>
                          <h3 className="text-2xl font-display font-bold text-white tracking-tight drop-shadow-md">
                              {s.title}
                          </h3>
                      </div>
                      <ChevronDown className={`w-6 h-6 text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : ''}`} />
                  </div>
                  
                  <div 
                      className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                      <div className="overflow-hidden">
                          <div className="pt-2 pb-2 pl-3 border-l-2 border-white/30">
                              <p className="text-white/90 font-medium text-sm leading-relaxed">
                                  {s.desc}
                              </p>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-4 pb-12 z-10 relative">
        <div className="bg-gray-900 dark:bg-white text-white dark:text-black rounded-[2.5rem] p-8 text-center shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-6">
                <h3 className="text-2xl font-display font-bold">Need something specific?</h3>
                <p className="opacity-80 text-sm leading-relaxed">
                    We specialize in custom solutions. Let's talk about your unique requirements.
                </p>
                <button 
                    onClick={() => openContactModal()}
                    className="w-full py-4 bg-white dark:bg-black text-black dark:text-white rounded-xl font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    Contact Us
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
