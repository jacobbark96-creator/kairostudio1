"use client";
import { ArrowRight, Mail, CheckCircle, TrendingUp, DollarSign, ArrowLeft, Layout, Smartphone, Palette, ArrowDownRight, Globe, Zap, Search } from 'lucide-react';
import Link from 'next/link';

import { useUI } from '../context/UIContext';
import SEO from './SEO';

export default function ServicesPage() {
  const { openContactModal } = useUI();

  const services = [
    {
      icon: Layout,
      title: 'Digital Presence',
      description: 'We build, host, and manage your entire website. No huge upfront costs, just a high-performing site that works.',
      features: ['Custom Design & Build', 'Premium Hosting Included', 'Unlimited Edits', '24/7 Technical Support'],
      colSpan: 'md:col-span-2 lg:col-span-2',
    },
    {
      icon: Search,
      title: 'Search Optimization',
      description: 'Your site isn’t a digital brochure—it’s an engine. We continually optimize your presence so customers can actually find you on Google.',
      features: ['Local SEO', 'Keyword Strategy', 'Performance Monitoring'],
      colSpan: 'md:col-span-1 lg:col-span-1',
    },
    {
      icon: Palette,
      title: 'Brand Identity',
      description: 'Look like the premium business you are. We craft logos and visual systems that build immediate trust with your future customers.',
      features: ['Logo Design', 'Brand Guidelines', 'Visual Identity'],
      colSpan: 'md:col-span-1 lg:col-span-1',
    },
    {
      icon: Zap,
      title: 'Performance & Scale',
      description: 'Lightning-fast load times and scalable architecture designed to grow seamlessly as your business expands.',
      features: ['Speed Optimization', 'Scalable Architecture', 'Security Audits', 'Conversion Tracking'],
      colSpan: 'md:col-span-2 lg:col-span-2',
    },
  ];

  return (
    <>
      <SEO 
        title="Services" 
        description="From brand identity to web development and digital strategy, Kairo Studio offers comprehensive services tailored to your goals." 
      />
      
      {/* Hero Section */}
      <section className="relative pt-40 sm:pt-56 pb-20 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-300 mb-12 sm:mb-16 group text-sm font-medium tracking-wide uppercase"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <div className="max-w-5xl">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.05] tracking-tighter text-gray-900 dark:text-white mb-8">
              Digital excellence.<br />
              <span className="text-gray-400 dark:text-gray-500">Engineered for growth.</span>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mt-12 sm:mt-16">
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                We don't just build websites. We engineer digital ecosystems designed to elevate your brand, capture your audience, and drive measurable results.
              </p>
              <div className="flex flex-col justify-center items-start">
                <button 
                  onClick={() => openContactModal()}
                  className="group inline-flex items-center gap-4 text-lg font-medium text-gray-900 dark:text-white pb-2 border-b-2 border-gray-900 dark:border-white hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-600 dark:hover:border-brand-400 transition-all duration-300"
                >
                  Start your project
                  <ArrowDownRight className="w-5 h-5 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Bento Grid */}
      <section id="services" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#0a0a0a] border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h2 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
              Our Capabilities
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md font-light leading-relaxed">
              A holistic approach to your digital presence, combining aesthetics with uncompromising performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className={`group p-8 sm:p-10 bg-white dark:bg-[#111] rounded-[2rem] border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-500 flex flex-col justify-between ${service.colSpan}`}
              >
                <div>
                  <div className="w-14 h-14 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-brand-50 dark:group-hover:bg-brand-500/10 transition-all duration-500">
                    <service.icon className="w-6 h-6 text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors" />
                  </div>
                  
                  <h3 className="text-2xl sm:text-3xl font-display font-bold mb-4 text-gray-900 dark:text-white tracking-tight">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-10 leading-relaxed font-light text-lg">
                    {service.description}
                  </p>
                </div>
                
                <ul className="space-y-3">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 group-hover:bg-brand-500 transition-colors duration-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Approach Section (Editorial Style) */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-32">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-8">
                Tailored for<br />
                <span className="text-gray-400 dark:text-gray-500">every ambition.</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed mb-10">
                Whether you're scaling a startup or reinventing an enterprise, we structure our partnerships to align with your trajectory and budget.
              </p>
              <div className="hidden lg:block w-full h-[1px] bg-gray-200 dark:bg-gray-800" />
            </div>

            <div className="lg:col-span-7 space-y-8">
              {/* Option 1 */}
              <div className="p-8 sm:p-12 bg-gray-50 dark:bg-[#111] rounded-[2.5rem] border border-gray-200 dark:border-gray-800 group hover:bg-white dark:hover:bg-[#151515] transition-colors duration-500 shadow-sm hover:shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-[#222] rounded-full flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700">
                      <Globe className="w-5 h-5 text-gray-900 dark:text-white" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
                      The Studio Retainer
                    </h3>
                  </div>
                  <span className="inline-flex px-4 py-1.5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-300 text-sm font-medium whitespace-nowrap">
                    From £899 / mo
                  </span>
                </div>
                
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-light mb-8">
                  Our most popular model. You get an elite design and development team on standby, treating your digital presence as a continuously evolving product.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {['Unlimited Design Requests', 'Ongoing Development', 'Premium Hosting & Security', 'Priority Support'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <CheckCircle className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                      <span className="font-medium text-sm sm:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Option 2 */}
              <div className="p-8 sm:p-12 bg-gray-900 dark:bg-[#111] rounded-[2.5rem] border border-gray-800 dark:border-gray-800 group hover:bg-black dark:hover:bg-[#151515] transition-colors duration-500 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-800 dark:bg-[#222] rounded-full flex items-center justify-center border border-gray-700 dark:border-gray-700">
                      <Layout className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
                      Custom Projects
                    </h3>
                  </div>
                  <span className="inline-flex px-4 py-1.5 rounded-full bg-gray-800 dark:bg-gray-800 text-gray-300 text-sm font-medium whitespace-nowrap border border-gray-700">
                    Bespoke Quoting
                  </span>
                </div>
                
                <p className="text-lg text-gray-400 leading-relaxed font-light mb-8">
                  For comprehensive digital transformations, complex web applications, and complete brand overhauls. We build it exactly to your specifications.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {['Dedicated Project Manager', 'Bespoke Architecture', 'Full Brand Guidelines', 'Complete Ownership'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-sm sm:text-base">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#050505] text-white border-t border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-8 leading-tight tracking-tight">
            Let's build something<br />
            <span className="text-gray-500">extraordinary.</span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-400 mb-12 font-light max-w-2xl mx-auto">
            Book a complimentary consultation to discuss your vision, timeline, and how we can elevate your brand.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => openContactModal()}
              className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-full hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center gap-3 text-lg font-bold"
            >
              Start the conversation
              <ArrowRight className="w-5 h-5" />
            </button>
            <a 
              href="mailto:hello@kairostudio.co.uk"
              className="w-full sm:w-auto px-10 py-5 bg-transparent text-white rounded-full border border-white/20 hover:border-white/50 transition-colors duration-300 flex items-center justify-center gap-3 text-lg font-medium"
            >
              Email us directly
            </a>
          </div>
        </div>
      </section>
    </>
  );
}