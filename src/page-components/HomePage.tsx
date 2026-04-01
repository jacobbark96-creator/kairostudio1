"use client";
import { ArrowRight, Palette, Code, Zap, Sparkles, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

import { supabase } from '../lib/supabase';
import TypewriterHero from '../components/TypewriterHero';
import SEO from '../components/SEO';
import FeaturedProjects from '../components/FeaturedProjects';
import RandomOffer from '../components/RandomOffer';

import { useUI } from '../context/UIContext';
import confetti from 'canvas-confetti';

export default function HomePage() {
  const { isJackpot, triggerJackpot } = useUI();
  const [heroTitle, setHeroTitle] = useState('We craft digital experiences that inspire');
  const [heroTitleAlt1, setHeroTitleAlt1] = useState('We build brands that convert');
  const [heroTitleAlt2, setHeroTitleAlt2] = useState('We design products that scale');
  const [heroSubtitle, setHeroSubtitle] = useState('Transform your vision into stunning digital realities. We blend creativity with technology to build brands that captivate and convert.');

  const [auditUrl, setAuditUrl] = useState('');
  const [auditEmail, setAuditEmail] = useState('');
  const [isSubmittingAudit, setIsSubmittingAudit] = useState(false);
  const [auditSuccess, setAuditSuccess] = useState(false);
  const [showMobileAudit, setShowMobileAudit] = useState(false);

  // Prevent scroll when mobile audit modal is open
  useEffect(() => {
    if (showMobileAudit) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [showMobileAudit]);

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAudit(true);

    // Format URL logic
    let formattedUrl = auditUrl.trim().toLowerCase();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      if (!/^www\./i.test(formattedUrl)) {
          formattedUrl = `https://www.${formattedUrl}`;
      } else {
          formattedUrl = `https://${formattedUrl}`;
      }
    }

    try {
        await fetch('https://hook.eu1.make.com/aewnwbg67m55lr979f9ofriktxg9i496', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: formattedUrl,
                email: auditEmail
            }),
        });
        
        setAuditSuccess(true);
        setAuditUrl('');
        setAuditEmail('');
    } catch (error) {
        console.error("Error submitting audit request", error);
        alert("There was an issue submitting your request. Please try again.");
    } finally {
        setIsSubmittingAudit(false);
    }
  };

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
      icon: Palette,
      title: 'Brand Identity',
      description: 'Crafting memorable brands that resonate with your audience and stand the test of time.',
      bgClass: 'bg-brand-500/5 dark:bg-brand-500/10',
      image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop', // Pinkish abstract
    },
    {
      icon: Code,
      title: 'Web Development',
      description: 'Building fast, responsive websites with cutting-edge technologies and seamless experiences.',
      bgClass: 'bg-blue-500/5 dark:bg-blue-500/10',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop', // Coding/Tech
    },
    {
      icon: Zap,
      title: 'Digital Strategy',
      description: 'Strategic planning and execution to elevate your digital presence and drive growth.',
      bgClass: 'bg-purple-500/5 dark:bg-purple-500/10',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop', // Strategy/Graph
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
                  className="md:hidden w-full relative h-[60px] bg-white/80 dark:bg-black/40 backdrop-blur-md rounded-full overflow-hidden border border-gray-300 dark:border-white/10 shadow-lg flex items-center mt-2 touch-none"
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
                        setShowMobileAudit(true);
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
                    Swipe to Analyse Site
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 to-purple-500/20 rounded-full blur-[80px] -z-10" />
              
              {/* DESKTOP BOX - Hidden on mobile */}
              <div className="hidden md:block w-full max-w-lg relative z-10 transform hover:scale-[1.02] transition-all duration-500">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-white/60 dark:bg-black/40 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/40 dark:border-white/10 group/audit">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent opacity-50" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 translate-x-[-200%] group-hover/audit:animate-shimmer hidden dark:block" />
                    
                    <div className="relative z-10 p-8 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/60 dark:border-white/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                            <Sparkles className="w-4 h-4 animate-pulse" />
                            Free Audit
                        </div>
                        
                        <h3 className="text-3xl font-display font-black text-gray-900 dark:text-white mb-3 leading-tight drop-shadow-sm">
                            Assess your <br/> 
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-300 dark:to-purple-300">current site</span>
                        </h3>
                        
                        {auditSuccess ? (
                            <div className="py-2 text-center animate-fade-in-up">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-xl drop-shadow-sm">Your email will arrive any moment</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 font-medium">Play for a discount while you wait.</p>
                                <div className="transform scale-90 origin-top">
                                    <RandomOffer />
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-700 dark:text-gray-200 text-sm font-medium mb-8 max-w-[16rem] mx-auto leading-relaxed drop-shadow-sm">
                                    Get instant feedback on your site and learn how Kairo can take you to the next level.
                                </p>
                                
                                <div className="bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/50 dark:border-white/10 shadow-inner">
                                    <form 
                                        onSubmit={handleAuditSubmit}
                                        className="flex flex-col gap-4"
                                    >
                                    <input 
                                        type="text" 
                                        placeholder="yourdomain.com" 
                                        required
                                        value={auditUrl}
                                        onChange={(e) => setAuditUrl(e.target.value)}
                                        className="w-full px-5 py-3.5 rounded-xl bg-white/70 dark:bg-black/40 backdrop-blur-sm border border-white/60 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all shadow-sm"
                                    />
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        required
                                        value={auditEmail}
                                        onChange={(e) => setAuditEmail(e.target.value)}
                                        className="w-full px-5 py-3.5 rounded-xl bg-white/70 dark:bg-black/40 backdrop-blur-sm border border-white/60 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all shadow-sm"
                                    />
                                    <button 
                                        type="submit"
                                        disabled={isSubmittingAudit}
                                        className="w-full py-4 mt-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white rounded-xl font-bold shadow-lg shadow-brand-500/30 active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-70 border border-brand-400/50"
                                    >
                                        {isSubmittingAudit ? 'Sending...' : 'Analyse Now'}
                                        {!isSubmittingAudit && <ArrowRight className="w-5 h-5" />}
                                    </button>
                                </form>
                                <p className="text-[11px] font-semibold tracking-wider text-gray-500 dark:text-gray-400 mt-5 text-center uppercase">Powered by Kairo AI</p>
                            </div>
                            </>
                        )}
                    </div>
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none mix-blend-overlay" />
                </div>
              </div>
              
              {/* MOBILE MODAL - Smooth Lightbox Transition */}
              <div 
                className={`md:hidden fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transform-gpu transition-[opacity,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  showMobileAudit ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                }`}
                style={{ willChange: 'opacity, visibility' }}
              >
                {/* Modal Container */}
                <div 
                  className={`relative w-full max-w-lg transform-gpu transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    showMobileAudit ? 'translate-y-0 scale-100 opacity-100 delay-100' : 'translate-y-12 scale-95 opacity-0'
                  }`}
                  style={{ willChange: 'transform, opacity' }}
                >
                  <button 
                    onClick={() => setShowMobileAudit(false)}
                    className="absolute -top-12 right-0 z-[110] p-2 bg-white/20 dark:bg-white/10 rounded-full text-white backdrop-blur-md shadow-lg border border-white/20"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  
                  {/* Site Assessment Feature */}
                  <div className="relative w-full overflow-hidden rounded-[2.5rem] bg-white/90 dark:bg-black/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] border border-white/40 dark:border-white/10 group/audit">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent opacity-50" />
                      
                      <div className="relative z-10 p-8 text-center">
                          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/60 dark:border-white/10 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                              <Sparkles className="w-4 h-4 animate-pulse" />
                              Free Audit
                          </div>
                          
                          <h3 className="text-3xl font-display font-black text-gray-900 dark:text-white mb-3 leading-tight drop-shadow-sm">
                              Assess your <br/> 
                              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-300 dark:to-purple-300">current site</span>
                          </h3>
                          
                          {auditSuccess ? (
                              <div className="py-2 text-center animate-fade-in-up">
                                  <h4 className="font-bold text-gray-900 dark:text-white mb-2 text-xl drop-shadow-sm">Your email will arrive any moment</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 font-medium">Play for a discount while you wait.</p>
                                  <div className="transform scale-90 origin-top">
                                      <RandomOffer />
                                  </div>
                              </div>
                          ) : (
                              <>
                                  <p className="text-gray-700 dark:text-gray-200 text-sm font-medium mb-8 max-w-[16rem] mx-auto leading-relaxed drop-shadow-sm">
                                      Get instant feedback on your site and learn how Kairo can take you to the next level.
                                  </p>
                                  
                                  <div className="bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/50 dark:border-white/10 shadow-inner">
                                      <form 
                                          onSubmit={handleAuditSubmit}
                                          className="flex flex-col gap-4"
                                      >
                                      <input 
                                          type="text" 
                                          placeholder="yourdomain.com" 
                                          required
                                          value={auditUrl}
                                          onChange={(e) => setAuditUrl(e.target.value)}
                                          className="w-full px-5 py-3.5 rounded-xl bg-white/70 dark:bg-black/40 backdrop-blur-sm border border-white/60 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all shadow-sm"
                                      />
                                      <input 
                                          type="email" 
                                          placeholder="Enter your email" 
                                          required
                                          value={auditEmail}
                                          onChange={(e) => setAuditEmail(e.target.value)}
                                          className="w-full px-5 py-3.5 rounded-xl bg-white/70 dark:bg-black/40 backdrop-blur-sm border border-white/60 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all shadow-sm"
                                      />
                                      <button 
                                          type="submit"
                                          disabled={isSubmittingAudit}
                                          className="w-full py-4 mt-2 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white rounded-xl font-bold shadow-lg shadow-brand-500/30 active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-70 border border-brand-400/50"
                                      >
                                          {isSubmittingAudit ? 'Sending...' : 'Analyse Now'}
                                          {!isSubmittingAudit && <ArrowRight className="w-5 h-5" />}
                                      </button>
                                  </form>
                                  <p className="text-[11px] font-semibold tracking-wider text-gray-500 dark:text-gray-400 mt-5 text-center uppercase">Powered by Kairo AI</p>
                              </div>
                              </>
                          )}
                      </div>
                      <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none mix-blend-overlay" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden block md:hidden">
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
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
            {services.map((service, index) => (
              <div
                key={index}
                className={`group p-8 sm:p-10 rounded-3xl hover:-translate-y-2 relative overflow-hidden transition-all duration-300 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-xl dark:shadow-2xl dark:shadow-black/50 ${
                  index === 1 ? 'md:-translate-y-8' : ''
                }`}
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 w-full h-full -z-10 transition-transform duration-700 group-hover:scale-110">
                    <img 
                        src={service.image} 
                        alt={service.title} 
                        className="w-full h-full object-cover opacity-20 dark:opacity-30 group-hover:opacity-30 dark:group-hover:opacity-40 transition-opacity"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.bgClass.replace('/5', '/80').replace('/10', '/90')} mix-blend-multiply dark:mix-blend-multiply`} />
                    <div className="absolute inset-0 bg-white/40 dark:bg-black/40" />
                </div>

                {/* Mobile-specific decorative elements */}
                <div className="md:hidden absolute top-0 right-0 w-32 h-32 bg-white/20 dark:bg-white/5 rounded-bl-[100px] -z-10" />
                <div className="md:hidden absolute bottom-0 left-0 w-24 h-24 bg-black/5 dark:bg-black/20 rounded-tr-[80px] -z-10" />

                {/* Abstract Background Blob per card */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-white/30 to-transparent dark:from-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-white/40 dark:border-white/20 shadow-lg relative z-10">
                  <service.icon className="w-7 h-7 sm:w-8 sm:h-8 text-gray-900 dark:text-white" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-gray-900 dark:text-white relative z-10 drop-shadow-sm">
                  {service.title}
                </h3>
                <p className="text-gray-800 dark:text-gray-200 font-medium text-base leading-relaxed relative z-10 drop-shadow-sm mb-6">
                  {service.description}
                </p>
                
                <div className="relative z-10 mt-auto flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white group-hover:gap-4 transition-all">
                  Explore <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
