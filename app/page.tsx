import type { Metadata } from "next";
import FirstSection from "./layouts/firstSection";
import Footer from "./layouts/footer";
import Header from "./layouts/header";
import PostsCategory from "./layouts/postsCategorys";
import PostsSection from "./layouts/postsSection";
import SubscribeSection from "./layouts/subscribeSection";

export const metadata: Metadata = {
  title: 'TechTrends - Технологические тренды и инновации',
  description: 'Актуальные технологические тренды, новости и аналитика о разработке, ИИ и технологиях. Будьте в курсе последних инноваций в мире технологий.',
  openGraph: {
    title: 'TechTrends - Технологические тренды и инновации',
    description: 'Актуальные технологические тренды, новости и аналитика о разработке, ИИ и технологиях',
    type: 'website',
  }
};

export default function Home() {
  return (
    <div className="">
        <Header/>
        <FirstSection/>  
        <PostsSection/>
        <PostsCategory/> 
        <SubscribeSection/>
        <Footer/>
    </div>
  );
}
