const fs = require('fs');

let content = fs.readFileSync('src/page-components/HomePage.tsx', 'utf8');

// 1. Insert "Code-to-Canvas" Section right above the Mobile "Selected Work" section
const codeToCanvasSection = `
      {/* Code-to-Canvas Interactive Section */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-sm font-bold tracking-widest text-brand-500 uppercase mb-4">How We Build</h2>
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tighter text-gray-900 dark:text-white mb-6">
              Code to Canvas.
            </h3>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
              We bridge the gap between complex engineering and beautiful design, creating pixel-perfect interfaces powered by robust logic.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-stretch max-w-6xl mx-auto">
            {/* The Code Side */}
            <div className="rounded-3xl bg-[#0d1117] border border-gray-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                <span className="ml-2 text-xs font-mono text-gray-500">HeroSection.tsx</span>
              </div>
              <div className="font-mono text-sm sm:text-base leading-relaxed overflow-x-auto text-gray-300">
                <div className="flex"><span className="text-purple-400 mr-2">import</span><span>{'{'} motion {'}'}</span><span className="text-purple-400 ml-2">from</span><span className="text-green-400 ml-2">'framer-motion'</span><span>;</span></div>
                <div className="flex mt-4"><span className="text-purple-400 mr-2">export default function</span><span className="text-blue-400">Hero</span><span>() {'{'}</span></div>
                <div className="flex ml-4 mt-2"><span className="text-purple-400 mr-2">return</span><span>(</span></div>
                <div className="flex ml-8 mt-2"><span>&lt;</span><span className="text-red-400">motion.div</span></div>
                <div className="flex ml-12"><span className="text-orange-300">initial</span><span>=</span><span className="text-blue-300">{{'{'}{'{'}</span><span> opacity: </span><span className="text-orange-400">0</span><span>, y: </span><span className="text-orange-400">20</span><span> </span><span className="text-blue-300">{'}'}{'}'}</span></div>
                <div className="flex ml-12"><span className="text-orange-300">animate</span><span>=</span><span className="text-blue-300">{{'{'}{'{'}</span><span> opacity: </span><span className="text-orange-400">1</span><span>, y: </span><span className="text-orange-400">0</span><span> </span><span className="text-blue-300">{'}'}{'}'}</span></div>
                <div className="flex ml-12"><span className="text-orange-300">className</span><span>=</span><span className="text-green-400">"text-6xl font-black"</span></div>
                <div className="flex ml-8"><span>&gt;</span></div>
                <div className="flex ml-12 text-white">Digital Excellence</div>
                <div className="flex ml-8"><span>&lt;/</span><span className="text-red-400">motion.div</span><span>&gt;</span></div>
                <div className="flex ml-4"><span>);</span></div>
                <div className="flex"><span>{'}'}</span></div>
                
                {/* Simulated typing cursor */}
                <div className="w-2 h-5 bg-brand-400 animate-pulse mt-4" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent opacity-50" />
            </div>

            {/* The Canvas Side */}
            <div className="rounded-3xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center group">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-500/20 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 mb-6 shadow-sm">
                  <Sparkles className="w-4 h-4 text-brand-500" />
                  <span className="text-xs font-semibold tracking-wide text-gray-900 dark:text-white uppercase">Live Preview</span>
                </div>
                <h3 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-gray-900 dark:text-white tracking-tighter drop-shadow-sm">
                  Digital Excellence
                </h3>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
`;

const insertMarker = `<section className="py-16 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden block md:hidden">`;
if (!content.includes('Code to Canvas.')) {
  content = content.replace(insertMarker, codeToCanvasSection + "\n" + insertMarker);
}

// 2. Add X-Ray Spotlight to Services Cards
// We need to add mouse tracking for the services grid
const stateHookMarker = "const [marqueeProjects, setMarqueeProjects] = useState<any[]>([]);";
const mouseTrackingHooks = `
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleServicesMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
`;

if (!content.includes('handleServicesMouseMove')) {
  content = content.replace(stateHookMarker, mouseTrackingHooks + "\n  " + stateHookMarker);
}

// Update the Services Grid wrapper to track mouse
const gridMarker = '<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">';
const newGridMarker = '<div \n            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 group/grid"\n            onMouseMove={handleServicesMouseMove}\n          >';

content = content.replace(gridMarker, newGridMarker);

// Add the hover radial gradient to the cards
const cardContentMarker = '<div className="mb-8">';
const xrayGlow = `
                {/* X-Ray Hover Glow */}
                <motion.div
                  className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover/grid:opacity-100 hidden sm:block"
                  style={{
                    background: useTransform(
                      [mouseX, mouseY],
                      ([x, y]) => \`radial-gradient(400px circle at \${x}px \${y}px, rgba(14, 165, 233, 0.15), transparent 40%)\`
                    )
                  }}
                />
                <motion.div
                  className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover/grid:opacity-100 hidden sm:block mix-blend-overlay"
                  style={{
                    background: useTransform(
                      [mouseX, mouseY],
                      ([x, y]) => \`radial-gradient(400px circle at \${x}px \${y}px, rgba(255, 255, 255, 0.1), transparent 40%)\`
                    )
                  }}
                />
                
                <div className="relative z-10 mb-8">
`;
// Replace the exact icon wrapper div to include the glow before it
// Notice we changed `<div className="mb-8">` to `<div className="relative z-10 mb-8">`
// We also need to add `relative z-10` to the other card children so they appear above the glow

content = content.replace(/<div className="mb-8">\n\s*<service.icon/g, xrayGlow + '\n                  <service.icon');

// Also update the heading and paragraph to have `relative z-10`
content = content.replace(/<h3 className="text-2xl font-display font-bold mb-3 text-gray-900 dark:text-white">/g, '<h3 className="relative z-10 text-2xl font-display font-bold mb-3 text-gray-900 dark:text-white">');
content = content.replace(/<p className="text-gray-500 dark:text-gray-400 font-medium text-base leading-relaxed mb-8 flex-grow">/g, '<p className="relative z-10 text-gray-500 dark:text-gray-400 font-medium text-base leading-relaxed mb-8 flex-grow">');
content = content.replace(/<div className="mt-auto flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white transition-all">/g, '<div className="relative z-10 mt-auto flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white transition-all">');


fs.writeFileSync('src/page-components/HomePage.tsx', content);
console.log('Features added');
