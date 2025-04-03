"use client"

import { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Cookies from 'js-cookie';
import DeleteIcon from '@mui/icons-material/Delete';

interface Comment {
  _id: string;
  text: string;
  author: string;
  authorAvatar: string;
  createdAt: string;
}

interface CommentListProps {
  comments: Comment[];
  postId: string;
}

export default function CommentList({ comments, postId }: CommentListProps) {
  const [commentsList, setCommentsList] = useState<Comment[]>(comments);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Получение информации о текущем пользователе
  useState(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) return;

        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData.username);
          setIsAdmin(userData.role === 'admin'); // Если у вас есть роли пользователей
        }
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
      }
    };

    fetchCurrentUser();
  });

  // Обработчик удаления комментария
  const handleDeleteComment = async (commentId: string) => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`/api/post/comment/${postId}/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setCommentsList(prev => prev.filter(comment => comment._id !== commentId));
      } else {
        const errorData = await response.json();
        console.error('Ошибка при удалении комментария:', errorData.error);
      }
    } catch (error) {
      console.error('Ошибка при удалении комментария:', error);
    }
  };

  if (commentsList.length === 0) {
    return <p className="text-gray-500 italic">Комментариев пока нет. Будьте первым!</p>;
  }

  return (
    <div className="space-y-6">
      {commentsList.map((comment) => {
        const formattedDate = format(new Date(comment.createdAt), 'd MMMM yyyy, HH:mm', { locale: ru });
        const canDelete = currentUser === comment.author || isAdmin;

        return (
          <div key={comment._id} className="flex space-x-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex-shrink-0">
              <div className="relative w-10 h-10">
                <Image 
                  src={comment.authorAvatar || '/user-avatar/default-avatar.jpg'} 
                  alt={comment.author} 
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{comment.author}</h3>
                  <p className="text-xs text-gray-500">{formattedDate}</p>
                </div>
                {canDelete && (
                  <button 
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-gray-400 hover:text-red-500"
                    aria-label="Удалить комментарий"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                )}
              </div>
              <div className="mt-2 text-sm text-gray-700">{comment.text}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 
