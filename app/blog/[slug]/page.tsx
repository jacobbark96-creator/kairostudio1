import BlogPost from '../../../src/components/BlogPost';
import { createClient } from '@supabase/supabase-js';
import { Metadata } from 'next';

export const dynamicParams = true;

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
    // Check if it's one of the mock posts
    const mockPost = {
      'custom-web-design-vs-templates': {
        title: 'Why Custom Web Design Outperforms Templates Every Time',
        excerpt: 'Discover why investing in a custom-built website yields higher conversion rates and better brand perception than off-the-shelf templates.',
        image_url: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2000&auto=format&fit=crop',
      }
    }[params.slug];

    if (mockPost) {
      return {
        title: `${mockPost.title} | Kairo Blog`,
        description: mockPost.excerpt,
        alternates: {
          canonical: `/blog/${params.slug}/`,
        },
        openGraph: {
          title: mockPost.title,
          description: mockPost.excerpt,
          url: `/blog/${params.slug}/`,
          images: [{ url: mockPost.image_url }],
        }
      };
    }

    return {
      title: 'Post Not Found | Kairo Studio',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://kairostudio.co.uk/blog/${params.slug}/`,
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

export async function generateStaticParams() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    return [
      { slug: 'custom-web-design-vs-templates' },
      { slug: 'dummy-post' }
    ];
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('published', true);

  if (error || !posts || posts.length === 0) {
    return [
      { slug: 'custom-web-design-vs-templates' },
      { slug: 'dummy-post' }
    ];
  }

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    return <BlogPost post={null} slug={params.slug} />;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .single();

  return <BlogPost post={post || null} slug={params.slug} />;
}
