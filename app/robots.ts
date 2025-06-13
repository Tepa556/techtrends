/**
 * Модуль для генерации robots.txt
 * Управляет доступом поисковых роботов к различным частям сайта
 */

import { MetadataRoute } from 'next';

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
 * Основная функция генерации robots.txt
 * Создает правила для поисковых роботов и определяет доступные разделы сайта
 * @returns {MetadataRoute.Robots} Конфигурация robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  
  // Проверяем, является ли текущий домен preview-доменом Vercel
  // Это нужно для блокировки индексации тестовых/промежуточных версий сайта
  const isVercelDomain = (
    process.env.VERCEL_URL && 
    process.env.VERCEL_URL.includes('vercel.app') &&
    !process.env.VERCEL_URL.includes('techtrends.app')
  ) || (
    process.env.VERCEL_BRANCH_URL && 
    process.env.VERCEL_BRANCH_URL.includes('vercel.app')
  );
  
  // Логируем информацию о генерации robots.txt для отладки
  console.log('Robots.txt генерация:', {
    baseUrl,
    isVercelDomain,
    nodeEnv: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL
  });
  
  // Если это preview-домен Vercel, блокируем индексацию всего сайта
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
  
  // Для продакшн и локальной разработки настраиваем стандартные правила
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/', // Разрешаем индексацию всего сайта по умолчанию
        disallow: [
          '/admin/', // Запрещаем индексацию админ-панели
          '/api/',   // Запрещаем индексацию API-эндпоинтов
          '/admin',  // Дублируем запреты без слеша для надежности
          '/api',
          '/_next/', // Запрещаем индексацию системных файлов Next.js
          '/node_modules/' // Запрещаем индексацию node_modules
        ]
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`, // Указываем путь к sitemap.xml
    host: baseUrl // Указываем основной домен сайта
  };
} 