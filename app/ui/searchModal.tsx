"use client"

import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useThemeStore } from '../lib/ThemeStore';
import FilterPanel, { FilterOptions } from './FilterPanel';
interface SearchDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Post {
    _id: string;
    title: string;
    description: string;
    category: string;
    imageUrl: string;
    author: string;
    likeCount: number;
    comments: any[];
    status: string;
    createdAt: string;
}

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<Post[]>([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({
        timeFilter: 'all',
        sortBy: 'newest',
        minRating: 0
    });
    const { theme } = useThemeStore();
    // Загрузка постов при открытии модального окна
    useEffect(() => {
        const fetchPosts = async () => {
            if (!isOpen) return;
            
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
                setError('Произошла ошибка при загрузке постов. Попробуйте позже.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [isOpen]);

    // Функция применения фильтров
    const applyFilters = (postList: Post[], currentFilters: FilterOptions) => {
        let filtered = [...postList];

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
                filtered.sort((a, b) => (b.likeCount + b.comments.length) - (a.likeCount + a.comments.length));
                break;
            case 'rating':
                filtered.sort((a, b) => b.likeCount - a.likeCount);
                break;
            case 'comments':
                filtered.sort((a, b) => b.comments.length - a.comments.length);
                break;
            default: // newest
                filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }

        return filtered;
    };

    // Обработчик изменения фильтров
    const handleFiltersChange = (newFilters: FilterOptions) => {
        setFilters(newFilters);
        
        // Применяем фильтры к текущим результатам поиска
        if (searchTerm.trim()) {
            let filteredResults = posts.filter(post =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.author.toLowerCase().includes(searchTerm.toLowerCase())
            );

            filteredResults = applyFilters(filteredResults, newFilters);
            setResults(filteredResults);
            
            if (filteredResults.length === 0) {
                setError(`Нет результатов для "${searchTerm}" с выбранными фильтрами`);
            } else {
                setError('');
            }
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (!value.trim()) {
            setResults([]);
            setError('');
            return;
        }

        // Применяем поиск и фильтрацию
        let filteredResults = posts.filter(post =>
            post.title.toLowerCase().includes(value.toLowerCase()) || // Поиск по заголовку
            post.description.toLowerCase().includes(value.toLowerCase()) || // Поиск по описанию
            post.category.toLowerCase().includes(value.toLowerCase()) || // Поиск по категории
            post.author.toLowerCase().includes(value.toLowerCase()) // Поиск по автору
        );

        // Применяем фильтры
        filteredResults = applyFilters(filteredResults, filters);

        setResults(filteredResults);
        // Отображение ошибки, если результаты пусты
        if (filteredResults.length === 0) {
            setError(`Нет результатов для "${value}"`);
        } else {
            setError('');
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth classes={{ paper: 'rounded-lg' }} >
            <div className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <DialogTitle className="relative font-bold">
                <div className='grid grid-cols-3 '>
                    <div className='flex col-start-2 justify-center text-center'>
                        <h2 className={`text-lg font-semibold leading-none tracking-tight content-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Поиск</h2>
                    </div>
                    <div className='flex justify-end content-center'>
                        <button
                            onClick={onClose}
                            color="inherit"
                            className={`rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                        >
                            <CloseIcon />
                        </button>
                    </div>
                </div>
            </DialogTitle>
            <DialogContent>
                <form className="relative mt-3">
                    <input
                        type="text"
                        className={`flex h-10 w-full rounded-md border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white placeholder:text-gray-400' : 'border-gray-300 bg-white text-gray-900 placeholder:text-gray-500'} px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
                        placeholder="Поиск статей, категорий..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </form>

                {/* Фильтры */}
                <div className="mt-2.5 mb-2.5">
                  <FilterPanel
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      isOpen={isFilterOpen}
                      onToggle={() => setIsFilterOpen(!isFilterOpen)}
                      showResultCount={true}
                      resultCount={results.length}
                  />
                </div>

                <div className="mt-4 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-3">
                        {isLoading ? (
                            // Улучшенные скелеты
                            Array.from({ length: 5 }).map((_, index) => (
                                <div key={index} className={`flex items-start p-3 rounded-lg animate-pulse ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <div className={`w-16 h-16 rounded flex-shrink-0 mr-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                    <div className="flex-1 space-y-2">
                                        <div className={`h-4 rounded w-3/4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                        <div className={`h-3 rounded w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                        <div className={`h-3 rounded w-1/2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                        <div className={`h-3 rounded w-1/4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
                                    </div>
                                </div>
                            ))
                        ) : error ? (
                            <p className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>{error}</p>
                        ) : (
                            results.map((result) => (
                                <a 
                                    key={result._id} 
                                    href={`/post/${result._id}`}
                                    onClick={onClose}
                                    className={`flex items-start p-3 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} cursor-pointer transition-colors block`}
                                >
                                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 mr-3">
                                        <img src={result.imageUrl || "/post-back/placeholder-image.jpg"} alt={result.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`font-medium truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{result.title}</h4>
                                        <p className={`text-sm mt-1 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{result.description}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${theme === 'dark' ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}>
                                                {result.category}
                                            </span>
                                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                                                <span className="flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                    {result.likeCount}
                                                </span>
                                                <span className="flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                    {result.comments?.length || 0}
                                                </span>
                                                <span className="text-gray-400">
                                                    {result.author}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))
                        )}
                    </div>
                </div>
            </DialogContent>
            </div>
        </Dialog>
    );
}
