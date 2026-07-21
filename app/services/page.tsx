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
    url: 'https://kairostudio.co.uk/services',
    siteName: 'Kairo Studio',
    images: [
      {
        url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=digital%20services%20abstract%20representation%20web%20design%20coding%20ui%20ux%20modern%20tech%20dark%20aesthetic%20high%20quality&image_size=landscape_16_9',
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
    images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=digital%20services%20abstract%20representation%20web%20design%20coding%20ui%20ux%20modern%20tech%20dark%20aesthetic%20high%20quality&image_size=landscape_16_9'],
  },
};

export default function Page() {
  return (
    <ServicesPage />
  );
}
