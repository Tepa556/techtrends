"use client"

import { useParams } from 'next/navigation';
import Header from '@/app/layouts/header';
import Footer from '@/app/layouts/footer';
import UserProfileContent from '@/app/layouts/userProfileContent';

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();

  return (
    <>
      <Header />
      <main className="min-h-screen py-8 bg-gray-50">
        <UserProfileContent userId={userId} />
      </main>
      <Footer />
    </>
  );
}
