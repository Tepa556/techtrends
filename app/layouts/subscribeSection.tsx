"use client"
import { useState } from 'react'; // Импортируем useState для управления состоянием
import { Email, Check } from '@mui/icons-material'; // Импортируем иконки из Material-UI

const SubscribeSection = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Логика для обработки подписки
        console.log('Подписка на:', email);
    };

    return (
        <section className="py-16 md:py-24 h-[600px] bg-gray-100 flex items-center justify-center relative overflow-hidden">
            <div className="container mx-auto px-4 relative">
                <div className="max-w-3xl mx-auto text-center">
                    <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">Оставайтесь в курсе</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-1 mb-4">Подпишитесь на нашу рассылку</h2>
                    <p className="text-lg  mb-8">
                        Получайте последние технологические тренды и статьи прямо на ваш почтовый ящик. Без спама, только качественный контент.
                    </p>
                    <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Ваш адрес электронной почты"
                                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="glass-button ml-4 px-6 py-3 rounded-lg whitespace-nowrap text-white font-bold transition-colors duraction-300 bg-blue-500 hover:bg-blue-600">
                                Подписаться
                            </button>
                        </div>
                        <p className="text-xs  mt-5">
                            Подписываясь, вы соглашаетесь с нашей Политикой конфиденциальности и даете согласие на получение обновлений от TechTrends.
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default SubscribeSection;
