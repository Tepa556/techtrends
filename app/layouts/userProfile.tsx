"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import EditIcon from '@mui/icons-material/Edit';
import EditAccountModal from '@/app/ui/editAccountModal';
import LogOutModal from "@/app/ui/logOutModal"
import Cookies from 'js-cookie';
import SubscribeButton from '@/app/ui/SubscribeButton';
import { Button } from '@mui/material';
import CreatePostModal from '@/app/ui/CreatePostModal';

interface User {
    email: string;
    username?: string;
    avatar?: string;
    subscribers: string[];
    subscriptions: string[];
    posts: string[];
    notifications: string[];
}

interface SubscriptionUser {
    _id: string;
    username: string;
    avatar?: string;
    email: string;
}

export default function UserProfile() {
    const [user, setUser] = useState<User | null>(null);
    const [subscriptionUsers, setSubscriptionUsers] = useState<SubscriptionUser[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'subscriptions' | 'posts' | 'notifications'>('subscriptions');
    const router = useRouter();
    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

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
                return fetch(`/api/subscription/${data.email}/user-data`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching subscribed users');
                }
                return response.json();
            })
            .then(subscriptionData => {
                setSubscriptionUsers(subscriptionData);
            })
            .catch(error => {
                console.error('Error:', error);
                setError('Failed to load user data');
            });
    }, [router]);

    const handleLogout = () => {
        Cookies.remove('token');
        router.push('/');
    };

    const handleOpenCreatePostModal = () => {
        setIsCreatePostModalOpen(true);
    };

    const handleCloseCreatePostModal = () => {
        setIsCreatePostModalOpen(false);
    };

    if (error) {
        return <div className="container mx-auto p-4">{error}</div>;
    }

    if (!user) {
        return <div className="container mx-auto p-4">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-3xl bg-gray-100 p-8 rounded-lg shadow-lg relative">
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
                <p><strong>Количество подписчиков:</strong> {user.subscribers.length}</p>
                <button
                    className="font-bold mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                    onClick={() => setIsLogoutModalOpen(true)}
                >
                    Выйти
                </button>
            </div>

            <div className="flex space-x-4 mt-4">
                <button
                    className={`font-bold px-4 py-2 transition duration-300 transform hover:scale-105 ${activeTab === 'subscriptions' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('subscriptions')}
                >
                    Подписки
                </button>
                <button
                    className={`font-bold px-4 py-2 transition duration-300 transform hover:scale-105 ${activeTab === 'posts' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('posts')}
                >
                    Посты
                </button>
                <button
                    className={`font-bold px-4 py-2 transition duration-300 transform hover:scale-105 ${activeTab === 'notifications' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('notifications')}
                >
                    Уведомления
                </button>
            </div>

            <div className="min-w-[300px] bg-gray-100 p-4 mt-4 rounded-lg shadow-lg">
                {activeTab === 'subscriptions' && (
                    <div>
                        <h2 className="text-xl font-bold mb-2">Подписки</h2>
                        <div className="flex flex-wrap justify-center max-h-96">
                            <div role="tablist" aria-orientation="horizontal" className="h-30 overflow-y-hidden     items-center rounded-md bg-gray-200  text-gray-700 inline-flex w-auto justify-start p-5 gap-10" tabIndex={0} style={{ outline: 'none' }}>
                                {subscriptionUsers.length > 0 ? (
                                    subscriptionUsers.map((sub) => (
                                        <div key={sub._id} className=" bg-white p-4 pr-5 rounded-lg shadow-md flex items-center">
                                            {sub.avatar && (
                                                <Image
                                                    src={sub.avatar}
                                                    alt={`${sub.username} Avatar`}
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full mr-4"
                                                />
                                            )}
                                            <span className='mr-4'>{sub.username}</span>
                                            <SubscribeButton userEmail={sub.email} currentUserEmail={user.email} />
                                        </div>
                                    ))
                                ) : (
                                    <p>У вас нет подписок.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'posts' && (
                    <div>
                        <h2 className="text-xl font-bold mb-2">Посты</h2>
                        {user.posts.length > 0 ? (
                            <ul>
                                {user.posts.map((post, index) => (
                                    <li key={index}>{post}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className='font-bold'>У вас нет постов.</p>
                        )}
                        <div className='flex justify-center'>
                            <Button variant="outlined" onClick={handleOpenCreatePostModal}>
                                Создать пост
                            </Button>
                        </div>
                    </div>
                )}
                {activeTab === 'notifications' && (
                    <div>
                        <h2 className="text-xl font-bold mb-2">Уведомления</h2>
                        {user.notifications.length > 0 ? (
                            <ul>
                                {user.notifications.map((notification, index) => (
                                    <li key={index}>{notification}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className='font-bold'>У вас нет уведомлений.</p>
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

            <CreatePostModal isOpen={isCreatePostModalOpen} onClose={handleCloseCreatePostModal} />
        </div>
                );
}
