"use client";

import { ArrowRight, Heart, Zap, Award, Target, Sparkles } from 'lucide-react';
import { useUI } from '../context/UIContext';
import SEO from './SEO';
import { motion, useScroll, useTransform, useMotionValue, animate } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const stats = [
  { label: 'Years Experience', value: 5, suffix: '+' },
  { label: 'Projects Completed', value: 50, suffix: '+' },
  { label: 'Happy Clients', value: 30, suffix: '+' },
  { label: 'Team Members', value: 8, suffix: '' },
];

const values = [
  {
    icon: Target,
    title: 'Mission Driven',
    description: 'We focus on creating digital solutions that drive real business results and growth.',
  },
  {
    icon: Heart,
    title: 'Client First',
    description: 'Your success is our success. We build lasting partnerships based on trust and transparency.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We stay ahead of the curve, utilizing the latest technologies to build future-proof solutions.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We take pride in our craft, delivering pixel-perfect designs and robust, scalable code.',
  },
];

// Animated Number Component
function AnimatedNumber({ value, suffix }: { value: number, suffix: string }) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || !nodeRef.current) return;
    
    const controls = animate(0, value, {
      duration: 2,
      ease: "easeOut",
      onUpdate: (v) => {
        if (nodeRef.current) {
          nodeRef.current.textContent = Math.floor(v) + suffix;
        }
      }
    });

    return () => controls.stop();
  }, [isInView, value, suffix]);

  return <span ref={nodeRef}>0{suffix}</span>;
}

