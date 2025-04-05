import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MailIcon from '@mui/icons-material/Mail';

export default function Footer() {
    return (
        <footer className=" bg-white border-t border-gray-200 transition-colors duration-300">
            <div className="container mx-auto py-12 px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <a href="/" className="text-2xl font-bold tracking-tight transition-colors hover:text-blue-600">TechTrends</a>
                        <p className="mt-2 text-sm text-gray-600">Ваш источник последних технологических трендов, новостей и информации.</p>
                        <div className="mt-4 flex space-x-4">
                            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors" aria-label="GitHub">
                                <GitHubIcon />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors" aria-label="Twitter">
                                <TwitterIcon />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600 transition-colors" aria-label="LinkedIn">
                                <LinkedInIcon />
                            </a>
                            <a href="mailto:contact@techtrends.com" className="text-gray-500 hover:text-blue-600 transition-colors" aria-label="Email">
                                <MailIcon />
                            </a>
                        </div>
                    </div>
                    <div className="md:col-span-1">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Категории</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="/category/веб-разработка" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Веб-разработка</a></li>
                            <li><a href="/category/мобильная-разработка" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Мобильная разработка</a></li>
                            <li><a href="/category/искусственный-интеллект" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Искусственный интеллект</a></li>
                            <li><a href="/category/большие-данные" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Большие данные</a></li>
                            <li><a href="/category/облачные-технологии" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Облачные технологии</a></li>
                            <li><a href="/category/кибербезопасность" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Кибербезопасность</a></li>
                        </ul>
                    </div>
                    <div className="md:col-span-1">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Быстрые ссылки</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="/about" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">О нас</a></li>
                            <li><a href="/contact" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Контакты</a></li>
                            <li><a href="/privacy-policy" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Политика конфиденциальности</a></li>
                            <li><a href="/terms-of-service" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Условия использования</a></li>
                            <li><a href="/writers" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Наши авторы</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-sm text-center text-gray-500">© 2025 TechTrends. Все права защищены.</p>
                </div>
            </div>
        </footer>
    );
}
