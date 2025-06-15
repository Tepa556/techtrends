import type { Metadata } from 'next';
import { MongoClient, ObjectId } from 'mongodb';
import { notFound } from 'next/navigation';
import PostContent from './PostContent';

interface Post {
  _id: string;
  title: string;
  description: string;
  text: string;
  category: string;
  imageUrl: string;
  author: string;
  likeCount: number;
  createdAt: string;
  status: string;
}

// Функция для получения поста на сервере
async function getPost(postId: string): Promise<Post | null> {
  if (!process.env.MONGODB_URL) {
    console.error('MONGODB_URL не найден');
    return null;
  }

  const client = new MongoClient(process.env.MONGODB_URL);
  
  try {
    await client.connect();
    const database = client.db('local');
    const postsCollection = database.collection('posts');
    
    const post = await postsCollection.findOne({ 
      _id: new ObjectId(postId),
      status: 'Опубликован' 
    }) as Post | null;
    
    return post;
  } catch (error) {
    console.error('Ошибка при получении поста:', error);
    return null;
  } finally {
    await client.close();
  }
}

// Тип для пропсов страницы
type Props = { 
  params: Promise<{ postId: string }> 
};

// Генерация метаданных на сервере
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;
  const post = await getPost(postId);
  
  if (!post) {
    return {
      title: 'Пост не найден | TechTrends',
      description: 'Запрашиваемый пост не найден или был удален',
    };
  }

  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://techtrends.app' 
    : 'http://localhost:3000';

  // Создаем краткое описание из текста поста (первые 160 символов)
  const shortDescription = post.text.length > 160 
    ? post.text.substring(0, 157) + '...' 
    : post.text;

  return {
    title: `${post.title} | TechTrends`,
    description: post.description || shortDescription,
    keywords: [
      post.category.toLowerCase(),
      'технологии',
      'программирование',
      'разработка',
      post.title.toLowerCase(),
      'techtrends'
    ],
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description || shortDescription,
      type: 'article',
      publishedTime: post.createdAt,
      authors: [post.author],
      section: post.category,
      tags: [post.category, 'технологии', 'программирование'],
      images: post.imageUrl ? [{
        url: post.imageUrl.startsWith('http') ? post.imageUrl : `${baseUrl}${post.imageUrl}`,
        width: 1200,
        height: 630,
        alt: post.title,
      }] : [],
      locale: 'ru_RU',
    },
    alternates: {
      canonical: `/post/${postId}`
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

// Серверный компонент страницы
export default async function PostPage({ params }: Props) {
  const { postId } = await params;
  const post = await getPost(postId);
  
  if (!post) {
    notFound();
  }

  // Передаем postId в клиентский компонент
  return <PostContent postId={postId} />;
}