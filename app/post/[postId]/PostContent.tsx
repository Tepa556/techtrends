"use client"
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useThemeStore } from '@/app/lib/ThemeStore';
import Header from '@/app/layouts/header';
import Footer from '@/app/layouts/footer';
import PostDetail from '@/app/layouts/postDetail';

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
}

interface PostContentProps {
  postId: string; // Получаем postId через пропсы от серверного компонента
}

export default function PostContent({ postId }: PostContentProps) {
  const { theme } = useThemeStore();
  const [post, setPost] = useState<Post | null>(null);
  
  // Можно использовать useParams для дополнительной логики, если нужно
  const params = useParams();
  
  // Получаем данные о посте для JSON-LD на клиентской стороне
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`/api/post/${postId}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data.post);
        }
      } catch (error) {
        console.error('Ошибка при загрузке поста:', error);
      }
    };
    
    fetchPostData();
  }, [postId]);

  // JSON-LD структурированные данные для статьи
  const articleJsonLd = post ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.imageUrl ? (post.imageUrl.startsWith('http') ? post.imageUrl : `${process.env.NODE_ENV === 'production' ? 'https://techtrends.app' : 'http://localhost:3000'}${post.imageUrl}`) : undefined,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'TechTrends',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NODE_ENV === 'production' ? 'https://techtrends.app' : 'http://localhost:3000'}/logo.png`,
      },
    },
    datePublished: post.createdAt,
    dateModified: post.createdAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NODE_ENV === 'production' ? 'https://techtrends.app' : 'http://localhost:3000'}/post/${postId}`,
    },
    articleSection: post.category,
    keywords: [post.category, 'технологии', 'программирование', 'разработка'],
  } : null;
  
  return (
    <>
      {/* JSON-LD структурированные данные */}
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleJsonLd),
          }}
        />
      )}
      
      <Header />
      <div className={`pt-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <PostDetail postId={postId} />
      </div>
      <Footer />
    </>
  );
} 