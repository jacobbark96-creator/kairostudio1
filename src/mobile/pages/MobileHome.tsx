
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
  const [auditUrl, setAuditUrl] = useState('');
  const [auditEmail, setAuditEmail] = useState('');
  const [isSubmittingAudit, setIsSubmittingAudit] = useState(false);
  const [auditSuccess, setAuditSuccess] = useState(false);

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

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAudit(true);

    // Format URL logic
    let formattedUrl = auditUrl.trim().toLowerCase();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      if (!/^www\./i.test(formattedUrl)) {
          formattedUrl = `https://www.${formattedUrl}`;
      } else {
          formattedUrl = `https://${formattedUrl}`;
      }
    }

    try {
        await fetch('https://hook.eu1.make.com/aewnwbg67m55lr979f9ofriktxg9i496', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: formattedUrl,
                email: auditEmail
            }),
        });
        
        setAuditSuccess(true);
        setAuditUrl('');
        setAuditEmail('');
    } catch (error) {
        console.error("Error submitting audit request", error);
        alert("There was an issue submitting your request. Please try again.");
    } finally {
        setIsSubmittingAudit(false);
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
        <div className="absolute top-0 left-0 w-full h-[100vh] -z-20">
            <img 
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop" 
                alt="Night Sky" 
                className="w-full h-full object-cover"
            />
            {/* Fade at the bottom to blend into plain background */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-[#0a0a0a] to-transparent" />
            
            {/* Light Mode "Fade" Overlay: Makes image subtle in light mode, invisible in dark mode */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white dark:opacity-0 transition-opacity duration-500 pointer-events-none" />
        </div>

      {/* Mobile Hero - Premium Editorial Redesign */}
      <section className="relative z-10 pt-16 px-6 pb-12 flex flex-col justify-end min-h-[60vh]">
        {/* Main Headline */}
        <div className="space-y-4 mb-6 animate-fade-in-up animation-delay-200 relative">
            <div className="absolute inset-0 bg-black/30 dark:bg-black/50 blur-2xl -z-10 rounded-full scale-150 hidden dark:block" />
            <div className="w-24 h-auto">
                <img 
                    src={logoNb} 
                    alt="Kairo" 
                    className="w-full h-auto object-contain brightness-0 dark:invert drop-shadow-lg" 
                />
            </div>
            <h1 className="text-5xl font-display font-black text-gray-900 dark:text-white leading-[0.85] tracking-tight drop-shadow-xl">
                BEYOND <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-purple-600 to-pink-600 dark:from-brand-400 dark:via-purple-400 dark:to-pink-400">IMAGINATION</span>
            </h1>
        </div>

        {/* Description with side line */}
        <div className="flex gap-4 mb-8 animate-fade-in-up animation-delay-400 relative">
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60 blur-xl -z-10 rounded-full hidden dark:block" />
            <div className="w-1 bg-gradient-to-b from-brand-600 to-transparent dark:from-brand-500 rounded-full" />
            <p className="text-base text-gray-900 dark:text-gray-100 font-medium leading-relaxed max-w-[80%] drop-shadow-md">
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

      {/* Site Assessment Feature */}
      <section className="px-4 relative z-10">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-gradient-to-br dark:from-brand-900 dark:to-purple-900 shadow-2xl border border-gray-200 dark:border-white/10">
            {/* Animated Border/Glow Effect (Dark Mode only) */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-200%] animate-shimmer hidden dark:block" />
            
            <div className="relative z-10 p-6 sm:p-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-white/10 backdrop-blur-md border border-brand-100 dark:border-black/10 text-brand-600 dark:text-white text-[10px] font-bold uppercase tracking-wider mb-4">
                    <Sparkles className="w-3 h-3 animate-pulse" />
                    Free Audit
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-display font-black text-gray-900 dark:text-white mb-2 leading-tight">
                    Assess your <br/> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-200 dark:to-purple-200">current site</span>
                </h3>
                
                <p className="text-gray-600 dark:text-white/80 text-sm font-medium mb-6 max-w-xs mx-auto">
                    Get instant feedback on your site and learn how Kairo can take you to the next level.
                </p>
                
                {/* Clawbot Integration Area */}
                <div className="bg-gray-50 dark:bg-black/20 rounded-2xl p-4 border border-gray-100 dark:border-white/5">
                    {auditSuccess ? (
                        <div className="py-6 text-center animate-fade-in-up">
                            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3">
                                <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Generating your audit...</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">This will be emailed to you shortly.</p>
                            <button 
                                onClick={() => setAuditSuccess(false)}
                                className="mt-4 text-xs text-brand-600 font-medium"
                            >
                                Submit another site
                            </button>
                        </div>
                    ) : (
                        <form 
                            onSubmit={handleAuditSubmit}
                            className="flex flex-col gap-3"
                        >
                            <input 
                                type="text" 
                                placeholder="yourdomain.com" 
                                required
                                value={auditUrl}
                                onChange={(e) => setAuditUrl(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
                            />
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                required
                                value={auditEmail}
                                onChange={(e) => setAuditEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow"
                            />
                            <button 
                                type="submit"
                                disabled={isSubmittingAudit}
                                className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold shadow-md hover:bg-brand-700 active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                            >
                                {isSubmittingAudit ? 'Sending...' : 'Analyze Now'}
                                {!isSubmittingAudit && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </form>
                    )}
                    <p className="text-[10px] text-gray-400 mt-3">Powered by Clawbot AI</p>
                </div>
            </div>
            
            {/* Background Texture (Dark Mode only) */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] hidden dark:block" />
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
