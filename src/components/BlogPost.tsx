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

export default function BlogPost({ post, slug }: { post: BlogPost | null, slug: string }) {
  const currentPost = post || MOCK_POSTS[slug] || null;

  if (!currentPost) {
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
        title={`${currentPost.title} | Kairo Blog`} 
        description={currentPost.excerpt} 
      />
      
      <article className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-32 pb-24 selection:bg-brand-500/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Back Link */}
            <div className="mb-10">
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white uppercase tracking-wider transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Journal
                </Link>
            </div>

            {/* Header (Title & Meta) */}
            <header className="mb-12">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-gray-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
                    {currentPost.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(currentPost.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {currentPost.reading_time || '5 min read'}
                    </span>
                </div>
            </header>

            {/* Featured Image */}
            {currentPost.image_url && (
                <div className="mb-16 rounded-3xl overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 aspect-video relative">
                    <img 
                        src={currentPost.image_url} 
                        alt={currentPost.title} 
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg md:prose-xl dark:prose-invert prose-headings:font-display prose-headings:font-black prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-relaxed prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-brand-600 dark:prose-a:text-brand-400 hover:prose-a:text-brand-700 prose-img:rounded-3xl prose-img:shadow-xl max-w-none font-normal">
                <ReactMarkdown>{currentPost.content}</ReactMarkdown>
            </div>
            
            <hr className="my-16 border-gray-200 dark:border-gray-800" />
            
            {/* CTA */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-10 sm:p-12 text-center border border-gray-200 dark:border-gray-800">
                <h3 className="text-2xl sm:text-3xl font-display font-black text-gray-900 dark:text-white mb-4 tracking-tight">Ready to elevate your digital presence?</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto text-lg">
                    Let's discuss how Kairo can help you achieve your goals with a custom digital solution.
                </p>
                <Link href="/" className="inline-flex px-8 py-4 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all items-center gap-2">
                    Start Your Project
                </Link>
            </div>
        </div>
      </article>
    </>
  );
}
