
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
    <div className="space-y-6 pb-20 pt-4">
      <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white px-2">Our Work</h1>
      <div className="space-y-4 px-2">
        {projects.map((p) => (
          <div key={p.id} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="h-48 bg-gray-100 dark:bg-gray-700 relative">
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FileText className="w-12 h-12" />
                </div>
              )}
              {p.featured && (
                <span className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  Featured
                </span>
              )}
            </div>
            <div className="p-6">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">{p.category}</span>
              <h3 className="text-2xl font-bold mt-2 mb-2 text-gray-900 dark:text-white">{p.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{p.description}</p>
              {p.link && (
                <a href={p.link} target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-black text-center font-bold rounded-xl hover:opacity-90 transition-opacity">
                  View Project
                </a>
              )}
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="text-center text-gray-500 py-10">Loading projects...</p>}
      </div>
    </div>
  );
}
