"use client";
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { categories } from '@/app/lib/nav-categories';
import SearchIcon from '@mui/icons-material/Search';
import MoonIcon from '@mui/icons-material/Brightness2';
import AuthModal from '../ui/authModal';
import RegModal from '../ui/regModal';
import { Avatar } from '@mui/material';
import SearchDialog from '../ui/searchModal';
import Link from 'next/link';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/navigation';

interface Category {
    name: string;
    link: string;
}
interface User {
    email: string;
    username?: string;
    avatar?: string;
}

export default function Header() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isRegModalOpen, setIsRegModalOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const removeToken = useCallback(() => {
        Cookies.remove('token');
        setUser(null);
        setLoading(false);
        console.log('Токен удален, пользователь разлогинен');
        router.push('/'); // Redirect to home page
    }, [router]);

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            const decoded: any = jwt.decode(token);
            const currentTime = Date.now() / 1000; // Время в секундах
            if (decoded.exp < currentTime) {
                removeToken();
            } else {
                fetchUserData(token);
            }
        } else {
            setLoading(false);
        }
    }, [removeToken]);

    const fetchUserData = async (token: string) => {
        try {
            const response = await fetch('/api/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                if (response.status === 401) {
                    removeToken();
                }
                throw new Error('Ошибка при получении данных пользователя');
            }
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error('Ошибка при получении данных пользователя:', error);
        } finally {
            setLoading(false);
        }
    };

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
            Cookies.set('token', data.token);
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
            Cookies.set('token', data.token);
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

    const handleOpenSearch = () => {
        setIsSearchOpen(true);
    };

    const handleCloseSearch = () => {
        setIsSearchOpen(false);
    };
    const handleLogout = () => {
        removeToken();
    };
    const handleProfilesClick = () => {
        if (user) {
            window.location.href = '/profiles';
        } else {
            setIsAuthModalOpen(true);
        }
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
                            onClick={handleProfilesClick}
                            className="px-3 py-2 rounded-md text-sm font-semibold transition-colors hover:text-blue-500"
                        >
                            Профили
                        </button>
                        <button
                            onClick={handleOpenSearch}
                            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-100 h-10 w-10"
                        >
                            <SearchIcon className="h-5 w-5" />
                        </button>
                        {loading ? (
                            <div className="flex items-center space-x-2">
                                <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
                            </div>
                        ) : user ? (
                            <div className="flex items-center space-x-2">
                                {user.avatar && (
                                    <Image
                                        src={user.avatar}
                                        alt="User Avatar"
                                        width={32}
                                        height={32}
                                        className="rounded-full"
                                    />
                                )}
                                <Link href={`/profile`} className="text-sm font-semibold hover:underline transition duration-200">
                                    {user.username || user.email}
                                </Link>
 
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
