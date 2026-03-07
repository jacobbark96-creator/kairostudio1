
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Code, Palette, Rocket, Users, Award } from 'lucide-react';
import RandomOffer from '../../components/RandomOffer';
import { useUI } from '../../context/UIContext';
import { supabase } from '../../lib/supabase';

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

      {/* Mobile Hero */}
      <section className="text-center space-y-6 pt-8 px-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-900/30 dark:to-purple-900/30 border border-brand-100 dark:border-brand-800/50 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3 h-3" />
          Creative Digital Studio
        </div>
        
        <div className="relative">
            {/* Abstract Background Shapes - Kept for extra flair but reduced opacity */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-400/10 rounded-full blur-3xl -z-10 animate-pulse mix-blend-screen" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl -z-10 animate-pulse animation-delay-2000 mix-blend-screen" />
            
            <h1 className="text-5xl font-display font-black text-gray-900 dark:text-white leading-[0.95] tracking-tight drop-shadow-sm">
              We Craft <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-purple-600 to-pink-500 animate-gradient-x">Digital Magic</span>
            </h1>
        </div>

        <p className="text-gray-600 dark:text-gray-200 text-base font-medium max-w-xs mx-auto leading-relaxed drop-shadow-sm">
          Turning bold ideas into stunning digital realities. Fast, fun, and future-proof.
        </p>
        
        <div className="flex flex-col gap-3 pt-6 px-4">
            <button 
                onClick={() => openContactModal()}
                className="w-full py-4 bg-gradient-to-r from-gray-900 to-black dark:from-white dark:to-gray-200 text-white dark:text-black rounded-2xl font-bold text-lg shadow-xl shadow-black/10 dark:shadow-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <Zap className="w-5 h-5 fill-current" />
                Start Your Project
            </button>
            <Link 
                to="/portfolio"
                className="w-full py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl font-bold text-lg hover:bg-white dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
                Explore Our Work
                <ArrowRight className="w-5 h-5" />
            </Link>
        </div>
      </section>

      {/* Slot Machine - Prominent Feature */}
      <section className="px-2 relative z-10">
        <div className="bg-gradient-to-br from-brand-500/10 to-purple-500/10 rounded-[2rem] p-4 border border-brand-100 dark:border-brand-900/30">
            <div className="text-center mb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Spin for a Discount</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Win up to £800 off your next project</p>
            </div>
            <div className="transform scale-90 origin-top">
                <RandomOffer />
            </div>
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
