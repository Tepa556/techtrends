import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Modal, Box, TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { categories } from '../lib/nav-categories';
import CloseIcon from '@mui/icons-material/Close';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPostCreated?: (newPost: any) => void;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [text, setText] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Функция для преобразования файла в Base64
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file); // Преобразует файл в Base64
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        const token = Cookies.get('token');

        const postData = {
            title,
            description,
            category,
            text,
            image: imagePreview,
        };

        try {
            const response = await fetch('/api/post/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Пост создан успешно');

                // Очищаем поля формы
                setTitle('');
                setDescription('');
                setCategory('');
                setText('');
                setImage(null);
                setImagePreview(null);

                // Закрываем модальное окно
                onClose();

                // Вызываем коллбэк с новым постом
                if (onPostCreated && data.post) {
                    onPostCreated(data.post);
                }
            } else {
                throw new Error(data.error || 'Ошибка при создании поста');
            }
        } catch (error) {
            if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage('Произошла неизвестная ошибка');
            }
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
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-lg">Создать пост</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center my-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Заголовок"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Краткое описание"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                        <FormControl fullWidth>
                            <InputLabel id="category-select-label">Категория</InputLabel>
                            <Select
                                labelId="category-select-label"
                                id="category-select"
                                value={category}
                                label="Категория"
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat.name} value={cat.name}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Текст поста"
                            multiline
                            rows={4}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            required
                        />
                        <div className="mt-4">
                            <label
                                className={`flex items-center justify-center w-full p-3 border-2 border-dashed rounded-md cursor-pointer transition-colors ${imagePreview ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-500'
                                    }`}
                            >
                                <div className="flex flex-col items-center space-y-2">
                                    <span className="text-sm font-medium text-gray-700">
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
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded shadow-sm transition-colors duration-200 mr-3"
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow-sm transition-colors duration-200"
                                disabled={isLoading}
                            >
                                Создать пост
                            </button>
                        </div>
                    </form>
                )}
                {message && <p className="text-red-500 font-bold mt-3">{message}</p>}
            </Box>
        </Modal>
    );
}