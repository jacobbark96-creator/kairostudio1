import AIPage from '../../src/components/AIPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Custom AI Agents | Kairo Studio',
  description: 'Hire custom AI agents for your business. From 24/7 AI receptionists to automated sales staff and lead generation—all for one monthly fee.',
  alternates: {
    canonical: '/ai/',
  },
  openGraph: {
    title: 'Custom AI Agents | Kairo Studio',
    description: 'Hire custom AI agents for your business. From 24/7 AI receptionists to automated sales staff and lead generation—all for one monthly fee.',
    url: 'https://kairostudio.co.uk/ai/',
    siteName: 'Kairo Studio',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2940&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Custom AI Agents by Kairo Studio',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Custom AI Agents | Kairo Studio',
    description: 'Hire custom AI agents for your business. From 24/7 AI receptionists to automated sales staff and lead generation—all for one monthly fee.',
    images: ['https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2940&auto=format&fit=crop'],
  },
};

export default function Page() {
  return <AIPage />;
}