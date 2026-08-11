const fs = require('fs');
let content = fs.readFileSync('src/components/AboutPage.tsx', 'utf8');

// 1. Add imports
if (!content.includes('DeveloperTerminal')) {
  content = content.replace("import SEO from './SEO';", "import SEO from './SEO';\nimport DeveloperTerminal from './DeveloperTerminal';\nimport HolographicCard from './HolographicCard';");
}

// 2. Add state for terminal mode
if (!content.includes('isTerminalMode')) {
  content = content.replace("export default function AboutPage() {", "export default function AboutPage() {\n  const [isTerminalMode, setIsTerminalMode] = useState(false);");
}

// 3. Add DeveloperTerminal
const statsEndMarker = "      </section>";
const statsEndIndex = content.indexOf(statsEndMarker, content.indexOf("2. STATS BENTO WITH LIVE METRIC TICKERS")) + statsEndMarker.length;

const terminalInjection = `\n\n      {/* 2.5 DEVELOPER TERMINAL */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-20">
        <DeveloperTerminal onModeChange={setIsTerminalMode} />
      </section>\n`;

if (!content.includes('2.5 DEVELOPER TERMINAL')) {
  content = content.substring(0, statsEndIndex) + terminalInjection + content.substring(statsEndIndex);
}

// 4. Wrap rest of page in {!isTerminalMode && ( ... )}
const manifestoStartMarker = "      {/* 3. THE MANIFESTO (ORIGIN STORY) */}";
const manifestoStartIndex = content.indexOf(manifestoStartMarker);
const mainEndMarker = "    </div>";
const mainEndIndex = content.lastIndexOf(mainEndMarker);

if (content.indexOf("{!isTerminalMode && (") === -1 && manifestoStartIndex !== -1) {
  content = content.substring(0, manifestoStartIndex) + "      {!isTerminalMode && (\n        <>\n" + content.substring(manifestoStartIndex, mainEndIndex) + "        </>\n      )}\n" + content.substring(mainEndIndex);
}

