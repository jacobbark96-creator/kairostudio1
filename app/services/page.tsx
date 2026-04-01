import ServicesPage from '../../src/components/ServicesPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Services | Web Design & Development',
  description: 'Explore our range of digital services including custom web design, web application development, UI/UX design, and SEO optimization.',
  alternates: {
    canonical: 'https://kairostudio.co.uk/services',
  },
};

export default function Page() {
  return (
    <ServicesPage />
  );
}
