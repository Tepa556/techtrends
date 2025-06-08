export interface Comment {
  _id: string;
  text: string;
  author: string;
  authorAvatar: string;
  createdAt: string;
  parentId?: string | null; // Для вложенных комментариев
  replies?: Comment[]; // Массив ответов
  level?: number; // Уровень вложенности
}

export interface CommentFormProps {
  postId: string;
  parentId?: string | null;
  onCommentAdded: (comment: Comment) => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export interface CommentListProps {
  comments: Comment[];
  postId: string;
  maxLevel?: number; // Максимальный уровень вложенности
  onCommentDeleted?: (commentId: string) => void; // Обработчик удаления комментария
} 