/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'placehold.co',
      ''
      // add other domains as needed
    ],
    formats: ['image/webp', 'image/avif'],
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  
  // Domain routing configuration
  async rewrites() {
    return {
      beforeFiles: [
        // For development environment
        ...process.env.NODE_ENV === 'development' ? [
          {
            source: '/admin-panel/:path*',
            destination: '/admin/:path*',
          },
        ] : [],
        
        // For production environment with subdomains
        ...process.env.NODE_ENV === 'production' ? [] : [],
      ],
    };
  },
  
  // Middleware configuration to handle subdomains in production
  // The actual subdomain handling is done in middleware.ts
}

module.exports = nextConfig 