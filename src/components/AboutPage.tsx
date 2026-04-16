"use client";
import { ArrowRight, Code, Heart, Zap, Award, Target, Users, Rocket, Sparkles } from 'lucide-react';
import { useUI } from '../context/UIContext';
import SEO from './SEO';
import { motion } from 'framer-motion';

const stats = [
  { label: 'Years Experience', value: '5+' },
  { label: 'Projects Completed', value: '50+' },
  { label: 'Happy Clients', value: '30+' },
  { label: 'Team Members', value: '8' },
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

export default function AboutPage() {
  const { openContactModal } = useUI();

  return (
    <>
      <SEO 
        title="About Us" 
        description="We are Kairo Studio, a team of passionate creators, strategists, and developers dedicated to transforming your digital presence." 
      />
      
      {/* Hero Section */}
      <section className="relative pt-40 sm:pt-56 md:pt-64 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[60vh] flex items-center">
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
           <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-400/20 dark:bg-brand-500/10 rounded-full blur-[100px] animate-blob" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-7xl mx-auto w-full relative z-10 text-center mt-16 sm:mt-0">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-8 tracking-tight text-gray-900 dark:text-white">
            We Build Digital
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-blue-600 to-purple-600 dark:from-brand-400 dark:via-blue-400 dark:to-purple-400">
              Experiences
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
            Kairo Studio is a team of passionate creators, strategists, and developers dedicated to transforming your digital presence into a powerful asset.
          </p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 border-y border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-bg sm:bg-white/50 sm:dark:bg-white/5 sm:backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="col-span-2 md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12"
            >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5 }}
                className="text-center group"
              >
                <div className="text-4xl sm:text-5xl font-display font-bold text-gray-900 dark:text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-brand-600 dark:text-brand-400 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-dark-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start"
          >
            <div className="relative sticky top-32">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 to-purple-500/20 rounded-[2rem] blur-2xl -z-10" />
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800&h=600" 
                alt="Our Team" 
                className="rounded-[2rem] shadow-2xl w-full transform hover:scale-[1.02] transition-transform duration-500 mb-8"
              />
              <div className="bg-brand-50 dark:bg-brand-900/10 p-8 rounded-3xl border border-brand-100 dark:border-brand-800/30">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Why Kairo?</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                      Because we've been in your shoes. We know the frustration of overpriced, under-delivered services. We built Kairo to be the antidote.
                  </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-8 text-gray-900 dark:text-white">
                Driven by Passion, <br/>
                <span className="text-brand-600 dark:text-brand-400">Defined by Quality</span>
              </h2>
              
              <div className="prose dark:prose-invert max-w-none text-left bg-gray-50 dark:bg-white/5 p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
                 <p className="text-lg text-gray-700 dark:text-gray-300 font-medium italic mb-6">
                     "We're honest. So here's the story..."
                 </p>
                 <div className="text-base text-gray-600 dark:text-gray-400 space-y-5 leading-relaxed font-light">
                     <p>
                         We wanted to build a website. A business. We contacted a company that was highly rated. 
                         We were told they were "the best" - and we were quoted over <strong className="text-brand-600 dark:text-brand-400">£70,000</strong> for just the first "stages".
                     </p>
                     <p>
                         That wasn't the end. We decided we couldn't afford that, so we went elsewhere. 
                         The next quote? <strong className="text-brand-600 dark:text-brand-400">£600,000</strong>.
                     </p>
                     <p>
                         So the search continued. Stress mounted. Until the famous words arrived:
                         <br />
                         <span className="font-bold text-gray-900 dark:text-white block mt-4 pl-4 border-l-4 border-brand-500 bg-white dark:bg-black/20 p-4 rounded-r-xl italic">
                             "F@!K IT! Let's do it ourselves. I'll take online courses at the university. It'll take longer, but let's try."
                         </span>
                     </p>
                     <p>
                         And that's exactly what we did. Our business is going steady, but we're still disappointed to see that our negative experience is still alive and well in the industry today.
                     </p>
                     <p className="font-bold text-gray-900 dark:text-white text-lg">
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
                     <p className="font-display font-bold text-xl text-brand-600 dark:text-brand-400 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                         Kairo is here for you, because it was created for us.
                     </p>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gray-900 dark:bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[100px]" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
            Ready to Work With Us?
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
        </motion.div>
      </section>
    </>
  );
}
