import React from 'react';
import {  Favorite, Message } from '@mui/icons-material';

interface Post {
    id: number;
    title: string;
    description: string;
    category: string;
    createdAt: string;
    imageUrl: string;
    author: string;
    likes: number;
    comments: number;
}

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
    return (
        <article className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:translate-y-[-5px]">
            <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-6">
                <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">{post.category}</p>
                <h3 className="mt-2 text-xl font-semibold text-gray-800">
                    {post.title}
                </h3>
                <p className="mt-2 text-gray-600 line-clamp-3">{post.description}</p>
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <img src="" alt={post.author} className="w-10 h-10 rounded-full mr-3" />
                        <span className="font-medium hover:text-primary transition-colors">{post.author}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                        <span className="flex items-center ml-3">
                            <Favorite className="h-4 w-4 mr-1 text-red-500" />{post.likes}
                        </span>
                        <span className="flex items-center ml-3">
                            <Message className="h-4 w-4 mr-1" />{post.comments}
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default PostCard;
