"use client"
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface SubscribeButtonProps {
    userEmail: string; // Email пользователя, на которого подписываемся
    currentUserEmail: string; // Email текущего пользователя
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({ userEmail, currentUserEmail }) => {
    const [isSubscribed, setIsSubscribed] = useState(false); // Состояние подписки
    const [loading, setLoading] = useState(true); // Состояние загрузки

    useEffect(() => {
        const checkSubscription = async () => {
            try {
                const response = await fetch(`/api/subscription/${userEmail}/status`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${Cookies.get('token')}`, // Добавляем токен для авторизации
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsSubscribed(data.isSubscribed); // Устанавливаем состояние подписки
                } else {
                    console.error('Ошибка при проверке подписки');
                }
            } catch (error) {
                console.error('Ошибка:', error);
            } finally {
                setLoading(false); // Устанавливаем состояние загрузки в false после завершения проверки
            }
        };

        checkSubscription();
    }, [userEmail, currentUserEmail]);

    const handleSubscribe = async () => {
        const method = isSubscribed ? 'DELETE' : 'POST'; // Определяем метод в зависимости от состояния подписки

        try {
            const response = await fetch(`/api/subscription/${userEmail}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`, // Добавляем токен для авторизации
                },
                body: JSON.stringify({ email: currentUserEmail }), // Передаем email текущего пользователя
            });

            if (!response.ok) {
                throw new Error('Ошибка при изменении подписки');
            }

            setIsSubscribed(!isSubscribed); // Обновляем состояние подписки
        } catch (error) {
            console.error(error);
        }
    };

    // Отображение скелета загрузки
    if (loading) {
        return <div className="animate-pulse bg-gray-300 h-8 w-32 rounded"></div>; // Пример скелета
    }

    return (
        <button
            onClick={handleSubscribe}
            className={`font-bold mt-2 px-4 py-2 rounded-xl transition duration-300 ${isSubscribed ? 'bg-red-500 text-white transition duration-300 hover:bg-red-600' : 'bg-blue-500 text-white transition duration-300 hover:bg-blue-600'}`}
        >
            {isSubscribed ? 'Отписаться' : 'Подписаться'}
        </button>
    );
};

export default SubscribeButton;
