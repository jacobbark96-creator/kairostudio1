import { ArrowRight, Palette, Code, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RandomOffer from '../components/RandomOffer';
import { supabase } from '../lib/supabase';
import TypewriterHero from '../components/TypewriterHero';
import SEO from '../components/SEO';
import FeaturedProjects from '../components/FeaturedProjects';

import { useUI } from '../context/UIContext';
import confetti from 'canvas-confetti';

export default function HomePage() {
  const { isJackpot, triggerJackpot } = useUI();
  const [heroTitle, setHeroTitle] = useState('We craft digital experiences that inspire');
  const [heroTitleAlt1, setHeroTitleAlt1] = useState('');
  const [heroTitleAlt2, setHeroTitleAlt2] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('Transform your vision into stunning digital realities. We blend creativity with technology to build brands that captivate and convert.');

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
    const { data } = await supabase.from('site_content').select('*');
    if (data) {
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
      <section className="relative z-0 pt-32 sm:pt-40 md:pt-48 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[85vh] sm:min-h-[90vh] flex items-center">
        {/* Night Sky Background */}
        <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
            <img 
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop" 
                alt="Night Sky" 
                className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Dark Mode: No overlay, just raw image */}
            
            {/* Light Mode "Fade" Overlay: Makes image subtle in light mode, invisible in dark mode */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-white dark:opacity-0 transition-opacity duration-500 pointer-events-none" />
        </div>

        {/* Background Blobs - Static on mobile, animated on desktop */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-30 sm:opacity-80 mix-blend-overlay">
          <div className="absolute top-[-10%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-brand-400/40 dark:bg-brand-500/30 rounded-full blur-[60px] sm:blur-[100px] sm:animate-blob will-change-transform" />
          <div className="absolute top-[20%] right-[-10%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-purple-400/40 dark:bg-purple-500/30 rounded-full blur-[60px] sm:blur-[100px] sm:animate-blob sm:animation-delay-2000 will-change-transform" />
          <div className="absolute bottom-[-10%] left-[20%] w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-blue-400/40 dark:bg-blue-500/30 rounded-full blur-[60px] sm:blur-[100px] sm:animate-blob sm:animation-delay-4000 will-change-transform" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="min-h-[140px] sm:min-h-[200px] mb-2 sm:mb-8">
                {isJackpot ? (
                    <TypewriterHero 
                      texts={["JACKPOT!!!"]} 
                      className="block text-4xl sm:text-6xl md:text-7xl lg:text-7xl font-display font-bold leading-[1.1] sm:leading-[0.9] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 pb-2 sm:pb-4 scale-110 origin-left transition-all duration-500"
                      speed={150}
                    />
                ) : (
                    <TypewriterHero 
                      texts={[heroTitle, heroTitleAlt1, heroTitleAlt2].filter(t => t && t.trim().length > 0)} 
                      className="block text-4xl sm:text-6xl md:text-7xl lg:text-7xl font-display font-bold leading-[1.1] sm:leading-[0.9] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-brand-800 to-brand-600 dark:from-white dark:via-gray-200 dark:to-brand-300 pb-2 sm:pb-4"
                      speed={70}
                    />
                )}
              </div>
              
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-white max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed font-light drop-shadow-md">
                {heroSubtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link 
                  to="/portfolio"
                  className="group w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full hover:bg-brand-600 dark:hover:bg-brand-400 dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-2 text-lg font-bold shadow-xl shadow-brand-500/20 hover:shadow-brand-500/40 hover:-translate-y-1"
                >
                  View Our Work
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/services"
                  className="w-full sm:w-auto px-8 py-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sm:bg-white/50 sm:dark:bg-white/5 sm:backdrop-blur-sm text-gray-900 dark:text-white rounded-full hover:border-brand-500 dark:hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-300 flex items-center justify-center gap-2 text-lg font-medium"
                >
                  Our Services
                </Link>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 to-purple-500/20 rounded-full blur-[80px] -z-10" />
              <div className="w-full max-w-lg relative z-10 transform hover:scale-[1.02] transition-transform duration-500">
                <RandomOffer />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden block md:hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
              Selected Work
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 font-light">
              See how we help brands grow through digital innovation.
            </p>
          </div>
          
          <div className="w-full">
            <FeaturedProjects />
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
              Our Services
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 font-light">
              Explore our comprehensive service offerings designed to elevate your brand.
            </p>
            <Link 
              to="/services"
              className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold hover:gap-4 transition-all duration-300 group"
            >
              View All Services
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1" />
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {services.map((service, index) => (
              <div
                key={index}
                className={`group p-8 sm:p-10 rounded-[2rem] hover:-translate-y-2 relative overflow-hidden transition-all duration-300 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xl`}
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

                {/* Abstract Background Blob per card */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-white/30 to-transparent dark:from-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-white/40 dark:border-white/20 shadow-lg relative z-10">
                  <service.icon className="w-7 h-7 sm:w-8 sm:h-8 text-gray-900 dark:text-white" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-gray-900 dark:text-white relative z-10 drop-shadow-sm">
                  {service.title}
                </h3>
                <p className="text-gray-800 dark:text-gray-200 font-medium text-base leading-relaxed relative z-10 drop-shadow-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
