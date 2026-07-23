import AboutPage from '../../src/components/AboutPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Our London Web Design Agency',
  description: 'Learn about Kairo Studio, a leading UK web design agency with offices in London and Manchester, building high-performance digital solutions globally.',
  alternates: {
    canonical: '/about/',
  },
  openGraph: {
    title: 'About Us | Kairo Studio',
    description: 'Learn about Kairo Studio, our mission, and the expert team building high-performance digital solutions.',
    url: 'https://kairostudio.co.uk/about/',
    siteName: 'Kairo Studio',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'About Kairo Studio',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Kairo Studio',
    description: 'Learn about Kairo Studio, our mission, and the expert team building high-performance digital solutions.',
    images: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop'],
  },
};

export default function Page() {
  return (
    <AboutPage />
  );
}
