"use client"

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from 'next/link';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentList from '@/app/ui/comments/CommentList';
import CommentForm from '@/app/ui/comments/CommentForm';
import { useThemeStore } from '../lib/ThemeStore';
// Интерфейсы
interface Post {
  _id: string;
  title: string;
  description: string;
  text: string;
  category: string;
  imageUrl: string;
  author: string;
  likeCount: number;
  comments: Comment[];
  status: string;
  createdAt: string;
}

interface Comment {
  _id: string;
  text: string;
  author: string;
  authorAvatar: string;
  createdAt: string;
}

interface AuthorData {
  username: string;
  avatar: string;
  role: string;
  bio: string;
}

interface PostDetailProps {
  postId: string;
}

export default function PostDetail({ postId }: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [authorData, setAuthorData] = useState<AuthorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { theme } = useThemeStore();  
  // Проверка авторизации пользователя
  useEffect(() => {
    const token = Cookies.get('token');
    setIsAuthenticated(!!token);
  }, []);

  // Получение данных поста
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/post/${postId}`);
        
        if (!response.ok) {
          throw new Error('Не удалось загрузить пост');
        }
        
        const data = await response.json();
        setPost(data);
        
        // Получение информации об авторе
        if (data.author) {
          const authorResponse = await fetch('/api/posts/author', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ author: data.author }),
          });
          
          if (authorResponse.ok) {
            const authorData = await authorResponse.json();
            setAuthorData(authorData);
          }
        }
        
        // Проверка, поставил ли пользователь лайк
        if (isAuthenticated) {
          const likeStatusResponse = await fetch(`/api/post/like/status/${postId}`, {
            headers: {
              'Authorization': `Bearer ${Cookies.get('token')}`
            }
          });
          
          if (likeStatusResponse.ok) {
            const { isLiked } = await likeStatusResponse.json();
            setIsLiked(isLiked);
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке поста:', error);
        setErrorMessage('Не удалось загрузить пост. Попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      fetchPostData();
    }
  }, [postId, isAuthenticated]);

  // Обработчик лайка
  const handleLikeToggle = async () => {
    if (!isAuthenticated) {
      setErrorMessage('Для того чтобы поставить лайк, необходимо авторизоваться');
      return;
    }

    try {
      const response = await fetch(`/api/post/like/${postId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Не удалось выполнить действие');
      }

      const { liked, likeCount } = await response.json();
      
      setIsLiked(liked);
      setPost(prevPost => prevPost ? { ...prevPost, likeCount } : null);
    } catch (error) {
      console.error('Ошибка при изменении лайка:', error);
      setErrorMessage('Не удалось выполнить действие. Попробуйте позже.');
    }
  };

  // Обработчик добавления комментария
  const handleCommentAdded = (newComment: Comment) => {
    setPost(prevPost => {
      if (!prevPost) return null;
      return {
        ...prevPost,
        comments: [newComment, ...prevPost.comments]
      };
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
          <article className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto`}>
          {/* Скелетон для заголовка и информации о посте */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-5 w-24 rounded`}></div>
              <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-4 w-20 rounded`}></div>
            </div>
            <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-8 w-3/4 rounded mb-4`}></div>
            
            {/* Скелетон для описания */}
            <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-20 w-full rounded mb-6`}></div>
            
            {/* Скелетон для информации об авторе */}
            <div className="flex items-center mb-6">
              <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-10 w-10 rounded-full mr-3`}></div>
              <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-5 w-32 rounded`}></div>
            </div>
          </div>
          
          {/* Скелетон для изображения поста */}
          <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-96 w-full`}></div>
          
          {/* Скелетон для содержимого поста */}
          <div className="p-6">
            <div className="flex flex-col space-y-3">
              <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-4 w-full rounded`}></div>
              <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-4 w-full rounded`}></div>
              <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-4 w-11/12 rounded`}></div>
              <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-4 w-full rounded`}></div>
              <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-4 w-10/12 rounded`}></div>
              <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-4 w-full rounded`}></div>
            </div>
            
            {/* Скелетон для кнопки лайка */}
            <div className={`flex items-center mt-8 border-t pt-4 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-6 w-6 rounded-full`}></div>
              <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-4 w-6 rounded ml-2`}></div>
            </div>
          </div>
          
          {/* Скелетон для секции комментариев */}
          <div className={`p-6 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} border-t`}>
            <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-6 w-48 rounded mb-4`}></div>
            
            {/* Скелетон для формы комментариев */}
            <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-24 w-full rounded mb-6`}></div>
            
            {/* Скелетоны комментариев */}
            <div className="space-y-6">
              {/* Комментарий 1 */}
              <div className="flex">
                <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-10 w-10 rounded-full`}></div>
                <div className="ml-3 flex-1">
                  <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-5 w-32 rounded mb-2`}></div>
                  <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-4 w-full rounded mb-1`}></div>
                  <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-4 w-5/6 rounded`}></div>
                </div>
              </div>
              
              {/* Комментарий 2 */}
              <div className="flex">
                <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-10 w-10 rounded-full`}></div>
                <div className="ml-3 flex-1">
                  <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-5 w-32 rounded mb-2`}></div>
                  <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-4 w-full rounded mb-1`}></div>
                  <div className={`animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-4 w-4/6 rounded`}></div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{errorMessage}</p>
          <Link href="/" className="text-blue-500 hover:underline mt-2 inline-block">
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Пост не найден</h1>
          <Link href="/" className="text-blue-500 hover:underline mt-2 inline-block">
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = format(new Date(post.createdAt), 'd MMMM yyyy', { locale: ru });

  return (
    <div className="container mx-auto px-4 py-8">
      <article className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto`}>
        {/* Заголовок и информация о посте */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">{post.category}</span>
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{formattedDate}</span>
          </div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>{post.title}</h1>
          
          {/* Описание поста */}
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-lg mb-6 italic`}>
            {post.description}
          </p>
          
          {/* Информация об авторе */}
          <div className="flex items-center mb-6">
            <div className="relative w-10 h-10 mr-3">
              <Image 
                src={authorData?.avatar || '/user-avatar/default-avatar.jpg'} 
                alt={post.author}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-full"
              />
            </div>
            <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{post.author}</span>
          </div>
        </div>
        
        {/* Изображение поста */}
        {post.imageUrl && (
          <div className="relative w-full h-96">
            <Image 
              src={post.imageUrl} 
              alt={post.title} 
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        )}
        
        {/* Содержимое поста */}
        <div className="p-6">
          <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert text-white' : ''}`} dangerouslySetInnerHTML={{ __html: post.text }} />
          
          {/* Кнопка лайка */}
          <div className={`flex items-center mt-8 border-t pt-4 ${theme === 'dark' ? 'border-gray-700' : ''}`}>
            <button 
              onClick={handleLikeToggle}
              className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} hover:text-red-500 transition-colors`}
              aria-label={isLiked ? "Убрать лайк" : "Поставить лайк"}
            >
              {isLiked ? (
                <FavoriteIcon className="h-6 w-6 text-red-500 mr-2" />
              ) : (
                <FavoriteBorderIcon className="h-6 w-6 mr-2" />
              )}
              <span>{post.likeCount}</span>
            </button>
          </div>
        </div>
        
        {/* Секция комментариев */}
        <div className={`p-6 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-50'} border-t`}>
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Комментарии ({post.comments?.length || 0})</h2>
          
          {isAuthenticated ? (
            <CommentForm postId={post._id} onCommentAdded={handleCommentAdded} />
          ) : (
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              <Link href="/login" className="text-blue-500 hover:underline">Войдите</Link>, чтобы оставить комментарий
            </p>
          )}
          
          <CommentList comments={post.comments || []} postId={post._id} />
        </div>
      </article>
    </div>
  );
} 