import Header from "@/app/layouts/header"
import Footer from "@/app/layouts/footer"
import UserProfile from '@/app/layouts/userProfile';

export default function ProfilePage() {
    return (
        <div>
            <Header/>
            <UserProfile />
            <Footer/>
        </div>
    );
}
