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
  // Removed trailingSlash: true as it causes issues with dynamic SSG routes and index.txt generation on static exports
  // trailingSlash: true,
}

export default nextConfig;
