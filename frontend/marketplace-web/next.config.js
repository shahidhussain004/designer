/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['@tanstack/react-query', 'axios', 'zustand', 'jwt-decode'],
  },
  webpack: (config, { _isServer }) => {
    // Enable code splitting for better chunk optimization
    config.optimization.splitChunks.cacheGroups = {
      ...config.optimization.splitChunks.cacheGroups,
      // Split vendor chunks
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: 10,
        reuseExistingChunk: true,
      },
      // Split common chunks used in multiple pages
      common: {
        minChunks: 2,
        priority: 5,
        reuseExistingChunk: true,
        name: 'common',
      },
      // Split react and related libraries
      react: {
        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
        name: 'react-vendors',
        priority: 20,
        reuseExistingChunk: true,
      },
    };
    return config;
  },
  // PWA configuration
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  // API proxy to backend services
  async rewrites() {
    return [
      {
        source: '/api/courses/:path*',
        destination: 'http://localhost:8082/api/courses/:path*',
      },
      {
        source: '/api/enrollments/:path*',
        destination: 'http://localhost:8082/api/enrollments/:path*',
      },
      {
        source: '/api/quizzes/:path*',
        destination: 'http://localhost:8082/api/quizzes/:path*',
      },
      {
        source: '/api/certificates/:path*',
        destination: 'http://localhost:8082/api/certificates/:path*',
      },
      {
        source: '/api/videos/:path*',
        destination: 'http://localhost:8082/api/videos/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
}

module.exports = nextConfig
