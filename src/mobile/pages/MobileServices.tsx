
import React from 'react';
import { Palette, Code, Zap, Rocket, Users, Award } from 'lucide-react';

export default function MobileServices() {
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

      <div className="space-y-2 pt-12 px-6 relative z-10">
        <h1 className="text-5xl font-display font-black text-gray-900 dark:text-white tracking-tight mb-2 drop-shadow-sm">
            Our Services
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 font-light max-w-[80%] leading-relaxed drop-shadow-sm">
            Comprehensive solutions designed to accelerate your digital growth.
        </p>
      </div>
      
      <div className="flex flex-col gap-6 px-4 pb-12 z-10 relative">
        {services.map((s, i) => (
          <div 
            key={i} 
            className="group relative overflow-hidden rounded-[2.5rem] shadow-xl transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src={s.bgImage} 
                    alt={s.title} 
                    className="w-full h-full object-cover opacity-100 transition-transform duration-700 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-90 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-80`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 min-h-[220px] flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-500">
                        <s.icon className="w-7 h-7" />
                    </div>
                    <span className="text-6xl font-display font-black text-white/10 absolute top-4 right-4 pointer-events-none select-none">
                        0{i + 1}
                    </span>
                </div>
                
                <div className="space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-3xl font-display font-bold text-white tracking-tight drop-shadow-md">
                        {s.title}
                    </h3>
                    <p className="text-white/90 font-medium text-base leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                        {s.desc}
                    </p>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
