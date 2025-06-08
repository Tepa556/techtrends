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
import { Comment } from '@/app/types/comment';

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

interface AuthorData {
  avatar: string;
  username: string;
}

interface PostDetailProps {
  postId: string;
}

export default function PostDetail({ postId }: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [currentComments, setCurrentComments] = useState<Comment[]>([]);
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
        setCurrentComments(data.comments || []);
        
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
    setCurrentComments(prevComments => [newComment, ...prevComments]);
    setPost(prevPost => {
      if (!prevPost) return null;
      return {
        ...prevPost,
        comments: [newComment, ...prevPost.comments]
      };
    });
  };

  // Обработчик удаления комментария
  const handleCommentDeleted = (deletedCommentId: string) => {
    // Рекурсивная функция для удаления комментария и его ответов из плоского массива
    const removeCommentAndRepliesFromFlat = (comments: Comment[], targetId: string): Comment[] => {
      return comments.filter(comment => {
        // Удаляем сам комментарий
        if (comment._id === targetId) {
          return false;
        }
        // Удаляем все ответы на этот комментарий
        if (comment.parentId === targetId) {
          return false;
        }
        return true;
      });
    };

    const updatedComments = removeCommentAndRepliesFromFlat(currentComments, deletedCommentId);
    setCurrentComments(updatedComments);
    
    // Также обновляем пост для синхронизации
    setPost(prevPost => {
      if (!prevPost) return null;
      return {
        ...prevPost,
        comments: updatedComments
      };
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto animate-pulse`}>
          <div className="p-6">
            <div className={`h-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-4`}></div>
            <div className={`h-8 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-4`}></div>
            <div className={`h-20 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded mb-6`}></div>
          </div>
          <div className={`h-96 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium">{errorMessage}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Пост не найден</p>
        </div>
      </div>
    );
  }

  const formattedDate = format(new Date(post.createdAt), 'd MMMM yyyy', { locale: ru });

  // Подсчитываем общее количество комментариев (включая вложенные)
  const countTotalComments = (comments: Comment[]): number => {
    return comments.reduce((total, comment) => {
      return total + 1 + (comment.replies ? countTotalComments(comment.replies) : 0);
    }, 0);
  };

  const totalCommentsCount = countTotalComments(currentComments);

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
          <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
            Комментарии ({totalCommentsCount})
          </h2>
          
          {isAuthenticated ? (
            <CommentForm postId={post._id} onCommentAdded={handleCommentAdded} />
          ) : (
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              <Link href="/login" className="text-blue-500 hover:underline">Войдите</Link>, чтобы оставить комментарий
            </p>
          )}
          
          <CommentList comments={currentComments} postId={post._id} maxLevel={3} onCommentDeleted={handleCommentDeleted} />
        </div>
      </article>
    </div>
  );
} 