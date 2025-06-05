"use client"
import { useState, useEffect } from 'react';
import PostCard from '@/app/ui/PostCard';
import { Favorite, Message } from '@mui/icons-material';
import { useThemeStore } from '../lib/ThemeStore';

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

const PostsSection = () => {
    const [recentPosts, setRecentPosts] = useState<Post[]>([]); // 3 поста разных категорий
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { theme } = useThemeStore();

    useEffect(() => {
        const fetchRecentPosts = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/posts/recent');
                
                if (!response.ok) {
                    throw new Error('Не удалось загрузить последние публикации');
                }
                
                const data = await response.json();
                setRecentPosts(data || []);
                
            } catch (err) {
                console.error('Ошибка при загрузке последних публикаций:', err);
                setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке публикаций');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecentPosts();
    }, []);

    // Скелетон для карточки
    const PostCardSkeleton = ({ featured = false }: { featured?: boolean }) => (
        <div className={`bg-white rounded-lg shadow-md overflow-hidden animate-pulse ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} ${featured ? 'w-full' : '' }` }>
            <div className={`bg-gray-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'} ${featured ? 'h-64' : 'h-48'}`}></div>
            <div className="p-4">
                <div className={`w-24 h-5 bg-gray-200 rounded mb-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
                <div className={`h-7 bg-gray-200 rounded mb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
                <div className="space-y-2 mb-4">
                    <div className={`h-4 bg-gray-200 rounded w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
                    <div className={`h-4 bg-gray-200 rounded w-5/6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center">
                        <div className={`w-10 h-10 bg-gray-200 rounded-full mr-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
                        <div className={`w-20 h-4 bg-gray-200 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
                    </div>
                    <div className="flex space-x-3">
                        <div className={`w-16 h-4 bg-gray-200 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
                        <div className={`w-16 h-4 bg-gray-200 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (error) {
        return (
            <div className={`py-12 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="container mx-auto px-4">
                    <div className="text-center text-red-500 font-medium py-8 bg-red-50 rounded-lg">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className={`py-12 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="container mx-auto px-4">
                <h2 className={`text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Последние публикации</h2>
                <p className={`text-center mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Свежие статьи из разных категорий
                </p>
                
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, index) => (
                            <PostCardSkeleton key={index} />
                        ))}
                    </div>
                ) : recentPosts.length === 0 ? (
                    <div className={`text-center py-12 bg-gray-100 rounded-lg shadow-sm ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                        <p className={` font-medium text-xl ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>В данный момент нет опубликованных постов</p>
                        <p className={` mt-2 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>Заходите позже, чтобы увидеть новые публикации</p>
                    </div>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentPosts.map((post, index) => (
                                <PostCard 
                                    key={post._id} 
                                    post={{
                                        _id: post._id,
                                        title: post.title,
                                        description: post.description,
                                        category: post.category,
                                        createdAt: post.createdAt,
                                        imageUrl: post.imageUrl || '',
                                        author: post.author,
                                        likeCount: post.likeCount || 0,
                                        comments: post.comments?.length || 0
                                    }}
                                />
                            ))}
                        </div>
                    
                    </div>
                )}
            </div>
        </section>
    );
};

export default PostsSection;