"use client";
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { categories } from '@/app/lib/nav-categories';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AuthModal from '../ui/authModal';
import RegModal from '../ui/regModal';
import SearchDialog from '../ui/searchModal';
import Link from 'next/link';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/navigation';
import ThemeToogle from '../ui/ThemeToogle';
import { useThemeStore } from '../lib/ThemeStore';
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
    const { theme } = useThemeStore();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isRegModalOpen, setIsRegModalOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const removeToken = useCallback(() => {
        Cookies.remove('token');
        setUser(null);
        setLoading(false);
        console.log('Токен удален, пользователь разлогинен');
        router.push('/');
    }, [router]);

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            const decoded: any = jwt.decode(token);
            const currentTime = Date.now() / 1000;
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
        setIsMobileMenuOpen(false);
    };

    const handleOpenRegister = () => {
        setIsRegModalOpen(true);
        setIsAuthModalOpen(false);
        setIsMobileMenuOpen(false);
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

    const handleRegister = async (username: string, email: string, password: string, phone: string) => {
        try {
            const response = await fetch('/api/reg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, phone }),
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
        setIsMobileMenuOpen(false);
    };

    const handleCloseSearch = () => {
        setIsSearchOpen(false);
    };



    const handleProfilesClick = () => {
        if (user) {
            window.location.href = '/profiles';
        } else {
            setIsAuthModalOpen(true);
        }
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    useEffect(() => {
        console.log(theme);
    }, [theme]);
    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 shadow-sm ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Image src={theme === 'dark' ? '/logo/Logo-dark.png' : '/logo/Logo-light.png'} alt="Logo" width={50} height={50} />
                            <Link href="/" className="flex-shrink-0 flex items-center">
                                <h1 className={`text-2xl font-bold transition-colors hover:text-blue-600 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>TechTrends</h1>
                            </Link>
                        </div>
                        
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-1">
                            <a href="/" className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${theme === 'dark' ? 'text-white hover:text-blue-400' : 'text-primary hover:text-blue-500'}`}>Главная</a>
                            <div className="relative group">
                                <button className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${theme === 'dark' ? 'text-white hover:text-blue-400' : 'hover:text-blue-500'}`}>Категории</button>
                                <div className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10`}>
                                    {categories.map((category: Category) => (
                                        <a key={category.name} href={category.link} className={`block px-4 py-2 text-sm font-semibold ${theme === 'dark' ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                                            {category.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <a href="/about" className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${theme === 'dark' ? 'text-white hover:text-blue-400' : 'hover:text-blue-500'}`}>О нас</a>
                            <button
                                onClick={handleProfilesClick}
                                className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${theme === 'dark' ? 'text-white hover:text-blue-400' : 'hover:text-blue-500'}`}
                            >
                                Профили
                            </button>
                            <button
                                onClick={handleOpenSearch}
                                className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} h-10 w-10`}
                            >
                                <SearchIcon className="h-5 w-5" />
                            </button>
                            <ThemeToogle />
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <div className={`h-4 w-32 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded animate-pulse`}></div>
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
                                    <Link href={`/profile`} className={`text-sm font-semibold hover:underline transition duration-200 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                                        {user.username || user.email}
                                    </Link>
                                </div>
                            ) : (
                                <div className="ml-4 flex items-center space-x-2">
                                    <button onClick={handleOpenLogin} className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} h-10 px-4 py-2`}>Войти</button>
                                    <button onClick={handleOpenRegister} className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2`}>Регистрация</button>
                                </div>
                            )}
                        </nav>

                        {/* Mobile Navigation Icons */}
                        <div className="flex items-center space-x-4 md:hidden">
                            <button 
                                className={`p-1 rounded-full ${theme === 'dark' ? 'text-white hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors focus:outline-none`} 
                                onClick={handleOpenSearch}
                            >
                                <SearchIcon />
                            </button>
                            <ThemeToogle />
                            <button 
                                className={`p-1 rounded-full ${theme === 'dark' ? 'text-white hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors focus:outline-none`} 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className={`md:hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-t border-gray-200 shadow-lg`}>
                        <div className="px-2 pt-2 pb-4 space-y-1">
                            <a href="/" className={`block px-3 py-3 rounded-md text-base font-bold ${theme === 'dark' ? 'text-white hover:text-blue-400' : 'hover:text-blue-600'} transition-colors`}>Главная</a>
                            
                            {/* Mobile Categories Dropdown */}
                            <div className="relative">
                                <button 
                                    onClick={() => document.getElementById('mobile-categories')?.classList.toggle('hidden')}
                                    className={`w-full text-left block px-3 py-3 rounded-md text-base font-bold ${theme === 'dark' ? 'text-white hover:text-blue-400' : 'hover:text-blue-600'} transition-colors`}
                                >
                                    Категории
                                </button>
                                <div id="mobile-categories" className="hidden pl-4">
                                    {categories.map((category: Category) => (
                                        <a 
                                            key={category.name} 
                                            href={category.link} 
                                            className={`block px-3 py-2 rounded-md text-sm font-bold ${theme === 'dark' ? 'text-white hover:text-blue-400' : 'hover:text-blue-600'} transition-colors`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {category.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                            
                            <a href="/about" className={`block px-3 py-3 rounded-md text-base font-bold ${theme === 'dark' ? 'text-white hover:text-blue-400' : 'hover:text-blue-600'} transition-colors`}>О нас</a>
                            <button
                                onClick={handleProfilesClick}
                                className={`w-full text-left block px-3 py-3 rounded-md text-base font-bold ${theme === 'dark' ? 'text-white hover:text-blue-400' : 'hover:text-blue-600'} transition-colors`}
                            >
                                Профили
                            </button>
                            
                            {user ? (
                                <div className="border-t border-gray-200 pt-2">
                                    <div className="px-3 py-2 flex items-center">
                                        {user.avatar && (
                                            <Image
                                                src={user.avatar}
                                                alt="User Avatar"
                                                width={32}
                                                height={32}
                                                className="rounded-full mr-2"
                                            />
                                        )}
                                        <Link 
                                            href={`/profile`} 
                                            className={`text-base font-bold ${theme === 'dark' ? 'text-white hover:text-blue-400' : 'hover:text-blue-600'} transition-colors`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {user.username || user.email}
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="border-t border-gray-200 pt-2 flex flex-col items-center space-y-2 p-3">
                                    <button 
                                        onClick={handleOpenLogin} 
                                        className={`w-96 py-2 px-4 rounded-md text-center text-base font-bold border ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'} transition-colors`}
                                    >
                                        Войти
                                    </button>
                                    <button 
                                        onClick={handleOpenRegister} 
                                        className={`w-96 py-2 px-4 rounded-md text-center text-base font-bold ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-colors`}
                                    >
                                        Регистрация
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>
            
            {/* Отступ для содержимого страницы под фиксированным header */}
            <div className="pt-16"></div>
            
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
