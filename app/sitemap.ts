import { MetadataRoute } from 'next';
import { MongoClient } from 'mongodb';

const getBaseUrl = () => {
  return process.env.NODE_ENV === 'production' 
    ? 'https://techtrends-cyan.vercel.app/' 
    : 'http://localhost:3000';
};

interface Post {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
  status: string;
}

async function fetchAllPosts() {
  const client = new MongoClient(process.env.MONGODB_URL || '');
  
  try {
    await client.connect();
    const database = client.db('local');
    const postsCollection = database.collection('posts');
    
    // Получаем только опубликованные посты для sitemap
    const posts = await postsCollection
      .find({ status: 'published' })
      .project({ _id: 1, title: 1, createdAt: 1, updatedAt: 1 })
      .toArray() as Post[];
    
    return posts;
  } catch (error) {
    console.error('Ошибка при получении постов для sitemap:', error);
    return [];
  } finally {
    await client.close();
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const posts = await fetchAllPosts();
  
  // Создаем записи для постов
  const postsEntries = posts.map((post) => ({
    url: `${baseUrl}/post/${post._id}`,
    lastModified: new Date(post.updatedAt || post.createdAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  
  // Статические страницы
  const routes = [
    '',
    '/about',
    '/login',
    '/register',
    '/profiles',
    '/privacy-policy',
    '/terms-of-service',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.7,
  }));
  
  return [...routes, ...postsEntries];
} 