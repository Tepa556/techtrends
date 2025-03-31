"use client"

import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { posts } from '@/app/lib/posts';

interface SearchDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<any[]>([]); // Массив для хранения результатов поиска
    const [error, setError] = useState(''); // Строка для хранения ошибки

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

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
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth classes={{ paper: 'rounded-lg' }}>
            <DialogTitle className="relative font-bold">
                <div className='grid grid-cols-3'>
                    <div className='flex col-start-2 justify-center text-center'>
                        <h2 className="text-lg font-semibold leading-none tracking-tight content-center">Поиск</h2>
                    </div>
                    <div className='flex justify-end content-center'>
                        <button
                            onClick={onClose}
                            color="inherit"
                            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Поиск статей, категорий..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </form>
                <div className="mt-4 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-3">
                        {error ? (
                            <p className="text-sm text-red-500">{error}</p>
                        ) : (
                            results.map((result, index) => (
                                <div key={index} className="flex items-start p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                                    <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 mr-3">
                                        <img src="6173700c-b150-4d2d-94a7-a69aeea152eb" alt={result.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium line-clamp-1">{result.title}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">{result.description}</p>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{result.category} • {result.readingTime}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
