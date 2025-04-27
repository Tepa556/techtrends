"use client"
import ProfilesList from "../layouts/profilesList";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import { useThemeStore } from "@/app/lib/ThemeStore";
export default function ProfilesPage() {
  const { theme } = useThemeStore();
  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <Header />
      <ProfilesList />
      <Footer />
    </div>
  )

}
