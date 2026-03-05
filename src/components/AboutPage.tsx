import { ArrowRight, Code, Heart, Zap, Award, Target, Users, Rocket, Sparkles } from 'lucide-react';
import { useUI } from '../context/UIContext';
import SEO from './SEO';

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
      <section className="relative pt-32 sm:pt-40 md:pt-48 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[60vh] flex items-center">
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

        <div className="max-w-7xl mx-auto w-full relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/20 sm:bg-brand-50/50 sm:dark:bg-brand-900/10 border border-brand-100 dark:border-brand-800 sm:backdrop-blur-sm mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400 animate-pulse" />
            <span className="text-sm font-medium text-brand-900 dark:text-brand-100 tracking-wide uppercase">
              Who We Are
            </span>
          </div>
          
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
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 border-y border-gray-100 dark:border-gray-800 bg-white dark:bg-dark-bg sm:bg-white/50 sm:dark:bg-white/5 sm:backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl sm:text-5xl font-display font-bold text-gray-900 dark:text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-brand-600 dark:text-brand-400 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-dark-bg relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 to-purple-500/20 rounded-[2rem] blur-2xl -z-10" />
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800&h=600" 
                alt="Our Team" 
                className="rounded-[2rem] shadow-2xl w-full transform hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
            
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6 text-gray-900 dark:text-white">
                Driven by Passion, <br/>
                <span className="text-brand-600 dark:text-brand-400">Defined by Quality</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 font-light leading-relaxed">
                <p>
                  Founded with a vision to bridge the gap between stunning design and robust functionality, 
                  Kairo Studio has grown into a full-service digital agency. We believe that every brand 
                  has a unique story, and our mission is to tell that story through immersive digital experiences.
                </p>
                <p>
                  We don't just build websites; we create digital ecosystems that engage users, drive conversions, 
                  and help businesses scale. Our approach combines creative innovation with data-driven strategy 
                  to deliver results that matter.
                </p>
              </div>
              
              <div className="mt-10 pt-10 border-t border-gray-100 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                      <Code className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">Clean Code</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Scalable & Maintainable</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">User Centric</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Experience First</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-gray-800/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-6 text-gray-900 dark:text-white">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
              The principles that guide our work and relationships.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group p-8 bg-white dark:bg-dark-card rounded-[2rem] border border-gray-100 dark:border-gray-800 hover:border-brand-200 dark:hover:border-brand-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-brand-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <value.icon className="w-7 h-7 text-brand-600 dark:text-brand-400" />
                </div>
                
                <h3 className="text-xl font-display font-bold mb-3 text-gray-900 dark:text-white">
                  {value.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {value.description}
                </p>
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
        </div>
      </section>
    </>
  );
}
