export interface Notification {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
  sender: string;
  isRead: boolean;
}

export interface User {
  _id: string;
  email: string;
  username: string;
  avatar: string | null;
  role?: string;
  createdAt?: string;
  subscribers: string[];
  subscriptions: string[];
  posts: string[];
  notifications: Notification[];
} 