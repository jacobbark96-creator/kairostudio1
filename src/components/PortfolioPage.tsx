import React, { useState } from 'react';
import { ArrowRight, ExternalLink, Code, Palette, Zap, Users, Globe, CheckCircle, ArrowLeft, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import SEO from './SEO';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string | null;
  favicon?: string | null;
  color: string;
  featured: boolean;
  link?: string;
  client?: {
    name: string;
    industry: string;
    location: string;
  };
  challenge?: string;
  solution?: string;
  features?: string[];
  technologies?: string[];
  results?: string[];
}

export default function PortfolioPage() {
  const { openContactModal } = useUI();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    client: false,
    challenge: false,
    features: false,
    technologies: false,
    results: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev: Record<string, boolean>) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Load images dynamically
  const usehyroPreviewModules = import.meta.glob('../clients/usehyro/preview/*.{png,jpg,jpeg,webp,svg}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  const usehyroFaviconModules = import.meta.glob('../clients/usehyro/favicon/*.{png,jpg,jpeg,webp,svg,ico}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  
  const luxeModules = import.meta.glob('../clients/luxe/*.{png,jpg,jpeg,webp,svg}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  const techflowModules = import.meta.glob('../clients/techflow/*.{png,jpg,jpeg,webp,svg}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  const verdeModules = import.meta.glob('../clients/verde/*.{png,jpg,jpeg,webp,svg}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  
  const usehyroPreview = Object.values(usehyroPreviewModules || {})[0] || null;
  const usehyroFavicon = Object.values(usehyroFaviconModules || {})[0] || null;
  const luxeImage = Object.values(luxeModules || {})[0] || null;
  const techflowImage = Object.values(techflowModules || {})[0] || null;
  const verdeImage = Object.values(verdeModules || {})[0] || null;

  const projects: Project[] = [
    {
      id: 'usehyro',
      title: 'UseHyro',
      category: 'E-commerce Platform',
      description: 'A comprehensive e-commerce solution built for modern businesses, featuring seamless ordering, inventory management, and customer engagement tools.',
      image: usehyroPreview,
      favicon: usehyroFavicon,
      color: 'from-cyan-500 to-blue-600',
      featured: true,
      client: {
        name: 'UseHyro',
        industry: 'E-commerce & Retail',
        location: 'United States',
      },
      challenge: 'The client needed a modern, scalable e-commerce platform that could handle high traffic volumes while providing an intuitive shopping experience. They required seamless integration with their existing inventory and payment systems.',
      solution: 'We developed a custom e-commerce platform using cutting-edge technologies, focusing on performance, scalability, and user experience. The solution included a responsive web application, mobile optimization, and comprehensive admin dashboard.',
      features: [
        'Custom Product Catalog',
        'Advanced Search & Filtering',
        'Secure Payment Processing',
        'Order Management System',
        'Inventory Tracking',
        'Customer Accounts & Profiles',
        'Responsive Design',
        'Admin Dashboard',
      ],
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe API', 'AWS'],
      results: [
        '40% increase in conversion rate',
        '60% reduction in page load time',
        '99.9% uptime achieved',
        'Seamless mobile experience',
      ],
      link: 'https://usehyro.com',
    },
    {
      id: 'luxe-cosmetics',
      title: 'Luxe Cosmetics',
      category: 'Brand Identity & Web',
      description: 'Complete brand redesign and e-commerce website for a luxury cosmetics brand.',
      image: luxeImage,
      color: 'from-rose-400 to-pink-600',
      featured: false,
    },
    {
      id: 'techflow-saas',
      title: 'TechFlow SaaS',
      category: 'Web Application',
      description: 'Enterprise SaaS platform for project management and team collaboration.',
      image: techflowImage,
      color: 'from-cyan-400 to-blue-600',
      featured: false,
    },
    {
      id: 'verde-restaurant',
      title: 'Verde Restaurant',
      category: 'Branding & Web',
      description: 'Complete brand identity and online presence for an upscale restaurant chain.',
      image: verdeImage,
      color: 'from-emerald-400 to-teal-600',
      featured: false,
    },
  ];

  const featuredProject = projects.find(p => p.featured) || projects[0];

  return (
    <>
      <SEO 
        title="Portfolio" 
        description="View our latest projects and success stories. See how Kairo Studio transforms ideas into digital reality." 
      />
      <section className="relative pt-32 sm:pt-40 md:pt-48 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[60vh] flex items-center">
        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
           <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-400/20 dark:bg-brand-500/10 rounded-full blur-[100px] animate-blob" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-300 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </Link>
          
          <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50/50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-800 backdrop-blur-sm mb-8 animate-fade-in">
              <span className="text-sm font-medium text-brand-900 dark:text-brand-100 tracking-wide uppercase">
                Our Portfolio
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-8 tracking-tight text-gray-900 dark:text-white">
              Work That
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-blue-600 to-purple-600 dark:from-brand-400 dark:via-blue-400 dark:to-purple-400">
                Speaks for Itself
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
              Explore our recent projects and see how we've helped businesses transform their digital presence.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Project - UseHyro */}
      {featuredProject && (
        <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-dark-bg relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                Featured Project
              </span>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
              {/* Project Image */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 to-purple-500/20 rounded-[2rem] blur-2xl -z-10 group-hover:blur-3xl transition-all duration-500" />
                <div className={`relative rounded-[2rem] overflow-hidden bg-gradient-to-br ${featuredProject.color} p-1 shadow-2xl`}>
                  <div className="bg-white dark:bg-gray-800 rounded-[1.8rem] overflow-hidden">
                    {featuredProject.image ? (
                      <img
                        src={featuredProject.image}
                        alt={featuredProject.title}
                        className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    ) : (
                      <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-brand-50 to-blue-50 dark:from-brand-900/30 dark:to-blue-900/30">
                        <div className="text-center p-8">
                          <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br ${featuredProject.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                            <Globe className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{featuredProject.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400">Project Preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${featuredProject.color} flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg`}>
                    {featuredProject.favicon ? (
                      <img 
                        src={featuredProject.favicon} 
                        alt={`${featuredProject.title} icon`}
                        className="w-full h-full object-contain p-3"
                      />
                    ) : (
                      <Globe className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-1">
                      {featuredProject.title}
                    </h2>
                    <p className="text-lg text-brand-600 dark:text-brand-400 font-medium">{featuredProject.category}</p>
                  </div>
                </div>

                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed font-light">
                  {featuredProject.description}
                </p>

                {featuredProject.link && (
                  <a
                    href={featuredProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors group mb-8"
                  >
                    Visit Website
                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                )}
                
                <div className="space-y-4">
                {/* Client Spec */}
                {featuredProject.client && (
                  <div className="bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
                    <button
                      onClick={() => toggleSection('client')}
                      className="w-full p-6 flex items-center justify-between hover:bg-gray-100/50 dark:hover:bg-white/10 transition-colors"
                    >
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                          <Users className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                        </div>
                        Client Information
                      </h3>
                      {expandedSections.client ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <div className={`px-6 pb-6 transition-all duration-300 ${expandedSections.client ? 'block opacity-100' : 'hidden opacity-0'}`}>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-gray-100 dark:border-white/5">
                        <div>
                          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Client</p>
                          <p className="font-medium text-gray-900 dark:text-white">{featuredProject.client.name}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Industry</p>
                          <p className="font-medium text-gray-900 dark:text-white">{featuredProject.client.industry}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Location</p>
                          <p className="font-medium text-gray-900 dark:text-white">{featuredProject.client.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Challenge & Solution */}
                {featuredProject.challenge && (
                  <div className="bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
                    <button
                      onClick={() => toggleSection('challenge')}
                      className="w-full p-6 flex items-center justify-between hover:bg-gray-100/50 dark:hover:bg-white/10 transition-colors"
                    >
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                        </div>
                        Challenge & Solution
                      </h3>
                      {expandedSections.challenge ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <div className={`px-6 pb-6 transition-all duration-300 ${expandedSections.challenge ? 'block opacity-100' : 'hidden opacity-0'}`}>
                      <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-white/5">
                        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20">
                          <h4 className="font-bold text-red-900 dark:text-red-300 mb-2 flex items-center gap-2">
                            <Zap className="w-4 h-4" /> The Challenge
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{featuredProject.challenge}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
                          <h4 className="font-bold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" /> Our Solution
                          </h4>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{featuredProject.solution}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>
            
            {/* Features & Tech Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {featuredProject.features && (
                <div className="p-8 bg-gray-50/50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/10">
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                        <Code className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                      </div>
                      Key Features
                   </h3>
                   <div className="grid sm:grid-cols-2 gap-4">
                      {featuredProject.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5">
                          <CheckCircle className="w-5 h-5 text-brand-600 dark:text-brand-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                   </div>
                </div>
              )}
              
              <div className="space-y-6">
                {featuredProject.technologies && (
                  <div className="p-8 bg-gray-50/50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/10">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                          <Palette className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                        </div>
                        Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {featuredProject.technologies.map((tech, i) => (
                        <span key={i} className="px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {featuredProject.results && (
                  <div className="p-8 bg-gradient-to-br from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 rounded-[2rem] border border-brand-100 dark:border-brand-900/20">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center">
                          <Zap className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                        </div>
                        Impact & Results
                    </h3>
                    <div className="space-y-3">
                      {featuredProject.results.map((result, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-brand-600 dark:bg-brand-500 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="font-medium text-gray-800 dark:text-gray-200">{result}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Other Projects */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-gray-800/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-gray-900 dark:text-white">
              More Projects
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore additional work we've completed for clients across various industries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.filter(p => !p.featured).map((project) => (
              <div
                key={project.id}
                className="group glass-card rounded-[2rem] overflow-hidden hover:-translate-y-2"
              >
                <div className={`h-48 sm:h-56 bg-gradient-to-br ${project.color} relative overflow-hidden`}>
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Globe className="w-16 h-16 text-white/50" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-white font-medium flex items-center gap-2">
                      View Details <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="inline-block px-3 py-1 rounded-full bg-brand-50 dark:bg-white/5 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-4">
                    {project.category}
                  </div>
                  
                  <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <button className="text-sm font-bold text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors uppercase tracking-wide flex items-center gap-2">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
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