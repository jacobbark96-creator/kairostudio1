"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Target, Heart, Zap, Award } from 'lucide-react';

const principles = [
  {
    icon: Target,
    title: 'Mission Driven',
    description: 'We focus on creating digital solutions that drive real business results and growth.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop',
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    icon: Heart,
    title: 'Client First',
    description: 'Your success is our success. We build lasting partnerships based on trust and transparency.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop',
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We stay ahead of the curve, utilizing the latest technologies to build future-proof solutions.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop',
    color: 'from-amber-500/20 to-orange-500/20',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We take pride in our craft, delivering pixel-perfect designs and robust, scalable code.',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop',
    color: 'from-emerald-500/20 to-teal-500/20',
  }
];

const Card = ({ principle, index, progress, totalCards }: any) => {
  const shrinkStart = index / totalCards;
  const shrinkEnd = 1;
  
  const scale = useTransform(progress, [shrinkStart, shrinkEnd], [1, 1 - (totalCards - index - 1) * 0.05]);
  const opacity = useTransform(progress, [shrinkStart, shrinkEnd], [1, 0.4]);

  return (
    <div className="h-screen w-full flex items-center justify-center sticky top-32 md:top-40" style={{ zIndex: index }}>
      <motion.div 
        style={{ scale, opacity, transformOrigin: "top", top: `calc(0px + ${index * 30}px)` }} 
        className="relative flex flex-col md:flex-row w-[90vw] max-w-5xl h-[70vh] min-h-[500px] md:h-[550px] bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-gray-200 dark:border-white/10 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)] transform-gpu"
      >
        {/* Content Side */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative z-20 bg-white dark:bg-[#0a0a0a]">
           <div className={`absolute inset-0 bg-gradient-to-br ${principle.color} opacity-30 pointer-events-none`} />
           <div className="relative z-10">
               <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center mb-6 md:mb-8 shadow-sm">
                  <principle.icon className="w-6 h-6 md:w-8 md:h-8 text-brand-500" />
               </div>
               <h4 className="text-3xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6 tracking-tight">{principle.title}</h4>
               <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed font-light">
                 {principle.description}
               </p>
           </div>
        </div>
        {/* Image Side */}
        <div className="w-full md:w-1/2 h-48 md:h-full relative overflow-hidden bg-black">
           <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white dark:from-[#0a0a0a] to-transparent z-10 hidden md:block" />
           <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white dark:from-[#0a0a0a] to-transparent z-10 md:hidden" />
           <img src={principle.image} alt={principle.title} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-all duration-700 hover:scale-110 transform-gpu" />
        </div>
      </motion.div>
    </div>
  );
};

export default function CorePrinciplesDeck() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <section ref={containerRef} className="relative w-full bg-gray-50 dark:bg-[#0a0a0a] border-y border-gray-200 dark:border-white/5 pt-20" style={{ height: `calc(${principles.length * 100}vh + 5rem)` }}>
      {/* Cards container */}
      <div className="relative">
        {principles.map((p, i) => (
          <Card key={i} principle={p} index={i} progress={scrollYProgress} totalCards={principles.length} />
        ))}
      </div>
    </section>
  );
}
