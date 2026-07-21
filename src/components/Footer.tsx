"use client";
import { Mail, MapPin, Instagram, Linkedin, Github, Phone } from 'lucide-react';
import Link from 'next/link';

interface FooterProps {
  logo: string;
  onShowContact: () => void;
}

const FOOTER_LINKS = [
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Blog', href: '/blog' },
  { name: 'Careers', href: '/careers' },
  { name: 'Franchise', href: '/franchise' },
  { name: 'Client Portal', href: '/dashboard' },
];

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/kairowebstudio',
    icon: Instagram,
    hoverClass: 'hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500',
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/kairo-studio',
    icon: Linkedin,
    hoverClass: 'hover:bg-blue-600',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/kairostudio',
    icon: Github,
    hoverClass: 'hover:bg-gray-900',
  },
  {
    name: 'Dribbble',
    href: 'https://dribbble.com/kairostudio',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.344 7.5c-.312 0-.625.031-.937.094.281-.656.5-1.344.656-2.062-.625.375-1.312.656-2.062.844.5-.625 1.125-1.188 1.812-1.656-.75.5-1.562.906-2.437 1.188-.625-.75-1.375-1.375-2.25-1.844.875.281 1.75.656 2.562 1.125-.375-.5-.812-.969-1.312-1.375C13.5 3.5 12.75 3.25 12 3.25s-1.5.25-2.188.656c-.5.406-.937.875-1.312 1.375.812-.469 1.687-.844 2.562-1.125-.875.469-1.625 1.094-2.25 1.844-.875-.281-1.687-.688-2.437-1.188.687.469 1.312 1.031 1.812 1.656-.75-.188-1.437-.469-2.062-.844.156.719.375 1.406.656 2.062-.312-.063-.625-.094-.937-.094C3.5 7.5 2.5 9.531 2.5 12s1 4.5 2.656 4.5c.312 0 .625-.031.937-.094-.281.656-.5 1.344-.656 2.062.625-.375 1.312-.656 2.062-.844-.5.625-1.125 1.188-1.812 1.656.75-.5 1.562-.906 2.437-1.188.625.75 1.375 1.375 2.25 1.844-.875-.281-1.75-.656-2.562-1.125.375.5.812.969 1.312 1.375C10.5 20.5 11.25 20.75 12 20.75s1.5-.25 2.188-.656c.5-.406.937-.875 1.312-1.375-.812.469-1.687.844-2.562 1.125.875-.469 1.625-1.094 2.25-1.844.875.281 1.687.688 2.437 1.188-.687-.469-1.312-1.031-1.812-1.656.75.188 1.437.469 2.062.844-.156-.719-.375-1.406-.656-2.062.312.063.625.094.937.094C20.5 16.5 21.5 14.469 21.5 12s-1-4.5-2.656-4.5z" />
      </svg>
    ),
    hoverClass: 'hover:bg-pink-500',
  },
];

export default function Footer({ logo, onShowContact }: FooterProps) {
  return (
    <footer className="py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-10 md:grid-cols-4 md:gap-6 lg:gap-10 mb-8 md:mb-10">
          <div className="text-center md:text-left">
            {logo && (
              <div className="h-16 sm:h-20 lg:h-24 w-auto max-w-[220px] sm:max-w-[240px] lg:max-w-[280px] flex items-center justify-center mb-4 mx-auto md:mx-0">
                <img
                  src={logo}
                  alt="Kairo Studio"
                  className="h-full w-auto max-w-full object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
                  style={{ maxHeight: '100%', width: 'auto' }}
                />
              </div>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs mx-auto md:mx-0">
              Crafting digital excellence through innovative design and strategic development.
            </p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={onShowContact}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Get in Touch
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 justify-center md:justify-start">
                <MapPin className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 text-left">
                  <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">London (Head Office)</span>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight uppercase tracking-tighter">
                    20 Wenlock Road, London N1 7GU
                  </p>
                  <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white mt-2">Manchester</span>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight uppercase tracking-tighter">
                    11 King Street, Manchester M2 4AH
                  </p>
                </div>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Phone className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                <a
                  href="tel:01612245044"
                  className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200"
                >
                  0161 224 5044
                </a>
              </li>
              <li className="flex items-center gap-3 justify-center md:justify-start">
                <Mail className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                <a
                  href="mailto:hello@kairostudio.co.uk"
                  className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-200 break-all"
                >
                  hello@kairostudio.co.uk
                </a>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Follow Us
            </h3>
            <div className="flex gap-3 justify-center md:justify-start">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className={`w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 ${social.hoverClass} hover:text-white transition-all duration-200 hover:scale-105 active:scale-95`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-5 sm:pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
            © {new Date().getFullYear()} Kairo Studio. All rights reserved.
          </p>
          <div className="flex justify-center gap-5 mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
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
