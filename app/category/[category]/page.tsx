"use client"

import { useParams } from 'next/navigation';
import Header from '@/app/layouts/header';
import Footer from '@/app/layouts/footer';
import CategoryContent from '@/app/layouts/СategoryContent';

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();

  return (
    <>
      <Header />
      <CategoryContent />
      <Footer />
    </>
  );
} 