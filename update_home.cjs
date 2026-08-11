const fs = require('fs');

let content = fs.readFileSync('src/page-components/HomePage.tsx', 'utf8');

// 1. Add marqueeProjects state and fetch
if (!content.includes('marqueeProjects')) {
  const stateInjection = `  const [marqueeProjects, setMarqueeProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchMarquee = async () => {
      const { data } = await supabase.from('projects').select('id, client_name, logo_url, image_url').eq('show_in_marquee', true);
      if (data) setMarqueeProjects(data);
    };
    fetchMarquee();
  }, []);

`;
  content = content.replace("export default function HomePage() {\n", "export default function HomePage() {\n" + stateInjection);
}

// 2. Add Infinite Marquee right below the Hero Section closing tag
const heroEndMarker = "</section>";
// We want to find the first </section> which closes the hero section
const indexOfHeroEnd = content.indexOf(heroEndMarker);

const marqueeSection = `
      {/* Infinite Tech-Stack & Partner Marquee */}
      <section className="py-12 border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#050505]/50 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-gray-50 dark:from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-50 dark:from-[#050505] to-transparent z-10 pointer-events-none" />
        
        <div className="flex flex-col gap-10">
          {/* Tech Stack Marquee */}
          <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite] opacity-60 dark:opacity-40 hover:opacity-100 transition-opacity duration-300">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-16 mx-8">
                <span className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200">React</span>
                <span className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200">Next.js</span>
                <span className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200">TailwindCSS</span>
                <span className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200">TypeScript</span>
                <span className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200">Supabase</span>
                <span className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200">Stripe</span>
                <span className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200">Vercel</span>
                <span className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200">Framer Motion</span>
              </div>
            ))}
          </div>

          {/* Client Logos Marquee (Only shows if projects exist) */}
          {marqueeProjects.length > 0 && (
            <div className="flex whitespace-nowrap animate-[marquee_40s_linear_infinite_reverse] opacity-70 hover:opacity-100 transition-opacity duration-300">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-16 mx-8">
                  {marqueeProjects.map((p: any) => (
                    <div key={p.id} className="flex items-center gap-4">
                      {p.logo_url || p.image_url ? (
                        <img src={p.logo_url || p.image_url} alt={p.client_name} className="h-10 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                      ) : (
                        <span className="text-xl font-bold text-gray-600 dark:text-gray-400">{p.client_name}</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
`;

if (!content.includes('Infinite Tech-Stack & Partner Marquee')) {
  content = content.slice(0, indexOfHeroEnd + heroEndMarker.length) + marqueeSection + content.slice(indexOfHeroEnd + heroEndMarker.length);
}

// 3. Add tailwind keyframes to globals.css
let css = fs.readFileSync('src/index.css', 'utf8');
if (!css.includes('marquee {')) {
  const keyframes = `
@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-100%); }
}
`;
  fs.writeFileSync('src/index.css', css + keyframes);
}

fs.writeFileSync('src/page-components/HomePage.tsx', content);
console.log('Marquee added');
