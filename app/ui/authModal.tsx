"use client"
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useThemeStore } from '../lib/ThemeStore';

interface AuthModalProps {
    isOpen: boolean;
    onCloseAction: () => void;
    onLoginAction: (email: string, password: string) => Promise<void>;
    onRegisterAction: (username: string, email: string, password: string, phone: string) => Promise<void>;
    error: string | null;
    onOpenRegisterAction: () => void; 
}

export default function AuthModal({ isOpen, onCloseAction, onLoginAction, onRegisterAction, error, onOpenRegisterAction }: AuthModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useThemeStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onLoginAction(email, password);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenRegister = () => {
        onOpenRegisterAction();
        onCloseAction();
    };

    return (
        <Dialog open={isOpen} onClose={onCloseAction} maxWidth="sm" fullWidth>
            <DialogTitle className={`relative font-bold ${theme === 'dark' ? 'text-white bg-gray-900' : 'text-gray-800 bg-white'}`}>
                <p className='font-bold '>Вход</p>
                <button
                    onClick={onCloseAction}
                    className="absolute right-6 top-3 text-gray-500 hover:text-gray-700 transition-colors "
                >
                    <CloseIcon className='cursor-pointer'/>
                </button>
            </DialogTitle>
            <DialogContent className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                {isLoading ? (
                    <div className="flex justify-center my-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-4">
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
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                        </div>
                    </form>
                )}
            </DialogContent>
            
            <div className={`flex justify-center px-6 pb-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                <button
                    onClick={handleSubmit} 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow-sm transition-colors duration-200"
                    disabled={isLoading}
                >
                    {isLoading ? 'Загрузка...' : 'Войти'}
                </button>
            </div>
            <div className={`px-6 pb-6 text-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Еще нет аккаунта? 
                    <button 
                        onClick={handleOpenRegister} 
                        className={`ml-2 ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-700'} font-medium transition-colors`} 
                        disabled={isLoading}
                    >
                        Зарегистрироваться
                    </button>
                </p>
            </div>
        </Dialog>
    );
}
