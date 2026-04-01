import '../src/index.css';
import { AuthProvider } from '../src/context/AuthContext';
import { ThemeProvider } from '../src/hooks/useTheme';
import { UIProvider } from '../src/context/UIContext';
import RootWrapper from './RootWrapper';
import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://kairostudio.co.uk'),
  title: {
    default: 'Kairo Studio | High-Performance Digital Solutions & Web Design',
    template: '%s | Kairo Studio'
  },
  description: 'Award-winning digital agency specializing in custom web design, high-performance web applications, SEO optimization, and scalable digital products for modern brands.',
  keywords: ['web design', 'digital agency', 'custom software development', 'SEO optimization', 'Next.js development', 'branding', 'UI/UX design'],
  authors: [{ name: 'Kairo Studio' }],
  creator: 'Kairo Studio',
  publisher: 'Kairo Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://kairostudio.co.uk',
    title: 'Kairo Studio | High-Performance Digital Solutions',
    description: 'Award-winning digital agency specializing in custom web design, high-performance web applications, and scalable digital products.',
    siteName: 'Kairo Studio',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop', // Beautiful hero image placeholder for OG graph
        width: 1200,
        height: 630,
        alt: 'Kairo Studio - Digital Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kairo Studio | High-Performance Digital Solutions',
    description: 'Award-winning digital agency specializing in custom web design and high-performance web applications.',
    creator: '@kairostudio',
    images: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code', // We can update this later when you register on Google Search Console
  },
  icons: {
    icon: [
        { url: '/favicon.ico' },
        { url: '/icon.png' }
    ],
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Kairo Studio',
    image: 'https://kairostudio.co.uk/icon.png',
    logo: 'https://kairostudio.co.uk/icon.png',
    url: 'https://kairostudio.co.uk',
    description: 'Award-winning digital agency specializing in custom web design, high-performance web applications, and scalable digital products.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'UK'
    },
    sameAs: [
      'https://twitter.com/kairostudio',
      'https://linkedin.com/company/kairo-studio'
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuthProvider>
          <ThemeProvider>
            <UIProvider>
              <RootWrapper>{children}</RootWrapper>
            </UIProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
