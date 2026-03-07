
import React from 'react';
import { Target, Heart, Zap, Award, Sparkles, ArrowRight } from 'lucide-react';
import { useUI } from '../../context/UIContext';

export default function MobileAbout() {
  const { openContactModal } = useUI();

  return (
    <div className="space-y-12 pb-24 relative overflow-hidden z-0">
       {/* Night Sky Background - Fixed Top */}
       <div className="absolute top-0 left-0 w-full h-[70vh] -z-20 overflow-hidden">
            <img 
                src="https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=2940&auto=format&fit=crop" 
                alt="Pyramids Night Sky" 
                className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Light Mode "Fade" Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white dark:opacity-0 transition-opacity duration-500 pointer-events-none" />
            {/* Bottom Fade to Plain Background */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-dark-bg to-transparent" />
        </div>

      <div className="space-y-4 pt-12 px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-600 dark:text-brand-300 text-[10px] font-bold uppercase tracking-wider shadow-sm mx-auto">
          <Sparkles className="w-3 h-3" />
          Who We Are
        </div>
        <h1 className="text-5xl font-display font-black text-gray-900 dark:text-white tracking-tight leading-[0.9]">
            About <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">Kairo</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg font-light max-w-xs mx-auto">
            Digital craftsmen & strategic thinkers building the future.
        </p>
      </div>

      <div className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border border-white/50 dark:border-gray-800 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden mx-4 z-10">
        <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <h3 className="text-2xl font-bold mb-6 relative z-10 text-gray-900 dark:text-white">Our Story</h3>
        
        <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-light relative z-10">
             <p className="italic font-medium text-gray-800 dark:text-gray-200">
                 "We're honest. So here's the story..."
             </p>
             <p>
                 We wanted to build a website. A business. We contacted a company that was highly rated. 
                 We were told they were "the best" - and we were quoted over <strong className="text-brand-600 dark:text-brand-400">£70,000</strong> for just the first "stages".
             </p>
             <p>
                 That wasn't the end. We decided we couldn't afford that, so we went elsewhere. 
                 The next quote? <strong className="text-brand-600 dark:text-brand-400">£600,000</strong>.
             </p>
             <div className="pl-4 border-l-2 border-brand-500 py-2 my-4 bg-brand-50/50 dark:bg-brand-900/10 rounded-r-xl">
                 <p className="font-bold text-gray-900 dark:text-white italic">
                     "F@!K IT! Let's do it ourselves. I'll take online courses at the university. It'll take longer, but let's try."
                 </p>
             </div>
             <p>
                 And that's exactly what we did. Our business is going steady, but we're still disappointed to see that our negative experience is still alive and well in the industry today.
             </p>
             <p className="font-bold text-gray-900 dark:text-white text-base">
                 We're gonna kill that attitude.
             </p>
             <p>
                 No more jargon. No more confusion. No more hidden fees. No more pressure. No more stress.
             </p>
             <p>
                 We work remotely, not only because we want to work on the beach, but because it allows at least one of our team to be available 24 hours a day. Meaning no more stress calling and emailing your web manager with no response.
             </p>
             <p className="font-display font-bold text-lg text-brand-600 dark:text-brand-400 pt-2 border-t border-gray-100 dark:border-gray-800">
                 Kairo is here for you, because it was created for us.
             </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 px-4 z-10 relative">
        {[
          { label: 'Experience', value: '5+ Years', icon: Target, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Projects', value: '50+ Done', icon: Zap, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Clients', value: '30+ Happy', icon: Heart, color: 'text-pink-500 bg-pink-50 dark:bg-pink-900/20' },
          { label: 'Awards', value: '12 Won', icon: Award, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20' },
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center gap-2 shadow-sm">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${s.color}`}>
                <s.icon className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-gray-900 dark:text-white">{s.value}</span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="px-4 z-10 relative">
        <div className="bg-gradient-to-br from-brand-600 to-purple-700 rounded-[2.5rem] p-8 text-center text-white shadow-xl shadow-brand-500/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            <div className="relative z-10 space-y-6">
                <h3 className="text-2xl font-display font-bold">Ready to start?</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                    Let's discuss how we can bring your vision to life with a custom solution.
                </p>
                <button 
                    onClick={() => openContactModal()}
                    className="w-full py-4 bg-white text-black rounded-xl font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    Get in Touch
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}
