"use client";
import { ArrowRight, Palette, Code, Zap, Sparkles, X, Layout, Smartphone, TrendingUp, CheckCircle, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';

import { supabase } from '../lib/supabase';
import TypewriterHero from '../components/TypewriterHero';
import SEO from '../components/SEO';
import FeaturedProjects from '../components/FeaturedProjects';
import InvestmentCalculator from '../components/InvestmentCalculator';
import CodeToCanvas from '../components/CodeToCanvas';

import { useUI } from '../context/UIContext';
import confetti from 'canvas-confetti';

export default function HomePage() {
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleServicesMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const [marqueeProjects, setMarqueeProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchMarquee = async () => {
      const { data } = await supabase.from('projects').select('id, client_name, logo_url, image_url').eq('show_in_marquee', true);
      if (data) setMarqueeProjects(data);
    };
    fetchMarquee();
  }, []);

  const { isJackpot, triggerJackpot } = useUI();
  const [heroTitle, setHeroTitle] = useState('We craft digital experiences that inspire');
  const [heroTitleAlt1, setHeroTitleAlt1] = useState('We build brands that convert');
  const [heroTitleAlt2, setHeroTitleAlt2] = useState('We design products that scale');
  const [heroSubtitle, setHeroSubtitle] = useState('Transform your vision into stunning digital realities. We blend creativity with technology to build brands that captivate and convert.');

  const [showCalculator, setShowCalculator] = useState(false);
  const [showMobileCalculator, setShowMobileCalculator] = useState(false);
  
  // Prevent scroll when mobile calculator modal is open
  useEffect(() => {
    if (showMobileCalculator) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [showMobileCalculator]);

  // Handle Jackpot Celebration
  useEffect(() => {
    if (isJackpot) {
      // Fire confetti from multiple angles for a "fill the screen" effect
      const duration = 10000; // Increased duration
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 45, spread: 360, ticks: 100, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          // Don't reset jackpot automatically, keep the "JACKPOT!!!" text
          // triggerJackpot(false); 
          return;
        }

        const particleCount = 100 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.4, 0.6), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [isJackpot, triggerJackpot]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase.from('site_content').select('*');
      if (error) {
        console.error("Error fetching site_content:", error);
        return; // Fallback to default state values
      }
      if (data && data.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const title = (data as any[]).find(item => item.key === 'hero_title')?.value;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const titleAlt1 = (data as any[]).find(item => item.key === 'hero_title_alt_1')?.value;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const titleAlt2 = (data as any[]).find(item => item.key === 'hero_title_alt_2')?.value;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subtitle = (data as any[]).find(item => item.key === 'hero_subtitle')?.value;
        
        if (title) setHeroTitle(title);
        if (titleAlt1) setHeroTitleAlt1(titleAlt1);
        if (titleAlt2) setHeroTitleAlt2(titleAlt2);
        if (subtitle) setHeroSubtitle(subtitle);
      }
    } catch (e) {
      console.error("Failed to fetch site content", e);
    }
  };

  const services = [
    {
      icon: Layout,
      title: 'Done-For-You Web Presence',
      description: 'We build, host, and manage your entire website for a flat monthly fee. No huge upfront costs, just a high-performing site that works.',
      bgClass: 'bg-brand-500/5 dark:bg-brand-500/10',
      image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop', // Pinkish abstract
    },
    {
      icon: TrendingUp,
      title: 'Continuous SEO & Growth',
      description: 'Your site isn’t a digital brochure—it’s an engine. We continually optimize your presence so customers can actually find you on Google.',
      bgClass: 'bg-purple-500/5 dark:bg-purple-500/10',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop', // Digital dashboard
    },
    {
      icon: Palette,
      title: 'Modern Brand Identity',
      description: 'Look like the premium business you are. We craft logos and visual systems that build immediate trust with your future customers.',
      bgClass: 'bg-pink-500/5 dark:bg-pink-500/10',
      image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1974&auto=format&fit=crop', // Abstract waves
    },
  ];

  return (
    <>
      <SEO 
        title="Digital Experiences That Inspire" 
        description="Transform your vision into stunning digital realities. We blend creativity with technology to build brands that captivate and convert." 
      />
      <section className="relative z-0 pt-48 sm:pt-56 md:pt-64 pb-12 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[85vh] sm:min-h-[90vh] flex items-center">
        {/* Night Sky Background */}
        <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
            <img 
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop" 
                alt="Night Sky" 
                className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Light Mode "Fade" Overlay: Makes image subtle in light mode, invisible in dark mode */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/70 to-white dark:opacity-0 transition-opacity duration-500 pointer-events-none" />
        </div>

        {/* Background Blobs - Static on mobile, animated on desktop */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-40 sm:opacity-80 mix-blend-overlay">
          <div className="absolute top-[-5%] left-[-10%] w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-brand-400/50 dark:bg-brand-500/30 rounded-full blur-[50px] sm:blur-[100px] sm:animate-blob will-change-transform" />
          <div className="absolute top-[30%] right-[-10%] w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-purple-400/50 dark:bg-purple-500/30 rounded-full blur-[50px] sm:blur-[100px] sm:animate-blob sm:animation-delay-2000 will-change-transform" />
          <div className="absolute bottom-[-5%] left-[10%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-blue-400/50 dark:bg-blue-500/30 rounded-full blur-[50px] sm:blur-[100px] sm:animate-blob sm:animation-delay-4000 will-change-transform" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="text-center lg:text-left mt-8 sm:mt-0">
              <div className="min-h-[120px] sm:min-h-[200px] mb-4 sm:mb-8">
                {isJackpot ? (
                    <TypewriterHero 
                      texts={["JACKPOT!!!"]} 
                      className="block text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-display font-bold leading-[1.1] sm:leading-[0.9] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 pb-2 sm:pb-4 scale-110 origin-center lg:origin-left transition-all duration-500"
                      speed={150}
                    />
                ) : (
                    <TypewriterHero 
                      texts={[heroTitle, heroTitleAlt1, heroTitleAlt2].filter(t => t && t.trim().length > 0)} 
                      className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black leading-[1.1] sm:leading-[1.05] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-brand-800 to-brand-600 dark:from-white dark:via-gray-100 dark:to-brand-200 pb-2 sm:pb-4 drop-shadow-sm"
                      speed={70}
                    />
                )}
              </div>
              
              <p className="text-lg sm:text-2xl text-gray-800 dark:text-gray-100 max-w-[20rem] sm:max-w-2xl mx-auto lg:mx-0 mb-8 sm:mb-10 leading-relaxed font-medium sm:font-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:drop-shadow-sm p-2 sm:p-0">
                {heroSubtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 px-4 sm:px-0">
                <Link 
                  href="/book"
                  className="group w-full sm:w-auto px-8 py-4 sm:py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full hover:bg-brand-600 dark:hover:bg-brand-400 dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-2 text-base sm:text-lg font-bold shadow-xl shadow-brand-500/20 hover:shadow-brand-500/40 hover:-translate-y-1 active:scale-[0.98]"
                >
                  Start Project
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                {/* Mobile Swipe to Analyse Slider */}
                <div 
                  className="md:hidden w-full relative h-[60px] bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-full overflow-hidden border border-gray-300 dark:border-white/10 shadow-lg flex items-center mt-2 touch-none cursor-pointer"
                  onClick={() => setShowMobileCalculator(true)}
                  onTouchStart={(e) => {
                    const slider = e.currentTarget;
                    const touch = e.touches[0];
                    const startX = touch.clientX;
                    const thumb = slider.querySelector('.swipe-thumb') as HTMLElement;
                    const text = slider.querySelector('.swipe-text') as HTMLElement;
                    const maxSlide = slider.offsetWidth - thumb.offsetWidth - 8; // 8px for padding
                    
                    thumb.style.transition = 'none';
                    if(text) text.style.transition = 'none';

                    const handleTouchMove = (e: TouchEvent) => {
                      const currentX = e.touches[0].clientX;
                      let diff = currentX - startX;
                      
                      // Clamp the swipe between 0 and maxSlide
                      if (diff < 0) diff = 0;
                      if (diff > maxSlide) diff = maxSlide;
                      
                      thumb.style.transform = `translateX(${diff}px)`;
                      
                      // Fade out text as you swipe
                      if(text) {
                          const opacity = 1 - (diff / (maxSlide * 0.5));
                          text.style.opacity = Math.max(0, opacity).toString();
                      }
                      
                      // If swiped all the way (or close enough), trigger action
                      if (diff > maxSlide * 0.85) {
                        handleTouchEnd();
                        setShowMobileCalculator(true);
                      }
                    };

                    const handleTouchEnd = () => {
                      thumb.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
                      thumb.style.transform = 'translateX(0px)';
                      if(text) {
                          text.style.transition = 'opacity 0.3s ease';
                          text.style.opacity = '1';
                      }
                      
                      document.removeEventListener('touchmove', handleTouchMove);
                      document.removeEventListener('touchend', handleTouchEnd);
                    };

                    document.addEventListener('touchmove', handleTouchMove, { passive: false });
                    document.addEventListener('touchend', handleTouchEnd);
                  }}
                >
                  {/* The swipeable thumb */}
                  <div className="swipe-thumb absolute left-1 top-1 bottom-1 w-14 bg-gradient-to-r from-brand-600 to-brand-500 rounded-full flex items-center justify-center shadow-lg z-10">
                    <ArrowRight className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* The instructional text */}
                  <span className="swipe-text w-full text-center text-sm font-bold text-gray-900 dark:text-gray-200 pl-10 pointer-events-none drop-shadow-sm">
                    Investment Calculator
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end relative">
              {/* DESKTOP BOX - Investment Calculator */}
              <div 
                className="hidden md:block w-full max-w-lg relative z-10 transition-all duration-500 group"
              >
                <div 
                  className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] border border-white/50 dark:border-white/10"
                >
                  <div className="relative z-10 p-10 text-center bg-white/40 dark:bg-black/40 backdrop-blur-sm">
                    <div className="w-16 h-16 bg-brand-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <RefreshCw className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                    </div>
                    
                    <h3 className="text-3xl font-display font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                      Website Investment Calculator
                    </h3>
                    
                    <p className="text-gray-500 dark:text-gray-400 text-base mb-8 max-w-sm mx-auto leading-relaxed">
                      Answer 5 quick questions to get an instant recommendation and pricing for your new project.
                    </p>
                    
                    <button 
                      onClick={() => setShowCalculator(true)}
                      className="w-full py-5 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-2xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all flex justify-center items-center gap-2"
                    >
                      Start Calculator
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    
                    <div className="mt-6 flex flex-col items-center justify-center gap-2">
                      <div className="flex items-center gap-1 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        ))}
                      </div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Instant quote. No obligation.</p>
                    </div>
                  </div>
                </div>
              </div>

              <InvestmentCalculator 
                isOpen={showCalculator} 
                onClose={() => setShowCalculator(false)} 
              />
            </div>
          </div>
        </div>
      </section>
            {/* Tech-Stack Marquee */}
      <section className="py-12 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#050505]/50 overflow-hidden relative flex flex-col items-center">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 dark:from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 dark:from-[#050505] to-transparent z-10 pointer-events-none" />
        
        <div className="w-full text-center mb-8 relative z-20">
           <span className="text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] bg-white/50 dark:bg-black/50 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm">
             Our Stack
           </span>
        </div>

        <div className="flex w-max animate-[marquee_30s_linear_infinite] opacity-60 dark:opacity-40 hover:opacity-100 transition-opacity duration-300">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-16 px-8">
              <img src="https://cdn.simpleicons.org/react/61DAFB" alt="React" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              <img src="https://cdn.simpleicons.org/nextdotjs" alt="Next.js" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 dark:invert" />
              <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" alt="TailwindCSS" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              <img src="https://cdn.simpleicons.org/typescript/3178C6" alt="TypeScript" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              <img src="https://cdn.simpleicons.org/supabase/3ECF8E" alt="Supabase" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              <img src="https://cdn.simpleicons.org/stripe/6366F1" alt="Stripe" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              <img src="https://cdn.simpleicons.org/vercel" alt="Vercel" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 dark:invert" />
              <img src="https://cdn.simpleicons.org/framer" alt="Framer Motion" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 dark:invert" />
            </div>
          ))}
        </div>
      </section>


      
      {/* Code-to-Canvas Interactive Section */}
      <CodeToCanvas />

      {/* Client Logos Marquee */}
      {marqueeProjects.length > 0 && (
        <section className="py-16 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#050505]/50 overflow-hidden relative flex flex-col items-center">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 dark:from-[#050505] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 dark:from-[#050505] to-transparent z-10 pointer-events-none" />
          
          <div className="w-full text-center mb-10 relative z-20">
             <span className="text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] bg-white/50 dark:bg-black/50 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm">
               Trusted By
             </span>
          </div>

          <div className="flex w-max animate-[marquee_40s_linear_infinite_reverse]">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-16 px-8">
                {marqueeProjects.map((p: any) => {
                   const name = p.client_name?.toLowerCase() || '';
                    const isHyro = name.includes('hyro');
                    const isSolarpedia = name.includes('solarpedia');
                    const isOpenlead = name.includes('openlead');
                    const isVerdePizza = name.includes('verde') || name.includes('pizza');
                    const isWhiteLogo = name.includes('open energy') || name.includes('openlead academy') || name.includes('openlead');
                    
                    let heightClass = 'h-[90px] md:h-28'; // Default for others
                    if (isHyro) heightClass = 'h-[58px] md:h-[72px]'; // 10% reduction from h-16/h-20
                    if (isSolarpedia) heightClass = 'h-[163px] md:h-[204px]'; // Another 10% increase from 185/148
                    if (isOpenlead) heightClass = 'h-[119px] md:h-[147px]'; // 10% increase from 134/108
                    if (isVerdePizza) heightClass = 'h-[99px] md:h-[123px]'; // 10% increase from 28/90
                    
                    return (
                     <div key={p.id} className="flex items-center gap-4 group/logo">
                       {p.logo_url || p.image_url ? (
                         <img 
                            src={p.logo_url || p.image_url} 
                            alt={p.client_name} 
                            className={`${heightClass} w-auto object-contain grayscale group-hover/logo:grayscale-0 transition-all duration-0 ${isWhiteLogo ? 'invert dark:invert-0' : ''}`} 
                          />
                       ) : (
                         <span className="text-2xl md:text-3xl font-bold text-gray-600 dark:text-gray-400">{p.client_name}</span>
                       )}
                     </div>
                   );
                 })}
              </div>
            ))}
          </div>
        </section>
      )}


