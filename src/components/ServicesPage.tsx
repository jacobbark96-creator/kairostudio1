
"use client";
import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle, ArrowLeft, Layout, Palette, ArrowDownRight, Globe, Zap, Search } from 'lucide-react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

import { useUI } from '../context/UIContext';
import SEO from './SEO';

// --- 1. Interactive Node Network Hero Component ---
const NodeNetwork = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);

    const particles = [];
    const numParticles = window.innerWidth < 768 ? 40 : 80;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };
    
    const onMouseLeave = () => {
      mouse.current.x = -1000;
      mouse.current.y = -1000;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    let animationFrameId;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      const isDark = document.documentElement.classList.contains('dark');
      const particleColor = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)';
      const lineColor = isDark ? '255, 255, 255' : '0, 0, 0';
      const mouseLineColor = isDark ? '14, 165, 233' : '14, 165, 233'; // brand-500

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        // Connect to mouse
        const dxMouse = mouse.current.x - p.x;
        const dyMouse = mouse.current.y - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 300) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.current.x, mouse.current.y);
          ctx.strokeStyle = `rgba(${mouseLineColor}, ${0.8 - distMouse / 375})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Connect to others
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${lineColor}, ${0.3 - dist / 500})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80 dark:opacity-100" />;
};

// --- 2. Magnetic Video Card Component ---
const MagneticVideoCard = ({ service, index }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative p-8 sm:p-10 bg-white dark:bg-[#111] rounded-[2rem] border border-gray-200 dark:border-gray-800 hover:border-brand-500/50 transition-colors duration-500 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-2xl ${service.colSpan}`}
    >
      {/* Background Video Reveal */}
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-[2rem]">
        <div className="absolute inset-0 bg-gray-900/90 dark:bg-black/90 z-0" />
        {/* Animated Mesh Gradients instead of broken videos */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-[spin_20s_linear_infinite] opacity-70 z-10 mix-blend-screen"
             style={{
               background: `conic-gradient(from 0deg, ${service.colors[0]}, ${service.colors[1]}, ${service.colors[2]}, ${service.colors[0]})`,
               filter: 'blur(60px)'
             }} 
        />
        <div className="absolute top-0 left-0 w-full h-full animate-[pulse_4s_ease-in-out_infinite] opacity-50 z-20 mix-blend-screen"
             style={{
               background: `radial-gradient(circle at center, ${service.colors[1]} 0%, transparent 70%)`,
               filter: 'blur(40px)'
             }}
        />
      </div>

      <div className="relative z-10 transform-gpu" style={{ transform: "translateZ(30px)" }}>
        <div className="w-14 h-14 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-brand-500 transition-all duration-500">
          <service.icon className="w-6 h-6 text-gray-900 dark:text-white group-hover:text-white transition-colors" />
        </div>
        
        <h3 className="text-2xl sm:text-3xl font-display font-bold mb-4 text-gray-900 dark:text-white group-hover:text-white tracking-tight transition-colors drop-shadow-md">
          {service.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-300 mb-10 leading-relaxed font-light text-lg transition-colors">
          {service.description}
        </p>
      </div>
      
      <ul className="space-y-3 relative z-10 transform-gpu" style={{ transform: "translateZ(20px)" }}>
        {service.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 group-hover:bg-brand-400 transition-colors duration-500" />
            {feature}
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

// --- 3. Sticky Morphing Sphere Component ---
const MorphingProcess = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const borderRadius = useTransform(scrollYProgress, 
    [0, 0.33, 0.66, 1], 
    ["50%", "10%", "30% 70% 70% 30% / 30% 30% 70% 70%", "50%"]
  );

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 1.2]);
  
  const background = useTransform(scrollYProgress, 
    [0, 0.33, 0.66, 1], 
    [
      "linear-gradient(135deg, rgba(14,165,233,0.1), rgba(14,165,233,0.3))",
      "linear-gradient(135deg, rgba(168,85,247,0.4), rgba(14,165,233,0.4))",
      "linear-gradient(135deg, rgba(236,72,153,0.5), rgba(168,85,247,0.5))",
      "linear-gradient(135deg, rgba(234,179,8,0.8), rgba(239,68,68,0.8))" 
    ]
  );

  const boxShadow = useTransform(scrollYProgress, 
    [0, 0.33, 0.66, 1], 
    [
      "inset 0 0 20px rgba(255,255,255,0.2), 0 0 40px rgba(14,165,233,0.2)",
      "inset 0 0 0px rgba(255,255,255,0), 0 20px 40px rgba(0,0,0,0.3)",
      "inset 0 0 20px rgba(255,255,255,0.5), 0 0 60px rgba(236,72,153,0.4)",
      "inset 0 0 50px rgba(255,255,255,0.8), 0 0 100px rgba(234,179,8,0.6)"
    ]
  );

  const phases = [
    { title: "01. Strategy", desc: "We map the architecture of your digital ecosystem. No lines of code are written until the wireframe of your brand's future is perfectly aligned with your business goals." },
    { title: "02. Design", desc: "The blueprint solidifies into stunning visual identity. We craft premium, conversion-optimized interfaces that build immediate trust with your high-value prospects." },
    { title: "03. Development", desc: "Ideas shatter into reality. We engineer lightning-fast, scalable, and secure architectures using modern frameworks that leave competitors in the dust." },
    { title: "04. Growth", desc: "Launch is just the beginning. We ignite your digital presence with continuous SEO and performance optimization, turning your site into a lead-generating sun." }
  ];

  return (
    <section ref={containerRef} className="relative w-full bg-gray-50 dark:bg-[#050505] border-y border-gray-200 dark:border-white/5" style={{ height: "500vh" }}>
      <div className="sticky top-0 w-full h-screen py-24 flex flex-col md:flex-row items-center justify-center overflow-hidden">
        
        {/* Text Content (Left) */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center px-8 md:px-16 lg:px-24 relative z-20">
          <div className="relative h-[400px] w-full">
            {phases.map((phase, i) => {
              const start = i * 0.2; // 0, 0.2, 0.4, 0.6
              const end = start + 0.2; // 0.2, 0.4, 0.6, 0.8
              const opacity = useTransform(scrollYProgress, 
                [start, start + 0.05, end - 0.05, end], 
                [i === 0 ? 1 : 0, 1, 1, i === phases.length - 1 ? 1 : 0] // Keep first step visible instantly, keep last step visible longer
              );
              const y = useTransform(scrollYProgress, 
                [start, start + 0.05, end - 0.05, end], 
                [i === 0 ? 0 : 40, 0, 0, i === phases.length - 1 ? 0 : -40] // Keep first step in place, keep last step in place
              );

              return (
                <motion.div key={i} style={{ opacity, y }} className="absolute inset-0 flex flex-col justify-center">
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
                    {phase.title}
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed max-w-lg">
                    {phase.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Morphing Sphere (Right) */}
        <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center relative z-10 perspective-1000 mb-16 md:mb-0">
          <motion.div 
            style={{ 
              width: "40vh", 
              height: "40vh", 
              borderRadius, 
              rotate, 
              scale,
              background,
              boxShadow,
              backdropFilter: "blur(20px)"
            }}
            className="border border-white/20 dark:border-white/10 flex items-center justify-center overflow-hidden relative"
          >
            {/* Inner Wireframe (Only visible early on) */}
            <motion.div 
              style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
              className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff40_1px,transparent_1px),linear-gradient(to_bottom,#ffffff40_1px,transparent_1px)] bg-[size:20px_20px] rounded-full"
            />
          </motion.div>
        </div>

      </div>
    </section>
  );
};

// --- 4. Holographic Black Card Component ---
const HolographicCard = ({ title, price, desc, features, icon: Icon, isPremium }) => {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative p-8 sm:p-12 rounded-[2.5rem] border overflow-hidden group transition-transform duration-500 hover:-translate-y-2 ${
        isPremium 
          ? 'bg-black border-gray-800 shadow-2xl' 
          : 'bg-gray-50 dark:bg-[#111] border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl'
      }`}
    >
      {/* Holographic Foil Overlay */}
      {isPremium && (
        <div 
          className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2.5rem] overflow-hidden mix-blend-screen"
        >
          <div 
            className="absolute inset-0 opacity-60"
            style={{
              background: `conic-gradient(from ${mousePos.x * 0.5}deg at ${mousePos.x}px ${mousePos.y}px, #0ea5e9, #8b5cf6, #ec4899, #0ea5e9)`,
              filter: 'blur(40px)',
              transform: 'scale(1.5)'
            }}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.3), transparent 40%)`
            }}
          />
        </div>
      )}
      
      {/* Light Foil Overlay for Standard */}
      {!isPremium && (
        <div 
          className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2.5rem] overflow-hidden mix-blend-screen"
        >
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: `conic-gradient(from ${mousePos.x * 0.5}deg at ${mousePos.x}px ${mousePos.y}px, #3b82f6, #0ea5e9, #3b82f6)`,
              filter: 'blur(40px)',
              transform: 'scale(1.5)'
            }}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.1), transparent 40%)`
            }}
          />
        </div>
      )}

      <div className="relative z-10 pointer-events-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${
              isPremium ? 'bg-[#222] border-gray-700' : 'bg-white dark:bg-[#222] border-gray-100 dark:border-gray-700 shadow-sm'
            }`}>
              <Icon className={`w-5 h-5 ${isPremium ? 'text-white' : 'text-gray-900 dark:text-white'}`} />
            </div>
            <h3 className={`text-2xl sm:text-3xl font-display font-bold ${isPremium ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
              {title}
            </h3>
          </div>
          <span className={`inline-flex px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
            isPremium ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-300'
          }`}>
            {price}
          </span>
        </div>
        
        <p className={`text-lg leading-relaxed font-light mb-8 ${isPremium ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
          {desc}
        </p>
        
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((item, i) => (
            <div key={i} className={`flex items-center gap-3 ${isPremium ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'}`}>
              <CheckCircle className={`w-5 h-5 ${isPremium ? 'text-gray-600' : 'text-gray-400 dark:text-gray-600'}`} />
              <span className="font-medium text-sm sm:text-base">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- MAIN PAGE COMPONENT ---
export default function ServicesPage() {
  const { openContactModal } = useUI();

  const services = [
    {
      icon: Layout,
      title: 'Digital Presence',
      description: 'We build, host, and manage your entire website. No huge upfront costs, just a high-performing site that works.',
      features: ['Custom Design & Build', 'Premium Hosting Included', 'Unlimited Edits', '24/7 Technical Support'],
      colSpan: 'md:col-span-2 lg:col-span-2',
      colors: ['#0ea5e9', '#3b82f6', '#8b5cf6']
    },
    {
      icon: Search,
      title: 'Search Optimisation',
      description: 'Your site isn’t a digital brochure—it’s an engine. We continually optimise your presence so customers can actually find you.',
      features: ['Local SEO', 'Keyword Strategy', 'Performance Monitoring'],
      colSpan: 'md:col-span-1 lg:col-span-1',
      colors: ['#10b981', '#3b82f6', '#0ea5e9']
    },
    {
      icon: Palette,
      title: 'Brand Identity',
      description: 'Look like the premium business you are. We craft logos and visual systems that build immediate trust.',
      features: ['Logo Design', 'Brand Guidelines', 'Visual Identity'],
      colSpan: 'md:col-span-1 lg:col-span-1',
      colors: ['#f59e0b', '#ef4444', '#ec4899']
    },
    {
      icon: Zap,
      title: 'Performance & Scale',
      description: 'Lightning-fast load times and scalable architecture designed to grow seamlessly as your business expands.',
      features: ['Speed Optimisation', 'Scalable Architecture', 'Security Audits', 'Conversion Tracking'],
      colSpan: 'md:col-span-2 lg:col-span-2',
      colors: ['#8b5cf6', '#d946ef', '#f43f5e']
    },
  ];

  return (
    <>
      <SEO 
        title="Services" 
        description="From brand identity to web development and digital strategy, Kairo Studio offers comprehensive services tailored to your goals." 
      />
      
      {/* 1. Interactive Node Network Hero Section */}
      <section className="relative pt-40 sm:pt-56 pb-20 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[70vh] flex items-center bg-gray-50 dark:bg-[#050505]">
        <NodeNetwork />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-300 mb-12 sm:mb-16 group text-sm font-medium tracking-wide uppercase"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <div className="max-w-5xl relative group pointer-events-none">
            {/* Spotlight Text Effect */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.05] tracking-tighter text-gray-900 dark:text-white mb-8 pointer-events-auto">
              Digital excellence.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-700">
                Engineered for growth.
              </span>
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 mt-12 sm:mt-16 pointer-events-auto">
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                We don't just build websites. We engineer digital ecosystems designed to elevate your brand, capture your audience, and drive measurable results.
              </p>
              <div className="flex flex-col justify-center items-start">
                <button 
                  onClick={() => openContactModal()}
                  className="group/btn inline-flex items-center gap-4 text-lg font-medium text-gray-900 dark:text-white pb-2 border-b-2 border-gray-900 dark:border-white hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-600 dark:hover:border-brand-400 transition-all duration-300"
                >
                  Start your project
                  <ArrowDownRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Magnetic Video Bento Grid */}
      <section id="services" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0a0a0a] border-y border-gray-200 dark:border-gray-800 perspective-1000">
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
              <MagneticVideoCard key={index} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Sticky Morphing Sphere Process */}
      <MorphingProcess />

      {/* 4. Holographic Investment Cards */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0a0a0a]">
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
              <HolographicCard 
                title="The Studio Retainer"
                price="From £79 / mo"
                desc="Our most popular model. You get an elite design and development team on standby, treating your digital presence as a continuously evolving product."
                features={['Unlimited Design Requests', 'Ongoing Development', 'Premium Hosting & Security', 'Priority Support']}
                icon={Globe}
                isPremium={false}
              />

              <HolographicCard 
                title="Custom Projects"
                price="Bespoke Quoting"
                desc="For comprehensive digital transformations, complex web applications, and complete brand overhauls. We build it exactly to your specifications."
                features={['Dedicated Project Manager', 'Bespoke Architecture', 'Full Brand Guidelines', 'Complete Ownership']}
                icon={Layout}
                isPremium={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-black text-white border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.1)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-8 leading-tight tracking-tight">
            Let's build something<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600">extraordinary.</span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-400 mb-12 font-light max-w-2xl mx-auto">
            Book a complimentary consultation to discuss your vision, timeline, and how we can elevate your brand.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button 
              onClick={() => openContactModal()}
              className="w-full sm:w-auto px-10 py-5 bg-white text-black rounded-full hover:bg-gray-200 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 text-lg font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)]"
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
