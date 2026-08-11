import FranchisePage from '../../src/page-components/FranchisePage';

export const metadata = {
  title: 'Franchise',
  description: 'Become your own boss. Open your own Kairo Studio office and work remotely with full training and unlimited support.',
  alternates: {
    canonical: '/franchise/',
  },
  openGraph: {
    title: 'Franchise | Kairo Studio',
    description: 'Become your own boss. Open your own Kairo Studio office and work remotely with full training and unlimited support.',
    url: 'https://kairostudio.co.uk/franchise/',
    siteName: 'Kairo Studio',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Kairo Studio Franchise',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Franchise | Kairo Studio',
    description: 'Become your own boss. Open your own Kairo Studio office and work remotely with full training and unlimited support.',
    images: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop'],
  },
};

export default function Page() {
  return <FranchisePage />;
}
