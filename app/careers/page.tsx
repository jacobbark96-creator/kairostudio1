import CareersPage from '../../src/page-components/CareersPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers | Join the Team',
  description: 'View our open positions and join the Kairo Studio team to help build the future of digital experiences.',
  alternates: {
    canonical: '/careers/',
  },
  openGraph: {
    title: 'Careers | Join the Team | Kairo Studio',
    description: 'View our open positions and join the Kairo Studio team to help build the future of digital experiences.',
    url: 'https://kairostudio.co.uk/careers/',
    siteName: 'Kairo Studio',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Kairo Studio Careers',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers | Join the Team | Kairo Studio',
    description: 'View our open positions and join the Kairo Studio team to help build the future of digital experiences.',
    images: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop'],
  },
};

export default function Page() {
  return <CareersPage />;
}
