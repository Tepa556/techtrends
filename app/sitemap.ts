/**
 * Модуль для генерации sitemap.xml
 * Генерирует карту сайта, включающую все публичные страницы и посты
 */

import { MetadataRoute } from 'next';
import { MongoClient } from 'mongodb';

/**
 * Получает базовый URL в зависимости от окружения
 * @returns {string} Базовый URL сайта
 */
const getBaseUrl = () => {
  return process.env.NODE_ENV === 'production' 
    ? 'https://techtrends.app' 
    : 'http://localhost:3000';
};

/**
 * Интерфейс для поста в базе данных
 */
interface Post {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt?: string;
  status: string;
}

/**
 * Получает все опубликованные посты из базы данных
 * @returns {Promise<Post[]>} Массив опубликованных постов
 */
async function fetchAllPosts(): Promise<Post[]> {
  // Проверяем наличие переменной окружения
  if (!process.env.MONGODB_URL) {
    console.warn('MONGODB_URL не найден, возвращаем пустой массив постов');
    return [];
  }

  const client = new MongoClient(process.env.MONGODB_URL);
  
  try {
    await client.connect();
    const database = client.db('local');
    const postsCollection = database.collection('posts');
    
    // Получаем только опубликованные посты для sitemap
    const posts = await postsCollection
      .find({ status: 'Опубликован' })
      .project({ _id: 1, title: 1, createdAt: 1, updatedAt: 1 })
      .sort({ createdAt: -1 }) // Сортируем по дате создания
      .toArray() as Post[];
    console.log(`Найдено ${posts.length} опубликованных постов для sitemap`);
    return posts;
  } catch (error) {
    console.error('Ошибка при получении постов для sitemap:', error);
    // Возвращаем пустой массив вместо прерывания
    return [];
  } finally {
    await client.close();
  }
}

/**
 * Основная функция генерации sitemap
 * Создает карту сайта, включающую статические страницы и динамические посты
 * @returns {Promise<MetadataRoute.Sitemap>} Массив URL-ов для sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  
  try {
    const posts = await fetchAllPosts();
    
    // Создаем записи для постов с приоритетом 0.8 и еженедельным обновлением
    const postsEntries = posts.map((post) => ({
      url: `${baseUrl}/post/${post._id}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
    
    // Статические страницы с разными приоритетами
    const routes = [
      '', // Главная страница
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
      priority: route === '' ? 1.0 : 0.7, // Главная страница имеет высший приоритет
    }));
    
    const allEntries = [...routes, ...postsEntries];
    console.log(`Генерирован sitemap с ${allEntries.length} записями`);
    
    return allEntries;
  } catch (error) {
    console.error('Критическая ошибка при генерации sitemap:', error);
    
    // В случае критической ошибки возвращаем минимальный sitemap
    // с только главной страницей и страницей "О нас"
    const baseUrl = getBaseUrl();
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }
    ];
  }
} 