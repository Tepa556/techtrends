"use client"

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useThemeStore } from '@/app/lib/ThemeStore';
import { Comment } from '@/app/types/comment';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: Comment[];
  postId: string;
  maxLevel?: number;
}

export default function CommentList({ comments, postId, maxLevel = 3, onCommentDeleted }: CommentListProps) {
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { theme } = useThemeStore();

  // Функция для организации комментариев в древовидную структуру
  const organizeComments = (flatComments: Comment[]): Comment[] => {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // Первый проход: создаем Map всех комментариев
    flatComments.forEach(comment => {
      commentMap.set(comment._id, { ...comment, replies: [] });
    });

    // Второй проход: организуем в дерево
    flatComments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment._id)!;
      
      if (comment.parentId) {
        // Это ответ на комментарий
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(commentWithReplies);
        }
      } else {
        // Это корневой комментарий
        rootComments.push(commentWithReplies);
      }
    });

    // Сортируем комментарии по дате создания (новые сначала)
    const sortComments = (comments: Comment[]): Comment[] => {
      return comments
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map(comment => ({
          ...comment,
          replies: comment.replies ? sortComments(comment.replies) : []
        }));
    };

    return sortComments(rootComments);
  };

  // Получение информации о текущем пользователе
  useEffect(() => {
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
          setIsAdmin(userData.role === 'admin');
        }
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Организация комментариев при изменении входных данных
  useEffect(() => {
    const organizedComments = organizeComments(comments);
    setCommentsList(organizedComments);
  }, [comments]);

  // Обработчик добавления нового комментария
  const handleCommentAdded = (newComment: Comment) => {
    // Добавляем новый комментарий к текущему списку и реорганизуем
    const updatedComments = [...comments, newComment];
    const organizedComments = organizeComments(updatedComments);
    setCommentsList(organizedComments);
  };

  // Обработчик удаления комментария
  const handleCommentDeleted = (commentId: string) => {
    // Рекурсивная функция для удаления комментария и его ответов
    const removeCommentAndReplies = (comments: Comment[], idToRemove: string): Comment[] => {
      return comments
        .filter(comment => comment._id !== idToRemove)
        .map(comment => ({
          ...comment,
          replies: comment.replies ? removeCommentAndReplies(comment.replies, idToRemove) : []
        }));
    };

    const updatedComments = removeCommentAndReplies(commentsList, commentId);
    setCommentsList(updatedComments);
    
    // Уведомляем родительский компонент об удалении
    if (onCommentDeleted) {
      onCommentDeleted(commentId);
    }
  };

  if (commentsList.length === 0) {
    return (
      <p className={`italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        Комментариев пока нет. Будьте первым!
      </p>
    );
  }

  return (
    <div className="space-y-0">
      {commentsList.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          postId={postId}
          currentUser={currentUser}
          isAdmin={isAdmin}
          level={0}
          maxLevel={maxLevel}
          onCommentAdded={handleCommentAdded}
          onCommentDeleted={handleCommentDeleted}
        />
      ))}
    </div>
  );
} 
