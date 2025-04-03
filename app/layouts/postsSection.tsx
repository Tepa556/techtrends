"use client"
import { useState, useEffect } from 'react';
import PostCard from '@/app/ui/PostCard';
import { Favorite, Message } from '@mui/icons-material';

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
    const [posts, setPosts] = useState<Post[]>([]);
    const [latestPost, setLatestPost] = useState<Post | null>(null);
    const [otherPosts, setOtherPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/posts');
                
                if (!response.ok) {
                    throw new Error('Не удалось загрузить посты');
                }
                
                const data = await response.json();
                // Проверяем структуру данных
                const postsArray = Array.isArray(data) ? data : (data.posts || []);
                const publishedPosts = postsArray.filter((post: Post) => post.status === 'Опубликован');
                
                if (publishedPosts.length > 0) {
                    // Сортируем по дате создания (от новых к старым)
                    const sortedPosts = [...publishedPosts].sort((a, b) => 
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                    
                    // Выделяем самый новый пост
                    setLatestPost(sortedPosts[0]);
                    // Остальные посты
                    setOtherPosts(sortedPosts.slice(1));
                    setPosts(sortedPosts);
                } else {
                    setPosts([]);
                    setLatestPost(null);
                    setOtherPosts([]);
                }
            } catch (err) {
                console.error('Ошибка при загрузке постов:', err);
                setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке постов');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Скелетон для карточки
    const PostCardSkeleton = ({ featured = false }: { featured?: boolean }) => (
        <div className={`bg-white rounded-lg shadow-md overflow-hidden animate-pulse ${featured ? 'w-full' : ''}`}>
            <div className={`bg-gray-300 ${featured ? 'h-64' : 'h-48'}`}></div>
            <div className="p-4">
                <div className="w-24 h-5 bg-gray-200 rounded mb-2"></div>
                <div className="h-7 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                        <div className="w-20 h-4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex space-x-3">
                        <div className="w-16 h-4 bg-gray-200 rounded"></div>
                        <div className="w-16 h-4 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (error) {
        return (
            <div className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center text-red-500 font-medium py-8 bg-red-50 rounded-lg">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center">Последние публикации</h2>
                
                {isLoading ? (
                    <div className="space-y-8">
                        <PostCardSkeleton featured={true} />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, index) => (
                                <PostCardSkeleton key={index} />
                            ))}
                        </div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12 bg-gray-100 rounded-lg shadow-sm">
                        <p className="text-gray-600 font-medium text-xl">В данный момент нет опубликованных постов</p>
                        <p className="text-gray-500 mt-2">Заходите позже, чтобы увидеть новые публикации</p>
                    </div>
                ) : (
                    <div>
                        {latestPost && (
                            <div className="mb-6">
                                <h3 className="text-xl flex justify-center mb-4 font-semibold text-gray-800">Новая публикация</h3>
                                <div className="max-w-4xl mx-auto">
                                    <PostCard 
                                        post={{
                                            _id: latestPost._id,
                                            title: latestPost.title,
                                            description: latestPost.description,
                                            category: latestPost.category,
                                            createdAt: latestPost.createdAt,
                                            imageUrl: latestPost.imageUrl || '',
                                            author: latestPost.author,
                                            likeCount: latestPost.likeCount || 0,
                                            comments: latestPost.comments?.length || 0
                                        }} 
                                        featured={true} 
                                    />
                                </div>
                            </div>
                        )}

                        {otherPosts.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-gray-800">Недавние публикации</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {otherPosts.map(post => (
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
                )}
            </div>
        </section>
    );
};

export default PostsSection;