import { MetadataRoute } from 'next';

const getBaseUrl = () => {
  return process.env.NODE_ENV === 'production' 
    ? 'https://techtrends-cyan.vercel.app/' 
    : 'http://localhost:3000';
};

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  
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