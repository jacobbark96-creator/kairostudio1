import { ArrowRight, Sparkles, Palette, Code, Zap, Mail, CheckCircle, TrendingUp, DollarSign, Users, Rocket, Award, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ContactModal from './ContactModal';

export default function ServicesPage() {
  const [showContact, setShowContact] = useState(false);

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
      <section className="pt-24 sm:pt-28 md:pt-32 lg:pt-36 xl:pt-40 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-gray-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-300 mb-4 sm:mb-5 group"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base font-medium">Back to Home</span>
          </Link>
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 dark:text-cyan-400 animate-pulse" />
              <span className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300 tracking-wide uppercase">
                Our Services
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4 sm:mb-6 md:mb-8">
              Services for
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400">
                Every Budget
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-3xl mx-auto px-2">
              Whether you're a startup with a 3-figure monthly budget or launching a 6-figure project, 
              we have the expertise and flexibility to bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-stretch sm:items-center px-4">
              <button 
                onClick={() => setShowContact(true)}
                className="group px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 flex items-center justify-center gap-3 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 min-h-[48px] sm:min-h-[52px] md:min-h-[56px]"
              >
                <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                Free Consultation
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <a 
                href="#services" 
                className="px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-cyan-500 transition-all duration-300 flex items-center justify-center gap-3 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 min-h-[48px] sm:min-h-[52px] md:min-h-[56px]"
              >
                Explore Services
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Budget Flexibility Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 text-gray-900 dark:text-gray-100 px-4">
              We Work With <span className="text-cyan-600 dark:text-cyan-400">All Budgets</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              From startups to enterprises, we tailor our services to fit your needs and budget.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-cyan-500 dark:hover:border-cyan-500 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="inline-block px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4">
                  {benefit.highlight}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          {/* Budget Examples */}
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <div className="p-5 sm:p-6 md:p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl sm:rounded-2xl border-2 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  6-Figure Projects
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 md:mb-6 text-sm sm:text-base leading-relaxed">
                We've successfully delivered comprehensive digital transformations, custom platforms, 
                and enterprise solutions for clients investing six figures in their digital presence.
              </p>
              <ul className="space-y-2">
                {['Custom Platform Development', 'Enterprise Solutions', 'Complete Digital Overhauls', 'Multi-Year Partnerships'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 sm:p-6 md:p-8 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl sm:rounded-2xl border-2 border-cyan-200 dark:border-cyan-800">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  3-Figure Monthly
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 md:mb-6 text-sm sm:text-base leading-relaxed">
                Perfect for growing businesses, we offer flexible monthly retainers starting in the 
                three-figure range, providing ongoing support and continuous improvement.
              </p>
              <ul className="space-y-2">
                {['Monthly Retainers', 'Ongoing Maintenance', 'Regular Updates', 'Dedicated Support'].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">
              What We Offer
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive services tailored to your business needs and goals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-cyan-500 dark:hover:border-cyan-500 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:from-cyan-600 group-hover:to-blue-600 dark:group-hover:from-cyan-500 dark:group-hover:to-blue-500 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <service.icon className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-600 dark:text-cyan-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
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
              onClick={() => setShowContact(true)}
              className="group px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 flex items-center justify-center gap-3 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 min-h-[48px] sm:min-h-[52px] md:min-h-[56px]"
            >
              <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              Book Free Consultation
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <a 
              href="mailto:hello@kairostudio.com"
              className="px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 md:py-5 bg-white/10 backdrop-blur-sm text-white rounded-full border-2 border-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-3 text-base sm:text-lg font-semibold hover:scale-105 active:scale-95 min-h-[48px] sm:min-h-[52px] md:min-h-[56px]"
            >
              Email Us Directly
            </a>
          </div>
          <p className="mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm md:text-base text-gray-400 px-4">
            No commitment required • 100% Free • Quick response guaranteed
          </p>
        </div>
      </section>

      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
    </>
  );
}

