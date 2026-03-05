
import React from 'react';
import { Palette, Code, Zap, Rocket, Users, Award } from 'lucide-react';

export default function MobileServices() {
  const services = [
    { icon: Palette, title: 'Brand Identity', desc: 'Logos & Guidelines' },
    { icon: Code, title: 'Web Development', desc: 'Custom Sites & Apps' },
    { icon: Zap, title: 'Digital Strategy', desc: 'SEO & Content' },
    { icon: Rocket, title: 'Growth Marketing', desc: 'Ads & Social' },
    { icon: Users, title: 'Operations', desc: 'Support & Integration' },
    { icon: Award, title: 'Management', desc: 'Retainers & Updates' },
  ];

  return (
    <div className="space-y-8 pb-24 pt-8 px-4">
      <div className="space-y-2">
        <h1 className="text-4xl font-display font-black text-gray-900 dark:text-white tracking-tight">Our Services</h1>
        <p className="text-gray-600 dark:text-gray-400 text-base font-medium">Comprehensive solutions for digital growth.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {services.map((s, i) => (
          <div key={i} className="group relative flex items-center gap-5 p-5 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-50 to-transparent dark:from-brand-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative w-14 h-14 bg-brand-50 dark:bg-brand-900/20 rounded-2xl flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-inner group-hover:scale-110 transition-transform duration-300">
              <s.icon className="w-7 h-7" />
            </div>
            
            <div className="relative">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{s.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
