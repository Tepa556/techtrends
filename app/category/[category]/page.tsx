"use client"

import { useParams } from 'next/navigation';
import Header from '@/app/layouts/header';
import Footer from '@/app/layouts/footer';
import CategoryContent from '@/app/layouts/СategoryContent';
import { useThemeStore } from '@/app/lib/ThemeStore';
export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { theme } = useThemeStore();
  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <Header />
      <CategoryContent />
      <Footer />
    </div>
  );
} 