"use client"
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface SubscribeButtonProps {
    userEmail: string; // Email пользователя, на которого подписываемся
    currentUserEmail: string; // Email текущего пользователя
    onSubscriptionChange?: (userEmail: string, isSubscribed: boolean) => void;
}

const SubscribeButton: React.FC<SubscribeButtonProps> = ({ userEmail, currentUserEmail, onSubscriptionChange }) => {
    const [isSubscribed, setIsSubscribed] = useState(false); // Состояние подписки
    const [loading, setLoading] = useState(true); // Состояние загрузки

    useEffect(() => {
        // Проверяем статус подписки при монтировании компонента
        checkSubscriptionStatus();
    }, [userEmail, currentUserEmail]);

    const checkSubscriptionStatus = async () => {
        try {
            const response = await fetch(`/api/subscription/${userEmail}/status/`, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setIsSubscribed(data.isSubscribed);
            }
        } catch (error) {
            console.error('Ошибка при проверке статуса подписки:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async () => {
        const method = isSubscribed ? 'DELETE' : 'POST';
        setLoading(true);

        try {
            const response = await fetch(`/api/subscription/${userEmail}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`,
                },
                body: JSON.stringify({ email: currentUserEmail }),
            });

            if (!response.ok) {
                throw new Error('Ошибка при изменении подписки');
            }

            const newStatus = !isSubscribed;
            setIsSubscribed(newStatus);
            
            // Уведомляем родительский компонент об изменении подписки
            if (onSubscriptionChange) {
                onSubscriptionChange(userEmail, newStatus);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Отображение скелета загрузки
    if (loading) {
        return <div className="animate-pulse bg-gray-300 h-8 w-32 rounded"></div>; // Пример скелета
    }

    return (
        <button
            onClick={handleSubscribe}
            className={`font-bold mt-2 px-4 py-2 rounded-xl transition duration-300 ${
                isSubscribed 
                    ? 'bg-red-500 text-white transition duration-300 hover:bg-red-600' 
                    : 'bg-blue-500 text-white transition duration-300 hover:bg-blue-600'
            }`}
        >
            {isSubscribed ? 'Отписаться' : 'Подписаться'}
        </button>
    );
};

export default SubscribeButton;
