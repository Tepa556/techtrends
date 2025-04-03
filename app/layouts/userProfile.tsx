"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditAccountModal from '@/app/ui/editAccountModal';
import LogOutModal from "@/app/ui/logOutModal"
import Cookies from 'js-cookie';
import SubscribeButton from '@/app/ui/SubscribeButton';
import { Button } from '@mui/material';
import CreatePostModal from '@/app/ui/CreatePostModal';
import EditPostModal from '../ui/EditPostModal';
import DeletePostModal from '../ui/DeletePostModal';

interface Notification {
    sender: string;
    message: string;
    createdAt: string;
    isRead: boolean;
    postId?: string;
}

interface User {
    _id?: string;
    email: string;
    username: string;
    avatar: string | null;
    subscribers: string[];
    subscriptions: string[];
    posts: string[];
    notifications: Notification[];
}

interface Post {
    _id: string;
    title: string;
    description: string;
    category: string;
    text: string;
    imageUrl: string | null;
    author: string;
    status: string;
    likeCount: number;
    comments: any[];
    createdAt: string;
}

export default function UserProfile() {
    const [user, setUser] = useState<User | null>(null);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [subscriptionUsers, setSubscriptionUsers] = useState<User[]>([]);
    const [activeTab, setActiveTab] = useState('posts');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
    const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
    const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchUserData();
    }, []);

    // Получение данных пользователя
    const fetchUserData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = Cookies.get('token');
            if (!token) {
                router.push('/');
                return;
            }

            const response = await fetch('/api/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    Cookies.remove('token');
                    router.push('/');
                    return;
                }
                throw new Error('Ошибка при загрузке данных пользователя');
            }

            const userData = await response.json();
            setUser(userData);

            // Загружаем посты пользователя
            fetchUserPosts();

            // Загружаем данные о подписках пользователя
            if (userData.subscriptions && userData.subscriptions.length > 0) {
                fetchSubscriptionUsers(userData.subscriptions);
            }
        } catch (error) {
            setError('Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
            console.error('Ошибка:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Получение постов пользователя
    const fetchUserPosts = async () => {
        try {
            const token = Cookies.get('token');
            const response = await fetch('/api/post/get', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setUserPosts(data);
            } else {
                console.error('Ошибка при получении постов пользователя');
            }
        } catch (error) {
            console.error('Ошибка при получении постов пользователя:', error);
        }
    };

    // Получение данных о пользователях, на которых подписан текущий пользователь
    const fetchSubscriptionUsers = async (subscriptions: string[]) => {
        try {
            const token = Cookies.get('token');
            const response = await fetch('/api/users/subscriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ subscriptions })
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке данных о подписках');
            }

            const users = await response.json();
            setSubscriptionUsers(users);
        } catch (error) {
            console.error('Ошибка при загрузке подписок:', error);
        }
    };

    // Обработчик создания нового поста
    const handlePostCreated = (newPost: Post) => {
        setUserPosts(prevPosts => [newPost, ...prevPosts]);
    };

    // Обработчик обновления поста
    const handlePostUpdated = (updatedPost: Post) => {
        setUserPosts(prevPosts =>
            prevPosts.map(post =>
                post._id === updatedPost._id ? updatedPost : post
            )
        );
    };

    // Обработчик удаления поста
    const handlePostDeleted = (deletedPostId: string) => {
        setUserPosts(prevPosts =>
            prevPosts.filter(post => post._id !== deletedPostId)
        );
    };

    // Обработчик обновления профиля пользователя
    const handleUserUpdated = (updatedUser: User) => {
        setUser(updatedUser);
    };

    // Обработчик изменения подписки
    const handleSubscriptionChange = (subscriptionEmail: string, isSubscribed: boolean) => {
        if (user) {
            // Обновляем список подписок пользователя
            let updatedSubscriptions = [...user.subscriptions];

            if (isSubscribed) {
                // Добавляем подписку, если её ещё нет
                if (!updatedSubscriptions.includes(subscriptionEmail)) {
                    updatedSubscriptions.push(subscriptionEmail);
                }
            } else {
                // Удаляем подписку
                updatedSubscriptions = updatedSubscriptions.filter(email => email !== subscriptionEmail);
            }

            // Обновляем данные пользователя
            setUser({
                ...user,
                subscriptions: updatedSubscriptions
            });

            // Обновляем список пользователей в подписках
            if (!isSubscribed) {
                setSubscriptionUsers(prevUsers =>
                    prevUsers.filter(user => user.email !== subscriptionEmail)
                );
            }
        }
    };

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

    const handleDeleteNotification = async (index: number) => {
        const token = Cookies.get('token');
        try {
            const response = await fetch('/api/notification/delete', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ notificationIndex: index })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка при удалении уведомления');
            }

            // Успешно удалено - обновляем локальное состояние
            if (user) {
                const updatedNotifications = [...user.notifications];
                updatedNotifications.splice(index, 1);
                setUser({ ...user, notifications: updatedNotifications });
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось удалить уведомление');
        }
    };

    const handleOpenEditPostModal = (post: Post) => {
        setSelectedPost(post);
        setIsEditPostModalOpen(true);
    };

    const handleCloseEditPostModal = () => {
        setIsEditPostModalOpen(false);
        setSelectedPost(null);
    };

    const handleOpenDeletePostModal = (postId: string) => {
        setSelectedPostId(postId);
        setIsDeletePostModalOpen(true);
    };

    const handleCloseDeletePostModal = () => {
        setIsDeletePostModalOpen(false);
        setSelectedPostId(null);
    };

    const handleDeletePost = async (postId: string) => {
        try {
            const token = Cookies.get('token');
            const response = await fetch(`/api/post/delete?postId=${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            
            if (response.ok) {
                setUserPosts(userPosts.filter(post => post._id !== postId));
                setIsDeletePostModalOpen(false);
            } else {
                const data = await response.json();
                console.error('Ошибка при удалении поста:', data.error);
            }
        } catch (error) {
            console.error('Ошибка при удалении поста:', error);
        }
    };

    if (error) {
        return <div className="container mx-auto p-4">{error}</div>;
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-4">
                <div className="w-full max-w-3xl bg-gray-100 p-8 rounded-lg shadow-lg relative">
                    <div className="flex flex-col items-start">
                        {/* Скелетоны для профиля */}
                        <div className="animate-pulse bg-gray-300 h-16 w-16 rounded-full mb-4"></div>
                        <div className="animate-pulse bg-gray-300 h-8 w-32 rounded mb-2"></div>
                        <div className="animate-pulse bg-gray-300 h-6 w-48 rounded mb-2"></div>
                        <div className="animate-pulse bg-gray-300 h-6 w-48 rounded mb-2"></div>
                        <div className="animate-pulse bg-gray-300 h-6 w-48 rounded mb-2"></div>

                        {/* Кнопки-скелетоны */}
                        <div className="flex mt-4 space-x-4">
                            <div className="animate-pulse bg-gray-300 h-10 w-32 rounded"></div>
                            <div className="animate-pulse bg-gray-300 h-10 w-32 rounded"></div>
                            <div className="animate-pulse bg-gray-300 h-10 w-32 rounded"></div>
                        </div>
                        <div className="flex mt-4 space-x-4">
                            <div className="animate-pulse bg-gray-300 h-10 w-32 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-3xl bg-gray-100 p-8 rounded-lg shadow-lg relative">

                <div>
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
                    <p><strong>Количество подписок:</strong> {user.subscriptions.length}</p>

                    <div className="flex mt-4 space-x-4">
                        <button
                            className={`${activeTab === 'posts' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} py-2 px-4 rounded font-bold transition duration-300 ease-in-out hover:bg-blue-600 hover:text-white`}
                            onClick={() => setActiveTab('posts')}
                        >
                            Посты
                        </button>
                        <button
                            className={`${activeTab === 'notifications' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} py-2 px-4 rounded font-bold transition duration-300 ease-in-out hover:bg-blue-600 hover:text-white`}
                            onClick={() => setActiveTab('notifications')}
                        >
                            Уведомления
                        </button>
                        <button
                            className={`${activeTab === 'subscriptions' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'} py-2 px-4 rounded font-bold transition duration-300 ease-in-out hover:bg-blue-600 hover:text-white`}
                            onClick={() => setActiveTab('subscriptions')}
                        >
                            Подписки
                        </button>
                    </div>

                    <div className="mt-4 flex justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded font-bold transition duration-300 ease-in-out"
                            onClick={handleOpenCreatePostModal}
                        >
                            Создать пост
                        </button>
                        <button
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded font-bold transition duration-300 ease-in-out"
                            onClick={() => setIsLogoutModalOpen(true)}
                        >
                            Выйти
                        </button>
                    </div>
                </div>

            </div>

            <div className="min-w-[300px] max-w-[900px] bg-gray-100 p-4 mt-4 rounded-lg shadow-lg overflow-x-auto max-h-[400px]">
                {activeTab === 'subscriptions' && (
                    <div>
                        <h2 className="text-xl font-bold mb-2">Подписки</h2>
                        <div className="flex flex-wrap justify-center max-h-96">
                            <div role="tablist" aria-orientation="horizontal" className="h-30 overflow-y-hidden items-center rounded-md bg-gray-200 text-gray-700 inline-flex w-auto justify-start p-5 gap-10" tabIndex={0} style={{ outline: 'none' }}>
                                {subscriptionUsers.length > 0 ? (
                                    subscriptionUsers.map((sub) => (
                                        <div key={sub._id} className="bg-white p-4 pr-5 rounded-lg shadow-md flex items-center">
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
                                            <SubscribeButton
                                                userEmail={sub.email}
                                                currentUserEmail={user.email}
                                                onSubscriptionChange={handleSubscriptionChange}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <p className='font-bold'>У вас нет подписок.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'posts' && (
                    <div>
                        <h2 className="text-xl font-bold mb-2">Мои посты</h2>
                        <div className="flex flex-nowrap gap-2 justify-start">
                            <div role="tablist" aria-orientation="horizontal" className="max-h-96 overflow-y-hidden items-center rounded-md bg-gray-200 text-gray-700 inline-flex w-auto justify-start p-5 gap-10" tabIndex={0} style={{ outline: 'none' }}>
                                {userPosts.length > 0 ? (
                                    userPosts.map((post) => (
                                        <div key={post._id} className="min-w-96 bg-white p-4 rounded-lg shadow-md flex items-center">
                                            <div className="mr-4">
                                                <h3 className="font-bold">{post.title}</h3>
                                                <p><strong>Описание:</strong> {post.description}</p>
                                                <p><strong>Категория:</strong> {post.category}</p>
                                                <p><strong>Дата создания:</strong> {new Date(post.createdAt).toLocaleDateString()}</p>
                                                <p><strong>Комментарии:</strong> {post.status}</p>
                                                <p><strong>Лайки:</strong> {post.likeCount}</p>
                                                <p><strong>Комментарии:</strong> {post.comments.length}</p>
                                                <div className="flex space-x-2 mt-2">
                                                    <button className="text-blue-500" onClick={() => handleOpenEditPostModal(post)}>
                                                        <EditIcon />
                                                    </button>
                                                    <button className="text-red-500" onClick={() => handleOpenDeletePostModal(post._id)}>
                                                        <DeleteIcon />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className='font-bold'>У вас нет постов.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div>
                        <h2 className="text-xl font-bold mb-2">Мои посты</h2>
                        <div className="flex flex-nowrap gap-2 justify-start">
                            <div role="tablist" aria-orientation="horizontal" className="max-h-96 overflow-x-hidden items-center rounded-md bg-gray-200 text-gray-700 inline-flex w-auto justify-start p-5 gap-10" tabIndex={0} style={{ outline: 'none' }}>
                                {user.notifications && user.notifications.length > 0 ? (
                                    <div className="space-y-4">
                                        {user.notifications.map((notification, index) => (
                                            <div key={index} className="bg-white p-4 rounded-lg shadow-md w-full relative">
                                                <div className='flex justify-between gap-2'>
                                                    <p className="font-medium">{notification.message} {new Date(notification.createdAt).toLocaleString('ru-RU', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}</p>
                                                    <button
                                                        className="text-gray-500 hover:text-red-500 transition-colors"
                                                        onClick={() => handleDeleteNotification(index)}
                                                        aria-label="Удалить уведомление"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className='font-bold'>У вас нет уведомлений.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <EditAccountModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUserUpdated={handleUserUpdated}
            />

            <LogOutModal
                isOpen={isLogoutModalOpen}
                onConfirm={handleLogout}
                onCancel={() => setIsLogoutModalOpen(false)}
            />

            <CreatePostModal
                isOpen={isCreatePostModalOpen}
                onClose={handleCloseCreatePostModal}
                onPostCreated={handlePostCreated}
            />

            <EditPostModal
                isOpen={isEditPostModalOpen}
                onClose={handleCloseEditPostModal}
                post={selectedPost}
                onPostUpdated={(updatedPost) => handlePostUpdated(updatedPost as Post)}
            />

            <DeletePostModal
                isOpen={isDeletePostModalOpen}
                onClose={handleCloseDeletePostModal}
                postId={selectedPostId}
                onPostDeleted={handleDeletePost}
            />
        </div>
    );
}
