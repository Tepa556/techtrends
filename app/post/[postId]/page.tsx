"use client"

import { useParams } from 'next/navigation';
import Header from '@/app/layouts/header';
import Footer from '@/app/layouts/footer';
import PostDetail from '@/app/layouts/postDetail';

export default function PostPage() {
  const { postId } = useParams<{ postId: string }>();
  
  return (
    <>
      <Header />
      <div className="pt-16"> {/* Добавляем отступ для фиксированного заголовка */}
        <PostDetail postId={postId as string} />
      </div>
      <Footer />
    </>
  );
}
