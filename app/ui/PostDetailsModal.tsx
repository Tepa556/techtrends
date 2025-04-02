import { Modal, Box } from '@mui/material';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';

// Константы для статусов постов
const POST_STATUS = {
    PENDING: 'pending',
    PUBLISHED: 'published',
    REJECTED: 'rejected',
};

interface Post {
    _id: string;
    title: string;
    description: string;
    text: string;
    category: string;
    author: string;
    status: string;
    createdAt: string;
    imageUrl: string | null;
}

interface PostDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: Post | null;
    onPublish: (postId: string) => void;
    onReject: () => void;
    isLoading: boolean;
}

export default function PostDetailsModal({ 
    isOpen, 
    onClose, 
    post, 
    onPublish, 
    onReject,
    isLoading 
}: PostDetailsModalProps) {
    if (!post) return null;

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxWidth: '900px',
                    maxHeight: '90vh',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    overflow: 'auto',
                }}
            >
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                        <h2 className="text-2xl font-bold">{post.title}</h2>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            post.status === POST_STATUS.PENDING 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : post.status === POST_STATUS.PUBLISHED 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                        }`}>
                            {post.status === POST_STATUS.PENDING 
                                ? 'Ожидает проверки' 
                                : post.status === POST_STATUS.PUBLISHED 
                                    ? 'Опубликован' 
                                    : 'Отклонен'}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition duration-300 ease-in-out"
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className="mb-4">
                    <div className="text-sm text-gray-500 mb-2">
                        Создан: {new Date(post.createdAt).toLocaleDateString('ru-RU')}
                    </div>
                    <p className="text-gray-600 mb-1">Автор: {post.author}</p>
                    <p className="text-gray-600">Категория: {post.category}</p>
                </div>

                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Описание:</h3>
                    <p className="text-gray-800">{post.description}</p>
                </div>

                {post.imageUrl && (
                    <div className="mb-6 relative h-64 w-full">
                        <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            style={{ objectFit: 'contain' }}
                            className="rounded"
                        />
                    </div>
                )}

                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Содержание:</h3>
                    <div className="prose max-w-none text-gray-800">
                        {post.text.split('\n').map((paragraph, index) => (
                            <p key={index} className="mb-2">{paragraph}</p>
                        ))}
                    </div>
                </div>

                {post.status === POST_STATUS.PENDING && (
                    <div className="flex space-x-4 mt-6 pt-6 border-t">
                        <button
                            onClick={() => onPublish(post._id)}
                            disabled={isLoading}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 ease-in-out disabled:opacity-50"
                        >
                            {isLoading ? 'Обработка...' : 'Опубликовать'}
                        </button>
                        <button
                            onClick={onReject}
                            disabled={isLoading}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 ease-in-out disabled:opacity-50"
                        >
                            {isLoading ? 'Обработка...' : 'Отклонить'}
                        </button>
                    </div>
                )}
            </Box>
        </Modal>
    );
}