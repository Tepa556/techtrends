"use client"

import { useState } from 'react';
import Cookies from 'js-cookie';

interface CommentFormProps {
  postId: string;
  onCommentAdded: (comment: any) => void;
}

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
        body: JSON.stringify({ text: commentText })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Не удалось добавить комментарий');
      }
      
      const newComment = await response.json();
      onCommentAdded(newComment);
      setCommentText('');
    } catch (error) {
      console.error('Ошибка при добавлении комментария:', error);
      setError(error instanceof Error ? error.message : 'Ошибка при добавлении комментария');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Ваш комментарий
        </label>
        <textarea
          id="comment"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Оставьте свой комментарий..."
          disabled={isSubmitting}
        />
      </div>
      
      {error && (
        <div className="mb-4 text-red-500 text-sm">{error}</div>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Отправка...' : 'Отправить комментарий'}
      </button>
    </form>
  );
}