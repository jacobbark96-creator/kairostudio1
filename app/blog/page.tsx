import BlogList from '../../src/components/BlogList';
import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog & Insights',
  description: 'Read the latest insights, tutorials, and case studies on web design, development, and digital strategy from the Kairo Studio team.',
  alternates: {
    canonical: '/blog/',
  },
  openGraph: {
    title: 'Blog & Insights | Kairo Studio',
    description: 'Read the latest insights, tutorials, and case studies on web design, development, and digital strategy from the Kairo Studio team.',
    url: 'https://kairostudio.co.uk/blog/',
    siteName: 'Kairo Studio',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2940&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Kairo Studio Blog',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog & Insights | Kairo Studio',
    description: 'Read the latest insights, tutorials, and case studies on web design, development, and digital strategy from the Kairo Studio team.',
    images: ['https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2940&auto=format&fit=crop'],
  },
};

export default async function Page() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  let initialPosts = null;

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
      
    if (data && data.length > 0) {
      initialPosts = data;
    }
  }

  return <BlogList initialPosts={initialPosts} />;
}
