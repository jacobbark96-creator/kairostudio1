import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/crm', '/dashboard', '/login', '/api/'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Claude-Web', 'ClaudeBot', 'Google-Extended'],
        allow: '/',
      }
    ],
    sitemap: 'https://kairostudio.co.uk/sitemap.xml',
  };
}
