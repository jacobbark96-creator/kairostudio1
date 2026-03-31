"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import lightLogoImg from '../Logo/light/colored-logo.png';
import darkLogoImg from '../Logo/kairologo-nbg.png';
import { usePathname } from 'next/navigation';

import { Menu, X } from 'lucide-react';
import Footer from './Footer';
import ContactModal from './ContactModal';
import { useTheme } from '../hooks/useTheme';
import { useUI } from '../context/UIContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isContactModalOpen, openContactModal, closeContactModal, contactModalPreill } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const lightLogos = [lightLogoImg.src || lightLogoImg];
  const darkLogos = [darkLogoImg.src || darkLogoImg];
  
  const kairoLogo = (theme === 'light' && lightLogos.length > 0 ? lightLogos[0] : darkLogos[0]) || '';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-brand-50/50 dark:bg-dark-bg text-gray-900 dark:text-gray-100 selection:bg-brand-500/30">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-2 sm:py-3'
            : 'py-4 sm:py-6'
        }`}
      >
        <div className={`mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          scrolled ? 'max-w-7xl' : 'max-w-7xl'
        }`}>
          <div className={`rounded-2xl transition-all duration-300 ${
            scrolled 
              ? 'glass shadow-lg shadow-black/5 bg-white dark:bg-dark-surface sm:bg-white/80 sm:dark:bg-dark-surface/80 px-4 py-2' 
              : 'bg-transparent px-0'
          }`}>
            <div className="flex items-center justify-between relative">
            
            {/* Logo - Centered on Mobile, Left on Desktop */}
            <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 z-50">
              <Link 
                href="/"
                className="cursor-pointer flex-shrink-0 flex items-center group"
                onClick={() => setMobileMenuOpen(false)}
              >
                {kairoLogo && (
                  <div className="h-20 sm:h-24 w-auto flex items-center justify-center">
                    <img 
                      src={typeof kairoLogo === 'string' ? kairoLogo : (kairoLogo as any).src} 
                      alt="Kairo Studio" 
                      className="h-full w-auto object-contain object-left transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                )}
              </Link>
            </div>

            {/* Empty div to balance flex on mobile */}
            <div className="w-10 h-10 md:hidden"></div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/services"
                className="px-5 py-2 text-sm font-medium rounded-full text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-white/5 transition-all duration-300"
              >
                Services
              </Link>
              <Link
                href="/portfolio"
                className="px-5 py-2 text-sm font-medium rounded-full text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-white/5 transition-all duration-300"
              >
                Portfolio
              </Link>
              <Link
                href="/pricing"
                className="px-5 py-2 text-sm font-medium rounded-full text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-white/5 transition-all duration-300"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="px-5 py-2 text-sm font-medium rounded-full text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-white/5 transition-all duration-300"
              >
                About
              </Link>
              <Link
                href="/dashboard"
                className="px-5 py-2 text-sm font-medium rounded-full text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-white/5 transition-all duration-300"
              >
                Client Portal
              </Link>
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-2" />
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                 {theme === 'dark' ? (
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                   </svg>
                 ) : (
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                   </svg>
                 )}
              </button>
              <button
                onClick={() => openContactModal()}
                className="ml-2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full hover:bg-brand-600 dark:hover:bg-brand-400 dark:hover:text-white transition-all duration-300 text-sm font-bold shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 hover:-translate-y-0.5"
              >
                Get in Touch
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 relative z-50 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            </div>
          </div>
        </div>

          {/* Mobile Menu Overlay */}
          <div className={`md:hidden fixed inset-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}>
            <div className={`flex flex-col items-center justify-center h-full gap-8 p-8 transition-all duration-700 delay-100 ${
              mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <Link
                href="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-display font-bold text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                Services
              </Link>
              <Link
                href="/portfolio"
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-display font-bold text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                Portfolio
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-display font-bold text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-display font-bold text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                About
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-display font-bold text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                Client Portal
              </Link>
              
              <div className="w-16 h-px bg-gray-200 dark:bg-gray-800 my-4"></div>

              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-xl font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
              >
                {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </button>
              
              <button
                onClick={() => {
                  openContactModal();
                  setMobileMenuOpen(false);
                }}
                className="mt-4 px-10 py-4 bg-gradient-to-r from-brand-600 to-purple-600 text-white rounded-full text-lg font-bold shadow-xl shadow-brand-500/30 hover:scale-105 transition-all duration-300"
              >
                Get in Touch
              </button>
            </div>
          </div>
      </nav>

      <main>
        {children}
      </main>

      <Footer 
        logo={typeof kairoLogo === 'string' ? kairoLogo : (kairoLogo as any).src}
        onShowContact={() => openContactModal()}
      />

      <ContactModal />
    </div>
  );
}

