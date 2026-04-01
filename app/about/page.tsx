import AboutPage from '../../src/components/AboutPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Kairo Studio, our mission, and the expert team building high-performance digital solutions.',
  alternates: {
    canonical: 'https://kairostudio.co.uk/about',
  },
};

export default function Page() {
  return (
    <AboutPage />
  );
}
