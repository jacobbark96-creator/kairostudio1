
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
    <div className="space-y-6 pb-20 pt-4">
      <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white px-2">Our Services</h1>
      <div className="grid grid-cols-1 gap-4 px-2">
        {services.map((s, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/20 rounded-xl flex items-center justify-center text-brand-600 dark:text-brand-400">
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{s.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
