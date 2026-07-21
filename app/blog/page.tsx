import BlogList from '../../src/components/BlogList';
import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

export const metadata: Metadata = {
  title: 'Blog & Insights',
  description: 'Read the latest insights, tutorials, and case studies on web design, development, and digital strategy from the Kairo Studio team.',
  alternates: {
    canonical: 'https://kairostudio.co.uk/blog/',
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
