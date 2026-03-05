
import React, { useState, useEffect } from 'react';
import { ArrowRight, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';

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

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    // Fetch featured projects first, or recent ones if no featured
    let { data: featuredData } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });

    if (!featuredData || featuredData.length === 0) {
       // Fallback to recent projects if no featured ones
       const { data: recentData } = await supabase
         .from('projects')
         .select('*')
         .order('created_at', { ascending: false })
         .limit(5);
       featuredData = recentData || [];
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setProjects(featuredData as any[]);
  };

  useEffect(() => {
    if (projects.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length);
    }, 6000); // Cycle every 6 seconds
    return () => clearInterval(interval);
  }, [projects.length]);

  if (projects.length === 0) return null;

  const project = projects[currentSlide];

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[600px] rounded-[2.5rem] overflow-hidden group border border-gray-200 dark:border-gray-800 shadow-2xl bg-gray-900">
      
      {/* Background Image Carousel */}
      {projects.map((p, index) => (
        <div 
            key={p.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
            {p.image_url ? (
                <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-full object-cover opacity-60 dark:opacity-40 group-hover:scale-105 transition-transform duration-[10s]"
                />
            ) : (
                <div className={`w-full h-full bg-gradient-to-br ${p.color || 'from-gray-800 to-black'} opacity-50`} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 sm:p-12 lg:p-16">
        <div className={`transition-all duration-700 transform ${true ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider text-white mb-4">
                Featured Work
            </span>
            
            <h3 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-4 leading-tight">
                {project.title}
            </h3>
            
            <p className="text-lg text-gray-300 mb-8 max-w-xl line-clamp-2">
                {project.description}
            </p>
            
            <div className="flex items-center gap-4">
                {project.link && (
                    <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-brand-500 hover:text-white transition-all duration-300"
                    >
                        View Project
                        <ArrowRight className="w-5 h-5" />
                    </a>
                )}
                <div className="flex gap-2 ml-auto">
                    {projects.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
