import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MailIcon from '@mui/icons-material/Mail';
import TelegramIcon from '@mui/icons-material/Telegram'; // Импортируем иконку Telegram

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 transition-colors duration-300">
            <div className="container mx-auto py-8 md:py-12 px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <a href="/" className="text-xl md:text-2xl font-bold tracking-tight transition-colors hover:text-blue-600">TechTrends</a>
                        <p className="mt-2 text-sm text-gray-600">Ваш источник последних технологических трендов, новостей и информации.</p>
                        <div className="mt-4 flex space-x-4">
                            <a href="https://t.me/techtrends_channel" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
                                <TelegramIcon /> {/* Иконка Telegram вместо текста */}
                            </a>
                        </div>
                    </div>
                    <div className="md:col-span-1">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Категории</h3>
                        <ul className="mt-4 grid grid-cols-2 md:grid-cols-1 gap-2">
                            <li><a href="/category/Веб-разработка" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Веб-разработка</a></li>
                            <li><a href="/category/Мобильная-разработка" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Мобильная разработка</a></li>
                            <li><a href="/category/Искусственный-интеллект" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Искусственный интеллект</a></li>
                            <li><a href="/category/Облачные-технологии" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Облачные технологии</a></li>
                            <li><a href="/category/Кибербезопасность" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Кибербезопасность</a></li>
                        </ul>
                    </div>
                    <div className="md:col-span-1">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Быстрые ссылки</h3>
                        <ul className="mt-4 grid grid-cols-2 md:grid-cols-1 gap-2">
                            <li><a href="/about" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">О нас</a></li>
                            <li><a href="/privacy-policy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Политика конфиденциальности</a></li>
                            <li><a href="/terms-of-service" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Условия использования</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
                    <p className="text-xs md:text-sm text-center text-gray-500">© 2025 TechTrends. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
}
