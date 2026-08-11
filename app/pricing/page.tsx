import PricingPage from '../../src/page-components/PricingPage';
import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

export const metadata: Metadata = {
  title: 'Pricing & Packages',
  description: 'Transparent pricing for custom web design, development, and ongoing maintenance packages.',
  alternates: {
    canonical: '/pricing/',
  },
  openGraph: {
    title: 'Pricing & Packages | Kairo Studio',
    description: 'Transparent pricing for custom web design, development, and ongoing maintenance packages.',
    url: 'https://kairostudio.co.uk/pricing/',
    siteName: 'Kairo Studio',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2940&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Kairo Studio Pricing',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing & Packages | Kairo Studio',
    description: 'Transparent pricing for custom web design, development, and ongoing maintenance packages.',
    images: ['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2940&auto=format&fit=crop'],
  },
};

export default async function Page() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  let initialPlans = null;

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data } = await supabase
      .from('pricing_plans')
      .select('*')
      .order('sort_order', { ascending: true });
      
    if (data && data.length > 0) {
      initialPlans = data;
    }
  }

  return (
    <PricingPage initialPlans={initialPlans} />
  );
}
