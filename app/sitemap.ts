import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://kairostudio.co.uk';
  
  // Base routes
  const routes = [
    '',
    '/about',
    '/services',
    '/portfolio',
    '/pricing',
    '/blog',
    '/careers',
    '/book',
    '/franchise',
    '/privacy-policy',
    '/terms-of-service'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch dynamic blog posts
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, created_at');

    if (posts) {
      const postRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
      
      return [...routes, ...postRoutes];
    }
  }

  // Fallback to static routes if DB fails
  return routes;
}
