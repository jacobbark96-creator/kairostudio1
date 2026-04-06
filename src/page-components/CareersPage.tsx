"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Briefcase, MapPin, Clock, ArrowRight, Sparkles, ChevronDown, CheckCircle2, PoundSterling, Building, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

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
    setOpenJob(id);
  };

  const closeJob = () => {
    setOpenJob(null);
  };

  const selectedJob = jobs.find(j => j.id === openJob);

  if (selectedJob) {
    return (
      <>
        <SEO 
          title={`${selectedJob.title} | Careers | Kairo Studio`} 
          description={selectedJob.description.substring(0, 150)} 
        />
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-32 pb-24 selection:bg-brand-500/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Back Button */}
            <div className="mb-10">
              <button 
                onClick={closeJob}
                className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white uppercase tracking-wider transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Roles
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
              
              {/* Main Content Column (2/3) */}
              <div className="lg:col-span-2">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-gray-900 dark:text-white leading-[1.1] mb-8 tracking-tight">
                  {selectedJob.title}
                </h1>
                
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">About the Role</h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>
                
                {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Responsibilities & Qualifications</h2>
                    <ul className="space-y-4">
                      {selectedJob.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-4">
                          <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Sidebar Details Column (1/3) */}
              <div className="lg:col-span-1">
                <div className="sticky top-32 bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Key Details</h3>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100 dark:border-gray-700">
                        <PoundSterling className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Salary</p>
                        <p className="font-bold text-gray-900 dark:text-white">Competitive</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100 dark:border-gray-700">
                        <MapPin className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                        <p className="font-bold text-gray-900 dark:text-white">{selectedJob.location}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100 dark:border-gray-700">
                        <Clock className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Job Type</p>
                        <p className="font-bold text-gray-900 dark:text-white">{selectedJob.type}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100 dark:border-gray-700">
                        <Building className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</p>
                        <p className="font-bold text-gray-900 dark:text-white">{selectedJob.department}</p>
                      </div>
                    </div>
                  </div>
                  
                  <a 
                    href={`mailto:hello@kairostudio.co.uk?subject=Application for ${selectedJob.title}`}
                    className="flex items-center justify-center w-full py-4 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Careers | Kairo Studio" 
        description="Join Kairo Studio and help us build the future of digital experiences." 
      />
      
      <div className="min-h-screen pt-48 sm:pt-56 pb-24 px-4 sm:px-6 lg:px-8 relative z-0">
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
                        We don't have any active vacancies at the moment, but we're always interested in meeting talented people. Send your CV to hello@kairostudio.co.uk.
                    </p>
                </div>
            ) : (
                <div className="space-y-4 animate-fade-in-up animation-delay-600">
                    {jobs.map((job) => {
                        return (
                            <div 
                                key={job.id} 
                                onClick={() => toggleJob(job.id)}
                                className="bg-white dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 cursor-pointer group"
                            >
                                <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs font-bold px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full uppercase tracking-wider">
                                                {job.department}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">{job.title}</h3>
                                        
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
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white transition-all">
                                            View Role <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
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
