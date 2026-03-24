"use client";
import React from 'react';
import { useTheme } from '../hooks/useTheme';
import lightLogo from './ClientLogos/light/logohyro-removebg-preview.png';
import darkLogo from './ClientLogos/dark/white_nobb.png';

const Logo = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center px-4 sm:px-6 py-4 w-32 sm:w-40 h-20 sm:h-24 bg-white/0 flex-shrink-0">
    {children}
  </div>
);

export default function LogoCarousel({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
  const isDark = theme === 'dark';
  const logos = [(isDark ? darkLogo : lightLogo) as any];

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
