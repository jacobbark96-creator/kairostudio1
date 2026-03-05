import { ArrowRight, Sparkles, Palette, Code, Zap, Mail, CheckCircle, TrendingUp, DollarSign, Users, Rocket, Award, ArrowLeft, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUI } from '../context/UIContext';
import SEO from './SEO';

export default function ServicesPage() {
  const { openContactModal } = useUI();

  const services = [
    {
      icon: Palette,
      title: 'Brand Identity',
      description: 'Crafting memorable brands that resonate with your audience and stand the test of time.',
      features: ['Logo Design', 'Brand Guidelines', 'Visual Identity', 'Brand Strategy'],
    },
    {
      icon: Code,
      title: 'Web Development',
      description: 'Building fast, responsive websites with cutting-edge technologies and seamless experiences.',
      features: ['Custom Websites', 'E-commerce Solutions', 'Web Applications', 'Performance Optimization'],
    },
    {
      icon: Zap,
      title: 'Digital Strategy',
      description: 'Strategic planning and execution to elevate your digital presence and drive growth.',
      features: ['SEO Optimization', 'Content Strategy', 'Marketing Automation', 'Analytics & Insights'],
    },
    {
      icon: Rocket,
      title: 'Growth Marketing',
      description: 'Data-driven campaigns that scale your business and maximize ROI.',
      features: ['Paid Advertising', 'Social Media', 'Email Marketing', 'Conversion Optimization'],
    },
    {
      icon: Users,
      title: 'Operations & Support',
      description: 'Streamlined operations and dedicated support to keep your business running smoothly.',
      features: ['POS Integration', 'Inventory Management', 'Staff Scheduling', 'Customer Support'],
    },
    {
      icon: Award,
      title: 'Ongoing Management',
      description: 'Continuous improvement and maintenance to ensure your digital presence stays ahead.',
      features: ['Monthly Retainers', 'Regular Updates', 'Performance Monitoring', 'Dedicated Support'],
    },
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: 'Flexible Budgets',
      description: 'From 3-figure monthly retainers to 6-figure project budgets, we work with businesses of all sizes.',
      highlight: 'All budgets welcome',
    },
    {
      icon: TrendingUp,
      title: 'Proven Results',
      description: 'We\'ve delivered successful projects across industries, from startups to established enterprises.',
      highlight: 'Track record of success',
    },
    {
      icon: Users,
      title: 'Dedicated Support',
      description: 'Every client gets personalized attention and ongoing support tailored to their needs.',
      highlight: 'Personalized service',
    },
  ];

  return (
    <>
      <SEO 
        title="Services" 
        description="From brand identity to web development and digital strategy, Kairo Studio offers comprehensive services for every budget." 
      />
      <section className="relative pt-32 sm:pt-40 md:pt-48 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[60vh] flex items-center">
        {/* Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
           <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-400/20 dark:bg-brand-500/10 rounded-full blur-[100px] animate-blob" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-300 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </Link>
          
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/20 sm:bg-brand-50/50 sm:dark:bg-brand-900/10 border border-brand-100 dark:border-brand-800 sm:backdrop-blur-sm mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400 animate-pulse" />
              <span className="text-sm font-medium text-brand-900 dark:text-brand-100 tracking-wide uppercase">
                Our Services
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-8 tracking-tight text-gray-900 dark:text-white">
              Services for
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-blue-600 to-purple-600 dark:from-brand-400 dark:via-blue-400 dark:to-purple-400">
                Every Budget
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
              Whether you're a startup with a 3-figure monthly budget or launching a 6-figure project, 
              we have the expertise and flexibility to bring your vision to life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => openContactModal()}
                className="group w-full sm:w-auto px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full hover:bg-brand-600 dark:hover:bg-brand-400 dark:hover:text-white transition-all duration-300 flex items-center justify-center gap-3 text-lg font-bold shadow-xl shadow-brand-500/20 hover:shadow-brand-500/40 hover:-translate-y-1"
              >
                <Mail className="w-5 h-5" />
                Free Consultation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href="#services" 
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 sm:bg-white/50 sm:dark:bg-white/5 sm:backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-full hover:border-brand-500 dark:hover:border-brand-400 transition-all duration-300 flex items-center justify-center gap-3 text-lg font-medium hover:text-brand-600 dark:hover:text-brand-400"
              >
                Explore Services
                <ArrowDown className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Budget Flexibility Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-dark-bg relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6 text-gray-900 dark:text-white">
              We Work With <span className="text-brand-600 dark:text-brand-400">All Budgets</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light">
              From startups to enterprises, we tailor our services to fit your needs and budget.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16 sm:mb-24">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group p-8 glass-card rounded-[2rem] hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="w-16 h-16 bg-brand-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-brand-100 dark:border-white/10">
                  <benefit.icon className="w-8 h-8 text-brand-600 dark:text-brand-400" />
                </div>
                
                <div className="inline-block px-4 py-1.5 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-sm font-semibold rounded-full mb-6">
                  {benefit.highlight}
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-gray-900 dark:text-white">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* Budget Examples */}
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-100 dark:border-purple-900/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-bl-[150px] transition-transform duration-500 group-hover:scale-110" />
              
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-14 h-14 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center shadow-sm">
                  <TrendingUp className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                  6-Figure Projects
                </h3>
              </div>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed relative z-10">
                We've successfully delivered comprehensive digital transformations, custom platforms, 
                and enterprise solutions for clients investing six figures in their digital presence.
              </p>
              
              <ul className="space-y-4 relative z-10">
                {['Custom Platform Development', 'Enterprise Solutions', 'Complete Digital Overhauls', 'Multi-Year Partnerships'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-br from-brand-50 to-blue-50 dark:from-brand-900/10 dark:to-blue-900/10 border border-brand-100 dark:border-brand-900/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-bl-[150px] transition-transform duration-500 group-hover:scale-110" />
              
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-14 h-14 bg-white dark:bg-white/5 rounded-2xl flex items-center justify-center shadow-sm">
                  <DollarSign className="w-7 h-7 text-brand-600 dark:text-brand-400" />
                </div>
                <h3 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                  3-Figure Monthly
                </h3>
              </div>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed relative z-10">
                Perfect for growing businesses, we offer flexible monthly retainers starting in the 
                three-figure range, providing ongoing support and continuous improvement.
              </p>
              
              <ul className="space-y-4 relative z-10">
                {['Monthly Retainers', 'Ongoing Maintenance', 'Regular Updates', 'Dedicated Support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <div className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-gray-800/20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl overflow-hidden pointer-events-none">
           <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6 text-gray-900 dark:text-white">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light">
              Comprehensive services tailored to your business needs and goals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group p-8 bg-white dark:bg-black/40 backdrop-blur-xl rounded-[2.5rem] border border-white/20 dark:border-white/10 hover:border-brand-500/30 dark:hover:border-brand-500/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Elegant Gradient Background on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-brand-500/10 to-transparent rounded-bl-[100px] transition-all duration-500 group-hover:scale-125" />
                
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-white dark:from-white/10 dark:to-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg border border-white/50 dark:border-white/10 relative z-10">
                  <service.icon className="w-8 h-8 text-gray-900 dark:text-white" />
                </div>
                
                <h3 className="text-2xl font-display font-bold mb-4 text-gray-900 dark:text-white relative z-10">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed relative z-10 font-light">
                  {service.description}
                </p>
                
                <ul className="space-y-4 relative z-10 border-t border-gray-100 dark:border-white/5 pt-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 group/item">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-400 group-hover/item:scale-150 transition-transform duration-300" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-gray-900 to-black dark:from-gray-900 dark:via-black dark:to-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-cyan-400 mx-auto mb-4 sm:mb-6 md:mb-8 animate-pulse" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight px-4">
            Ready to Get Started?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-300 dark:text-gray-400 mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto px-4">
            Book a free consultation to discuss your project, budget, and how we can help bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-stretch sm:items-center px-4">
            <button 
              onClick={() => openContactModal()}
              className="group px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 flex items-center justify-center gap-3 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 min-h-[48px] sm:min-h-[52px] md:min-h-[56px]"
            >
              <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              Book Free Consultation
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <a 
              href="mailto:hello@kairostudio.com"
              className="px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 bg-white/5 dark:bg-white/5 sm:bg-white/10 sm:backdrop-blur-sm text-white rounded-full border-2 border-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-3 text-base sm:text-lg font-semibold hover:scale-105 active:scale-95 min-h-[48px] sm:min-h-[52px] md:min-h-[56px]"
            >
              Email Us Directly
            </a>
          </div>
          <p className="mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm md:text-base text-gray-400 px-4">
            No commitment required • 100% Free • Quick response guaranteed
          </p>
        </div>
      </section>
    </>
  );
}