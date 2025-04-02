"use client"

import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface RegModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRegister: (username: string, email: string, password: string) => Promise<void>;
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setFormError('Пароли не совпадают');
            return;
        }
        if (!email || !password || !username) {
            setFormError('Все поля обязательны для заполнения');
            return;
        }
        
        setIsLoading(true);
        try {
            await onRegister(username, email, password);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle className="relative font-bold">
                <p className='font-bold'>Регистрация</p>
                <button
                    onClick={onClose}
                    className="absolute right-6 top-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <CloseIcon className='cursor-pointer' />
                </button>
            </DialogTitle>
            <DialogContent>
                {isLoading ? (
                    <div className="flex justify-center my-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <TextField
                            label="Имя пользователя"
                            variant="outlined"
                            fullWidth
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            label="Электронная почта"
                            variant="outlined"
                            type="email"
                            fullWidth
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            label="Пароль"
                            variant="outlined"
                            type="password"
                            fullWidth
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            label="Подтвердите пароль"
                            variant="outlined"
                            type="password"
                            fullWidth
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            margin="normal"
                        />
                        {formError && <p className="text-red-500">{formError}</p>}
                        {error && <p className="text-red-500">{error}</p>}
                    </form>
                )}
            </DialogContent>
            <div className="flex justify-center px-6 pb-6">
                <button
                    onClick={handleSubmit} 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow-sm transition-colors duration-200"
                    disabled={isLoading}
                >
                    {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
                </button>
            </div>
            <div className="px-6 pb-6 text-center">
                <p className="text-sm text-gray-600">
                    Уже есть аккаунт? 
                    <button 
                        onClick={onOpenLogin} 
                        className="ml-2 text-blue-500 hover:text-blue-700 font-medium transition-colors" 
                        disabled={isLoading}
                    >
                        Войти
                    </button>
                </p>
            </div>
        </Dialog>
    );
}