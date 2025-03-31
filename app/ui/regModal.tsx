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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setFormError('Пароли не совпадают');
            return;
        }
        if (!email || !password || !username) {
            setFormError('Все поля обязательны для заполнения');
            return;
        }
        onRegister(username, email, password);
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle className="relative font-bold">
                <p className='font-bold'>Регистрация</p>
                <button
                    onClick={onClose}
                    className="absolute right-6 top-3"
                >
                    <CloseIcon className='cursor-pointer' />
                </button>
            </DialogTitle>
            <DialogContent>
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
            </DialogContent>
            <div className="flex justify-center">
                <button
                    onClick={handleSubmit} 
                    className="w-45 bg-blue-500 text-white font-bold transition duration-300 ease-in-out hover:bg-blue-600 rounded-md py-2"
                >
                    Зарегистрироваться
                </button>
            </div>
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Уже есть аккаунт? <Button onClick={onOpenLogin} className="text-primary hover:underline">Войти</Button>
                </p>
            </div>
        </Dialog>
    );
}