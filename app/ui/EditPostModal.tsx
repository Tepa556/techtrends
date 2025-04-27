"use client";

import { useState, useEffect } from 'react';
import { Modal, Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Cookies from 'js-cookie';
import CloseIcon from '@mui/icons-material/Close';
import { categories } from '@/app/lib/nav-categories';
import { useThemeStore } from '@/app/lib/ThemeStore';
interface Post {
    _id: string;
    title: string;
    description: string;
    category: string;
    text: string;
    imageUrl: string | null;
    author: string;
    likeCount: number;
    comments: any[];
    createdAt: string;
}

interface EditPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post | null;
    onPostUpdated?: (updatedPost: Post) => void;
}

export default function EditPostModal({ isOpen, onClose, post, onPostUpdated }: EditPostModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [text, setText] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useThemeStore();
    // Инициализация данных при открытии модального окна
    useEffect(() => {
        if (isOpen && post) {
            setTitle(post.title);
            setDescription(post.description);
            setCategory(post.category);
            setText(post.text);
            setImagePreview(post.imageUrl);
            console.log(post.imageUrl)
        }

    }, [isOpen, post]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 2 * 1024 * 1024) {
                setMessage('Размер файла не должен превышать 2MB');
                return;
            }

            setImage(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!post) return;

        if (!title || !description || !category || !text) {
            setMessage('Все поля обязательны для заполнения');
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            const token = Cookies.get('token');
            const response = await fetch('/api/post/update', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    postId: post._id,
                    title,
                    description,
                    category,
                    text,
                    image: imagePreview,
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                setMessage('Пост успешно обновлен');
                setTimeout(() => {
                    setMessage(null);
                    onClose();
                    
                    // Вместо перезагрузки вызываем коллбэк
                    if (onPostUpdated && data.post) {
                        onPostUpdated(data.post);
                    }
                }, 1500);
            } else {
                setMessage(data.error || 'Ошибка при обновлении поста');
            }
        } catch (error) {
            setMessage('Произошла ошибка при обращении к серверу');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: theme === 'dark' ? '#0f141c' : 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : ''}`}>Редактировать пост</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <CloseIcon />
                    </button>
                </div>
                
                {message && (
                    <div className={`p-3 mb-4 rounded ${message.includes('ошибка') || message.includes('Ошибка') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}
                
                {isLoading ? (
                    <div className="flex justify-center my-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col">
                                <label className={`mb-2 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                                    Заголовок
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="Введите заголовок"
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={`mb-2 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                                    Краткое описание
                                </label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="Введите краткое описание"
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={`mb-2 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                                    Категория
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    required
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.name} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label className={`mb-2 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                                    Текст поста
                                </label>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    rows={4}
                                    placeholder="Введите текст поста"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label
                                className={`flex items-center justify-center w-full p-3 border-2 border-dashed rounded-md cursor-pointer transition-colors ${
                                    imagePreview ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500'
                                }`}
                            >
                                <div className="flex flex-col items-center space-y-2">
                                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                                        {imagePreview ? 'Изображение выбрано' : 'Загрузить изображение'}
                                    </span>
                                    {imagePreview && (
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="mt-2 max-h-40 object-contain" 
                                        />
                                    )}
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                        
                        <div className="flex justify-end mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded shadow-sm transition-colors duration-200 mr-3 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : ''}`}
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-sm transition-colors duration-200"
                                disabled={isLoading}
                            >
                                Сохранить
                            </button>
                        </div>
                    </form>
                )}
            </Box>
        </Modal>
    );
}
