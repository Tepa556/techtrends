"use client"

import { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Cookies from 'js-cookie';

interface User {
    email: string;
    username?: string;
    avatar?: string;
}

interface UserEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
}

export default function EditAccountModal({ isOpen, onClose, user }: UserEditModalProps) {
    const [username, setUsername] = useState(user.username || '');
    const [email, setEmail] = useState(user.email);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        if (avatar) {
            formData.append('avatar', avatar);
        }

        const token = Cookies.get('token');
        const response = await fetch('/api/user/update', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (response.ok) {
            setMessage('Профиль обновлен');
            onClose();
        } else {
            const errorData = await response.json();
            setMessage(errorData.error || 'Ошибка при обновлении профиля');
        }
    };

    const handleChangePassword = async () => {
        if (password !== confirmPassword) {
            setMessage('Пароли не совпадают');
            return;
        }

        const token = Cookies.get('token');
        const response = await fetch('/api/user/change-password', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        if (response.ok) {
            setMessage('Пароль обновлен');
            setPassword('');
            setConfirmPassword('');
        } else {
            const errorData = await response.json();
            setMessage(errorData.error || 'Ошибка при обновлении пароля');
        }
    };

    const handleDeleteAccount = async () => {
        const token = Cookies.get('token');
        const response = await fetch('/api/user/delete', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            setMessage('Аккаунт удален');
            onClose();
        } else {
            const errorData = await response.json();
            setMessage(errorData.error || 'Ошибка при удалении аккаунта');
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
                }}
            >
                <h2>Редактировать профиль</h2>
                {message && <p className="text-red-500">{message}</p>}
                <TextField
                    fullWidth
                    label="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files) {
                            setAvatar(e.target.files[0]);
                        }
                    }}
                />
                <TextField
                    fullWidth
                    label="Новый пароль"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Подтверждение пароля"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    sx={{ mt: 2 }}
                >
                    Сохранить
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleChangePassword}
                    sx={{ mt: 2, ml: 2 }}
                >
                    Изменить пароль
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteAccount}
                    sx={{ mt: 2, ml: 2 }}
                >
                    Удалить аккаунт
                </Button>
            </Box>
        </Modal>
    );
}
