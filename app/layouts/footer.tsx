"use client"
import TelegramIcon from '@mui/icons-material/Telegram';
import { useThemeStore } from '../lib/ThemeStore';
import Link from 'next/link';

export default function Footer() {
    const { theme } = useThemeStore();
    
    return (
        <footer className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-t transition-colors duration-300`}>
            <div className="container mx-auto py-8 md:py-12 px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <Link href="/" className={`text-xl md:text-2xl font-bold tracking-tight transition-colors hover:text-blue-600 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>TechTrends</Link>
                        <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Ваш источник последних технологических трендов, новостей и информации.</p>
                        <div className="mt-4 flex space-x-4">
                            <a href="https://t.me/techtrends_channel" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                                <TelegramIcon />
                            </a>
                        </div>
                    </div>
                    <div className="md:col-span-1">
                        <h3 className={`text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Категории</h3>
                        <ul className="mt-4 grid grid-cols-2 md:grid-cols-1 gap-2">
                            <li><Link href="/category/Веб-разработка" className={`text-sm hover:text-blue-600 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Веб-разработка</Link></li>
                            <li><Link href="/category/Мобильная-разработка" className={`text-sm hover:text-blue-600 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Мобильная разработка</Link></li>
                            <li><Link href="/category/Искусственный-интеллект" className={`text-sm hover:text-blue-600 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Искусственный интеллект</Link></li>
                            <li><Link href="/category/Облачные-технологии" className={`text-sm hover:text-blue-600 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Облачные технологии</Link></li>
                            <li><Link href="/category/Кибербезопасность" className={`text-sm hover:text-blue-600 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Кибербезопасность</Link></li>
                        </ul>
                    </div>
                    <div className="md:col-span-1">
                        <h3 className={`text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Быстрые ссылки</h3>
                        <ul className="mt-4 grid grid-cols-2 md:grid-cols-1 gap-2">
                            <li><a href="/about" className={`text-sm hover:text-blue-600 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>О нас</a></li>
                            <li><a href="/privacy-policy" className={`text-sm hover:text-blue-600 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Политика конфиденциальности</a></li>
                            <li><a href="/terms-of-service" className={`text-sm hover:text-blue-600 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Условия использования</a></li>
                        </ul>
                    </div>
                </div>
                <div className={`mt-8 md:mt-12 pt-6 md:pt-8 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-xs md:text-sm text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>© 2025 TechTrends. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
}
