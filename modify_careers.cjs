const fs = require('fs');

let content = fs.readFileSync('src/page-components/CareersPage.tsx', 'utf8');

if (!content.includes('framer-motion')) {
  content = content.replace("import SEO from '../components/SEO';", "import SEO from '../components/SEO';\nimport { motion } from 'framer-motion';");
}

const insertMapMarker = "            {loading ? (";
const mapSection = `            {/* Global Remote Map Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-20 mt-12 relative w-full rounded-[2rem] overflow-hidden bg-gray-900 dark:bg-[#050505] border border-gray-800 p-8 sm:p-12 text-center shadow-2xl"
            >
                <div className="absolute inset-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-semibold tracking-wide text-white uppercase">Global Remote Team</span>
                </div>

                <h3 className="text-3xl sm:text-4xl font-display font-black text-white mb-4 relative z-10 tracking-tight">Work from anywhere.</h3>
                <p className="text-gray-400 text-lg max-w-xl mx-auto mb-12 relative z-10 font-light">
                  We are a remote-first company. Whether you're in a London cafe or on a beach in Bali, we care about your output, not your coordinates.
                </p>

                <div className="relative w-full max-w-4xl mx-auto aspect-[2/1] bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
                    {/* Abstract Grid Map */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                    
                    {/* Connection Lines (Abstract SVG) */}
                    <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M160 120 Q 250 80 360 160 T 640 100" stroke="url(#gradient1)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
                      <path d="M160 120 Q 250 200 240 300" stroke="url(#gradient2)" strokeWidth="1.5" strokeDasharray="4 4" />
                      <path d="M360 160 Q 450 250 640 240" stroke="url(#gradient3)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
                      <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#0ea5e9" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#0ea5e9" />
                          <stop offset="100%" stopColor="#60a5fa" />
                        </linearGradient>
                        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#38bdf8" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Glowing Nodes (Team Locations) */}
                    <div className="absolute top-[30%] left-[20%] w-3 h-3 bg-brand-500 rounded-full shadow-[0_0_20px_rgba(14,165,233,1)]">
                        <div className="absolute inset-0 w-full h-full bg-brand-500 rounded-full animate-ping opacity-75" />
                    </div>
                    <div className="absolute top-[40%] left-[45%] w-2.5 h-2.5 bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,1)]">
                        <div className="absolute inset-0 w-full h-full bg-purple-500 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }} />
                    </div>
                    <div className="absolute top-[25%] left-[80%] w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_15px_rgba(96,165,250,1)]">
                        <div className="absolute inset-0 w-full h-full bg-blue-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '1s' }} />
                    </div>
                    <div className="absolute top-[60%] left-[80%] w-3 h-3 bg-brand-400 rounded-full shadow-[0_0_20px_rgba(56,189,248,1)]">
                        <div className="absolute inset-0 w-full h-full bg-brand-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '1.5s' }} />
                    </div>
                    <div className="absolute top-[75%] left-[30%] w-2 h-2 bg-purple-400 rounded-full shadow-[0_0_15px_rgba(192,132,252,1)]">
                        <div className="absolute inset-0 w-full h-full bg-purple-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.2s' }} />
                    </div>
                    
                    <div className="absolute bottom-6 left-0 w-full text-center text-xs text-gray-500 font-mono tracking-widest uppercase bg-black/40 py-2 backdrop-blur-sm border-y border-white/5">
                        Active Remote Nodes
                    </div>
                </div>
            </motion.div>\n\n`;

content = content.replace(insertMapMarker, mapSection + insertMapMarker);

fs.writeFileSync('src/page-components/CareersPage.tsx', content);
console.log('Done mapping');
