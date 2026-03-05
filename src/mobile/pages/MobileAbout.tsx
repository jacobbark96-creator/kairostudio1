
import React from 'react';
import { Target, Heart, Zap, Award } from 'lucide-react';

export default function MobileAbout() {
  return (
    <div className="space-y-8 pb-24 relative overflow-hidden z-0">
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
        <h1 className="text-4xl font-display font-black text-gray-900 dark:text-white tracking-tight">About Kairo</h1>
        <p className="text-gray-600 dark:text-gray-400 text-base font-medium">Digital craftsmen & strategic thinkers.</p>
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-black dark:from-white dark:to-gray-200 text-white dark:text-black rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden mx-4 z-10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <h3 className="text-2xl font-bold mb-4 relative z-10">Our Mission</h3>
        <p className="text-lg leading-relaxed font-light opacity-90 relative z-10">
          To bridge the gap between stunning design and robust functionality, creating digital ecosystems that drive real growth.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4 px-4 z-10 relative">
        {[
          { label: 'Years Experience', value: '5+', icon: Target },
          { label: 'Projects Done', value: '50+', icon: Zap },
          { label: 'Happy Clients', value: '30+', icon: Heart },
          { label: 'Awards Won', value: '12', icon: Award },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-3xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center gap-2 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-brand-50 dark:bg-brand-900/20 rounded-full flex items-center justify-center text-brand-600 dark:text-brand-400 mb-1">
                <s.icon className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-brand-50 dark:bg-brand-900/10 p-6 rounded-3xl border border-brand-100 dark:border-brand-800/30 text-center mx-4 relative z-10">
        <p className="text-brand-800 dark:text-brand-200 font-medium">
          "We don't just build websites; we build businesses."
        </p>
      </div>
    </div>
  );
}
