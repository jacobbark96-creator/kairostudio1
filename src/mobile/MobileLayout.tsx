
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Layers, Grid, User, Menu, X, Rocket } from 'lucide-react';
import { useUI } from '../context/UIContext';
import ContactModal from '../components/ContactModal';
import { useTheme } from '../hooks/useTheme';

// Import Logo
import logoNb from '../Logo/kairologo-nbg.png';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const { isContactModalOpen, closeContactModal, contactModalPreill, openContactModal } = useUI();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen pb-20">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoNb} alt="Kairo" className="h-12 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
            <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
                {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            >
                <Menu className="w-5 h-5" />
            </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 px-4 pb-24">
        {children}
      </main>

      {/* Bottom Navigation - Fixed to viewport */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 safe-area-bottom shadow-lg shadow-black/5">
        <div className="flex justify-around items-center h-16">
          <Link 
            to="/" 
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/') ? 'text-brand-600 dark:text-brand-400' : 'text-gray-500 dark:text-gray-400'}`}
          >
            <Home className={`w-6 h-6 ${isActive('/') ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          
          <Link 
            to="/services" 
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/services') ? 'text-brand-600 dark:text-brand-400' : 'text-gray-500 dark:text-gray-400'}`}
          >
            <Layers className={`w-6 h-6 ${isActive('/services') ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-medium">Services</span>
          </Link>

          {/* Center FAB - Contact/Offer */}
          <div className="relative -top-5">
            <button 
                onClick={() => openContactModal()}
                className="w-14 h-14 rounded-full bg-brand-600 text-white shadow-lg shadow-brand-500/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            >
                <Rocket className="w-6 h-6" />
            </button>
          </div>
          
          <Link 
            to="/portfolio" 
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/portfolio') ? 'text-brand-600 dark:text-brand-400' : 'text-gray-500 dark:text-gray-400'}`}
          >
            <Grid className={`w-6 h-6 ${isActive('/portfolio') ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-medium">Work</span>
          </Link>
          
          <Link 
            to="/about" 
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/about') ? 'text-brand-600 dark:text-brand-400' : 'text-gray-500 dark:text-gray-400'}`}
          >
            <User className={`w-6 h-6 ${isActive('/about') ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-medium">About</span>
          </Link>
        </div>
      </nav>

      {/* Full Screen Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white dark:bg-gray-900 animate-in slide-in-from-right duration-300">
            <div className="p-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
                <span className="font-display font-bold text-xl dark:text-white">Menu</span>
                <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800"
                >
                    <X className="w-6 h-6 dark:text-white" />
                </button>
            </div>
            <div className="p-6 space-y-6">
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-2xl font-bold dark:text-white">Client Portal</Link>
                <div className="h-px bg-gray-100 dark:bg-gray-800 my-4" />
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Quick Links</h3>
                    <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-medium dark:text-gray-300">Home</Link>
                    <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-medium dark:text-gray-300">Services</Link>
                    <Link to="/portfolio" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-medium dark:text-gray-300">Portfolio</Link>
                    <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-medium dark:text-gray-300">About Us</Link>
                    <Link to="/privacy-policy" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-medium dark:text-gray-300">Privacy Policy</Link>
                    <Link to="/terms-of-service" onClick={() => setMobileMenuOpen(false)} className="block text-lg font-medium dark:text-gray-300">Terms of Service</Link>
                </div>
            </div>
        </div>
      )}

      <ContactModal />
    </div>
  );
}
