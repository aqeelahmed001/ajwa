/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'placehold.co',
      'res.cloudinary.com',
      // add other domains as needed
    ],
    formats: ['image/webp', 'image/avif'],
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig 