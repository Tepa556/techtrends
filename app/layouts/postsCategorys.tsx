"use client"
import { useState, useEffect } from 'react'; 
import PostCard from '@/app/ui/PostCard';
import { categories } from '@/app/lib/categories-for-posts-categories'; 

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

const PostsCategory = () => {
    const [selectedCategory, setSelectedCategory] = useState('Все');
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
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
                setPosts(publishedPosts);
            } catch (err) {
                console.error('Ошибка при загрузке постов:', err);
                setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке постов');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        // Фильтруем посты при изменении выбранной категории или при обновлении списка постов
        setFilteredPosts(
            selectedCategory === 'Все' 
                ? posts 
                : posts.filter(post => post.category === selectedCategory)
        );
    }, [selectedCategory, posts]);

    // Скелетон для карточки поста
    const PostCardSkeleton = () => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-4">
                <div className="w-24 h-5 bg-gray-200 rounded mb-2"></div>
                <div className="h-7 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
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
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center text-red-500 font-medium py-8 bg-red-50 rounded-lg">
                        {error}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 md:py-24 bg-white transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">Исследуйте</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-1 text-gray-800">Категории</h2>
                </div>
                
                {/* Кнопки категорий */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    <button
                        className={`px-4 py-2 rounded-full transition-colors ${
                            selectedCategory === 'Все' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => setSelectedCategory('Все')}
                    >
                        Все
                    </button>
                    {categories
                        .filter(category => category.name !== 'Все') // Исключаем категорию "Все" из массива
                        .map(category => (
                            <button
                                key={category.name}
                                className={`px-4 py-2 font-bold rounded-full transition-colors ${
                                    selectedCategory === category.name 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                                onClick={() => setSelectedCategory(category.name)}
                            >
                                {category.name}
                            </button>
                        ))
                    }
                </div>
                
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <PostCardSkeleton key={index} />
                        ))}
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-12 bg-gray-100 rounded-lg shadow-sm">
                        <p className="text-gray-600 font-bold text-xl">
                            {selectedCategory === 'Все' 
                                ? 'В данный момент нет опубликованных постов' 
                                : `В категории «${selectedCategory}» пока нет публикаций`}
                        </p>
                        <p className="text-gray-500 mt-2">
                            {selectedCategory === 'Все' 
                                ? 'Заходите позже, чтобы увидеть новые публикации' 
                                : 'Попробуйте выбрать другую категорию или заходите позже'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map(post => (
                            <PostCard 
                                key={post._id} 
                                post={{
                                    _id: post._id.toString(),
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
                )}
            </div>
        </section>
    );
};

export default PostsCategory;
