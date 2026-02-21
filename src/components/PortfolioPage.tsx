import React, { useState } from 'react';
import { ArrowRight, ExternalLink, Code, Palette, Zap, Users, Globe, CheckCircle, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUI } from '../context/UIContext';

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
      <section className="pt-24 sm:pt-28 md:pt-32 lg:pt-36 xl:pt-40 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-gray-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-300 mb-4 sm:mb-5 group"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base font-medium">Back to Home</span>
          </Link>

          <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-8">
            <div className="inline-block px-4 py-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4">
              Our Portfolio
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3 sm:mb-4">
              Work That
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400">
                Speaks for Itself
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed px-4">
              Explore our recent projects and see how we've helped businesses transform their digital presence.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Project - UseHyro */}
      {featuredProject && (
        <section className="py-6 sm:py-8 md:py-10 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="mb-4 sm:mb-5">
              <span className="text-xs sm:text-sm font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                Featured Project
              </span>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-10 md:mb-12">
              {/* Project Image */}
              <div>
                <div className={`relative rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br ${featuredProject.color} p-0.5 sm:p-1 shadow-xl sm:shadow-2xl`}>
                  <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl overflow-hidden">
                    {featuredProject.image ? (
                      <img
                        src={featuredProject.image}
                        alt={featuredProject.title}
                        className="w-full h-auto object-cover"
                      />
                    ) : (
                      <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30">
                        <div className="text-center p-4 sm:p-6 md:p-8">
                          <div className={`w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl sm:rounded-2xl bg-gradient-to-br ${featuredProject.color} flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg`}>
                            <Globe className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />
                          </div>
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{featuredProject.title}</h3>
                          <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">Project Preview</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div>
                <div className="flex items-center gap-2 mb-2.5 sm:mb-3">
                  <div className={`w-9 h-9 sm:w-11 sm:h-11 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${featuredProject.color} flex items-center justify-center overflow-hidden flex-shrink-0`}>
                    {featuredProject.favicon ? (
                      <img 
                        src={featuredProject.favicon} 
                        alt={`${featuredProject.title} icon`}
                        className="w-full h-full object-contain p-1.5 sm:p-2"
                      />
                    ) : (
                      <Globe className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7 text-white" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 break-words">
                      {featuredProject.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{featuredProject.category}</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed">
                  {featuredProject.description}
                </p>

                {featuredProject.link && (
                  <a
                    href={featuredProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 transition-all duration-300 font-medium text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 mb-4 sm:mb-5 min-h-[44px] sm:min-h-[48px]"
                  >
                    Visit Website
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Client Spec */}
            {featuredProject.client && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl mb-3 sm:mb-4 md:mb-6 overflow-hidden border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => toggleSection('client')}
                  className="w-full p-3 sm:p-5 md:p-7 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base md:text-lg">Client Information</span>
                  </h3>
                  {expandedSections.client ? (
                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 md:hidden" />
                  ) : (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 md:hidden" />
                  )}
                </button>
                <div className={expandedSections.client ? 'block md:block px-3 sm:px-5 md:px-7 pb-3 sm:pb-5 md:pb-7' : 'hidden md:block px-3 sm:px-5 md:px-7 pb-3 sm:pb-5 md:pb-7'}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Client Name
                      </p>
                      <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 break-words">
                        {featuredProject.client.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Industry
                      </p>
                      <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 break-words">
                        {featuredProject.client.industry}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                        Location
                      </p>
                      <p className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 break-words">
                        {featuredProject.client.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Challenge & Solution */}
            {featuredProject.challenge && (
              <div className="mb-3 sm:mb-4 md:mb-6">
                <button
                  onClick={() => toggleSection('challenge')}
                  className="w-full p-3 sm:p-4 md:p-5 bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors border border-gray-200 dark:border-gray-700 mb-2 md:hidden"
                >
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                    <span>Challenge & Solution</span>
                  </h3>
                  {expandedSections.challenge ? (
                    <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
                <div className={expandedSections.challenge ? 'block md:block grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-5' : 'hidden md:block grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-5'}>
                  <div className="bg-red-50 dark:bg-red-900/10 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border border-red-200 dark:border-red-900/30">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <span>The Challenge</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {featuredProject.challenge}
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/10 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 border border-green-200 dark:border-green-900/30">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span>Our Solution</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {featuredProject.solution}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            {featuredProject.features && (
              <div className="mb-3 sm:mb-4 md:mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => toggleSection('features')}
                    className="w-full p-3 sm:p-4 md:p-5 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Code className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base md:text-lg">Key Features</span>
                    </h3>
                    {expandedSections.features ? (
                      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 md:hidden" />
                    ) : (
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 md:hidden" />
                    )}
                  </button>
                  <div className={expandedSections.features ? 'block md:block px-3 sm:px-4 md:px-5 pb-3 sm:pb-4 md:pb-5' : 'hidden md:block px-3 sm:px-4 md:px-5 pb-3 sm:pb-4 md:pb-5'}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                      {featuredProject.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 p-2 sm:p-2.5 md:p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                        >
                          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Technologies */}
            {featuredProject.technologies && (
              <div className="mb-3 sm:mb-4 md:mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => toggleSection('technologies')}
                    className="w-full p-3 sm:p-4 md:p-5 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                      <span className="text-sm sm:text-base md:text-lg">Technologies Used</span>
                    </h3>
                    {expandedSections.technologies ? (
                      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 md:hidden" />
                    ) : (
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 md:hidden" />
                    )}
                  </button>
                  <div className={expandedSections.technologies ? 'block md:block px-3 sm:px-4 md:px-5 pb-3 sm:pb-4 md:pb-5' : 'hidden md:block px-3 sm:px-4 md:px-5 pb-3 sm:pb-4 md:pb-5'}>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {featuredProject.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-xs sm:text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {featuredProject.results && (
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden border-2 border-cyan-200 dark:border-cyan-800">
                <button
                  onClick={() => toggleSection('results')}
                  className="w-full p-3 sm:p-4 md:p-6 flex items-center justify-between hover:bg-cyan-100/50 dark:hover:bg-cyan-900/30 transition-colors"
                >
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                    <span className="text-sm sm:text-base md:text-lg">Results & Impact</span>
                  </h3>
                  {expandedSections.results ? (
                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 md:hidden" />
                  ) : (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 md:hidden" />
                  )}
                </button>
                <div className={`${expandedSections.results ? 'block' : 'hidden'} md:block px-3 sm:px-4 md:p-6 pb-3 sm:pb-4 md:pb-6`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    {featuredProject.results.map((result, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-cyan-600 dark:bg-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                        </div>
                        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{result}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Other Projects */}
      <section className="py-6 sm:py-8 md:py-10 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4 sm:mb-5 md:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100 px-4">
              More Projects
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Explore additional work we've completed for clients across various industries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {projects.filter(p => !p.featured).map((project) => (
              <div
                key={project.id}
                className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-cyan-500 dark:hover:border-cyan-500 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`h-32 sm:h-40 md:h-48 bg-gradient-to-br ${project.color} relative overflow-hidden`}>
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Globe className="w-12 h-12 sm:w-16 sm:h-16 text-white/50" />
                    </div>
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-1.5">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-2.5">
                    {project.description}
                  </p>
                  <button className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors duration-300 group-hover:gap-2">
                    View Details
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-6 sm:py-8 md:py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-gray-900 to-black dark:from-gray-900 dark:via-black dark:to-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2.5 sm:mb-3 leading-tight px-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 dark:text-gray-400 mb-3 sm:mb-4 md:mb-5 leading-relaxed max-w-2xl mx-auto px-4">
            Let's discuss how we can bring your vision to life with a custom solution tailored to your needs.
          </p>
          <button
            onClick={() => openContactModal()}
            className="group px-5 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-3.5 md:py-4 lg:py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 min-h-[44px] sm:min-h-[48px] md:min-h-[52px] lg:min-h-[56px] mx-auto"
          >
            Get Started Today
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </>
  );
}