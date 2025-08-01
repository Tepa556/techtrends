"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import EditAccountModal from '@/app/ui/editAccountModal';
import LogOutModal from "@/app/ui/logOutModal"
import Cookies from 'js-cookie';
import SubscribeButton from '@/app/ui/SubscribeButton';
import { Button } from '@mui/material';
import CreatePostModal from '@/app/ui/CreatePostModal';
import EditPostModal from '../ui/EditPostModal';
import DeletePostModal from '../ui/DeletePostModal';
import { useThemeStore } from '@/app/lib/ThemeStore';
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
    const [filteredUserPosts, setFilteredUserPosts] = useState<Post[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
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
    const { theme } = useThemeStore();

    // Функция фильтрации постов
    const filterPosts = (posts: Post[], query: string) => {
        if (!query.trim()) {
            return posts;
        }
        
        const searchTerm = query.toLowerCase().trim();
        return posts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) ||
            post.description.toLowerCase().includes(searchTerm) ||
            post.category.toLowerCase().includes(searchTerm)
        );
    };

    // Обработчик изменения поискового запроса
    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        setFilteredUserPosts(filterPosts(userPosts, query));
    };

    // Очистка поиска
    const clearSearch = () => {
        setSearchQuery('');
        setFilteredUserPosts(userPosts);
    };

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
                setFilteredUserPosts(data);
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
        setFilteredUserPosts(prevPosts => [newPost, ...prevPosts]);
    };

    // Обработчик обновления поста
    const handlePostUpdated = (updatedPost: Post) => {
        setUserPosts(prevPosts =>
            prevPosts.map(post =>
                post._id === updatedPost._id ? updatedPost : post
            )
        );
        setFilteredUserPosts(prevPosts =>
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
        setFilteredUserPosts(prevPosts =>
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
            const response = await fetch('/api/user/notification/delete', {
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
            // Немедленно удаляем пост из локального состояния
            setUserPosts(userPosts.filter(post => post._id !== postId));
            setFilteredUserPosts(userPosts.filter(post => post._id !== postId));
            setIsDeletePostModalOpen(false);
            
            // Пост будет удален из базы данных через модальное окно DeletePostModal
            // Обработчик уже вызван из модального окна
        } catch (error) {
            console.error('Ошибка при обработке удаления поста:', error);
        }
    };

    if (error) {
        return <div className="container mx-auto p-4">{error}</div>;
    }

    if (!user) {
        return (
            <div className={`flex flex-col items-center justify-center min-h-screen px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                <div className={`w-full max-w-3xl p-8 rounded-lg shadow-lg relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className="flex flex-col items-start">
                        {/* Скелетоны для профиля */}
                        <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-16 w-16 rounded-full mb-4`}></div>
                        <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-8 w-32 rounded mb-2`}></div>
                        <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-6 w-48 rounded mb-2`}></div>
                        <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-6 w-48 rounded mb-2`}></div>
                        <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-6 w-48 rounded mb-2`}></div>

                        {/* Кнопки-скелетоны */}
                        <div className="flex mt-4 space-x-4">
                            <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-10 w-32 rounded`}></div>
                            <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-10 w-32 rounded`}></div>
                            <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-10 w-32 rounded`}></div>
                        </div>
                        <div className="flex mt-4 space-x-4">
                            <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-10 w-32 rounded`}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <div className={`w-full max-w-3xl bg-gray-100 p-8 rounded-lg shadow-lg relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>

                <div>
                    <button
                        className={`absolute top-4 right-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                        onClick={() => setIsEditModalOpen(true)}
                    >
                        <EditIcon />
                    </button>
                    <h1 className={`text-2xl font-bold mb-4 flex items-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
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
                    <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}><strong>Email:</strong> {user.email}</p>
                    {user.username && <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}><strong>Имя пользователя:</strong> {user.username}</p>}
                    <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}><strong>Количество подписчиков:</strong> {user.subscribers.length}</p>
                    <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}><strong>Количество подписок:</strong> {user.subscriptions.length}</p>

                    <div className="flex mt-4 space-x-4">
                        <button
                            className={`${activeTab === 'posts' 
                                ? 'bg-blue-500 text-white' 
                                : theme === 'dark' 
                                    ? 'bg-gray-700 text-gray-300' 
                                    : 'bg-gray-300 text-gray-700'} 
                                py-2 px-4 rounded font-bold transition duration-300 ease-in-out 
                                hover:bg-blue-600 hover:text-white`}
                            onClick={() => setActiveTab('posts')}
                        >
                            Посты
                        </button>
                        <button
                            className={`${activeTab === 'notifications' 
                                ? 'bg-blue-500 text-white' 
                                : theme === 'dark' 
                                    ? 'bg-gray-700 text-gray-300' 
                                    : 'bg-gray-300 text-gray-700'} 
                                py-2 px-4 rounded font-bold transition duration-300 ease-in-out 
                                hover:bg-blue-600 hover:text-white`}
                            onClick={() => setActiveTab('notifications')}
                        >
                            Уведомления
                        </button>
                        <button
                            className={`${activeTab === 'subscriptions' 
                                ? 'bg-blue-500 text-white' 
                                : theme === 'dark' 
                                    ? 'bg-gray-700 text-gray-300' 
                                    : 'bg-gray-300 text-gray-700'} 
                                py-2 px-4 rounded font-bold transition duration-300 ease-in-out 
                                hover:bg-blue-600 hover:text-white`}
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

            <div className={`min-w-[300px] max-w-[900px] p-4 mt-4 rounded-lg shadow-lg max-h-[400px] ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                {activeTab === 'subscriptions' && (
                    <div>
                        <h2 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Подписки</h2>
                        <div className="flex flex-wrap justify-center max-h-96">
                            <div role="tablist" aria-orientation="horizontal" className={`h-30 overflow-y-hidden items-center rounded-md inline-flex w-auto justify-start p-5 gap-10 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`} tabIndex={0} style={{ outline: 'none' }}>
                                {subscriptionUsers.length > 0 ? (
                                    subscriptionUsers.map((sub) => (
                                        <div key={sub._id} className={`p-4 pr-5 rounded-lg shadow-md flex items-center justify-between gap-4 ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-50'} transition-colors`}>
                                            <div 
                                                className="flex items-center cursor-pointer flex-1 mr-4"
                                                onClick={() => router.push(`/profiles/${sub._id}`)}
                                                title={`Перейти к профилю ${sub.username}`}
                                            >
                                                {sub.avatar ? (
                                                    <Image
                                                        src={sub.avatar}
                                                        alt={`${sub.username} Avatar`}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full mr-4"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-4">
                                                        <span className="text-white font-bold text-lg">
                                                            {sub.username.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                                <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} hover:text-blue-500 transition-colors font-bold`}>
                                                    {sub.username}
                                                </span>
                                            </div>
                                            <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
                                                <SubscribeButton
                                                    userEmail={sub.email}
                                                    currentUserEmail={user.email}
                                                    onSubscriptionChange={handleSubscriptionChange}
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>У вас нет подписок.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'posts' && (
                    <div>
                        <h2 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Мои посты</h2>
                        
                        {/* Поле поиска */}
                        {userPosts.length > 0 && (
                            <div className="mb-4">
                                <div className={`relative max-w-md mx-auto ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    <div className="relative">
                                        <SearchIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} h-5 w-5`} />
                                        <input
                                            type="text"
                                            placeholder="Поиск по моим постам..."
                                            value={searchQuery}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                            className={`w-full pl-10 pr-10 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                                                theme === 'dark' 
                                                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                            }`}
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={clearSearch}
                                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                                            >
                                                <ClearIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Результаты поиска */}
                                {searchQuery && (
                                    <div className={`text-center mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                        <p className="text-sm">
                                            {filteredUserPosts.length === 0 
                                                ? `Не найдено постов по запросу "${searchQuery}"` 
                                                : `Найдено ${filteredUserPosts.length} ${filteredUserPosts.length === 1 ? 'пост' : filteredUserPosts.length <= 4 ? 'поста' : 'постов'} по запросу "${searchQuery}"`
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <div className="flex flex-nowrap gap-2 justify-center">
                            <div role="tablist" aria-orientation="horizontal" className={`max-h-96 overflow-auto items-center rounded-md inline-flex w-auto justify-start p-5 gap-10 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`} tabIndex={0} style={{ outline: 'none' }}>
                                {filteredUserPosts.length > 0 ? (
                                    filteredUserPosts.map((post) => (
                                        <div key={post._id} className={`min-w-96 p-4 rounded-lg shadow-md flex items-center ${theme === 'dark' ? 'bg-gray-600' : 'bg-white'}`}>
                                            <div className="mr-4">
                                                <h3 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{post.title}</h3>
                                                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}><strong>Описание:</strong> {post.description.length > 100 ? 
                                                    `${post.description.substring(0, 100)}...` : 
                                                    post.description}
                                                </p>
                                                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}><strong>Категория:</strong> {post.category}</p>
                                                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}><strong>Дата создания:</strong> {new Date(post.createdAt).toLocaleDateString()}</p>
                                                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}><strong>Комментарии:</strong> {post.status}</p>
                                                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}><strong>Лайки:</strong> {post.likeCount}</p>
                                                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}><strong>Комментарии:</strong> {post.comments.length}</p>
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
                                    <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {searchQuery ? `По запросу "${searchQuery}" ничего не найдено` : 'У вас нет постов.'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div>
                        <h2 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Мои уведомления</h2>
                        <div className="flex flex-nowrap gap-2 justify-center">
                            <div role="tablist" aria-orientation="horizontal" className={`max-h-96 overflow-x-hidden items-center rounded-md inline-flex w-auto justify-start p-5 gap-10 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`} tabIndex={0} style={{ outline: 'none' }}>
                                {user.notifications && user.notifications.length > 0 ? (
                                    <div className="space-y-4">
                                        {user.notifications.map((notification, index) => (
                                            <div key={index} className={`p-4 rounded-lg shadow-md w-full relative ${theme === 'dark' ? 'bg-gray-600' : 'bg-white'}`}>
                                                <div className='flex justify-between gap-2'>
                                                    <p className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'}`}>{notification.message} {new Date(notification.createdAt).toLocaleString('ru-RU', {
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
                                    <p className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>У вас нет уведомлений.</p>
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
