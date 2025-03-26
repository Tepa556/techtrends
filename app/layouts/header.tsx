"use client"

import { categories } from '@/app/lib/nav-categories';
import SearchIcon from '@mui/icons-material/Search';
import MoonIcon from '@mui/icons-material/Brightness2';

interface Category {
    name: string;
    link: string;
}

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white backdrop-blur-md shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center">
                    <a href="/" className="text-xl font-bold tracking-tight transition-colors hover:text-blue-500">TechTrends</a>
                </div>
                <nav className="flex items-center space-x-1">
                    <a href="/" className="px-3 py-2 rounded-md text-sm font-semibold transition-colors text-primary hover:text-blue-500">Главная</a>
                    <div className="relative group">
                        <button className="px-3 py-2 rounded-md text-sm font-semibold transition-colors hover:text-blue-500">Категории</button>
                        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white  opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                            {categories.map((category: Category) => (
                                <a key={category.name} href={category.link} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-semibold">
                                    {category.name}
                                </a>
                            ))}
                        </div>
                    </div>
                    <a href="/about" className="px-3 py-2 rounded-md text-sm font-semibold transition-colors hover:text-blue-500">О нас</a>
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-100 h-10 w-10" aria-label="Поиск">
                        <SearchIcon className="h-5 w-5" />
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full h-10 w-10 transition-all duration-300 hover:bg-gray-100" aria-label="Переключиться на темную тему">
                        <MoonIcon className="h-[1.2rem] w-[1.2rem] transition-all duration-300" />
                        <span className="sr-only">Переключиться на светлую тему</span>
                    </button>
                    <div className="ml-4 flex items-center space-x-2">
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-100 h-10 px-4 py-2">Войти</button>
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold bg-blue-500 text-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-blue-600 h-10 px-4 py-2">Регистрация</button>
                    </div>
                </nav>
            </div>
        </header>
    );
}

