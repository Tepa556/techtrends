"use client"

import { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { useThemeStore } from '@/app/lib/ThemeStore';
import { Comment } from '@/app/types/comment';

interface CommentFormProps {
  postId: string;
  parentId?: string | null;
  onCommentAdded: (comment: Comment) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  isReply?: boolean;
}

export default function CommentForm({ 
  postId, 
  parentId, 
  onCommentAdded, 
  onCancel, 
  placeholder = "Оставьте свой комментарий...",
  autoFocus = false,
  isReply = false
}: CommentFormProps) {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useThemeStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (commentText.trim() === '') {
      setError('Комментарий не может быть пустым');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const token = Cookies.get('token');
      const response = await fetch(`/api/post/comment/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          text: commentText,
          parentId: parentId || null
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось добавить комментарий');
      }
      
      const newComment = await response.json();
      onCommentAdded(newComment);
      setCommentText('');
      
      // Если это ответ на комментарий, закрываем форму
      if (isReply && onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error('Ошибка при добавлении комментария:', error);
      setError(error instanceof Error ? error.message : 'Ошибка при добавлении комментария');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setCommentText('');
    setError('');
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${isReply ? 'mt-3' : 'mb-6'}`}>
      <div className="mb-4">
        {!isReply && (
          <label htmlFor="comment" className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
            {parentId ? 'Ответ на комментарий' : 'Ваш комментарий'}
          </label>
        )}
        <textarea
          ref={textareaRef}
          id="comment"
          rows={isReply ? 2 : 3}
          className={`w-full px-3 py-2 border ${theme === 'dark' ? 'border-gray-700 text-white' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} ${isReply ? 'text-sm' : ''}`}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={placeholder}
          disabled={isSubmitting}
        />
      </div>
      
      {error && (
        <div className="mb-4 text-red-500 text-sm">{error}</div>
      )}
      
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 ${isReply ? 'px-3 py-1 text-xs' : ''}`}
        >
          {isSubmitting ? 'Отправка...' : (isReply ? 'Ответить' : 'Отправить комментарий')}
        </button>
        
        {isReply && (
          <button
            type="button"
            onClick={handleCancel}
            className={`inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md shadow-sm ${theme === 'dark' ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' : 'text-gray-700 bg-white hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            Отмена
          </button>
        )}
      </div>
    </form>
  );
}