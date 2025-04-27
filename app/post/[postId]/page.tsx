"use client"

import { useParams } from 'next/navigation';
import Header from '@/app/layouts/header';
import Footer from '@/app/layouts/footer';
import PostDetail from '@/app/layouts/postDetail';
import { useThemeStore } from '@/app/lib/ThemeStore';
export default function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  const { theme } = useThemeStore();
  
  return (
    <>
      <Header />
      <div className={`pt-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}> {/* Добавляем отступ для фиксированного заголовка */}
        <PostDetail postId={postId as string} />
      </div>
      <Footer />
    </>
  );
}
