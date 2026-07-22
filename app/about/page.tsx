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
        url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20digital%20agency%20team%20working%20on%20innovative%20projects%20modern%20office%20abstract%20style%20dark%20aesthetic&image_size=landscape_16_9',
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
    images: ['https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20digital%20agency%20team%20working%20on%20innovative%20projects%20modern%20office%20abstract%20style%20dark%20aesthetic&image_size=landscape_16_9'],
  },
};

export default function Page() {
  return (
    <AboutPage />
  );
}
