
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Code, Palette } from 'lucide-react';
import RandomOffer from '../../components/RandomOffer';
import { useUI } from '../../context/UIContext';

export default function MobileHome() {
  const { openContactModal } = useUI();

  return (
    <div className="space-y-8 pb-20 relative overflow-hidden z-0">
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

      {/* Mobile Hero */}
      <section className="text-center space-y-6 pt-8 px-4 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-50 to-purple-50 dark:from-brand-900/30 dark:to-purple-900/30 border border-brand-100 dark:border-brand-800/50 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3 h-3" />
          Creative Digital Studio
        </div>
        
        <div className="relative">
            {/* Abstract Background Shapes - Kept for extra flair but reduced opacity */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-400/10 rounded-full blur-3xl -z-10 animate-pulse mix-blend-screen" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl -z-10 animate-pulse animation-delay-2000 mix-blend-screen" />
            
            <h1 className="text-5xl font-display font-black text-gray-900 dark:text-white leading-[0.95] tracking-tight drop-shadow-sm">
              We Craft <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-purple-600 to-pink-500 animate-gradient-x">Digital Magic</span>
            </h1>
        </div>

        <p className="text-gray-600 dark:text-gray-200 text-base font-medium max-w-xs mx-auto leading-relaxed drop-shadow-sm">
          Turning bold ideas into stunning digital realities. Fast, fun, and future-proof.
        </p>
        
        <div className="flex flex-col gap-3 pt-4 px-4">
            <button 
                onClick={() => openContactModal()}
                className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold text-lg shadow-xl shadow-brand-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
                <Zap className="w-5 h-5 fill-current" />
                Start Your Project
            </button>
            <Link 
                to="/portfolio"
                className="w-full py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
                Explore Our Work
            </Link>
        </div>
      </section>

      {/* Slot Machine - Prominent Feature */}
      <section className="px-2 relative z-10">
        <div className="bg-gradient-to-br from-brand-500/10 to-purple-500/10 rounded-[2rem] p-4 border border-brand-100 dark:border-brand-900/30">
            <div className="text-center mb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Spin for a Discount</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Win up to £800 off your next project</p>
            </div>
            <div className="transform scale-90 origin-top">
                <RandomOffer />
            </div>
        </div>
      </section>

      {/* Quick Services */}
      <section className="space-y-4 relative z-10">
        <div className="flex justify-between items-end px-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Services</h2>
            <Link to="/services" className="text-xs text-brand-600 font-medium">View All</Link>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 px-2 snap-x">
            {[
                { icon: Palette, title: 'Branding', color: 'bg-pink-100 text-pink-600' },
                { icon: Code, title: 'Web Dev', color: 'bg-blue-100 text-blue-600' },
                { icon: Zap, title: 'Growth', color: 'bg-amber-100 text-amber-600' },
            ].map((s, i) => (
                <div key={i} className="flex-shrink-0 w-32 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 snap-center flex flex-col items-center text-center gap-3 shadow-sm">
                    <div className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center`}>
                        <s.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm dark:text-white">{s.title}</span>
                </div>
            ))}
        </div>
      </section>

      {/* Recent Work Teaser */}
      <section className="space-y-4 px-2 relative z-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Work</h2>
        <div className="bg-gray-900 rounded-[2rem] p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl" />
            <div className="relative z-10">
                <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">Featured</span>
                <h3 className="text-2xl font-bold mt-2 mb-4">Verde Restaurant</h3>
                <p className="text-gray-400 text-sm mb-6">A modern dining experience with seamless reservation system.</p>
                <Link to="/portfolio" className="inline-flex items-center gap-2 text-sm font-bold hover:gap-3 transition-all">
                    View Case Study <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
}
