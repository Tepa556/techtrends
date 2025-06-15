import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Экспериментальные функции
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  
  // Сжатие
  compress: true,
  
  // Webpack конфигурация для обработки ошибок загрузки чанков
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Улучшенная обработка ошибок загрузки чанков
      config.output.crossOriginLoading = 'anonymous';
      config.output.chunkLoadTimeout = 30000; // 30 секунд таймаут
      
      // Добавляем retry логику
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        if (entries['main.js'] && !entries['main.js'].includes('./app/lib/chunkRetry.js')) {
          entries['main.js'].unshift('./app/lib/chunkRetry.js');
        }
        return entries;
      };
      
      // Оптимизация разделения чанков
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
            maxSize: 244000,
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: -5,
            chunks: 'all',
            maxSize: 244000,
          },
        },
      };
    }
    return config;
  },
  
  // Оптимизация изображений
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  env: {
    MONGODB_URL: process.env.MONGODB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
  },
  
  // Убираем редиректы из next.config.ts, оставляем только в vercel.json
  
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
          },
          // Добавляем заголовки для лучшей совместимости
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
        ],
      },
      // Агрессивное кэширование для статических ресурсов
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      // Специальные заголовки для JS и CSS файлов
      {
        source: '/_next/static/chunks/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
        ],
      },
      {
        source: '/_next/static/css/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Content-Type',
            value: 'text/css',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
