import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Modal, Box, TextField, Button, Typography, MenuItem, Select } from '@mui/material';
import { categories } from '../lib/nav-categories';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
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

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [text, setText] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = Cookies.get('token');

        if (imageFile) {
            const validExtensions = ['image/jpeg', 'image/png'];
            if (!validExtensions.includes(imageFile.type)) {
                setMessage('Неверный формат изображения. Используйте JPEG или PNG.');
                return;
            }

            if (imageFile.size > 2 * 1024 * 1024) { // 2MB
                setMessage('Размер изображения превышает 2MB.');
                return;
            }
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('text', text);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const response = await fetch('/api/post/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка при создании поста');
            }

            setMessage('Пост создан успешно');
            setTitle('');
            setDescription('');
            setCategory('');
            setText('');
            setImageFile(null);
            onClose();
        } catch (error) {
            if (error instanceof Error) {
                setMessage(error.message);
            } else {
                setMessage('Произошла неизвестная ошибка');
            }
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2">
                    Создать новый пост
                </Typography>
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
                        label="Описание"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <Select
                        fullWidth   
                        value={category}
                        onChange={(e) => setCategory(e.target.value as string)}
                        displayEmpty
                        required
                    >
                        <MenuItem value="" disabled>
                            Выберите категорию
                        </MenuItem>
                        {categories.map((cat) => (
                            <MenuItem key={cat.name} value={cat.name}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
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
                    <Button
                        variant="contained"
                        component="label"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Загрузить изображение
                        <input
                            type="file"
                            hidden
                            accept="image/jpeg, image/png"
                            onChange={(e) => {
                                if (e.target.files) {
                                    setImageFile(e.target.files[0]);
                                }
                            }}
                        />
                    </Button>
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Создать пост
                    </Button>
                </form>
                {message && <Typography color="error">{message}</Typography>}
            </Box>
        </Modal>
    );
}
