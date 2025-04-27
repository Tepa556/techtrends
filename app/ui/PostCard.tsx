'use client';

import React, { useState, useEffect } from 'react';
import { Favorite, Message } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { useThemeStore } from '../lib/ThemeStore';
interface PostCardProps {
  post: {
    _id: string;
    title: string;
    description: string;
    category: string;
    createdAt: string;
    imageUrl: string;
    author: string;
    likeCount: number;
    comments: number;
  };
  featured?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, featured = false }) => {
  const [authorAvatar, setAuthorAvatar] = useState<string>('/user-avatar/default-avatar.jpg');
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useThemeStore();
  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/posts/author', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ author: post.author }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.avatar) {
            setAuthorAvatar(data.avatar);
          }
        }
      } catch (error) {
        console.error('Ошибка при получении аватара автора:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (post.author) {
      fetchAuthorData();
    }
  }, [post.author]);

  const formattedDate = new Date(post.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <article className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:-translate-y-2 ${featured ? 'md:col-span-2' : ''}`}>
      <Link href={`/post/${post._id}`} className="block hover:opacity-95 transition-opacity cursor-pointer">
        <div className="relative w-full h-56">
          <Image
            src={post.imageUrl || '/placeholder-image.jpg'}
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
          <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2 hover:text-blue-600 transition-colors`}>
            {post.title}
          </h3>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4 line-clamp-2`}>{post.description}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="relative w-8 h-8 mr-2">
                <Image
                  src={authorAvatar}
                  alt={post.author}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-full"
                />
              </div>
              <div>
                <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{post.author}</span>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{formattedDate}</p>
              </div>
            </div>
              <div className="flex items-center text-sm text-gray-500">
              <span className="flex items-center ml-3">
                <Favorite className="h-4 w-4 mr-1 text-red-500" />{post.likeCount || 0}
              </span>
              <span className="flex items-center ml-3">
                <Message className="h-4 w-4 mr-1" />{post.comments || 0}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default PostCard;