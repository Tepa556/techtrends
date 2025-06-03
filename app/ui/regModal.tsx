"use client"

import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { useThemeStore } from '../lib/ThemeStore';

interface RegModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRegister: (username: string, email: string, password: string, phone: string) => Promise<void>;
    error: string | null;
    onOpenLogin: () => void;
}

export default function RegModal({ isOpen, onClose, onRegister, error, onOpenLogin }: RegModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const { theme } = useThemeStore();
    const [phone, setPhone] = useState('');

    const formatPhoneNumber = (value: string) => {
        // Удаляем все символы кроме цифр
        const phoneNumber = value.replace(/\D/g, '');
        
        // Ограничиваем до 11 цифр (включая код страны)
        const truncated = phoneNumber.slice(0, 11);
        
        // Форматируем в зависимости от длины
        if (truncated.length === 0) return '';
        if (truncated.length <= 1) return `+7`;
        if (truncated.length <= 4) return `+7 (${truncated.slice(1)}`;
        if (truncated.length <= 7) return `+7 (${truncated.slice(1, 4)}) ${truncated.slice(4)}`;
        if (truncated.length <= 9) return `+7 (${truncated.slice(1, 4)}) ${truncated.slice(4, 7)}-${truncated.slice(7)}`;
        return `+7 (${truncated.slice(1, 4)}) ${truncated.slice(4, 7)}-${truncated.slice(7, 9)}-${truncated.slice(9, 11)}`;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        setPhone(formatted);
    };

    const validateUsername = (username: string): boolean => {
        return username.length >= 3 && username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(username);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        
        if (!privacyAccepted) {
            setFormError('Необходимо принять политику конфиденциальности');
            return;
        }
        
        if (password !== confirmPassword) {
            setFormError('Пароли не совпадают');
            return;
        }
        
        if (!email || !password || !username || !phone) {
            setFormError('Все поля обязательны для заполнения');
            return;
        }
        
        if (!validateUsername(username)) {
            setFormError('Никнейм должен содержать от 3 до 20 символов и может включать только буквы, цифры и знак подчеркивания');
            return;
        }
        
        setIsLoading(true);
        try {
            await onRegister(username, email, password, phone);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog 
            open={isOpen} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            className={theme === 'dark' ? 'bg-gray-900' : 'bg-white'}
        >
            <DialogTitle className={`relative font-bold ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white'}`}>
                <p className='font-bold'>Регистрация</p>
                <button
                    onClick={onClose}
                    className={`absolute right-6 top-3 ${theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                >
                    <CloseIcon className='cursor-pointer' />
                </button>
            </DialogTitle>
            <DialogContent className={theme === 'dark' ? 'bg-gray-900' : 'bg-white'}>
                {isLoading ? (
                    <div className="flex justify-center my-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="relative">
                                <label 
                                    htmlFor="username"
                                    className={`block mb-2 text-sm font-medium ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}
                                >
                                    Имя пользователя
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-lg border ${
                                        theme === 'dark' 
                                            ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500' 
                                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                    } focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                                    placeholder="Введите имя пользователя"
                                    required
                                />
                                <p className={`mt-1 text-xs ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                    От 3 до 20 символов, только буквы, цифры и знак подчеркивания
                                </p>
                            </div>

                            <div className="relative">
                                <label 
                                    htmlFor="email"
                                    className={`block mb-2 text-sm font-medium ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}
                                >
                                    Электронная почта
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-lg border ${
                                        theme === 'dark' 
                                            ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500' 
                                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                    } focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                                    placeholder="Введите email"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <label 
                                    htmlFor="password"
                                    className={`block mb-2 text-sm font-medium ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}
                                >
                                    Пароль
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-lg border ${
                                        theme === 'dark' 
                                            ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500' 
                                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                    } focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                                    placeholder="Введите пароль"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <label 
                                    htmlFor="confirmPassword"
                                    className={`block mb-2 text-sm font-medium ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}
                                >
                                    Подтвердите пароль
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-lg border ${
                                        theme === 'dark' 
                                            ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500' 
                                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                    } focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                                    placeholder="Подтвердите пароль"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <label 
                                    htmlFor="phone"
                                    className={`block mb-2 text-sm font-medium ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}
                                >
                                    Номер телефона
                                </label>
                                <input
                                    id="phone"
                                    type="tel"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    className={`w-full px-4 py-2 rounded-lg border ${
                                        theme === 'dark' 
                                            ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500' 
                                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                    } focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors`}
                                    placeholder="+7 (999) 999-99-99"
                                    required
                                />
                                <p className={`mt-1 text-xs ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                    Российский номер телефона
                                </p>
                            </div>
                        </div>
                        <FormControlLabel
                            control={
                                <Checkbox 
                                    checked={privacyAccepted}
                                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label={
                                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                                    Я согласен с <Link href="/privacy-policy" target="_blank" className={`${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-700'}`}>политикой конфиденциальности</Link>
                                </span>
                            }
                        />
                        {formError && <p className="text-red-500">{formError}</p>}
                        {error && <p className="text-red-500">{error}</p>}
                    </form>
                )}
            </DialogContent>
            <div className={`flex justify-center px-6 pb-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                <button
                    onClick={handleSubmit} 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow-sm transition-colors duration-200"
                    disabled={isLoading}
                >
                    {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
                </button>
            </div>
            <div className={`px-6 pb-6 text-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Уже есть аккаунт? 
                    <button 
                        onClick={onOpenLogin} 
                        className={`ml-2 ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-700'} font-medium transition-colors`} 
                        disabled={isLoading}
                    >
                        Войти
                    </button>
                </p>
            </div>
        </Dialog>
    );
}