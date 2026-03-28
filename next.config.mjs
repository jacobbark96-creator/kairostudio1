/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Note: rewrites are not supported in output: 'export' mode
  // To mask the URL on Cloudflare Pages, we will use a _routes.json or _redirects file
}

export default nextConfig;
