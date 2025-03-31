"use client"
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface SubscribeButtonProps {
    userEmail: string; // Email пользователя, на которого подписываемся
    currentUserEmail: string; // Email текущего пользователя
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({ userEmail, currentUserEmail }) => {
    const [isSubscribed, setIsSubscribed] = useState(false); // Состояние подписки

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

    return (
        <button
            onClick={handleSubscribe}
            className={`mt-2 px-4 py-2 rounded transition duration-300 ${isSubscribed ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
        >
            {isSubscribed ? 'Отписаться' : 'Подписаться'}
        </button>
    );
};

export default SubscribeButton;
