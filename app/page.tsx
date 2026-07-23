import HomePage from '../src/page-components/HomePage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://kairostudio.co.uk'),
  alternates: {
    canonical: '/',
  },
  title: {
    absolute: 'Kairo Studio | High-Performance Digital Solutions & Web Design'
  },
  description: 'Premium digital agency specializing in custom web design, high-performance web applications, SEO optimization, and scalable digital products for modern brands.',
  openGraph: {
    title: 'Kairo Studio | High-Performance Digital Solutions',
    description: 'Premium digital agency specializing in custom web design, high-performance web applications, and scalable digital products.',
    url: 'https://kairostudio.co.uk',
    siteName: 'Kairo Studio',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Kairo Studio - Premium Digital Agency',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kairo Studio | High-Performance Digital Solutions',
    description: 'Premium digital agency specializing in custom web design and high-performance web applications.',
    images: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop'],
  },
};

export default function Page() {
  return (
    <HomePage />
  );
}
