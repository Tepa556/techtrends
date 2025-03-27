"use client"

import { useState, useEffect } from 'react';
import { categories } from '@/app/lib/nav-categories';
import SearchIcon from '@mui/icons-material/Search';
import MoonIcon from '@mui/icons-material/Brightness2';
import AuthModal from './authModal';
import RegModal from './regModal';
import { Avatar } from '@mui/material';
import SearchDialog from './searchModal';

interface Category {
    name: string;
    link: string;
}

export default function Header() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isRegModalOpen, setIsRegModalOpen] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [user, setUser] = useState<{ username: string; avatar: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setUser({ username: 'UserNickname', avatar: 'path/to/avatar.jpg' });
            setIsRegistered(true);
        }
    }, []);

    const handleOpenLogin = () => {
        setIsAuthModalOpen(true);
        setIsRegModalOpen(false);
    };

    const handleOpenRegister = () => {
        setIsRegModalOpen(true);
        setIsAuthModalOpen(false);
    };

    const handleLogin = async (email: string, password: string) => {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('accessToken', data.accessToken);
                setUser({ username: data.username, avatar: data.avatar });
                setIsRegistered(true);
                setIsAuthModalOpen(false);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Ошибка входа. Попробуйте еще раз.');
        }
    };

    const handleRegister = async (username: string, email: string, password: string) => {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('accessToken', data.accessToken);
                setUser({ username: data.username, avatar: data.avatar });
                setIsRegistered(true);
                setIsRegModalOpen(false);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Ошибка регистрации. Попробуйте еще раз.');
        }
    };

    const handleOpenSearch = () => {
        setIsSearchOpen(true);
    };

    const handleCloseSearch = () => {
        setIsSearchOpen(false);
    };

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white backdrop-blur-md shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <a href="/" className="text-xl font-bold tracking-tight transition-colors hover:text-blue-500">TechTrends</a>
                    </div>
                    <nav className="flex items-center space-x-1">
                        <a href="/" className="px-3 py-2 rounded-md text-sm font-semibold transition-colors text-primary hover:text-blue-500">Главная</a>
                        <div className="relative group">
                            <button className="px-3 py-2 rounded-md text-sm font-semibold transition-colors hover:text-blue-500">Категории</button>
                            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                {categories.map((category: Category) => (
                                    <a key={category.name} href={category.link} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-semibold">
                                        {category.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <a href="/about" className="px-3 py-2 rounded-md text-sm font-semibold transition-colors hover:text-blue-500">О нас</a>
                        <button 
                            onClick={handleOpenSearch} 
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-100 h-10 w-10"
                        >
                            <SearchIcon className="h-5 w-5" />
                        </button>
                        {isRegistered ? (
                            <div className="flex items-center space-x-2">
                                <Avatar src={user?.avatar} alt={user?.username} />
                                <span className="text-sm font-semibold">{user?.username}</span>
                            </div>
                        ) : (
                            <div className="ml-4 flex items-center space-x-2">
                                <button onClick={handleOpenLogin} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-100 h-10 px-4 py-2">Войти</button>
                                <button onClick={handleOpenRegister} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold bg-blue-500 text-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-blue-600 h-10 px-4 py-2">Регистрация</button>
                            </div>
                        )}
                    </nav>
                </div>
            </header>
            <AuthModal 
                isOpen={isAuthModalOpen} 
                onClose={() => setIsAuthModalOpen(false)} 
                onLogin={handleLogin} 
                onRegister={handleRegister} 
                error={error} 
                onOpenRegister={handleOpenRegister}
            />
            <RegModal 
                isOpen={isRegModalOpen} 
                onClose={() => setIsRegModalOpen(false)} 
                onRegister={handleRegister} 
                error={error} 
                onOpenLogin={handleOpenLogin}
            />
            <SearchDialog 
                isOpen={isSearchOpen} 
                onClose={handleCloseSearch} 
            />
        </>
    );
}

