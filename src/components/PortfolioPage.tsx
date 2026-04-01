"use client";
import React, { useState, useEffect } from 'react';
import { ArrowRight, ExternalLink, Code, Palette, Zap, Users, Globe, CheckCircle, ArrowLeft, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { useUI } from '../context/UIContext';
import SEO from './SEO';
import { supabase } from '../lib/supabase';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string | null;
  mobile_image_url?: string | null;
  color: string;
  featured: boolean;
  link?: string;
  client_name?: string;
  client_industry?: string;
  client_location?: string;
  challenge?: string;
  solution?: string;
  features?: string[];
  technologies?: string[];
  results?: string[];
}

export default function PortfolioPage() {
  const { openContactModal } = useUI();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    client: false,
    challenge: false,
    features: false,
    technologies: false,
    results: false,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setProjects(data as any[]);
    }
    setLoading(false);
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev: Record<string, boolean>) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const featuredProject = projects.find(p => p.featured) || projects[0];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-brand-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title="Portfolio" 
        description="View our latest projects and success stories. See how Kairo Studio transforms ideas into digital reality." 
      />
      <section className="relative pt-24 sm:pt-56 md:pt-64 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[40vh] sm:min-h-[50vh] flex items-center">
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

        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
           <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-400/10 dark:bg-brand-500/5 rounded-full blur-[100px] animate-blob" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 mt-24 sm:mt-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300 mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
          
          <div className="max-w-4xl">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[1] sm:leading-[0.9] mb-6 sm:mb-8 tracking-tight text-black dark:text-white">
              Selected
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-900 dark:from-gray-400 dark:to-white">
                Works.
              </span>
            </h1>
            
            <p className="text-lg sm:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl font-light">
              A collection of digital experiences crafted with precision, passion, and purpose.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Project - UseHyro */}
      {featuredProject && (
        <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Project Image - Spans 7 cols */}
              <div className="lg:col-span-7 group relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/10 to-purple-500/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative rounded-[2rem] overflow-hidden border border-gray-200 dark:border-gray-800 shadow-2xl bg-white dark:bg-gray-900">
                  {featuredProject.image_url ? (
                    <>
                      <img
                        src={featuredProject.image_url}
                        alt={featuredProject.title}
                        className={`w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-700 ease-out ${featuredProject.mobile_image_url ? 'hidden sm:block' : 'block'}`}
                      />
                      {featuredProject.mobile_image_url && (
                        <img
                          src={featuredProject.mobile_image_url}
                          alt={`${featuredProject.title} mobile`}
                          className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-700 ease-out block sm:hidden"
                        />
                      )}
                    </>
                  ) : (
                    <div className="aspect-[16/10] flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                        <Globe className="w-20 h-20 text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                </div>
              </div>

              {/* Project Details - Spans 5 cols */}
              <div className="lg:col-span-5 flex flex-col justify-center pt-4">
                <div className="mb-8">
                    <span className="inline-block px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-6">
                        Featured Case Study
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-display font-bold text-black dark:text-white mb-4 leading-tight">
                      {featuredProject.title}
                    </h2>
                    <p className="text-xl text-gray-500 dark:text-gray-400 font-light">{featuredProject.category}</p>
                </div>

                <div className="prose dark:prose-invert max-w-none mb-10">
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        {featuredProject.description}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3 mb-10">
                    {featuredProject.technologies?.map((tech, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {tech}
                        </span>
                    ))}
                </div>

                {featuredProject.link && (
                  <a
                    href={featuredProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-lg font-bold text-black dark:text-white hover:gap-5 transition-all duration-300 group"
                  >
                    View Live Project
                    <ArrowRight className="w-5 h-5" />
                  </a>
                )}
                
                {/* Accordion Sections for Case Study Details */}
                <div className="mt-12 space-y-4">
                    {/* Client Info */}
                    {featuredProject.client_name && (
                        <div className="border-t border-gray-200 dark:border-gray-800">
                            <button
                                onClick={() => toggleSection('client')}
                                className="w-full py-4 flex items-center justify-between text-left group"
                            >
                                <span className="font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">Client Details</span>
                                {expandedSections.client ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${expandedSections.client ? 'max-h-40 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Industry</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{featuredProject.client_industry}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Location</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{featuredProject.client_location}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    {featuredProject.results && (
                        <div className="border-t border-gray-200 dark:border-gray-800">
                            <button
                                onClick={() => toggleSection('results')}
                                className="w-full py-4 flex items-center justify-between text-left group"
                            >
                                <span className="font-bold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">Key Results</span>
                                {expandedSections.results ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${expandedSections.results ? 'max-h-60 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                                <ul className="space-y-2">
                                    {featuredProject.results.map((res, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            {res}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Other Projects */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
            <div>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-black dark:text-white mb-2">
                Selected Archive
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-lg text-sm sm:text-base">
                Explore a curation of our diverse projects across various industries and technologies.
                </p>
            </div>
            {/* Mobile swipe indicator */}
            <div className="md:hidden flex items-center gap-2 text-xs font-medium text-gray-400">
                <span>Swipe to explore</span>
                <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 overflow-x-auto pb-8 pt-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible snap-x snap-mandatory hide-scrollbar">
            {projects.filter(p => !p.featured).map((project) => (
              <a
                key={project.id}
                href={project.link || '#'}
                target={project.link ? "_blank" : "_self"}
                rel={project.link ? "noopener noreferrer" : ""}
                className={`group flex flex-col gap-4 min-w-[85vw] sm:min-w-0 snap-center ${!project.link ? 'cursor-default' : 'cursor-pointer'}`}
                onClick={(e) => !project.link && e.preventDefault()}
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 p-0 sm:p-0">
                    {project.image_url ? (
                        <>
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${project.mobile_image_url ? 'hidden sm:block' : 'block'}`}
                          />
                          {project.mobile_image_url && (
                            <img
                              src={project.mobile_image_url}
                              alt={`${project.title} mobile`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 block sm:hidden"
                            />
                          )}
                        </>
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${project.color} opacity-20`}>
                            <Globe className="w-12 h-12 text-black dark:text-white" />
                        </div>
                    )}
                    
                    {/* Hover Overlay */}
                    {project.link && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                           <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                               <ArrowRight className="w-5 h-5" />
                           </div>
                      </div>
                    )}
                </div>
                
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-black dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {project.title}
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    {project.category}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gray-900 dark:bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[100px]" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
            Ready to Start Your Project?
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto font-light">
            Let's discuss how we can bring your vision to life with a custom solution tailored to your needs.
          </p>
          <button
            onClick={() => openContactModal()}
            className="group px-8 py-4 bg-white text-black rounded-full hover:bg-brand-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-3 text-lg font-bold shadow-2xl hover:scale-105 active:scale-95 mx-auto"
          >
            Get Started Today
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </>
  );
}