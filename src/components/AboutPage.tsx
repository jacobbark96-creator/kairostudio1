import { ArrowLeft, Users, Target, Lightbulb, Heart, Award, Rocket, CheckCircle } from 'lucide-react';
import ContactModal from './ContactModal';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const [showContact, setShowContact] = useState(false);

  const values = [
    {
      icon: Target,
      title: 'Client-Focused',
      description: 'Your success is our success. We prioritize understanding your business goals and delivering solutions that drive real results.',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'We stay ahead of the curve, using cutting-edge technologies and creative approaches to solve complex challenges.',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: Heart,
      title: 'Passion-Driven',
      description: 'We love what we do, and it shows in every project. Our dedication to excellence is evident in the quality of our work.',
      color: 'from-rose-500 to-pink-600',
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'We maintain the highest standards in everything we create, ensuring your brand is represented with excellence.',
      color: 'from-amber-500 to-orange-600',
    },
  ];

  const team = [
    {
      name: 'Creative Team',
      role: 'Design & Strategy',
      description: 'Our creative minds bring your vision to life with stunning designs and strategic thinking.',
    },
    {
      name: 'Development Team',
      role: 'Engineering & Tech',
      description: 'Expert developers who build robust, scalable solutions using the latest technologies.',
    },
    {
      name: 'Support Team',
      role: 'Client Success',
      description: 'Dedicated professionals ensuring your success every step of the way.',
    },
  ];

  const stats = [
    { number: '50+', label: 'Projects Delivered' },
    { number: '30+', label: 'Happy Clients' },
    { number: '5+', label: 'Years Experience' },
    { number: '100%', label: 'Client Satisfaction' },
  ];

  return (
    <>
      <section className="pt-24 sm:pt-28 md:pt-32 lg:pt-36 xl:pt-40 pb-8 sm:pb-10 md:pb-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-gray-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-300 mb-4 sm:mb-5 group"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm sm:text-base font-medium">Back to Home</span>
          </Link>

          <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-8">
            <div className="inline-block px-4 py-2 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4">
              About Kairo
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-3 sm:mb-4">
              We're More Than
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400">
                Just a Studio
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed px-4">
              We're a team of passionate creators, strategists, and developers dedicated to transforming your digital presence.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 text-gray-900 dark:text-gray-100">
                Our Mission
              </h2>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                At Kairo, we believe that every business deserves exceptional digital experiences. Our mission is to bridge the gap between your vision and reality, creating solutions that not only look stunning but drive measurable results.
              </p>
              <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                We combine creative excellence with strategic thinking, ensuring that every project we undertake contributes to your long-term success and growth.
              </p>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-cyan-200 dark:border-cyan-800">
              <Rocket className="w-12 h-12 sm:w-16 sm:h-16 text-cyan-600 dark:text-cyan-400 mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                Driving Digital Transformation
              </h3>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                We help businesses of all sizes navigate the digital landscape, from startups taking their first steps to established enterprises looking to innovate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
              Our Values
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              The principles that guide everything we do and shape how we work with our clients.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700 hover:border-cyan-500 dark:hover:border-cyan-500 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4`}>
                  <value.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                  {value.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
              Our Approach
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              How we work together to bring your vision to life.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 mx-auto">
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100">
                  {member.name}
                </h3>
                <p className="text-sm sm:text-base font-semibold text-center text-cyan-600 dark:text-cyan-400 mb-3">
                  {member.role}
                </p>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
              Why Choose Kairo?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              What sets us apart in the digital landscape.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-cyan-200 dark:border-cyan-800">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Comprehensive Solutions
              </h3>
              <ul className="space-y-3">
                {[
                  'End-to-end project management',
                  'From concept to launch and beyond',
                  'Integrated marketing and operations',
                  'Ongoing support and optimization',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-purple-200 dark:border-purple-800">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Flexible Partnership
              </h3>
              <ul className="space-y-3">
                {[
                  'Projects tailored to your budget',
                  'Scalable solutions that grow with you',
                  'Transparent communication',
                  'Dedicated account management',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-black via-gray-900 to-black dark:from-gray-900 dark:via-black dark:to-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 leading-tight px-4">
            Let's Build Something Amazing Together
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 dark:text-gray-400 mb-4 sm:mb-5 md:mb-6 leading-relaxed max-w-2xl mx-auto px-4">
            Ready to transform your digital presence? Get in touch and let's discuss how we can help you achieve your goals.
          </p>
          <button
            onClick={() => setShowContact(true)}
            className="group px-5 sm:px-6 md:px-8 lg:px-10 py-3 sm:py-3.5 md:py-4 lg:py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-full hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg font-semibold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 min-h-[44px] sm:min-h-[48px] md:min-h-[52px] lg:min-h-[56px] mx-auto"
          >
            Get Started
            <Rocket className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />
    </>
  );
}

