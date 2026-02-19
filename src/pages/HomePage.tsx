import { ArrowRight, Mail, Sparkles, Palette, Code, Zap } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import LogoCarousel from '../components/LogoCarousel';
import ContactModal from '../components/ContactModal';
import HeroCarousel from '../components/HeroCarousel';
import WhyKairo from '../components/WhyKairo';
import { useTheme } from '../hooks/useTheme';

export default function HomePage() {
  const [showContact, setShowContact] = useState(false);
  const { theme } = useTheme();

  const services = [
    {
      icon: Palette,
      title: 'Brand Identity',
      description: 'Crafting memorable brands that resonate with your audience and stand the test of time.',
    },
    {
      icon: Code,
      title: 'Web Development',
      description: 'Building fast, responsive websites with cutting-edge technologies and seamless experiences.',
    },
    {
      icon: Zap,
      title: 'Digital Strategy',
      description: 'Strategic planning and execution to elevate your digital presence and drive growth.',
    },
  ];

  return (
    <>
      <section className="pt-24 sm:pt-28 md:pt-32 lg:pt-36 xl:pt-40 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4 sm:mb-6">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 tracking-wide uppercase">
                  Creative Design Studio
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 sm:mb-6">
                We craft digital
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400">
                  experiences
                </span>
                <br />
                that inspire
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed">
                Transform your vision into stunning digital realities. We blend creativity with technology
                to build brands that captivate and convert.
              </p>
              <Link 
                to="/portfolio"
                className="group px-6 sm:px-8 py-3.5 sm:py-4 bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-cyan-600 dark:hover:bg-cyan-500 transition-all duration-300 flex items-center justify-center gap-2 text-base sm:text-lg font-medium mx-auto lg:mx-0 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 min-h-[48px] sm:min-h-[52px]"
              >
                View Our Work
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="flex justify-center lg:justify-end mt-8 lg:mt-0">
              <div className="w-full sm:w-3/4 lg:w-full max-w-lg h-64 sm:h-80 md:h-96 lg:h-[500px]">
                <HeroCarousel />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14 md:py-18 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">Our Services</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 px-4">Explore our comprehensive service offerings</p>
            <Link 
              to="/services"
              className="px-6 sm:px-8 py-3.5 sm:py-4 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 transition-all duration-300 flex items-center justify-center gap-2 text-base sm:text-lg font-medium mx-auto shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 min-h-[48px] sm:min-h-[52px]"
            >
              View All Services
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-2xl hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-cyan-200 dark:hover:border-cyan-700 hover:-translate-y-1"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:from-cyan-600 group-hover:to-blue-600 dark:group-hover:from-cyan-500 dark:group-hover:to-blue-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <service.icon className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 dark:text-cyan-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyKairo />

      <LogoCarousel theme={theme} />

      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-gray-900 to-black dark:from-gray-900 dark:via-black dark:to-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Ready to elevate
            <br />
            your brand?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 dark:text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
            Let's collaborate and create something extraordinary together.
            Get in touch and let's start building.
          </p>
          <button 
            onClick={() => setShowContact(true)} 
            className="group px-6 sm:px-8 py-3.5 sm:py-4 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 transition-all duration-300 flex items-center justify-center gap-3 text-base sm:text-lg font-medium mx-auto shadow-lg hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 min-h-[48px] sm:min-h-[52px]"
          >
            <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
            Start a Project
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
    </>
  );
}

