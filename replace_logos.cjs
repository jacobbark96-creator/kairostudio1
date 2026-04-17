const fs = require('fs');

let content = fs.readFileSync('src/page-components/HomePage.tsx', 'utf8');

const oldSpans = `                <span className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200">React</span>
                <span className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200">Next.js</span>
                <span className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200">TailwindCSS</span>
                <span className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200">TypeScript</span>
                <span className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200">Supabase</span>
                <span className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200">Stripe</span>
                <span className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200">Vercel</span>
                <span className="text-2xl font-bold font-display text-gray-800 dark:text-gray-200">Framer Motion</span>`;

const newLogos = `                <img src="https://cdn.simpleicons.org/react/61DAFB" alt="React" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src="https://cdn.simpleicons.org/nextdotjs" alt="Next.js" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 dark:invert" />
                <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" alt="TailwindCSS" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src="https://cdn.simpleicons.org/typescript/3178C6" alt="TypeScript" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src="https://cdn.simpleicons.org/supabase/3ECF8E" alt="Supabase" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src="https://cdn.simpleicons.org/stripe/6366F1" alt="Stripe" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src="https://cdn.simpleicons.org/vercel" alt="Vercel" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 dark:invert" />
                <img src="https://cdn.simpleicons.org/framer" alt="Framer Motion" className="h-8 md:h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 dark:invert" />`;

content = content.replace(oldSpans, newLogos);

fs.writeFileSync('src/page-components/HomePage.tsx', content);
console.log('Logos replaced');
