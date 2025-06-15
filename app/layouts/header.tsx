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

    // Закрытие мобильного меню при клике вне его
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen]);

    // Закрытие мобильного меню при изменении размера экрана
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        console.log(theme);
    }, [theme]);

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 shadow-sm backdrop-blur-sm ${theme === 'dark' ? 'bg-gray-900/95 text-white border-gray-800' : 'bg-white/95 text-black border-gray-200'} border-b`}>
                <div className="container mx-auto px-3 sm:px-4 lg:px-6">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        {/* Logo Section - Адаптивный размер */}
                        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
                            <Image 
                                src={theme === 'dark' ? '/logo/Logo-dark.png' : '/logo/Logo-light.png'} 
                                alt="TechTrends Logo" 
                                width={40} 
                                height={40} 
                                className="sm:w-12 sm:h-12 flex-shrink-0"
                                priority
                            />
                            <Link href="/" className="flex-shrink-0 min-w-0">
                                <h1 className={`text-lg sm:text-xl lg:text-2xl font-bold transition-colors hover:text-blue-600 truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    <span className="hidden sm:inline">TechTrends</span>
                                    <span className="sm:hidden">TT</span>
                                </h1>
                            </Link>
                        </div>
                        
                        {/* Desktop Navigation - Скрыто на планшетах и мобильных */}
                        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
                            <Link href="/" className={`px-2 xl:px-3 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap ${theme === 'dark' ? 'text-white hover:text-blue-400 hover:bg-gray-800' : 'text-gray-700 hover:text-blue-500 hover:bg-gray-100'}`}>
                                Главная
                            </Link>
                            
                            {/* Categories Dropdown */}
                            <div className="relative group">
                                <button className={`px-2 xl:px-3 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap ${theme === 'dark' ? 'text-white hover:text-blue-400 hover:bg-gray-800' : 'text-gray-700 hover:text-blue-500 hover:bg-gray-100'}`}>
                                    Категории
                                </button>
                                <div className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20`}>
                                    {categories.map((category: Category) => (
                                        <Link 
                                            key={category.name} 
                                            href={category.link} 
                                            className={`block px-4 py-2 text-sm font-medium transition-colors ${theme === 'dark' ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            
                            <Link href="/about" className={`px-2 xl:px-3 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap ${theme === 'dark' ? 'text-white hover:text-blue-400 hover:bg-gray-800' : 'text-gray-700 hover:text-blue-500 hover:bg-gray-100'}`}>
                                О нас
                            </Link>
                            
                            <button
                                onClick={handleProfilesClick}
                                className={`px-2 xl:px-3 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap ${theme === 'dark' ? 'text-white hover:text-blue-400 hover:bg-gray-800' : 'text-gray-700 hover:text-blue-500 hover:bg-gray-100'}`}
                            >
                                Профили
                            </button>
                        </nav>

                        {/* Right Section - Адаптивные элементы */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            {/* Search Button */}
                            <button
                                onClick={handleOpenSearch}
                                className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                                aria-label="Поиск"
                            >
                                <SearchIcon className="h-5 w-5" />
                            </button>

                            {/* Theme Toggle */}
                            <ThemeToogle />

                            {/* Desktop User Section - Скрыто на мобильных и планшетах */}
                            <div className="hidden lg:flex items-center ml-2">
                                {loading ? (
                                    <div className={`h-8 w-24 xl:w-32 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded animate-pulse`}></div>
                                ) : user ? (
                                    <div className="flex items-center space-x-2">
                                        {user.avatar && (
                                            <Image
                                                src={user.avatar}
                                                alt="Аватар пользователя"
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                        )}
                                        <Link 
                                            href="/profile" 
                                            className={`text-sm font-semibold hover:underline transition duration-200 truncate max-w-24 xl:max-w-32 ${theme === 'dark' ? 'text-white' : 'text-black'}`}
                                            title={user.username || user.email}
                                        >
                                            {user.username || user.email}
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <button 
                                            onClick={handleOpenLogin} 
                                            className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap ${theme === 'dark' ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                                        >
                                            Войти
                                        </button>
                                        <button 
                                            onClick={handleOpenRegister} 
                                            className={`px-3 py-2 rounded-md text-sm font-semibold text-white transition-colors whitespace-nowrap ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
                                        >
                                            <span className="hidden xl:inline">Регистрация</span>
                                            <span className="xl:hidden">Регистр.</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Menu Button - Показано только на мобильных и планшетах */}
                            <button 
                                className={`lg:hidden p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'text-white hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'}`} 
                                onClick={toggleMobileMenu}
                                aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                            >
                                {isMobileMenuOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu - Улучшенная адаптивность */}
                {isMobileMenuOpen && (
                    <div className={`lg:hidden mobile-menu-container ${theme === 'dark' ? 'bg-gray-800/95' : 'bg-white/95'} border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-lg backdrop-blur-sm`}>
                        <div className="px-3 sm:px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
                            {/* Navigation Links */}
                            <Link 
                                href="/" 
                                className={`block px-3 py-3 rounded-md text-base font-semibold transition-colors ${theme === 'dark' ? 'text-white hover:text-blue-400 hover:bg-gray-700' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Главная
                            </Link>
                            
                            {/* Mobile Categories */}
                            <div className="space-y-1">
                                <div className={`px-3 py-2 text-base font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                    Категории
                                </div>
                                <div className="pl-4 space-y-1">
                                    {categories.map((category: Category) => (
                                        <Link 
                                            key={category.name} 
                                            href={category.link} 
                                            className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${theme === 'dark' ? 'text-white hover:text-blue-400 hover:bg-gray-700' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'}`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            
                            <Link 
                                href="/about" 
                                className={`block px-3 py-3 rounded-md text-base font-semibold transition-colors ${theme === 'dark' ? 'text-white hover:text-blue-400 hover:bg-gray-700' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                О нас
                            </Link>
                            
                            <button
                                onClick={handleProfilesClick}
                                className={`w-full text-left block px-3 py-3 rounded-md text-base font-semibold transition-colors ${theme === 'dark' ? 'text-white hover:text-blue-400 hover:bg-gray-700' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'}`}
                            >
                                Профили
                            </button>
                            
                            {/* Mobile User Section */}
                            <div className={`border-t pt-4 mt-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                                {loading ? (
                                    <div className="px-3 py-2">
                                        <div className={`h-8 w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} rounded animate-pulse`}></div>
                                    </div>
                                ) : user ? (
                                    <div className="px-3 py-2">
                                        <Link 
                                            href="/profile" 
                                            className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {user.avatar && (
                                                <Image
                                                    src={user.avatar}
                                                    alt="Аватар пользователя"
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className={`text-base font-semibold truncate ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                                    {user.username || user.email}
                                                </div>
                                                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    Перейти в профиль
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="px-3 space-y-3">
                                        <button 
                                            onClick={handleOpenLogin} 
                                            className={`w-full py-3 px-4 rounded-md text-center text-base font-semibold border transition-colors ${theme === 'dark' ? 'border-gray-600 text-white hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            Войти
                                        </button>
                                        <button 
                                            onClick={handleOpenRegister} 
                                            className={`w-full py-3 px-4 rounded-md text-center text-base font-semibold text-white transition-colors ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
                                        >
                                            Регистрация
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </header>
            
            {/* Spacer for fixed header */}
            <div className="h-14 sm:h-16"></div>
            
            {/* Modals */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onCloseAction={() => setIsAuthModalOpen(false)}
                onLoginAction={handleLogin}
                onRegisterAction={handleRegister}
                error={error}
                onOpenRegisterAction={() => {
                    setIsAuthModalOpen(false);
                    setIsRegModalOpen(true);
                }}
            />
            <RegModal
                isOpen={isRegModalOpen}
                onCloseAction={() => setIsRegModalOpen(false)}
                onRegisterAction={handleRegister}
                error={error}
                onOpenLoginAction={() => {
                    setIsRegModalOpen(false);
                    setIsAuthModalOpen(true);
                }}
            />
            <SearchDialog
                isOpen={isSearchOpen}
                onClose={handleCloseSearch}
            />
        </>
    );
}
