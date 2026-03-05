
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
    <div className="space-y-8 pb-24 relative overflow-hidden">
       {/* Night Sky Background */}
       <div className="absolute inset-0 w-full h-full -z-20 overflow-hidden">
            <img 
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop" 
                alt="Night Sky" 
                className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Light Mode "Fade" Overlay: Makes image subtle in light mode, invisible in dark mode */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white dark:opacity-0 transition-opacity duration-500 pointer-events-none" />
        </div>

      <div className="space-y-2 pt-8 px-4 relative z-10">
        <h1 className="text-4xl font-display font-black text-gray-900 dark:text-white tracking-tight">Our Services</h1>
        <p className="text-gray-600 dark:text-gray-400 text-base font-medium">Comprehensive solutions for digital growth.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 px-4 z-10 relative">
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
