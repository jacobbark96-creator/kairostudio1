
import React from 'react';
import { Target, Heart, Zap, Award } from 'lucide-react';

export default function MobileAbout() {
  return (
    <div className="space-y-6 pb-20 pt-4 px-2">
      <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">About Kairo</h1>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
        We are a team of creators, strategists, and developers transforming digital presence into powerful assets.
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: '5+ Years', icon: Target },
          { label: '50+ Projects', icon: Zap },
          { label: '30+ Clients', icon: Heart },
          { label: 'Award Winning', icon: Award },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-2 shadow-sm">
            <s.icon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
            <span className="font-bold text-sm text-gray-900 dark:text-white">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-brand-50 dark:bg-brand-900/20 p-6 rounded-3xl border border-brand-100 dark:border-brand-800">
        <h3 className="text-xl font-bold text-brand-900 dark:text-brand-100 mb-2">Our Mission</h3>
        <p className="text-sm text-brand-700 dark:text-brand-300">
          To bridge the gap between stunning design and robust functionality, creating digital ecosystems that drive growth.
        </p>
      </div>
    </div>
  );
}
