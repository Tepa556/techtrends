"use client"

import { useParams } from 'next/navigation';
import Header from '@/app/layouts/header';
import Footer from '@/app/layouts/footer';
import UserProfileContent from '@/app/layouts/userProfileContent';
import { useThemeStore } from '@/app/lib/ThemeStore';

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { theme } = useThemeStore();

  return (
    <>
      <Header />
      <main className={`min-h-screen py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <UserProfileContent userId={userId} />
      </main>
      <Footer />
    </>
  );
}
