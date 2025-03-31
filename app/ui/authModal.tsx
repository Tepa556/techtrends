"use client"
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (email: string, password: string) => Promise<void>;
    onRegister: (username: string, email: string, password: string) => Promise<void>;
    error: string | null;
    onOpenRegister: () => void; 
}

export default function AuthModal({ isOpen, onClose, onLogin, onRegister, error, onOpenRegister }: AuthModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    const handleOpenRegister = () => {
        onOpenRegister();
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle className="relative font-bold">
                <p className='font-bold'>Вход</p>
                <button
                    onClick={onClose}
                    className="absolute right-6 top-3"
                >
                    <CloseIcon className='cursor-pointer'/>
                </button>
            </DialogTitle>
            <DialogContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
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
                    {error && <p className="text-red-500">{error}</p>}
                </form>
            </DialogContent>
            <div className="flex justify-center">
                <button
                    onClick={handleSubmit} 
                    className="w-45 bg-blue-500 text-white font-bold transition duration-300 ease-in-out hover:bg-blue-600 rounded-md py-2"
                >
                    Войти
                </button>
            </div>
            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Еще нет аккаунта? <Button onClick={handleOpenRegister} className="text-primary hover:underline">Зарегистрироваться</Button>
                </p>
            </div>
        </Dialog>
    );
}
