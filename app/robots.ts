import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/crm', '/dashboard', '/login', '/api/'],
    },
    sitemap: 'https://kairostudio.com/sitemap.xml',
  };
}
