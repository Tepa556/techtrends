import { MetadataRoute } from 'next';

const getBaseUrl = () => {
  return process.env.NODE_ENV === 'production' 
    ? 'https://techtrends.app' 
    : 'http://localhost:3000';
};

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  
  // Если это Vercel домен, запрещаем индексацию
  const isVercelDomain = process.env.VERCEL_URL && process.env.VERCEL_URL.includes('vercel.app');
  
  if (isVercelDomain) {
    return {
      rules: [
        {
          userAgent: '*',
          disallow: ['/'],
        },
      ],
    };
  }
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/admin',
          '/api'
        ]
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
} 