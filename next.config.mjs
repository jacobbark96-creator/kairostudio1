/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export', // Required for Cloudflare Pages static hosting to generate HTML files
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true, // This forces Next.js to generate folders with index.html, which Cloudflare Pages loves
  // Rewrites removed because they are incompatible with output: 'export'
  // We will handle the /media/ rewrite via Cloudflare _routes.json / _redirects if needed
}

export default nextConfig;
