"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import SubscribeButton from '@/app/ui/SubscribeButton';

interface User {
    _id: string;
    username: string;
    avatar?: string;
    email: string;
}

export default function ProfilesList() {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = (token: string) => {
        setIsLoading(true);
        fetch('/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка при получении списка пользователей');
                }
                return response.json();
            })
            .then(data => {
                setUsers(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Ошибка:', error);
                setError('Не удалось загрузить пользователей');
                setIsLoading(false);
            });
    };

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            const decoded: any = jwt.decode(token);
            setCurrentUserEmail(decoded?.email || null);
            fetchUsers(token);
        } else {
            setError('Токен не найден. Пожалуйста, войдите в систему.');
            setIsLoading(false);
        }
    }, []);

    if (error) {
        return <div className="container mx-auto p-4 text-center text-red-500 font-medium py-8 bg-red-50 rounded-lg">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4 m-20 h-96">
            <div className='flex justify-center'>
                <h1 className="text-4xl font-bold mb-4">Пользователи</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {isLoading ? (
                    // Скелетоны для загрузки
                    Array(6).fill(0).map((_, index) => (
                        <div key={`skeleton-${index}`} className="block bg-white p-4 rounded-lg shadow-md animate-pulse">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                                <div className="h-6 bg-gray-300 rounded w-32"></div>
                            </div>
                            <div className='flex justify-center mt-4'>
                                <div className="h-8 bg-gray-300 rounded w-28"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    // Реальные данные пользователей
                    users.map(user => (
                        <div key={user._id} className="block bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <Link href={`/profiles/${user._id}`} className="flex items-center">
                                {user.avatar && (
                                    <Image
                                        src={user.avatar}
                                        alt={`${user.username} Avatar`}
                                        width={50}
                                        height={50}
                                        className="rounded-full mr-4"
                                    />
                                )}
                                <span className="text-lg font-semibold">{user.username}</span>
                            </Link>
                            {currentUserEmail && (
                                <div className='flex justify-center'>
                                    <SubscribeButton userEmail={user.email} currentUserEmail={currentUserEmail} />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
