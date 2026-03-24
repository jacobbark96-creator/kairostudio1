"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { supabase } from '../lib/supabase';
import SEO from './SEO';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  created_at: string;
  reading_time: string;
}

const MOCK_POSTS: Record<string, BlogPost> = {
    'custom-web-design-vs-templates': {
        id: '1',
        title: 'Why Custom Web Design Outperforms Templates Every Time',
        slug: 'custom-web-design-vs-templates',
        excerpt: 'Discover why investing in a custom-built website yields higher conversion rates and better brand perception than off-the-shelf templates.',
        content: `
When building a new website, the temptation to use a pre-made template is strong. They're cheap, fast to deploy, and look "good enough." But in today's hyper-competitive digital landscape, "good enough" rarely cuts it.

Here is why custom web design consistently outperforms templates:

### 1. Brand Authenticity
Templates force your brand to fit into a pre-existing box. A custom website is built around your brand's unique identity, voice, and goals. It ensures that your online presence is a true reflection of your business, not a generic copy of a thousand other sites.

### 2. Tailored User Experience (UX)
Every business has different customer journeys. A custom site allows you to design specifically for your target audience, guiding them intuitively towards your desired conversion goals.

### 3. Performance and SEO
Templates are notoriously bloated with unnecessary code and features you'll never use. This slows down your site, which negatively impacts both user experience and search engine rankings. Custom sites are lean, fast, and built with technical SEO in mind from day one.

### 4. Scalability
As your business grows, your website needs to adapt. Templates often hit a wall when you need to add complex functionality. Custom sites are built on flexible architectures that can scale with you.

**Conclusion:** While templates have their place for hobbyists or absolute beginners, serious businesses need a custom digital presence to truly stand out and convert visitors into loyal customers.
        `,
        image_url: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2000&auto=format&fit=crop',
        created_at: new Date().toISOString(),
        reading_time: '5 min read'
    }
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    if (!slug) return;
    
    setLoading(true);
    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) throw error;
        
        if (data) {
            setPost(data as BlogPost);
        } else {
            setPost(MOCK_POSTS[slug] || null);
        }
    } catch (error) {
        console.log("Using mock blog post", error);
        setPost(MOCK_POSTS[slug] || null);
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
      return (
          <div className="min-h-screen flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
          </div>
      );
  }

  if (!post) {
      return (
          <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Post not found</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">The article you're looking for doesn't exist or has been removed.</p>
              <Link href="/blog" className="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-colors">
                  Back to Blog
              </Link>
          </div>
      );
  }

  return (
    <>
      <SEO 
        title={`${post.title} | Kairo Blog`} 
        description={post.excerpt} 
      />
      
      <article className="min-h-screen pt-24 pb-24 relative z-0">
        {/* Background */}
        <div className="fixed inset-0 w-full h-full -z-20 bg-gray-50 dark:bg-black pointer-events-none" />

        {/* Hero Image Header */}
        <header className="w-full h-[50vh] sm:h-[60vh] relative mb-12 sm:mb-20">
            <img 
                src={post.image_url} 
                alt={post.title} 
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/50 to-transparent dark:from-black dark:via-black/50 dark:to-transparent" />
            
            <div className="absolute bottom-0 left-0 w-full px-4 sm:px-6 lg:px-8 translate-y-1/2 sm:translate-y-1/4">
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900/90 backdrop-blur-xl p-8 sm:p-12 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/10">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-6 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Journal
                    </Link>
                    
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-gray-900 dark:text-white leading-tight mb-6">
                        {post.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {post.reading_time || '5 min read'}
                        </span>
                    </div>
                </div>
            </div>
        </header>

        {/* Article Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-12">
            <div className="prose prose-lg sm:prose-xl dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-a:text-brand-600 dark:prose-a:text-brand-400 hover:prose-a:text-brand-700 max-w-none font-light leading-relaxed text-gray-700 dark:text-gray-300">
                <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
            
            <hr className="my-16 border-gray-200 dark:border-gray-800" />
            
            <div className="bg-brand-50 dark:bg-brand-900/20 rounded-[2rem] p-8 sm:p-12 text-center border border-brand-100 dark:border-brand-800/30">
                <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">Ready to elevate your digital presence?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
                    Let's discuss how Kairo can help you achieve your goals with a custom digital solution.
                </p>
                <Link href="/" className="inline-flex px-8 py-4 bg-brand-600 text-white rounded-xl font-bold shadow-lg hover:bg-brand-700 transition-colors">
                    Start Your Project
                </Link>
            </div>
        </div>
      </article>
    </>
  );
}
