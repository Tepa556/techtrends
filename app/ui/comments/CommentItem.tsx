"use client"

import { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Cookies from 'js-cookie';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import { useThemeStore } from '@/app/lib/ThemeStore';
import { Comment } from '@/app/types/comment';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  currentUser: string | null;
  isAdmin: boolean;
  level: number;
  maxLevel: number;
  onCommentAdded: (comment: Comment) => void;
  onCommentDeleted: (commentId: string) => void;
}

export default function CommentItem({
  comment,
  postId,
  currentUser,
  isAdmin,
  level,
  maxLevel,
  onCommentAdded,
  onCommentDeleted
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const { theme } = useThemeStore();

  const canDelete = currentUser === comment.author || isAdmin;
  const canReply = level < maxLevel && currentUser;
  const hasReplies = comment.replies && comment.replies.length > 0;

  const handleDeleteComment = async () => {
    if (!confirm('Вы уверены, что хотите удалить этот комментарий? Это также удалит все ответы на него.')) {
      return;
    }

    try {
      const token = Cookies.get('token');
      const response = await fetch(`/api/post/comment/${postId}/${comment._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        onCommentDeleted(comment._id);
      } else {
        const errorData = await response.json();
        console.error('Ошибка при удалении комментария:', errorData.error);
      }
    } catch (error) {
      console.error('Ошибка при удалении комментария:', error);
    }
  };

  const handleReply = () => {
    setShowReplyForm(true);
  };

  const handleReplyCancel = () => {
    setShowReplyForm(false);
  };

  const handleReplyAdded = (newComment: Comment) => {
    onCommentAdded(newComment);
    setShowReplyForm(false);
  };

  const formattedDate = format(new Date(comment.createdAt), 'd MMMM yyyy, HH:mm', { locale: ru });

  // Стиль отступа для вложенных комментариев
  const marginLeft = level > 0 ? `${level * 30}px` : '0';

  return (
    <div className={`animate-[slideIn_0.3s_ease-out] ${level > 0 ? 'ml-8' : ''} mb-4`}>
      {/* Основной комментарий */}
      <div 
        className={`flex space-x-3 p-4 rounded-lg shadow-sm border-l-2 transition-all duration-200 ${
          level > 0 
            ? `${theme === 'dark' ? 'border-blue-500/50 bg-gray-800/50' : 'border-blue-300/50 bg-blue-50/30'}` 
            : `${theme === 'dark' ? 'border-transparent bg-gray-800' : 'border-transparent bg-white'}`
        }`}
      >
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
        
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-grow">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                  {comment.author}
                </h3>
                <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formattedDate}
                </span>
                {level > 0 && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${theme === 'dark' ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                    Ответ
                  </span>
                )}
              </div>
              
              <div className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                {comment.text}
              </div>

              {/* Кнопки действий */}
              <div className="flex items-center space-x-3 mt-2">
                {canReply && (
                  <button 
                    onClick={handleReply}
                    className={`flex items-center text-xs font-medium transition-all duration-200 hover:translate-x-0.5 ${
                      theme === 'dark' 
                        ? 'text-gray-400 hover:text-blue-400' 
                        : 'text-gray-500 hover:text-blue-600'
                    }`}
                  >
                    <ReplyIcon fontSize="small" className="mr-1" />
                    Ответить
                  </button>
                )}
                
                {hasReplies && (
                  <button
                    onClick={() => setShowReplies(!showReplies)}
                    className={`text-xs font-medium ${
                      theme === 'dark' 
                        ? 'text-blue-400 hover:text-blue-300' 
                        : 'text-blue-600 hover:text-blue-700'
                    } transition-colors`}
                  >
                    {showReplies ? '▼' : '▶'} {comment.replies!.length} 
                    {comment.replies!.length === 1 ? ' ответ' : ' ответов'}
                  </button>
                )}
              </div>
            </div>
            
            {/* Кнопка удаления */}
            {canDelete && (
              <button 
                onClick={handleDeleteComment}
                className={`flex-shrink-0 p-1 rounded ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' 
                    : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'
                } transition-colors`}
                aria-label="Удалить комментарий"
              >
                <DeleteIcon fontSize="small" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Форма ответа */}
      {showReplyForm && currentUser && (
        <div className="animate-[slideDown_0.2s_ease-out] mt-3 ml-13">
          <CommentForm
            postId={postId}
            parentId={comment._id}
            onCommentAdded={handleReplyAdded}
            onCancel={handleReplyCancel}
            placeholder={`Ответить ${comment.author}...`}
            autoFocus={true}
            isReply={true}
          />
        </div>
      )}

      {/* Вложенные комментарии */}
      {hasReplies && showReplies && (
        <div className="mt-2">
          {comment.replies!.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              postId={postId}
              currentUser={currentUser}
              isAdmin={isAdmin}
              level={level + 1}
              maxLevel={maxLevel}
              onCommentAdded={onCommentAdded}
              onCommentDeleted={onCommentDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
} 