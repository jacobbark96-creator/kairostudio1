const fs = require('fs');

let content = fs.readFileSync('src/page-components/HomePage.tsx', 'utf8');

const startMarker = "{/* Infinite Tech-Stack & Partner Marquee */}";
const endMarker = "      </section>";
const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker, startIndex) + endMarker.length;
const originalSection = content.substring(startIndex, endIndex);

const techStackSection = `      {/* Tech-Stack Marquee */}
      <section className="py-12 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#050505]/50 overflow-hidden relative flex flex-col items-center">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 dark:from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 dark:from-[#050505] to-transparent z-10 pointer-events-none" />
        
        <div className="w-full text-center mb-8 relative z-20">
           <span className="text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] bg-white/50 dark:bg-black/50 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm">
             Our Stack
           </span>
        </div>

        <div className="flex w-max animate-[marquee_30s_linear_infinite] opacity-60 dark:opacity-40 hover:opacity-100 transition-opacity duration-300">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-16 px-8">
              <img src="https://cdn.simpleicons.org/react/61DAFB" alt="React" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              <img src="https://cdn.simpleicons.org/nextdotjs" alt="Next.js" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 dark:invert" />
              <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" alt="TailwindCSS" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              <img src="https://cdn.simpleicons.org/typescript/3178C6" alt="TypeScript" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              <img src="https://cdn.simpleicons.org/supabase/3ECF8E" alt="Supabase" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              <img src="https://cdn.simpleicons.org/stripe/6366F1" alt="Stripe" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              <img src="https://cdn.simpleicons.org/vercel" alt="Vercel" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 dark:invert" />
              <img src="https://cdn.simpleicons.org/framer" alt="Framer Motion" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 dark:invert" />
            </div>
          ))}
        </div>
      </section>`;

const clientMarqueeSection = `
      {/* Client Logos Marquee */}
      {marqueeProjects.length > 0 && (
        <section className="py-16 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#050505]/50 overflow-hidden relative flex flex-col items-center">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 dark:from-[#050505] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 dark:from-[#050505] to-transparent z-10 pointer-events-none" />
          
          <div className="w-full text-center mb-10 relative z-20">
             <span className="text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] bg-white/50 dark:bg-black/50 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm">
               Trusted By
             </span>
          </div>

          <div className="flex w-max animate-[marquee_40s_linear_infinite_reverse] opacity-70 hover:opacity-100 transition-opacity duration-300">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-16 px-8">
                {marqueeProjects.map((p: any) => (
                  <div key={p.id} className="flex items-center gap-4">
                    {p.logo_url || p.image_url ? (
                      <img src={p.logo_url || p.image_url} alt={p.client_name} className="h-16 md:h-20 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                    ) : (
                      <span className="text-2xl md:text-3xl font-bold text-gray-600 dark:text-gray-400">{p.client_name}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      )}
`;

content = content.replace(originalSection, techStackSection);

const codeCanvasEndMarker = "Code-to-Canvas Interactive Section";
const codeCanvasStartIndex = content.indexOf(codeCanvasEndMarker);
if(codeCanvasStartIndex !== -1) {
    const sectionEndIndex = content.indexOf("</section>", codeCanvasStartIndex);
    if(sectionEndIndex !== -1) {
        content = content.substring(0, sectionEndIndex + 10) + "\n" + clientMarqueeSection + content.substring(sectionEndIndex + 10);
    }
}

let css = fs.readFileSync('src/index.css', 'utf8');
if (css.includes('transform: translateX(-100%);')) {
  css = css.replace('transform: translateX(-100%);', 'transform: translateX(-50%);');
  fs.writeFileSync('src/index.css', css);
}

fs.writeFileSync('src/page-components/HomePage.tsx', content);
console.log('Carousels updated');
