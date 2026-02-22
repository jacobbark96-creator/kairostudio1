import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  // Load logos for both themes
  const lightLogoModules = import.meta.glob('../Logo/light/*.{png,jpg,jpeg,webp,svg}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  const darkLogoModules = import.meta.glob('../Logo/*.{png,jpg,jpeg,webp,svg}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  
  const lightLogos = Object.values(lightLogoModules || {});
  const darkLogos = Object.values(darkLogoModules || {});
  
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
  }, [location]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

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
              ? 'glass shadow-lg shadow-black/5 bg-white/80 dark:bg-dark-surface/80 px-4 py-2' 
              : 'bg-transparent px-0'
          }`}>
            <div className="flex items-center justify-between">
            <Link 
              to="/"
              className="cursor-pointer flex-shrink-0 flex items-center group"
            >
              {kairoLogo && (
                <div className="h-20 sm:h-24 w-auto flex items-center justify-center overflow-hidden">
                  <img 
                    src={kairoLogo} 
                    alt="Kairo Studio" 
                    className="h-full w-auto object-contain object-left transition-transform duration-500 group-hover:scale-105" 
                  />
                </div>
              )}
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/dashboard"
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
              className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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

          {/* Mobile Menu */}
          <div className={`md:hidden fixed inset-0 z-40 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-xl transition-transform duration-500 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="flex flex-col items-center justify-center h-full gap-8 p-8">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl font-display font-bold text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                Client Portal
              </Link>
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-2xl font-display font-bold text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-2"
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              <button
                onClick={() => {
                  openContactModal();
                  setMobileMenuOpen(false);
                }}
                className="px-8 py-4 bg-brand-600 text-white rounded-full text-xl font-bold shadow-xl hover:scale-105 transition-transform"
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
        logo={kairoLogo}
        onShowContact={() => openContactModal()}
      />

      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={closeContactModal} 
        lockedSubject={contactModalPreill}
      />
    </div>
  );
}

