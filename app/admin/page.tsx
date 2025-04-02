'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import RejectPostModal from '../ui/RejectPostModal';
import PostDetailsModal from '../ui/PostDetailsModal';

// Типы данных для постов
interface Post {
    _id: string;
    title: string;
    description: string;
    text: string;
    category: string;
    author: string;
    status: string;
    createdAt: string;
    imageUrl: string | null;
}

// Константы для статусов постов
const POST_STATUS = {
    PENDING: 'pending',
    PUBLISHED: 'published',
    REJECTED: 'rejected',
};

export default function AdminDashboard() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('all'); // all, pending, published, rejected
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const token = Cookies.get('admin_token');
            
            const response = await fetch('/api/admin/posts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка при загрузке постов');
            }

            const data = await response.json();
            setPosts(data.posts);
        } catch (error) {
            setError('Ошибка при загрузке постов');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (post: Post) => {
        setSelectedPost(post);
        setIsDetailsModalOpen(true);
    };

    const handlePublish = async (postId: string) => {
        try {
            setStatusUpdateLoading(true);
            const token = Cookies.get('admin_token');
            
            const response = await fetch(`/api/admin/posts/${postId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: POST_STATUS.PUBLISHED
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка при публикации поста');
            }

            const data = await response.json();
            
            // Обновляем состояние
            setPosts(prevPosts => 
                prevPosts.map(post => 
                    post._id === postId ? { ...post, status: POST_STATUS.PUBLISHED } : post
                )
            );

            // Если модальное окно открыто, обновляем выбранный пост
            if (selectedPost && selectedPost._id === postId) {
                setSelectedPost({ ...selectedPost, status: POST_STATUS.PUBLISHED });
            }
            
            alert('Пост успешно опубликован');
        } catch (error) {
            console.error('Ошибка при публикации поста:', error);
            alert('Ошибка при публикации поста');
        } finally {
            setStatusUpdateLoading(false);
        }
    };

    const handleRejectClick = (post: Post) => {
        setSelectedPost(post);
        setIsRejectModalOpen(true);
    };

    const handleRejectPost = async (reason: string) => {
        if (!selectedPost) return;
        
        try {
            setStatusUpdateLoading(true);
            const token = Cookies.get('admin_token');
            
            const response = await fetch(`/api/admin/posts/${selectedPost._id}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: POST_STATUS.REJECTED,
                    rejectionReason: reason
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка при отклонении поста');
            }

            // Обновляем состояние
            setPosts(prevPosts => 
                prevPosts.map(post => 
                    post._id === selectedPost._id ? { ...post, status: POST_STATUS.REJECTED } : post
                )
            );

            // Закрываем модальные окна
            setIsRejectModalOpen(false);
            setIsDetailsModalOpen(false);
            setSelectedPost(null);
            
            alert('Пост отклонен');
        } catch (error) {
            console.error('Ошибка при отклонении поста:', error);
            alert('Ошибка при отклонении поста');
        } finally {
            setStatusUpdateLoading(false);
        }
    };

    const handleLogout = () => {
        Cookies.remove('admin_token');
        router.push('/admin/login');
    };

    // Фильтрация постов по статусу
    const filteredPosts = activeTab === 'all' 
        ? posts 
        : posts.filter(post => post.status === activeTab);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">Панель администратора</h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 ease-in-out"
                    >
                        Выйти
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Управление публикациями</h2>
                    <p className="text-gray-600">
                        Здесь вы можете просматривать, публиковать или отклонять статьи.
                    </p>
                </div>

                <div className="flex mb-6 space-x-2">
                    <button
                        className={`px-4 py-2 rounded font-medium transition duration-300 ease-in-out ${
                            activeTab === 'all' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => setActiveTab('all')}
                    >
                        Все посты
                    </button>
                    <button
                        className={`px-4 py-2 rounded font-medium transition duration-300 ease-in-out ${
                            activeTab === POST_STATUS.PENDING 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => setActiveTab(POST_STATUS.PENDING)}
                    >
                        Ожидающие
                    </button>
                    <button
                        className={`px-4 py-2 rounded font-medium transition duration-300 ease-in-out ${
                            activeTab === POST_STATUS.PUBLISHED 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => setActiveTab(POST_STATUS.PUBLISHED)}
                    >
                        Опубликованные
                    </button>
                    <button
                        className={`px-4 py-2 rounded font-medium transition duration-300 ease-in-out ${
                            activeTab === POST_STATUS.REJECTED 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => setActiveTab(POST_STATUS.REJECTED)}
                    >
                        Отклоненные
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-lg">Загрузка...</p>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <p className="text-lg text-gray-600">Нет постов для отображения</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                {post.imageUrl && (
                                    <div className="h-48 w-full relative">
                                        <Image
                                            src={post.imageUrl}
                                            alt={post.title}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                )}
                                <div className="p-4">
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                        post.status === POST_STATUS.PENDING 
                                            ? 'bg-yellow-100 text-yellow-800' 
                                            : post.status === POST_STATUS.PUBLISHED 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                    }`}>
                                        {post.status === POST_STATUS.PENDING 
                                            ? 'Ожидает проверки' 
                                            : post.status === POST_STATUS.PUBLISHED 
                                                ? 'Опубликован' 
                                                : 'Отклонен'}
                                    </span>
                                    <h2 className="text-xl font-semibold mt-2">{post.title}</h2>
                                    <p className="text-gray-600 text-sm mt-1">Автор: {post.author}</p>
                                    <p className="text-gray-600 text-sm">Категория: {post.category}</p>
                                    <p className="text-gray-600 mt-2 line-clamp-2">{post.description}</p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <button 
                                            onClick={() => handleViewDetails(post)}
                                            className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out"
                                        >
                                            Подробнее
                                        </button>
                                        
                                        {post.status === POST_STATUS.PENDING && (
                                            <>
                                                <button
                                                    onClick={() => handlePublish(post._id)}
                                                    disabled={statusUpdateLoading}
                                                    className="ml-2 text-green-500 hover:text-green-700 transition duration-300 ease-in-out"
                                                >
                                                    Опубликовать
                                                </button>
                                                <button
                                                    onClick={() => handleRejectClick(post)}
                                                    disabled={statusUpdateLoading}
                                                    className="ml-2 text-red-500 hover:text-red-700 transition duration-300 ease-in-out"
                                                >
                                                    Отклонить
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Модальное окно для просмотра деталей поста */}
            <PostDetailsModal 
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                post={selectedPost}
                onPublish={handlePublish}
                onReject={() => setIsRejectModalOpen(true)}
                isLoading={statusUpdateLoading}
            />

            {/* Модальное окно для отклонения поста */}
            <RejectPostModal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                onReject={handleRejectPost}
            />
        </div>
    );
}