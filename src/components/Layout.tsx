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
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/"
              className="cursor-pointer flex-shrink-0 flex items-center"
            >
              {kairoLogo && (
                <div className="h-12 sm:h-16 md:h-20 lg:h-24 xl:h-28 w-auto max-w-[200px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[320px] xl:max-w-[360px] flex items-center justify-center">
                  <img 
                    src={kairoLogo} 
                    alt="Kairo Studio" 
                    className="h-full w-auto max-w-full object-contain object-left transition-all duration-300 hover:opacity-80" 
                    style={{ maxHeight: '100%', width: 'auto' }}
                  />
                </div>
              )}
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              <Link
                to="/dashboard"
                className="px-5 py-2 text-sm font-medium rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px] flex items-center"
              >
                Client Portal
              </Link>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-pressed={theme === 'dark'}
                aria-label="Toggle color scheme"
                className="relative inline-flex items-center h-9 w-14 rounded-full px-1 transition-colors duration-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 min-w-[44px] min-h-[44px]"
              >
                <span
                  className={`absolute top-1 left-1 w-7 h-7 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
                <span className="sr-only">Toggle dark mode</span>
              </button>
              <button
                onClick={() => openContactModal()}
                className="px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 bg-cyan-600 text-white rounded-full hover:bg-cyan-500 transition-all duration-300 text-sm sm:text-base font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 min-h-[44px]"
              >
                Get in Touch
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-xl animate-in slide-in-from-top-5 duration-200">
              <div className="flex flex-col gap-2 p-4">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center"
                >
                  Client Portal
                </Link>
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full"
                >
                  <span className="text-base font-medium">Theme</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{theme === 'dark' ? 'Dark' : 'Light'}</span>
                </button>
                <button
                  onClick={() => {
                    openContactModal();
                    setMobileMenuOpen(false);
                  }}
                  className="mt-2 w-full px-4 py-3.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-500 transition-all duration-300 text-base font-semibold shadow-lg active:scale-95"
                >
                  Get in Touch
                </button>
              </div>
            </div>
          )}
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

