"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import EditIcon from '@mui/icons-material/Edit';
import EditAccountModal from '@/app/layouts/editAccountModal';
import LogOutModal from "@/app/layouts/logOutModal"
import Cookies from 'js-cookie';

interface User {
    email: string;
    username?: string;
    avatar?: string;
    subscriptions?: string[]; 
    posts?: string[];
    notifications?: string[];
}
interface Subscription {
    id: string;
    username: string;
    avatar?: string;
}
export default function UserProfile() {
    const [user, setUser] = useState<User | null>(null);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'subscriptions' | 'posts' | 'notifications'>('subscriptions');
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('token');
        fetch('/api/user', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching user data');
            }
            return response.json();
        })
        .then(data => {
            setUser(data);
            return data.subscriptions || [];
        })
        .then((subscriptionIds: string[]) => {
            return Promise.all(subscriptionIds.map((id: string) =>
                fetch(`/api/user/${id}`)
                .then(res => res.json())
            ));
        })
        .then(subscriptionsData => setSubscriptions(subscriptionsData))
        .catch(error => {
            console.error('Error:', error);
            setError('Failed to load user data');
        });
    }, [router]);

    const handleLogout = () => {
        Cookies.remove('token');
        router.push('/'); 
    };

    if (error) {
        return <div className="container mx-auto p-4">{error}</div>;
    }

    if (!user) {
        return <div className="container mx-auto p-4">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-[900px] bg-gray-300 p-8 rounded-lg shadow-lg relative">
                <button
                    className="absolute top-4 right-4"
                    onClick={() => setIsEditModalOpen(true)}
                >
                    <EditIcon />
                </button>
                <h1 className="text-2xl font-bold mb-4 flex items-center">
                    {user.avatar && (
                        <Image
                            src={user.avatar}
                            alt="User Avatar"
                            width={40}
                            height={40}
                            className="rounded-full mr-4"
                        />
                    )}
                    Профиль
                </h1>
                <p><strong>Email:</strong> {user.email}</p>
                {user.username && <p><strong>Имя пользователя:</strong> {user.username}</p>}
                <p><strong>Количество подписчиков:</strong> {subscriptions.length}</p>
                <button
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                    onClick={() => setIsLogoutModalOpen(true)}
                >
                    Выйти
                </button>
            </div>

            <div className="flex space-x-4 mt-4">
                <button
                    className={`px-4 py-2 transition-colors duration-300 transform hover:scale-105 ${activeTab === 'subscriptions' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('subscriptions')}
                >
                    Подписки
                </button>
                <button
                    className={`px-4 py-2 transition-colors duration-300 transform hover:scale-105 ${activeTab === 'posts' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('posts')}
                >
                    Посты
                </button>
                <button
                    className={`px-4 py-2 transition-colors duration-300 transform hover:scale-105 ${activeTab === 'notifications' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('notifications')}
                >
                    Уведомления
                </button>
            </div>

            <div className="w-[900px] bg-gray-100 p-4 mt-4 rounded-lg shadow-lg">
                {activeTab === 'subscriptions' && (
                    <div>
                        <h2 className="text-xl font-bold mb-2">Подписки</h2>
                        <div className="flex flex-wrap justify-center overflow-y-scroll max-h-96">
                            {subscriptions.length > 0 ? (
                                subscriptions.map((sub, index) => (
                                    <div key={index} className="bg-white p-4 m-2 rounded-lg shadow-md flex items-center">
                                        {sub.avatar && (
                                            <Image
                                                src={sub.avatar}
                                                alt={`${sub.username} Avatar`}
                                                width={40}
                                                height={40}
                                                className="rounded-full mr-4"
                                            />
                                        )}
                                        <span>{sub.username}</span>
                                    </div>
                                ))
                            ) : (
                                <p>У вас нет подписок.</p>
                            )}
                        </div>
                    </div>
                )}
                {activeTab === 'posts' && (
                    <div>
                        <h2 className="text-xl font-bold mb-2">Посты</h2>
                        {user.posts && user.posts.length > 0 ? (
                            <ul>
                                {user.posts.map((post, index) => (
                                    <li key={index}>{post}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>У вас нет постов.</p>
                        )}
                    </div>
                )}
                {activeTab === 'notifications' && (
                    <div>
                        <h2 className="text-xl font-bold mb-2">Уведомления</h2>
                        {user.notifications && user.notifications.length > 0 ? (
                            <ul>
                                {user.notifications.map((notification, index) => (
                                    <li key={index}>{notification}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>У вас нет уведомлений.</p>
                        )}
                    </div>
                )}
            </div>

            <EditAccountModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={user}
            />

            <LogOutModal
                isOpen={isLogoutModalOpen}
                onConfirm={handleLogout}
                onCancel={() => setIsLogoutModalOpen(false)}
            />
        </div>
    );
}
