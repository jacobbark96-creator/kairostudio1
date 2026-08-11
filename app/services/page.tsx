import ServicesPage from '../../src/components/ServicesPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services | Web Design & Development',
  description: 'Explore our range of digital services including custom web design, web application development, UI/UX design, and SEO optimization.',
  alternates: {
    canonical: '/services/',
  },
  openGraph: {
    title: 'Our Services | Kairo Studio',
    description: 'Explore our range of digital services including custom web design, web application development, UI/UX design, and SEO optimization.',
    url: 'https://kairostudio.co.uk/services/',
    siteName: 'Kairo Studio',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2940&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Kairo Studio Services',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Services | Kairo Studio',
    description: 'Explore our range of digital services including custom web design, web application development, UI/UX design, and SEO optimization.',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2940&auto=format&fit=crop'],
  },
};

export default function Page() {
  return (
    <ServicesPage />
  );
}
