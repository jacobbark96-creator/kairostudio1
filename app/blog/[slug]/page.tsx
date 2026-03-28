import BlogPost from '../../../src/components/BlogPost';
import { createClient } from '@supabase/supabase-js';
import { Metadata } from 'next';

export const dynamicParams = false;

// Generate metadata dynamically for each blog post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return { title: 'Blog Post' };
  }
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, image_url, created_at, updated_at')
    .eq('slug', params.slug)
    .single();

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://kairostudio.co.uk/blog/${params.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.created_at,
      modifiedTime: post.updated_at || post.created_at,
      images: [
        {
          url: post.image_url,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image_url],
    },
  };
}

// Since this is a static export, we can't fetch from Supabase at build time if the env vars aren't available to the static generator.
// Let's fallback to allowing the client to fetch it, but provide a dummy path to satisfy the static exporter.
export function generateStaticParams() {
  // We need to return an array of all possible slugs so Next.js knows what to build.
  // We'll include the mock post slug so it works out of the box.
  return [
    { slug: 'custom-web-design-vs-templates' },
    { slug: 'dummy-post' }
  ];
}

export default function Page({ params }: { params: { slug: string } }) {
  return <BlogPost slug={params.slug} />;
}
