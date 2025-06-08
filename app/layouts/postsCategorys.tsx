"use client"
import { useState, useEffect } from 'react'; 
import PostCard from '@/app/ui/PostCard';
import { categories } from '@/app/lib/categories-for-posts-categories'; 
import { useThemeStore } from '../lib/ThemeStore';
import FilterPanel, { FilterOptions } from '../ui/FilterPanel';
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
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({
        timeFilter: 'all',
        sortBy: 'newest',
        minRating: 0
    });
    const { theme } = useThemeStore();
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

    // Функция применения фильтров и категорий
    const applyFiltersAndCategory = (postList: Post[], category: string, currentFilters: FilterOptions) => {
        // Сначала фильтруем по категории
        let filtered = category === 'Все' ? [...postList] : postList.filter(post => post.category === category);

        // Фильтр по рейтингу
        if (currentFilters.minRating > 0) {
            filtered = filtered.filter(post => post.likeCount >= currentFilters.minRating);
        }

        // Фильтр по времени
        if (currentFilters.timeFilter !== 'all') {
            const now = new Date();
            let dateThreshold: Date;

            switch (currentFilters.timeFilter) {
                case 'today':
                    dateThreshold = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case 'week':
                    dateThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case 'month':
                    dateThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                case 'year':
                    dateThreshold = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    dateThreshold = new Date(0);
            }

            filtered = filtered.filter(post => new Date(post.createdAt) >= dateThreshold);
        }

        // Сортировка
        switch (currentFilters.sortBy) {
            case 'oldest':
                filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case 'popular':
                filtered.sort((a, b) => (b.likeCount + (b.comments?.length || 0)) - (a.likeCount + (a.comments?.length || 0)));
                break;
            case 'rating':
                filtered.sort((a, b) => b.likeCount - a.likeCount);
                break;
            case 'comments':
                filtered.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
                break;
            default: // newest
                filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        return filtered;
    };

    useEffect(() => {
        // Применяем фильтры и категории при изменении постов, категории или фильтров
        const result = applyFiltersAndCategory(posts, selectedCategory, filters);
        setFilteredPosts(result);
    }, [selectedCategory, posts, filters]);

    // Обработчик изменения фильтров
    const handleFiltersChange = (newFilters: FilterOptions) => {
        setFilters(newFilters);
    };

    // Скелетон для карточки поста
    const PostCardSkeleton = () => (
        <div className={`bg-white rounded-lg shadow-md overflow-hidden animate-pulse ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <div className={`h-48 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
            <div className="p-4">
                <div className={`w-24 h-5 rounded mb-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                <div className={`h-7 rounded mb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                <div className="space-y-2 mb-4">
                    <div className={`h-4 rounded w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                    <div className={`h-4 rounded w-5/6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <div className={`w-20 h-4 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                    <div className="flex space-x-3">
                        <div className={`w-16 h-4 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                        <div className={`w-16 h-4 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (error) {
        return (
            <section className={`py-16 md:py-24 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                <div className="container mx-auto px-4">
                    <div className="text-center text-red-500 font-medium py-8 bg-red-50 rounded-lg">
                        {error}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={`py-16 md:py-24 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} uppercase tracking-wider`}>Исследуйте</span>
                    <h2 className={`text-3xl md:text-4xl font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Категории</h2>
                </div>

                {/* Кнопки категорий */}
                <div className="flex flex-wrap justify-center gap-3 mb-6 font-bold ">
                    <button
                        className={`px-4 py-2 rounded-full transition-colors ${
                            selectedCategory === 'Все' 
                                ? 'bg-blue-600 text-white' 
                                : `${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                        }`}
                        onClick={() => setSelectedCategory('Все')}
                    >
                        Все
                    </button>
                    {categories
                        .filter(category => category.name !== 'Все')
                        .map(category => (
                            <button
                                key={category.name}
                                className={`px-4 py-2 font-bold rounded-full transition-colors ${
                                    selectedCategory === category.name 
                                        ? 'bg-blue-600 text-white' 
                                        : `${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                                }`}
                                onClick={() => setSelectedCategory(category.name)}
                            >
                                {category.name}
                            </button>
                        ))
                    }
                </div>

                {/* Фильтры */}
                <div className="mt-2.5 mb-10">
                  <FilterPanel
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      isOpen={isFilterOpen}
                      onToggle={() => setIsFilterOpen(!isFilterOpen)}
                      showResultCount={true}
                      resultCount={filteredPosts.length}
                  />
                </div>
                
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <PostCardSkeleton key={index} />
                        ))}
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <div className={`text-center py-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg shadow-sm`}>
                        <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-bold text-xl`}>
                            {selectedCategory === 'Все' 
                                ? 'В данный момент нет опубликованных постов' 
                                : `В категории «${selectedCategory}» пока нет публикаций`}
                        </p>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
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
