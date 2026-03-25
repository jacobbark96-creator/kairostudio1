import BlogPost from '../../../src/components/BlogPost';
import { createClient } from '@supabase/supabase-js';

// Since this is a static export, we can't fetch from Supabase at build time if the env vars aren't available to the static generator.
// Let's fallback to allowing the client to fetch it, but provide a dummy path to satisfy the static exporter.
export function generateStaticParams() {
  return [{ slug: 'dummy-post' }];
}

export default function Page({ params }: { params: { slug: string } }) {
  return <BlogPost slug={params.slug} />;
}
