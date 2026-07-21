import PortfolioPage from '../../src/components/PortfolioPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Work & Case Studies',
  description: 'View our portfolio of award-winning websites, applications, and digital products built by Kairo Studio.',
  alternates: {
    canonical: '/portfolio/',
  },
  openGraph: {
    title: 'Our Work & Case Studies | Kairo Studio',
    description: 'View our portfolio of award-winning websites, applications, and digital products built by Kairo Studio.',
    url: 'https://kairostudio.co.uk/portfolio',
    siteName: 'Kairo Studio',
    images: [
      {
        url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=premium%20portfolio%20showcase%20of%20web%20design%20projects%20on%20screens%20modern%20minimalist%20dark%20aesthetic%20high%20resolution&image_size=landscape_16_9',
        width: 1200,
        height: 630,
        alt: 'Kairo Studio Portfolio',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Work & Case Studies | Kairo Studio',
    description: 'View our portfolio of award-winning websites, applications, and digital products built by Kairo Studio.',
    images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=premium%20portfolio%20showcase%20of%20web%20design%20projects%20on%20screens%20modern%20minimalist%20dark%20aesthetic%20high%20resolution&image_size=landscape_16_9'],
  },
};

export default function Page() {
  return (
    <PortfolioPage />
  );
}
