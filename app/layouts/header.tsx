"use client"

import { useState, useEffect } from 'react';
import { categories } from '@/app/lib/nav-categories';
import SearchIcon from '@mui/icons-material/Search';
import MoonIcon from '@mui/icons-material/Brightness2';
import AuthModal from './authModal';
import RegModal from './regModal';
import { Avatar } from '@mui/material';
import SearchDialog from './searchModal';
import { jwtDecode } from 'jwt-decode';

interface Category {
    name: string;
    link: string;
}

interface User {
    email: string;
    username?: string;
}

export default function Header() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isRegModalOpen, setIsRegModalOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('/api/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при получении данных пользователя');
                }
                return response.json();
            })
            .then(data => setUser(data))
            .catch(error => console.error('Ошибка:', error));
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
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка при авторизации');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            console.log('Авторизация успешна, токен сохранен');
            setIsAuthModalOpen(false);
            fetchUserData(data.token);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Произошла неизвестная ошибка');
            }
        }
    };

    const handleRegister = async (username: string, email: string, password: string) => {
        try {
            const response = await fetch('/api/reg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ошибка при регистрации');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            console.log('Регистрация успешна, токен сохранен');
            setIsRegModalOpen(false);
            fetchUserData(data.token);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Произошла неизвестная ошибка');
            }
        }
    };

    const fetchUserData = (token: string) => {
        fetch('/api/user', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка при получении данных пользователя');
            }
            return response.json();
        })
        .then(data => setUser(data))
        .catch(error => console.error('Ошибка:', error));
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
                        {user ? (
                            <>
                                <div className="flex items-center space-x-2">
                                    <Avatar src="" alt={user?.username} />
                                    <span className="text-sm font-semibold"><a href="/profile" className='transition duraction-300 hover:text-blue-500 '>{user?.username}</a></span>
                                </div>
                            </>
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

