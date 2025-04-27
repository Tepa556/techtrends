import { Modal, Box } from '@mui/material';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useThemeStore } from '../lib/ThemeStore';
interface DeletePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    postId: string | null;
    onPostDeleted: (postId: string) => void;
}

export default function DeletePostModal({ isOpen, onClose, postId, onPostDeleted }: DeletePostModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const { theme } = useThemeStore();
    const handleDelete = async () => {
        if (!postId) return;
        
        setIsLoading(true);
        setMessage(null);
        
        try {
            const token = Cookies.get('token');
            const response = await fetch(`/api/post/delete/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setMessage('Пост успешно удален');
                if (onPostDeleted) {
                    onPostDeleted(postId);
                }
                setTimeout(() => {
                    setMessage(null);
                    onClose();
                }, 1000);
            } else {
                setMessage(data.error || 'Ошибка при удалении поста');
            }
        } catch (error) {
            setMessage('Произошла ошибка при обращении к серверу');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: theme === 'dark' ? '#0f141c' : 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <h2 className={`font-bold text-lg mb-4 ${theme === 'dark' ? 'text-white' : ''}`}>Удалить пост</h2>
                
                {message ? (
                    <div className={`p-3 mb-4 rounded ${message.includes('ошибка') || message.includes('Ошибка') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                ) : (
                    <p className={`mb-6 ${theme === 'dark' ? 'text-white' : ''}`}>Вы уверены, что хотите удалить этот пост? Это действие невозможно отменить.</p>
                )}
                
                {isLoading ? (
                    <div className="flex justify-center my-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    !message && (
                        <div className="flex justify-end">
                            <button
                                onClick={onClose}
                                className={`bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded shadow-sm transition-colors duration-200 mr-3 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : ''}`}
                                disabled={isLoading}
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow-sm transition-colors duration-200"
                                disabled={isLoading}
                            >
                                Удалить
                            </button>
                        </div>
                    )
                )}
            </Box>
        </Modal>
    );
}