export default function AboutPage() {
  const { openContactModal } = useUI();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse tracking for X-Ray
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

    return (
      <div className="bg-white dark:bg-[#050505] selection:bg-brand-500/30 overflow-hidden">
        <SEO 
          title="About Us | Kairo Studio" 
          description="We are Kairo Studio, a team of passionate creators, strategists, and developers dedicated to transforming your digital presence." 
        />
      
      {/* 1. HERO SECTION: Massive Typography & Gradients */}
      <section 
        ref={containerRef}
        className="relative pt-40 sm:pt-56 md:pt-64 pb-20 sm:pb-32 px-4 sm:px-6 lg:px-8 min-h-[85vh] flex flex-col items-center justify-center text-center"
      >
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-[0%] left-[20%] w-[600px] h-[600px] bg-brand-500/10 dark:bg-brand-500/20 rounded-full blur-[120px] animate-blob mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute bottom-[10%] right-[20%] w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay" />
        </div>

        <motion.div 
          style={{ y, opacity }}
          className="max-w-5xl mx-auto relative z-10 flex flex-col items-center"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-8 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-semibold tracking-wide text-gray-900 dark:text-white uppercase">Our Mission</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black leading-[0.95] tracking-tighter mb-8 text-gray-900 dark:text-white"
          >
            We Engineer Digital <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-brand-500 via-blue-500 to-purple-600">
              Unfair Advantages.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto font-light tracking-tight"
          >
            Kairo Studio is a collective of passionate creators, strategists, and developers dedicated to transforming your digital presence into a market-dominating force.
          </motion.p>
        </motion.div>
      </section>

      {/* 2. STATS BENTO WITH LIVE METRIC TICKERS */}
      <section className="relative z-20 -mt-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-3xl bg-white/60 dark:bg-[#111]/60 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="text-5xl sm:text-6xl font-display font-black text-gray-900 dark:text-white mb-3 tracking-tighter group-hover:scale-105 transition-transform duration-500 ease-out font-mono">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium tracking-tight">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. THE MANIFESTO (ORIGIN STORY) */}
      <section className="py-32 sm:py-48 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Faint Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-12 sm:space-y-16"
          >
            <div>
              <h2 className="text-sm font-bold tracking-widest text-brand-500 uppercase mb-6">The Manifesto</h2>
              <h3 className="text-3xl sm:text-5xl md:text-6xl font-display font-black leading-[1.1] tracking-tighter text-gray-900 dark:text-white">
                Driven by Passion. <br />
                Defined by Quality.
              </h3>
            </div>

            <div className="prose prose-lg sm:prose-xl dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 font-light leading-relaxed tracking-tight">
              <p className="text-2xl sm:text-3xl text-gray-900 dark:text-white font-medium italic mb-10 border-l-4 border-brand-500 pl-6">
                  "We're honest. So here's the story..."
              </p>
              <div className="space-y-8">
                  <p>
                      We wanted to build a website. A business. We contacted a company that was highly rated. 
                      We were told they were "the best" — and we were quoted over <strong className="text-gray-900 dark:text-white font-semibold border-b-2 border-brand-500/50">£70,000</strong> for just the first "stages".
                  </p>
                  <p>
                      That wasn't the end. We decided we couldn't afford that, so we went elsewhere. 
                      The next quote? <strong className="text-gray-900 dark:text-white font-semibold border-b-2 border-brand-500/50">£600,000</strong>.
                  </p>
                  <p>
                      So the search continued. Stress mounted. Until the famous words arrived:
                  </p>
                  
                  {/* Highlight Block */}
                  <div className="my-12 p-8 sm:p-12 rounded-[2rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-brand-400 to-purple-500" />
                    <p className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-900 dark:text-white m-0 italic font-display tracking-tight leading-snug group-hover:scale-[1.02] transition-transform duration-500">
                      "F@!K IT! Let's do it ourselves. I'll take online courses at the university. It'll take longer, but let's try."
                    </p>
                  </div>

                  <p>
                      And that's exactly what we did. Our business is going steady, but we're still disappointed to see that our negative experience is still alive and well in the industry today.
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      We're gonna kill that attitude.
                  </p>
                  <p>
                      No more jargon. No more confusion. No more hidden fees. No more pressure. No more stress.
                  </p>
                  <p>
                      We do everything we can, including funding our time from our other ventures, to make sure that we destroy our competition in price, service, and quality.
                  </p>
                  <p>
                      We work remotely, not only because we want to work on the beach, but because it allows at least one of our team to be available 24 hours a day. Meaning no more stress calling and emailing your web manager with no response.
                  </p>
                  
                  <div className="pt-12 mt-12 border-t border-gray-200 dark:border-white/10">
                    <p className="text-2xl sm:text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-500">
                        Kairo is here for you, because it was created for us.
                    </p>
                  </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. X-RAY BENTO CORE VALUES */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#0a0a0a] border-y border-gray-200 dark:border-white/5 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-sm font-bold tracking-widest text-brand-500 uppercase mb-4">Core Principles</h2>
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tighter text-gray-900 dark:text-white">
              What drives us forward.
            </h3>
          </div>

          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 group/grid"
            onMouseMove={handleMouseMove}
          >
            {values.map((value, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 p-10 sm:p-12 hover:shadow-2xl transition-all duration-500"
              >
                {/* X-Ray Hover Glow */}
                <motion.div
                  className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover/grid:opacity-100 hidden sm:block"
                  style={{
                    background: useTransform(
                      [mouseX, mouseY],
                      ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(14, 165, 233, 0.1), transparent 40%)`
                    )
                  }}
                />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <value.icon className="w-6 h-6 text-brand-500" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">{value.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed font-light">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PREMIUM MAGNETIC CTA */}
      <section className="py-32 sm:py-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="relative overflow-hidden rounded-[3rem] bg-gray-900 dark:bg-[#0a0a0a] border border-gray-800 dark:border-white/10 p-12 sm:p-20 text-center shadow-2xl">
            {/* Glowing background inside CTA */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />
            
            <div className="relative z-10">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-black mb-8 text-white tracking-tighter leading-[1.1]">
                Ready to build something <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">
                  extraordinary?
                </span>
              </h2>
              <p className="text-xl sm:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto font-light tracking-tight">
                Stop settling for average. Let's engineer a digital experience that puts you years ahead of your competition.
              </p>
              
              {/* Magnetic Button Simulation via hover transforms */}
              <button
                onClick={() => openContactModal()}
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-black rounded-full text-lg font-bold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Your Project
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
