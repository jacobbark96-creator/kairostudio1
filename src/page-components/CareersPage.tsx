"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Briefcase, MapPin, Clock, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import SEO from './SEO';

interface Career {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  is_active: boolean;
}

export default function CareersPage() {
  const [jobs, setJobs] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [openJob, setOpenJob] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleJob = (id: string) => {
    setOpenJob(openJob === id ? null : id);
  };

  return (
    <>
      <SEO 
        title="Careers | Kairo Studio" 
        description="Join Kairo Studio and help us build the future of digital experiences." 
      />
      
      <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative z-0">
        {/* Background */}
        <div className="absolute inset-0 w-full h-full -z-20 overflow-hidden">
            <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2940&auto=format&fit=crop" 
                alt="Office Space" 
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white dark:from-black/80 dark:via-black/90 dark:to-black pointer-events-none" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-16 mt-8 sm:mt-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-sm font-bold uppercase tracking-wider mb-6 animate-fade-in-up">
                    <Sparkles className="w-4 h-4" />
                    Join The Team
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-black text-gray-900 dark:text-white mb-6 tracking-tight drop-shadow-sm animate-fade-in-up animation-delay-200">
                    Build the <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-400 dark:to-purple-400">future of digital</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light animate-fade-in-up animation-delay-400">
                    We are always looking for passionate designers, developers, and strategists to join our growing team.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
                </div>
            ) : jobs.length === 0 ? (
                <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-[2rem] p-12 text-center border border-gray-200 dark:border-white/10 shadow-xl animate-fade-in-up animation-delay-600">
                    <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No open positions right now</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        We don't have any active vacancies at the moment, but we're always interested in meeting talented people. Send your CV to hello@kairostudio.com.
                    </p>
                </div>
            ) : (
                <div className="space-y-4 animate-fade-in-up animation-delay-600">
                    {jobs.map((job) => {
                        const isOpen = openJob === job.id;
                        return (
                            <div 
                                key={job.id} 
                                className={`bg-white dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-lg transition-all duration-300 ${isOpen ? 'ring-2 ring-brand-500 shadow-brand-500/20' : 'hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-700'}`}
                            >
                                {/* Header / Trigger */}
                                <div 
                                    onClick={() => toggleJob(job.id)}
                                    className="p-6 sm:p-8 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs font-bold px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full uppercase tracking-wider">
                                                {job.department}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{job.title}</h3>
                                        
                                        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4" />
                                                {job.location}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                {job.type}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between sm:justify-end gap-4 mt-4 sm:mt-0">
                                        <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-500' : ''}`} />
                                    </div>
                                </div>

                                {/* Expandable Content */}
                                <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">
                                        <div className="p-6 sm:p-8 pt-0 border-t border-gray-100 dark:border-gray-800">
                                            <div className="mt-6 mb-8">
                                                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About the Role</h4>
                                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                                    {job.description}
                                                </p>
                                            </div>
                                            
                                            {job.requirements && job.requirements.length > 0 && (
                                                <div className="mb-8">
                                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Requirements</h4>
                                                    <ul className="space-y-3">
                                                        {job.requirements.map((req, idx) => (
                                                            <li key={idx} className="flex items-start gap-3">
                                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                                                                <span className="text-gray-600 dark:text-gray-300">{req}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            
                                            <a 
                                                href={`mailto:hello@kairostudio.com?subject=Application for ${job.title}`}
                                                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-opacity active:scale-95"
                                            >
                                                Apply Now
                                                <ArrowRight className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
      </div>
    </>
  );
}
