import PortfolioPage from '../../src/components/PortfolioPage';
import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Work & Case Studies',
  description: 'View our portfolio of premium websites, applications, and digital products built by Kairo Studio.',
  alternates: {
    canonical: '/portfolio/',
  },
  openGraph: {
    title: 'Our Work & Case Studies | Kairo Studio',
    description: 'View our portfolio of premium websites, applications, and digital products built by Kairo Studio.',
    url: 'https://kairostudio.co.uk/portfolio/',
    siteName: 'Kairo Studio',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2940&auto=format&fit=crop',
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
    description: 'View our portfolio of premium websites, applications, and digital products built by Kairo Studio.',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2940&auto=format&fit=crop'],
  },
};

export default async function Page() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  let initialProjects = null;

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (data && data.length > 0) {
      initialProjects = data;
    }
  }

  return (
    <PortfolioPage initialProjects={initialProjects} />
  );
}
