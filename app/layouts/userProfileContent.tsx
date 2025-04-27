"use client"

import { useEffect, useState } from 'react';
import Image from 'next/image';
import SubscribeButton from '@/app/ui/SubscribeButton';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import Link from 'next/link';
import Favorite from '@mui/icons-material/Favorite';
import Message from '@mui/icons-material/Message';

interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  subscribers?: string[];
  subscriptions?: string[];
}

interface Post {
  _id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  author: string;
  likeCount: number;
  comments: any[];
  status: string;
  createdAt: string;
}

interface UserProfileContentProps {
  userId: string;
}

export default function UserProfileContent({ userId }: UserProfileContentProps) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [activePostIndex, setActivePostIndex] = useState(0);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const decoded: any = jwt.decode(token);
      setCurrentUserEmail(decoded?.email || null);
    }

    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = Cookies.get('token');
        if (!token) {
          setError('Необходима авторизация для просмотра профиля');
          setIsLoading(false);
          return;
        }

        // Получаем информацию о пользователе
        const userResponse = await fetch(`/api/users/${userId}`);
        
        if (!userResponse.ok) {
          throw new Error('Не удалось загрузить данные пользователя');
        }
        
        const userData = await userResponse.json();
        setUser(userData);
        
        // Получаем посты пользователя с передачей JWT токена
        const postsResponse = await fetch(`/api/posts/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!postsResponse.ok) {
          const errorData = await postsResponse.json();
          throw new Error(errorData.error || 'Не удалось загрузить посты пользователя');
        }
        
        const postsData = await postsResponse.json();
        const publishedPosts = postsData.filter((post: Post) => post.status === 'Опубликован');
        setPosts(publishedPosts);
      } catch (error: any) {
        console.error('Ошибка при загрузке данных:', error);
        setError(error.message || 'Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Переключение между постами
  const handleTabChange = (index: number) => {
    setActivePostIndex(index);
  };

  // Компонент Skeleton для профиля
  const ProfileSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
        <div className="mb-4 md:mb-0 md:mr-6">
          <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
        </div>
        <div className="w-full">
          <div className="h-8 bg-gray-300 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-32 mb-4"></div>
          <div className="h-10 bg-gray-300 rounded w-40"></div>
        </div>
      </div>
      <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
      <div className="flex overflow-x-auto pb-2 mb-4">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="h-8 bg-gray-300 rounded w-24 mr-2"></div>
        ))}
      </div>
      <div className="h-96 bg-gray-200 rounded-lg"></div>
    </div>
  );

  // Компонент Skeleton для постов
  const PostsSkeleton = () => (
    <div className="grid grid-cols-1 gap-6 animate-pulse">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-48 bg-gray-300"></div>
        <div className="p-4">
          <div className="h-6 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
          <div className="text-center text-red-500 font-medium py-8 bg-red-50 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
        {isLoading ? (
          <ProfileSkeleton />
        ) : user ? (
          <div>
            <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
              <div className="mb-4 md:mb-0 md:mr-6">
                {user.avatar ? (
                  <Image 
                    src={user.avatar} 
                    alt={`${user.username} аватар`} 
                    width={96} 
                    height={96} 
                    className="rounded-full" 
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 text-xl">{user.username.charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold mb-2">{user.username}</h1>
                <div className="text-gray-600 mb-4">
                  <p>Подписчиков: {user.subscribers?.length || 0}</p>
                  <p>Подписок: {user.subscriptions?.length || 0}</p>
                </div>
                {currentUserEmail && currentUserEmail !== user.email && (
                  <SubscribeButton 
                    userEmail={user.email} 
                    currentUserEmail={currentUserEmail} 
                  />
                )}
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-center border-b pb-3">Публикации пользователя</h2>
              
              {isLoading ? (
                <PostsSkeleton />
              ) : posts.length > 0 ? (
                <div>
                  <div className="flex w-full overflow-x-auto">
                    <div 
                      role="tablist" 
                      aria-orientation="horizontal" 
                      className="min-h-30 overflow-y-hidden items-center rounded-md bg-gray-200 text-gray-700 inline-flex w-full justify-start p-5 gap-10" 
                      tabIndex={0} 
                      style={{ outline: 'none' }}
                    >
                      {posts.length > 0 ? (
                        posts.map((post) => (
                          <Link 
                            key={post._id} 
                            href={`/post/${post._id}`} 
                            className="min-w-96 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transform transition-transform duration-300 hover:-translate-y-2"
                          >
                            <div className="relative w-full h-56 ">
                              <Image
                                src={post.imageUrl || ''}
                                alt={post.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="transition-transform duration-300 hover:scale-105"
                              />
                              <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
                                {post.category}
                              </div>
                            </div>
                            <div className="p-4">
                              <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                                {post.title}
                              </h3>
                              <p className="text-gray-600 mb-4 line-clamp-2">{post.description}</p>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <div className="relative w-8 h-8 mr-2">
                                    <Image
                                      src={user?.avatar || '/user-avatar/default-avatar.jpg'}
                                      alt={post.author}
                                      fill
                                      style={{ objectFit: 'cover' }}
                                      className="rounded-full"
                                    />
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-800">{post.author}</span>
                                    <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                                  </div>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <span className="flex items-center ml-3">
                                    <Favorite className="h-4 w-4 mr-1 text-red-500" />{post.likeCount || 0}
                                  </span>
                                  <span className="flex items-center ml-3">
                                    <Message className="h-4 w-4 mr-1" />{post.comments?.length || 0}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <p className='font-bold'>У пользователя нет постов.</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-100 rounded-lg shadow-sm">
                  <p className="text-gray-600 font-medium text-xl">
                    У пользователя пока нет публикаций
                  </p>
                  <p className="text-gray-500 mt-2">
                    Заходите позже, чтобы увидеть новые публикации
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// Необходимо добавить в глобальные стили для анимации fade-in
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// .animate-fadeIn { animation: fadeIn 0.3s ease-in-out; } 
