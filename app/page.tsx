import FirstSection from "./layouts/firstSection";
import Footer from "./layouts/footer";
import Header from "./layouts/header";
import PostsCategory from "./layouts/postsCategorys";
import PostsSection from "./layouts/postsSection";
import SubscribeSection from "./layouts/subscribeSection";

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
