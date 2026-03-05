
import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { FileText } from 'lucide-react';

export default function MobilePortfolio() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (data) setProjects(data);
    };
    fetchProjects();
  }, []);

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
        <h1 className="text-4xl font-display font-black text-gray-900 dark:text-white tracking-tight">Our Work</h1>
        <p className="text-gray-600 dark:text-gray-400 text-base font-medium">Selected projects and case studies.</p>
      </div>

      <div className="space-y-6 px-4 z-10 relative">
        {projects.map((p) => (
          <div key={p.id} className="group bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden shadow-lg shadow-black/5 border border-gray-100 dark:border-gray-700 transition-transform hover:scale-[1.02]">
            <div className="h-56 bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-800">
                  <FileText className="w-12 h-12 opacity-50" />
                </div>
              )}
              {p.featured && (
                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  ★ Featured
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
            </div>
            
            <div className="p-6 relative">
              <div className="absolute -top-6 right-6 w-12 h-12 bg-brand-600 text-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-12 transition-all">
                <FileText className="w-6 h-6" />
              </div>
              
              <span className="inline-block px-3 py-1 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-3">
                {p.category}
              </span>
              
              <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2 leading-tight">{p.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">{p.description}</p>
              
              {p.link && (
                <a href={p.link} target="_blank" rel="noopener noreferrer" className="block w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-black text-center font-bold rounded-xl hover:opacity-90 transition-opacity shadow-md">
                  View Project
                </a>
              )}
            </div>
          </div>
        ))}
        {projects.length === 0 && (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-gray-500 font-medium">Loading amazing projects...</p>
            </div>
        )}
      </div>
    </div>
  );
}
