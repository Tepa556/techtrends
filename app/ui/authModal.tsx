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
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onLogin(email, password);
        } finally {
            setIsLoading(false);
        }
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
                    className="absolute right-6 top-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <CloseIcon className='cursor-pointer'/>
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
                )}
            </DialogContent>
            
            <div className="flex justify-center px-6 pb-6">
                <button
                    onClick={handleSubmit} 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow-sm transition-colors duration-200"
                    disabled={isLoading}
                >
                    {isLoading ? 'Загрузка...' : 'Войти'}
                </button>
            </div>
            <div className="px-6 pb-6 text-center">
                <p className="text-sm text-gray-600">
                    Еще нет аккаунта? 
                    <button 
                        onClick={handleOpenRegister} 
                        className="ml-2 text-blue-500 hover:text-blue-700 font-medium transition-colors" 
                        disabled={isLoading}
                    >
                        Зарегистрироваться
                    </button>
                </p>
            </div>
        </Dialog>
    );
}
