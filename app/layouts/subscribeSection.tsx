"use client"
import { Telegram } from '@mui/icons-material';
import { useThemeStore } from '../lib/ThemeStore';

const SubscribeSection = () => {
    const { theme } = useThemeStore();
    
    return (
        <section className={`py-16 md:py-24 h-[600px] ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'} flex items-center justify-center relative overflow-hidden`}>
            <div className="container mx-auto px-4 relative">
                <div className="max-w-3xl mx-auto text-center">
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} uppercase tracking-wider`}>Оставайтесь в курсе</span>
                    <h2 className={`text-3xl md:text-4xl font-bold mt-1 mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Подпишитесь на наш Telegram-канал</h2>
                    <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        Присоединяйтесь к нашему Telegram-каналу, чтобы первыми получать последние технологические тренды, новости и статьи. Никакого спама, только качественный контент.
                    </p>
                    <div className="max-w-md mx-auto">
                        <a 
                            href="https://t.me/techtrendsapp" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center justify-center gap-2 glass-button px-6 py-3 rounded-lg whitespace-nowrap text-white font-bold transition-colors duration-300 bg-blue-500 hover:bg-blue-600"
                        >
                            <Telegram /> Подписаться на Telegram-канал
                        </a>
                        <p className={`text-xs mt-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Подписавшись на наш канал, вы всегда будете в курсе самых актуальных новостей и трендов в мире технологий.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SubscribeSection;
