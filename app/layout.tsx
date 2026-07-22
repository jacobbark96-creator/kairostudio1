import '../src/index.css';
import { AuthProvider } from '../src/context/AuthContext';
import { ThemeProvider } from '../src/hooks/useTheme';
import { UIProvider } from '../src/context/UIContext';
import RootWrapper from './RootWrapper';
import React from 'react';

import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://kairostudio.co.uk'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: 'Kairo Studio | Web Design Agency London | High-Performance Digital Solutions',
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
    google: 'II9v7duCgzQQFJH6VhiUIaHhLansF0JXZ4vd88sYOCk',
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
    '@type': 'LocalBusiness',
    name: 'Kairo Studio',
    alternateName: 'Kairo Studio Web Design',
    description: 'Award-winning digital agency specializing in custom web design, high-performance web applications, SEO optimization, and scalable digital products for modern brands.',
    url: 'https://kairostudio.co.uk',
    logo: 'https://kairostudio.co.uk/icon.png',
    image: 'https://kairostudio.co.uk/icon.png',
    email: 'hello@kairostudio.co.uk',
    telephone: '0161 224 5044',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '20 Wenlock Road',
      addressLocality: 'London',
      postalCode: 'N1 7GU',
      addressCountry: 'GB'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 51.5297,
      longitude: -0.0886
    },
    branchOf: {
      '@type': 'Organization',
      name: 'Kairo Studio',
      location: [
        {
          '@type': 'LocalBusiness',
          name: 'Kairo Studio Manchester',
          address: {
            '@type': 'PostalAddress',
            streetAddress: '11 King Street',
            addressLocality: 'Manchester',
            postalCode: 'M2 4AH',
            addressCountry: 'GB'
          }
        }
      ]
    },
    sameAs: [
      'https://instagram.com/kairowebstudio',
      'https://linkedin.com/company/kairo-studio',
      'https://github.com/kairostudio',
      'https://dribbble.com/kairostudio'
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18287243813"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4QHDY6WV7H');
              gtag('config', 'AW-18287243813');
            `,
          }}
        />
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
