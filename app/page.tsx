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
  description: 'Award-winning digital agency specializing in custom web design, high-performance web applications, SEO optimization, and scalable digital products for modern brands.',
  openGraph: {
    title: 'Kairo Studio | High-Performance Digital Solutions',
    description: 'Award-winning digital agency specializing in custom web design, high-performance web applications, and scalable digital products.',
    url: 'https://kairostudio.co.uk',
    siteName: 'Kairo Studio',
    images: [
      {
        url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=premium%20digital%20agency%20hero%20image%20with%20abstract%20tech%20elements%20glassmorphism%20dark%20aesthetic%20sleek%20modern%20design&image_size=landscape_16_9',
        width: 1200,
        height: 630,
        alt: 'Kairo Studio - Digital Agency',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kairo Studio | High-Performance Digital Solutions',
    description: 'Award-winning digital agency specializing in custom web design and high-performance web applications.',
    images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=premium%20digital%20agency%20hero%20image%20with%20abstract%20tech%20elements%20glassmorphism%20dark%20aesthetic%20sleek%20modern%20design&image_size=landscape_16_9'],
  },
};

export default function Page() {
  return (
    <HomePage />
  );
}
