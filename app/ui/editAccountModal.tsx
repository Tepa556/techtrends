"use client"

import { useState, useRef, useEffect } from 'react';
import { Modal, Box, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { User } from '@/app/types/user';
import { useThemeStore } from '../lib/ThemeStore';
interface UserEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUserUpdated?: (updatedUser: User) => void;
}

export default function EditAccountModal({ isOpen, onClose, onUserUpdated }: UserEditModalProps) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { theme } = useThemeStore();
    // Загружаем данные пользователя при открытии модального окна
    useEffect(() => {
        if (isOpen) {
            fetchUserData();
        }
    }, [isOpen]);

    const fetchUserData = async () => {
        setIsLoading(true);
        const token = Cookies.get('token');
        
        try {
            const response = await fetch('/api/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                setUsername(userData.username || '');
                setEmail(userData.email);
                setAvatarPreview(userData.avatar || null);
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || 'Ошибка при загрузке данных пользователя');
            }
        } catch (error) {
            setMessage('Произошла ошибка при обращении к серверу');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onloadend = () => {
                setAvatar(file);
                setAvatarPreview(reader.result as string);
            };
            
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        const token = Cookies.get('token');
        try {
            const response = await fetch('/api/user/update', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    email,
                    avatarBase64: avatarPreview && avatarPreview.startsWith('data:') ? avatarPreview : null
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage('Профиль обновлен');
                
                setTimeout(() => {
                    setMessage(null);
                    onClose();
                    
                    if (onUserUpdated && data.user) {
                        onUserUpdated(data.user);
                    } else {
                        window.location.reload();
                    }
                }, 1500);
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || 'Ошибка при обновлении профиля');
            }
        } catch (error) {
            setMessage('Произошла ошибка при обращении к серверу');
        }
    };

    const handleChangePassword = async () => {
        if (password !== confirmPassword) {
            setMessage('Пароли не совпадают');
            return;
        }

        const token = Cookies.get('token');
        try {
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
                setTimeout(() => {
                    setMessage(null);
                }, 1500);
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || 'Ошибка при изменении пароля');
            }
        } catch (error) {
            setMessage('Произошла ошибка при обращении к серверу');
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.')) {
            return;
        }

        const token = Cookies.get('token');
        try {
            const response = await fetch('/api/user/delete', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                Cookies.remove('token');
                window.location.href = '/login'; // Перенаправление на страницу входа
            } else {
                const errorData = await response.json();
                setMessage(errorData.error || 'Ошибка при удалении аккаунта');
            }
        } catch (error) {
            setMessage('Произошла ошибка при обращении к серверу');
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
                
                <div className="flex justify-between items-center mb-4 ">
                    <h2 className={`font-bold text-xl ${theme === 'dark' ? 'text-white' : ''}`}>Редактировать профиль</h2>
                    <IconButton 
                        onClick={onClose}
                        sx={{ 
                            color: 'gray',
                            '&:hover': {
                                color: 'black',
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
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
                    <>
                        {/* Аватар с возможностью загрузки */}
                        <div className="flex flex-col items-center mb-6">
                            <div 
                                onClick={handleAvatarClick}
                                className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors group mb-2"
                            >
                                {avatarPreview ? (
                                    <img 
                                        src={avatarPreview.startsWith('data:') ? avatarPreview : avatarPreview}
                                        alt="Avatar preview" 
                                        className="absolute w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                )}
                                <div 
                                    className="absolute inset-0 flex items-center justify-center transition-all hover-overlay"
                                    style={{ 
                                        backgroundColor: 'rgba(0, 0, 0, 0)', 
                                        transition: 'background-color 0.3s' 
                                    }}
                                    onMouseEnter={(e) => { 
                                        (e.target as HTMLDivElement).style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                                    }}
                                    onMouseLeave={(e) => { 
                                        (e.target as HTMLDivElement).style.backgroundColor = 'rgba(0, 0, 0, 0)';
                                    }}
                                >
                                    <span className="text-white opacity-0 group-hover:opacity-100 font-medium">Изменить фото</span>
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                            <p className="text-sm text-gray-500">Нажмите на изображение для загрузки новой аватарки</p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label className={`mb-2 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                                    Имя пользователя
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="Введите имя пользователя"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={`mb-2 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="Введите email"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={`mb-2 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                                    Новый пароль
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="Введите новый пароль"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className={`mb-2 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                                    Подтверждение пароля
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="Подтвердите новый пароль"
                                />
                            </div>
                        </div>
                        
                        <div className="flex space-x-4 mt-6">
                            <button 
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded shadow-sm transition-colors duration-200 flex-1"
                                onClick={handleSave}
                            >
                                Сохранить
                            </button>
                            <button 
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded shadow-sm transition-colors duration-200 flex-1"
                                onClick={handleChangePassword}
                            >
                                Изменить пароль
                            </button>
                        </div>
                        
                        <div className="mt-8">
                            <button 
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow-sm transition-colors duration-200 w-full"
                                onClick={handleDeleteAccount}
                            >
                                Удалить аккаунт
                            </button>
                        </div>
                    </>
                )}
            </Box>
        </Modal>
    );
}
