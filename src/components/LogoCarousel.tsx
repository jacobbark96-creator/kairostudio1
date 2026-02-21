import React from 'react';

const Logo = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center px-4 sm:px-6 py-4 w-32 sm:w-40 h-20 sm:h-24 bg-white/0 flex-shrink-0">
    {children}
  </div>
);

export default function LogoCarousel({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  // Load logos from the appropriate theme folder
  const logoModules = import.meta.glob('../components/ClientLogos/*/*.{png,jpg,jpeg,webp,svg}', { eager: true }) as Record<string, { default: string }>;
  
  // Filter by theme folder and remove duplicates
  const logoUrls = Array.from(new Set(
    Object.entries(logoModules)
      .filter(([path]) => path.includes(`/ClientLogos/${theme}/`))
      .map(([, mod]) => mod.default)
  ));

  // Placeholder logos if no theme-specific logos found
  const placeholderLogos = [
    (
      <svg viewBox="0 0 120 40" className="w-24 h-10" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="40" rx="6" fill="#E6F6FF" />
        <text x="60" y="25" textAnchor="middle" fontSize="14" fill="#0369A1" fontWeight="700">Acme</text>
      </svg>
    ),
    (
      <svg viewBox="0 0 140 40" className="w-24 h-10" xmlns="http://www.w3.org/2000/svg">
        <rect width="140" height="40" rx="6" fill="#FEF3C7" />
        <text x="70" y="25" textAnchor="middle" fontSize="14" fill="#92400E" fontWeight="700">Orchid</text>
      </svg>
    ),
  ];

  const logos = logoUrls.length > 0 ? logoUrls : placeholderLogos;

  return (
    <section className="py-10 sm:py-12 md:py-16" aria-label="Trusted by clients">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-center text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6 sm:mb-8">Trusted by</h3>

        <div className="relative md:overflow-hidden">
          <div className="marquee will-change-transform" aria-hidden="false">
            <div className="marquee__inner flex" role="list">
              {logos.map((logo: string | React.ReactNode, i: number) => (
                <Logo key={`logo-${i}`}>
                  {typeof logo === 'string' ? (
                    <img src={logo} alt={`client logo ${i + 1}`} className="h-12 sm:h-14 md:h-16 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300" />
                  ) : (
                    logo
                  )}
                </Logo>
              ))}
              {/* Duplicate logos for seamless marquee loop - only if we have logos */}
              {logos.length > 0 && logos.map((logo: string | React.ReactNode, i: number) => (
                <Logo key={`logo-dup-${i}`}>
                  {typeof logo === 'string' ? (
                    <img src={logo} alt={`client logo ${i + 1} (duplicate)`} className="h-12 sm:h-14 md:h-16 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300" />
                  ) : (
                    logo
                  )}
                </Logo>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
