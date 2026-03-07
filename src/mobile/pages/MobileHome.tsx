
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Code, Palette, Rocket, Users, Award } from 'lucide-react';
import RandomOffer from '../../components/RandomOffer';
import { useUI } from '../../context/UIContext';
import { supabase } from '../../lib/supabase';
import logoNb from '../../Logo/kairologo-nbg.png';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string | null;
  link?: string;
  featured: boolean;
  color?: string;
}

export default function MobileHome() {
  const { openContactModal } = useUI();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    // Fetch all projects, prioritizing featured ones, then by date
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
        setProjects(data);
    }
  };

  const services = [
    { 
        icon: Palette, 
        title: 'Brand Identity', 
        desc: 'Crafting logos and visual systems.',
        color: 'from-pink-500 to-rose-500',
    },
    { 
        icon: Code, 
        title: 'Web Dev', 
        desc: 'Lightning-fast, responsive websites.',
        color: 'from-blue-500 to-cyan-500',
    },
    { 
        icon: Zap, 
        title: 'Digital Strategy', 
        desc: 'Data-driven SEO strategies.',
        color: 'from-amber-400 to-orange-500',
    },
    { 
        icon: Rocket, 
        title: 'Growth', 
        desc: 'Targeted campaigns that convert.',
        color: 'from-purple-500 to-indigo-500',
    },
  ];

  return (
    <div className="space-y-8 pb-20 relative overflow-hidden z-0">
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

      {/* Mobile Hero - Premium Editorial Redesign */}
      <section className="relative z-10 pt-16 px-6 pb-12 flex flex-col justify-end min-h-[60vh]">
        {/* Main Headline */}
        <div className="space-y-4 mb-6 animate-fade-in-up animation-delay-200">
            <div className="w-24 h-auto">
                <img 
                    src={logoNb} 
                    alt="Kairo" 
                    className="w-full h-auto object-contain brightness-0 dark:brightness-100" 
                />
            </div>
            <h1 className="text-5xl font-display font-black text-gray-900 dark:text-white leading-[0.85] tracking-tight">
                BEYOND <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-purple-500 to-brand-400">IMAGINATION</span>
            </h1>
        </div>

        {/* Description with side line */}
        <div className="flex gap-4 mb-8 animate-fade-in-up animation-delay-400">
            <div className="w-1 bg-gradient-to-b from-brand-500 to-transparent rounded-full" />
            <p className="text-base text-gray-600 dark:text-gray-300 font-medium leading-relaxed max-w-[80%]">
                We design digital experiences that define the future of your brand. Unapologetically bold.
            </p>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-[1fr,auto] gap-3 animate-fade-in-up animation-delay-600">
            <button 
                onClick={() => openContactModal()}
                className="h-14 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold text-base flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-transform"
            >
                Start Project
                <ArrowRight className="w-4 h-4" />
            </button>
            <Link 
                to="/portfolio"
                className="h-14 w-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-gray-900 dark:text-white active:scale-95 transition-transform"
            >
                <Zap className="w-5 h-5" />
            </Link>
        </div>
      </section>

      {/* Slot Machine - Prominent Feature */}
      <section className="px-4 relative z-10">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-900 to-purple-900 dark:from-white dark:to-gray-200 shadow-2xl shadow-brand-500/20">
            {/* Animated Border/Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-200%] animate-shimmer" />
            
            <div className="relative z-10 p-6 sm:p-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-black/10 text-white dark:text-black text-[10px] font-bold uppercase tracking-wider mb-4">
                    <Sparkles className="w-3 h-3 animate-pulse" />
                    Limited Time Offer
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-display font-black text-white dark:text-black mb-2 leading-tight">
                    Spin & Win <br/> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-200 to-purple-200 dark:from-brand-600 dark:to-purple-600">Exclusive Discounts</span>
                </h3>
                
                <p className="text-white/80 dark:text-black/60 text-sm font-medium mb-6 max-w-xs mx-auto">
                    Try your luck for up to £800 off your next digital project.
                </p>
                
                <div className="transform scale-100 origin-center bg-white/5 dark:bg-black/5 backdrop-blur-sm rounded-2xl p-2 border border-white/10 dark:border-black/5">
                    <RandomOffer />
                </div>
            </div>
            
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        </div>
      </section>

      {/* Services Redesigned */}
      <section className="space-y-4 relative z-10">
        <div className="flex justify-between items-end px-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Services</h2>
            <Link to="/services" className="text-xs text-brand-600 font-medium">View All</Link>
        </div>
        
        <div className="grid grid-cols-2 gap-3 px-4">
            {services.map((s, i) => (
                <div key={i} className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 shadow-sm hover:shadow-md transition-all">
                    <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${s.color} opacity-10 rounded-bl-full`} />
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-3 shadow-sm`}>
                        <s.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-1">{s.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{s.desc}</p>
                </div>
            ))}
        </div>
      </section>

      {/* Recent Work Carousel */}
      <section className="space-y-4 relative z-10 overflow-hidden">
        <div className="flex justify-between items-end px-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Work</h2>
            <Link to="/portfolio" className="text-xs text-brand-600 font-medium">View All</Link>
        </div>
        
        {projects.length > 0 ? (
            <div className="marquee">
                <div className="marquee__inner">
                    {[...projects, ...projects].map((project, index) => (
                        <Link 
                            key={`${project.id}-${index}`} 
                            to="/portfolio"
                            className="flex-shrink-0 w-[85vw] relative rounded-[2rem] overflow-hidden aspect-[4/3] group"
                        >
                            {project.image_url ? (
                                <img 
                                    src={project.image_url} 
                                    alt={project.title} 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className={`absolute inset-0 w-full h-full bg-gradient-to-br ${project.color || 'from-gray-800 to-black'}`} />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
                            
                            <div className="absolute bottom-0 left-0 p-6 w-full">
                                <span className="inline-block px-2 py-1 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white mb-2">
                                    {project.category}
                                </span>
                                <h3 className="text-2xl font-bold text-white mb-1">{project.title}</h3>
                                <p className="text-sm text-gray-300 line-clamp-2">{project.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        ) : (
             <div className="px-4">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-[2rem] p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">Loading projects...</p>
                </div>
            </div>
        )}
      </section>
    </div>
  );
}
