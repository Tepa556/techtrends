"use client"
import { Telegram } from '@mui/icons-material'; // Импортируем иконку Telegram

const SubscribeSection = () => {
    return (
        <section className="py-16 md:py-24 h-[600px] bg-gray-100 flex items-center justify-center relative overflow-hidden">
            <div className="container mx-auto px-4 relative">
                <div className="max-w-3xl mx-auto text-center">
                    <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">Оставайтесь в курсе</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-1 mb-4">Подпишитесь на наш Telegram-канал</h2>
                    <p className="text-lg mb-8">
                        Присоединяйтесь к нашему Telegram-каналу, чтобы первыми получать последние технологические тренды, новости и статьи. Никакого спама, только качественный контент.
                    </p>
                    <div className="max-w-md mx-auto">
                        <a 
                            href="https://t.me/techtrends_channel" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center justify-center gap-2 glass-button px-6 py-3 rounded-lg whitespace-nowrap text-white font-bold transition-colors duration-300 bg-blue-500 hover:bg-blue-600"
                        >
                            <Telegram /> Подписаться на Telegram-канал
                        </a>
                        <p className="text-xs mt-5">
                            Подписавшись на наш канал, вы всегда будете в курсе самых актуальных новостей и трендов в мире технологий.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SubscribeSection;
