import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from './SEO';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

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

// Temporary mock data until Supabase table is created and populated
const MOCK_POSTS: BlogPost[] = [
    {
        id: '1',
        title: 'Why Custom Web Design Outperforms Templates Every Time',
        slug: 'custom-web-design-vs-templates',
        excerpt: 'Discover why investing in a custom-built website yields higher conversion rates and better brand perception than off-the-shelf templates.',
        content: '',
        image_url: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2000&auto=format&fit=crop',
        created_at: new Date().toISOString(),
        reading_time: '5 min read'
    },
    {
        id: '2',
        title: 'The Future of E-Commerce: Trends to Watch in 2025',
        slug: 'ecommerce-trends-2025',
        excerpt: 'From AI-driven personalization to headless commerce, explore the technologies shaping the future of online retail.',
        content: '',
        image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop',
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
        reading_time: '7 min read'
    },
    {
        id: '3',
        title: 'How to Optimize Your Site for Core Web Vitals',
        slug: 'core-web-vitals-optimization',
        excerpt: 'A comprehensive guide to understanding and improving your Core Web Vitals for better SEO and user experience.',
        content: '',
        image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop',
        created_at: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
        reading_time: '6 min read'
    }
];

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
        // Attempt to fetch from Supabase. If the table doesn't exist yet, we'll catch the error and use mock data.
        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('published', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data && data.length > 0) {
            setPosts(data as BlogPost[]);
        } else {
            setPosts(MOCK_POSTS);
        }
    } catch (error) {
        console.log("Using mock blog posts (table might not exist yet)", error);
        setPosts(MOCK_POSTS);
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Digital Insights & Strategies | Kairo Blog" 
        description="Expert insights, strategies, and tutorials on web design, development, and digital marketing." 
      />
      
      <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative z-0">
        {/* Background */}
        <div className="absolute inset-0 w-full h-full -z-20 overflow-hidden">
            <img 
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2940&auto=format&fit=crop" 
                alt="Night Sky" 
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-white dark:from-black/50 dark:via-black/80 dark:to-black pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-16">
                <h1 className="text-5xl md:text-7xl font-display font-black text-gray-900 dark:text-white mb-6 tracking-tight drop-shadow-sm">
                    The <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 dark:from-brand-400 dark:to-purple-400">Journal</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light">
                    Insights, strategies, and thoughts on digital design, development, and growing your business online.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link 
                            key={post.id} 
                            to={`/blog/${post.slug}`}
                            className="group bg-white dark:bg-gray-900/60 backdrop-blur-md rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
                        >
                            <div className="aspect-video w-full overflow-hidden relative">
                                <img 
                                    src={post.image_url} 
                                    alt={post.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                            </div>
                            
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex items-center gap-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {post.reading_time || '5 min'}
                                    </span>
                                </div>
                                
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                    {post.title}
                                </h2>
                                
                                <p className="text-gray-600 dark:text-gray-300 font-light line-clamp-3 mb-6 flex-grow">
                                    {post.excerpt}
                                </p>
                                
                                <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold mt-auto group/btn">
                                    Read Article
                                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
      </div>
    </>
  );
}
