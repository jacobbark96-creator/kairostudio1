"use client";
import { Mail, Phone, MapPin, Instagram, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';


interface FooterProps {
  logo: string;
  onShowContact: () => void;
}

export default function Footer({ logo, onShowContact }: FooterProps) {
  return (
    <footer className="py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Layout */}
        <div className="sm:hidden space-y-6">
          {/* Row 1: Quick Links & Get in Touch */}
          <div className="grid grid-cols-2 gap-6">
            {/* Quick Links */}
            <div>
              <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    href="/services"
                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about"
                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/blog"
                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={onShowContact}
                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <Link 
                    href="/portfolio"
                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200"
                  >
                    Our Work
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/dashboard"
                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200"
                  >
                    Client Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Get in Touch */}
            <div>
              <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3">
                Get in Touch
              </h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:hello@kairostudio.co.uk" className="text-xs text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200 break-all">
                    hello@kairostudio.co.uk
                  </a>
                </li>
                <li>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Glasgow | Bali | Sydney
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Row 2: Follow Us & Logo */}
          <div className="grid grid-cols-2 gap-6 items-start">
            {/* Follow Us */}
            <div>
              <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3">
                Follow Us
              </h3>
              <div className="flex gap-2 flex-wrap">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-200"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition-all duration-200"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-all duration-200"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a 
                  href="https://dribbble.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Dribbble"
                  className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-pink-500 hover:text-white transition-all duration-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.344 7.5c-.312 0-.625.031-.937.094.281-.656.5-1.344.656-2.062-.625.375-1.312.656-2.062.844.5-.625 1.125-1.188 1.812-1.656-.75.5-1.562.906-2.437 1.188-.625-.75-1.375-1.375-2.25-1.844.875.281 1.75.656 2.562 1.125-.375-.5-.812-.969-1.312-1.375C13.5 3.5 12.75 3.25 12 3.25s-1.5.25-2.188.656c-.5.406-.937.875-1.312 1.375.812-.469 1.687-.844 2.562-1.125-.875.469-1.625 1.094-2.25 1.844-.875-.281-1.687-.688-2.437-1.188.687.469 1.312 1.031 1.812 1.656-.75-.188-1.437-.469-2.062-.844.156.719.375 1.406.656 2.062-.312-.063-.625-.094-.937-.094C3.5 7.5 2.5 9.531 2.5 12s1 4.5 2.656 4.5c.312 0 .625-.031.937-.094-.281.656-.5 1.344-.656 2.062.625-.375 1.312-.656 2.062-.844-.5.625-1.125 1.188-1.812 1.656.75-.5 1.562-.906 2.437-1.188.625.75 1.375 1.375 2.25 1.844-.875-.281-1.75-.656-2.562-1.125.375.5.812.969 1.312 1.375C10.5 20.5 11.25 20.75 12 20.75s1.5-.25 2.188-.656c.5-.406.937-.875 1.312-1.375-.812.469-1.687.844-2.562 1.125.875-.469 1.625-1.094 2.25-1.844.875.281 1.687.688 2.437 1.188-.687-.469-1.312-1.031-1.812-1.656.75.188 1.437.469 2.062.844-.156-.719-.375-1.406-.656-2.062.312.063.625.094.937.094C20.5 16.5 21.5 14.469 21.5 12s-1-4.5-2.656-4.5z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Logo */}
            {logo && (
              <div className="flex justify-end">
                <div className="h-20 w-auto max-w-[140px] flex items-center justify-end">
                  <img 
                    src={logo} 
                    alt="Kairo Studio" 
                    className="h-full w-auto max-w-full object-contain opacity-90 hover:opacity-100 transition-opacity duration-300" 
                    style={{ maxHeight: '100%', width: 'auto' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10 mb-6 sm:mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-1 text-center sm:text-left">
            {logo && (
              <div className="h-16 md:h-20 lg:h-24 w-auto max-w-[200px] md:max-w-[240px] lg:max-w-[280px] flex items-center justify-center mb-3 mx-auto sm:mx-0">
                <img 
                  src={logo} 
                  alt="Kairo Studio" 
                  className="h-full w-auto max-w-full object-contain opacity-90 hover:opacity-100 transition-opacity duration-300" 
                  style={{ maxHeight: '100%', width: 'auto' }}
                />
              </div>
            )}
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs mx-auto sm:mx-0">
              Crafting digital excellence through innovative design and strategic development.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/services"
                  className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  href="/about"
                  className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog"
                  className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200"
                >
                  Blog
                </Link>
              </li>
              <li>
                <button 
                  onClick={onShowContact}
                  className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200"
                >
                  Contact
                </button>
              </li>
              <li>
                <Link 
                  href="/portfolio"
                  className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200"
                >
                  Our Work
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard"
                  className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200"
                >
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center sm:text-left">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3">
              Get in Touch
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                <a href="mailto:hello@kairostudio.co.uk" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200 break-all">
                  hello@kairostudio.co.uk
                </a>
              </li>
              <li className="flex items-center gap-2 justify-center sm:justify-start">
                <MapPin className="w-4 h-4 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Glasgow | Bali | Sydney
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="text-center sm:text-left">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3">
              Follow Us
            </h3>
            <div className="flex gap-3 justify-center sm:justify-start">
              <a 
                href="https://instagram.com/kairowebstudio" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://dribbble.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Dribbble"
                className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-pink-500 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.344 7.5c-.312 0-.625.031-.937.094.281-.656.5-1.344.656-2.062-.625.375-1.312.656-2.062.844.5-.625 1.125-1.188 1.812-1.656-.75.5-1.562.906-2.437 1.188-.625-.75-1.375-1.375-2.25-1.844.875.281 1.75.656 2.562 1.125-.375-.5-.812-.969-1.312-1.375C13.5 3.5 12.75 3.25 12 3.25s-1.5.25-2.188.656c-.5.406-.937.875-1.312 1.375.812-.469 1.687-.844 2.562-1.125-.875.469-1.625 1.094-2.25 1.844-.875-.281-1.687-.688-2.437-1.188.687.469 1.312 1.031 1.812 1.656-.75-.188-1.437-.469-2.062-.844.156.719.375 1.406.656 2.062-.312-.063-.625-.094-.937-.094C3.5 7.5 2.5 9.531 2.5 12s1 4.5 2.656 4.5c.312 0 .625-.031.937-.094-.281.656-.5 1.344-.656 2.062.625-.375 1.312-.656 2.062-.844-.5.625-1.125 1.188-1.812 1.656.75-.5 1.562-.906 2.437-1.188.625.75 1.375 1.375 2.25 1.844-.875-.281-1.75-.656-2.562-1.125.375.5.812.969 1.312 1.375C10.5 20.5 11.25 20.75 12 20.75s1.5-.25 2.188-.656c.5-.406.937-.875 1.312-1.375-.812.469-1.687.844-2.562 1.125.875-.469 1.625-1.094 2.25-1.844.875.281 1.687.688 2.437 1.188-.687-.469-1.312-1.031-1.812-1.656.75.188 1.437.469 2.062.844-.156-.719-.375-1.406-.656-2.062.312.063.625.094.937.094C20.5 16.5 21.5 14.469 21.5 12s-1-4.5-2.656-4.5z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-5 sm:pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 text-center">
            © {new Date().getFullYear()} Kairo Studio. All rights reserved.
          </p>
          <div className="hidden sm:flex justify-center gap-5 mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-500">
            <Link href="/privacy-policy" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

