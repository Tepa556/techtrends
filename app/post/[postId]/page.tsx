"use client"

import { useParams } from 'next/navigation';
import Head from 'next/head';
import Header from '@/app/layouts/header';
import Footer from '@/app/layouts/footer';
import PostDetail from '@/app/layouts/postDetail';
import { useThemeStore } from '@/app/lib/ThemeStore';
import { useEffect, useState } from 'react';

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

export default function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const { theme } = useThemeStore();
  const [post, setPost] = useState<Post | null>(null);
  
  // Получаем данные о посте для метаданных на клиентской стороне
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
  
  return (
    <>
      {post && (
        <Head>
          <title>{post.title} | TechTrends</title>
          <meta name="description" content={post.description} />
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={post.description} />
          {post.imageUrl && <meta property="og:image" content={post.imageUrl} />}
          <meta property="og:type" content="article" />
          <meta property="article:published_time" content={post.createdAt} />
          <meta property="article:section" content={post.category} />
        </Head>
      )}
      <Header />
      <div className={`pt-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}> {/* Добавляем отступ для фиксированного заголовка */}
        <PostDetail postId={postId as string} />
      </div>
      <Footer />
    </>
  );
}
