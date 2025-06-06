import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    MONGODB_URL: process.env.MONGODB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
  },
  async redirects() {
    return [
      // Редирект с Vercel домена на основной
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'techtrends-artems-projects-81c0f51b.vercel.app',
          },
        ],
        destination: 'https://techtrends.app/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          }
        ],
      },
    ];
  },
};

export default nextConfig;
