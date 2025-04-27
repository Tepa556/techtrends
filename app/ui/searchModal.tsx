"use client"

import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useThemeStore } from '../lib/ThemeStore';
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

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (!value.trim()) {
            setResults([]);
            setError('');
            return;
        }

        // Фильтрация результатов
        const filteredResults = posts.filter(post =>
            post.title.toLowerCase().includes(value.toLowerCase()) || // Поиск по заголовку
            post.category.toLowerCase().includes(value.toLowerCase()) // Поиск по категории
        );

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
                <div className="mt-4 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-3">
                        {isLoading ? (
                            <div className="flex justify-center py-4">
                                <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'} h-48 w-full rounded`}></div>
                            </div>
                        ) : error ? (
                            <p className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>{error}</p>
                        ) : (
                            results.map((result) => (
                                <div key={result._id} className={`flex items-start p-3 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} cursor-pointer transition-colors`}>
                                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 mr-3">
                                        <img src={result.imageUrl || "/placeholder-image.jpg"} alt={result.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className={`font-medium line-clamp-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{result.title}</h4>
                                        <p className={`text-sm line-clamp-2 mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{result.description}</p>
                                        <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{result.category}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </DialogContent>
            </div>
        </Dialog>
    );
}
