"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();

    const fetchUsers = (token: string) => {
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
        })
        .catch(error => {
            console.error('Ошибка:', error);
            setError('Не удалось загрузить пользователей');
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
        }
    }, []);

    if (error) {
        return <div className="container mx-auto p-4">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4 m-20 h-96">
            <div className='flex justify-center'>
                <h1 className="text-4xl font-bold mb-4">Пользователи</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {users.map(user => (
                    <div key={user._id} className="block bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <Link href={`/profile/${user._id}`} className="flex items-center">
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
                            <SubscribeButton userEmail={user.email} currentUserEmail={currentUserEmail} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