<section className="hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-10 sm:mb-24">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black mb-4 text-gray-900 dark:text-white tracking-tight">
              Selected Work
            </h2>
            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-400 max-w-[18rem] mx-auto mb-8 font-normal leading-relaxed">
              See how we help brands grow through digital innovation.
            </p>
          </div>
          
          <div className="w-full">
            <FeaturedProjects />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-24">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black mb-4 text-gray-900 dark:text-white tracking-tight">
              Our Services
            </h2>
            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-400 max-w-[20rem] sm:max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
              Explore our comprehensive service offerings designed to elevate your brand.
            </p>
            <Link 
              href="/services"
              className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold hover:gap-4 transition-all duration-300 group bg-brand-50 dark:bg-brand-900/20 px-6 py-3 rounded-full"
            >
              View All Services
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div 
            className="flex flex-nowrap sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-10 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 group/grid no-scrollbar"
            onMouseMove={handleServicesMouseMove}
          >
            {services.map((service, index) => (
              <Link
                key={index}
                href="/services"
                className={`w-[75vw] sm:w-auto shrink-0 snap-center group flex flex-col p-6 sm:p-10 bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-brand-500/50 dark:hover:border-brand-500/50 shadow-sm hover:shadow-2xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden ${
                  index === 1 ? 'md:-translate-y-8' : ''
                }`}
              >
                
                {/* X-Ray Hover Glow */}
                <motion.div
                  className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover/grid:opacity-100 hidden sm:block"
                  style={{
                    background: useTransform(
                      [mouseX, mouseY],
                      ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(14, 165, 233, 0.15), transparent 40%)`
                    )
                  }}
                />
                <motion.div
                  className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover/grid:opacity-100 hidden sm:block mix-blend-overlay"
                  style={{
                    background: useTransform(
                      [mouseX, mouseY],
                      ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(255, 255, 255, 0.1), transparent 40%)`
                    )
                  }}
                />
                
                <div className="relative z-10 mb-8">

                  <service.icon className="w-8 h-8 text-brand-600 dark:text-brand-500 transition-transform duration-300 group-hover:scale-110" />
                </div>
                
                <h3 className="relative z-10 text-2xl font-display font-bold mb-3 text-gray-900 dark:text-white">
                  {service.title}
                </h3>
                
                <p className="relative z-10 text-gray-500 dark:text-gray-400 font-medium text-base leading-relaxed mb-8 flex-grow">
                  {service.description}
                </p>
                
                <div className="relative z-10 mt-auto flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white transition-all">
                  Explore <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* MOBILE MODAL - Website Investment Calculator */}
      <InvestmentCalculator 
        isOpen={showMobileCalculator} 
        onClose={() => setShowMobileCalculator(false)} 
      />
    </>
  );
}
