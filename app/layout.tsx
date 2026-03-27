import '../src/index.css';
import { AuthProvider } from '../src/context/AuthContext';
import { ThemeProvider } from '../src/hooks/useTheme';
import { UIProvider } from '../src/context/UIContext';
import RootWrapper from './RootWrapper';
import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://kairostudio.com'),
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
    url: 'https://kairostudio.com',
    title: 'Kairo Studio | High-Performance Digital Solutions',
    description: 'Award-winning digital agency specializing in custom web design, high-performance web applications, and scalable digital products.',
    siteName: 'Kairo Studio',
    images: [
      {
        url: '/og-image.jpg', // You should place an og-image.jpg in the public folder
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
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
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
    image: 'https://kairostudio.com/og-image.jpg',
    url: 'https://kairostudio.com',
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
