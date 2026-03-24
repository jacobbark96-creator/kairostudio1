"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText, ChevronDown } from 'lucide-react';

export default function MobilePortfolio() {
  const [projects, setProjects] = useState<any[]>([]);
  const [openProject, setOpenProject] = useState<string | null>(null);

  const toggleProject = (id: string) => {
      setOpenProject(openProject === id ? null : id);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (data) setProjects(data);
    };
    fetchProjects();
  }, []);

  return (
    <div className="space-y-8 pb-24 relative overflow-hidden z-0">
       {/* Night Sky Background - Fixed Top */}
       <div className="absolute top-0 left-0 w-full h-[60vh] -z-20 overflow-hidden">
            <img 
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop" 
                alt="Night Sky" 
                className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Light Mode "Fade" Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white dark:opacity-0 transition-opacity duration-500 pointer-events-none" />
            {/* Bottom Fade to Plain Background */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-dark-bg to-transparent" />
        </div>

      <div className="space-y-2 pt-8 px-4 relative z-10">
        <h1 className="text-4xl font-display font-black text-gray-900 dark:text-white tracking-tight">Our Work</h1>
        <p className="text-gray-600 dark:text-gray-400 text-base font-medium">Selected projects and case studies.</p>
      </div>

      <div className="space-y-4 px-4 z-10 relative">
        {projects.map((p) => {
          const isOpen = openProject === p.id;
          
          return (
          <div 
            key={p.id} 
            onClick={() => toggleProject(p.id)}
            className="group bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden shadow-lg shadow-black/5 border border-gray-100 dark:border-gray-700 transition-transform cursor-pointer"
          >
            <div className={`h-40 sm:h-56 bg-gray-100 dark:bg-gray-700 relative overflow-hidden transition-all duration-500 ${isOpen ? '' : 'grayscale-[50%]'}`}>
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} className={`w-full h-full object-cover transition-transform duration-700 ${isOpen ? 'scale-110' : ''}`} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800">
                  <FileText className="w-12 h-12 opacity-50" />
                </div>
              )}
              {p.featured && (
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-black text-[10px] font-bold px-2 py-1 rounded-md shadow-sm uppercase tracking-wider">
                  Featured
                </span>
              )}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 ${isOpen ? 'opacity-90' : 'opacity-60'}`} />
              
              {/* Title overlay always visible */}
              <div className="absolute bottom-0 left-0 w-full p-5 flex justify-between items-end">
                  <div>
                      <span className="inline-block text-[10px] font-bold text-brand-400 uppercase tracking-wider mb-1 drop-shadow-md">
                        {p.category}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-display font-bold text-white leading-tight drop-shadow-md">{p.title}</h3>
                  </div>
                  <ChevronDown className={`w-6 h-6 text-white/70 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-white' : ''}`} />
              </div>
            </div>
            
            <div 
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
              <div className="overflow-hidden">
                  <div className="p-6 pt-4 bg-gray-50 dark:bg-gray-900/50">
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">{p.description}</p>
                      
                      {p.link && (
                        <a 
                            href={p.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={(e) => e.stopPropagation()} // Prevent closing accordion when clicking link
                            className="block w-full py-3 bg-brand-600 text-white text-center font-bold rounded-xl hover:bg-brand-700 transition-colors shadow-md"
                        >
                          View Project
                        </a>
                      )}
                  </div>
              </div>
            </div>
          </div>
        )})}
        {projects.length === 0 && (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 font-medium">Loading amazing projects...</p>
            </div>
        )}
      </div>
    </div>
  );
}