// 5. Replace Manifesto with Apple Sticky Scroll
const oldManifestoStart = "      {/* 3. THE MANIFESTO (ORIGIN STORY) */}";
const oldManifestoEnd = "      </section>";
let oldMStartIndex = content.indexOf(oldManifestoStart);
if (oldMStartIndex !== -1) {
  let oldMEndIndex = content.indexOf(oldManifestoEnd, oldMStartIndex) + oldManifestoEnd.length;
  const oldManifesto = content.substring(oldMStartIndex, oldMEndIndex);

  const newManifesto = `      {/* 3. THE MANIFESTO (APPLE STICKY SCROLL) */}
      <section className="py-24 sm:py-32 relative overflow-visible">
        {/* Faint Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start relative">
            
            {/* Sticky Visual Side */}
            <div className="hidden lg:block sticky top-32 h-[calc(100vh-16rem)] flex flex-col justify-center">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-500/20 to-purple-500/20 rounded-[3rem] blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="absolute inset-0 bg-white/5 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-[3rem] backdrop-blur-3xl shadow-2xl flex items-center justify-center overflow-hidden">
                  <div className="absolute w-[200%] h-[200%] bg-gradient-to-br from-brand-400/20 via-transparent to-purple-500/20 animate-[spin_10s_linear_infinite]" />
                  <div className="relative z-10 w-32 h-32 rounded-full border border-white/20 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-brand-500 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Scrolling Text Side */}
            <div className="space-y-12 sm:space-y-16 pb-32 pt-16">
              <div>
                <h2 className="text-sm font-bold tracking-widest text-brand-500 uppercase mb-6">The Manifesto</h2>
                <h3 className="text-3xl sm:text-5xl md:text-6xl font-display font-black leading-[1.1] tracking-tighter text-gray-900 dark:text-white">
                  Driven by Passion. <br />
                  Defined by Quality.
                </h3>
              </div>

              <div className="prose prose-lg sm:prose-xl dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 font-light leading-relaxed tracking-tight">
                <p className="text-2xl sm:text-3xl text-gray-900 dark:text-white font-medium italic mb-10 border-l-4 border-brand-500 pl-6">
                    "We're honest. So here's the story..."
                </p>
                <div className="space-y-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ margin: "-20%" }} transition={{ duration: 0.6 }}>
                        We wanted to build a website. A business. We contacted a company that was highly rated. 
                        We were told they were "the best" — and we were quoted over <strong className="text-gray-900 dark:text-white font-semibold border-b-2 border-brand-500/50">£70,000</strong> for just the first "stages".
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ margin: "-20%" }} transition={{ duration: 0.6 }}>
                        That wasn't the end. We decided we couldn't afford that, so we went elsewhere. 
                        The next quote? <strong className="text-gray-900 dark:text-white font-semibold border-b-2 border-brand-500/50">£600,000</strong>.
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ margin: "-20%" }} transition={{ duration: 0.6 }}>
                        So the search continued. Stress mounted. Until the famous words arrived:
                    </motion.div>
                    
                    {/* Highlight Block */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ margin: "-20%" }} transition={{ duration: 0.6 }} className="my-12 p-8 sm:p-12 rounded-[2rem] bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 relative overflow-hidden group shadow-xl">
                      <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-brand-400 to-purple-500" />
                      <p className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-900 dark:text-white m-0 italic font-display tracking-tight leading-snug group-hover:scale-[1.02] transition-transform duration-500">
                        "F@!K IT! Let's do it ourselves. I'll take online courses at the university. It'll take longer, but let's try."
                      </p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ margin: "-20%" }} transition={{ duration: 0.6 }}>
                        And that's exactly what we did. Our business is going steady, but we're still disappointed to see that our negative experience is still alive and well in the industry today.
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ margin: "-20%" }} transition={{ duration: 0.6 }} className="text-3xl font-bold text-gray-900 dark:text-white">
                        We're gonna kill that attitude.
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ margin: "-20%" }} transition={{ duration: 0.6 }}>
                        No more jargon. No more confusion. No more hidden fees. No more pressure. No more stress.
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ margin: "-20%" }} transition={{ duration: 0.6 }}>
                        We do everything we can, including funding our time from our other ventures, to make sure that we destroy our competition in price, service, and quality.
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ margin: "-20%" }} transition={{ duration: 0.6 }}>
                        We work remotely, not only because we want to work on the beach, but because it allows at least one of our team to be available 24 hours a day. Meaning no more stress calling and emailing your web manager with no response.
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ margin: "-20%" }} transition={{ duration: 0.6 }} className="pt-12 mt-12 border-t border-gray-200 dark:border-white/10">
                      <p className="text-2xl sm:text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-500">
                          Kairo is here for you, because it was created for us.
                      </p>
                    </motion.div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>`;

  content = content.replace(oldManifesto, newManifesto);
}

// 6. Add Holographic Cards Section
const ctaMarker = "{/* 5. PREMIUM MAGNETIC CTA */}";
const ctaIndex = content.indexOf(ctaMarker);

const holographicSection = `      {/* 4.5 TEAM ROSTER (HOLOGRAPHIC CARDS) */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-white dark:bg-[#050505]">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 sm:mb-24">
            <h2 className="text-sm font-bold tracking-widest text-brand-500 uppercase mb-4">The Team</h2>
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tighter text-gray-900 dark:text-white">
              The Minds Behind the Code.
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {[
              { name: "Jake", role: "Founder & Lead Engineer", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60" },
              { name: "Sarah", role: "Head of Design", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60" },
              { name: "David", role: "Growth Strategist", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60" }
            ].map((member, i) => (
              <HolographicCard key={i} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>\n\n      `;

if (!content.includes('TEAM ROSTER (HOLOGRAPHIC CARDS)')) {
  content = content.substring(0, ctaIndex) + holographicSection + content.substring(ctaIndex);
}

fs.writeFileSync('src/components/AboutPage.tsx', content);
console.log('AboutPage updated successfully!');