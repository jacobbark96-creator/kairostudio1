/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Removed output: 'export' because it breaks Next.js native Rewrites and API routes
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
  async rewrites() {
    return [
      {
        source: '/media/:path*',
        destination: 'https://tqnvjeshgvmougtimygd.supabase.co/storage/v1/object/public/media/:path*',
      },
    ]
  }
}

export default nextConfig;
