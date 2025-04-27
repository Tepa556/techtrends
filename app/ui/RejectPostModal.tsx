import { useState } from 'react';
import { Modal, Box, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useThemeStore } from '../lib/ThemeStore';
interface RejectPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReject: (reason: string) => void;
}

export default function RejectPostModal({ isOpen, onClose, onReject }: RejectPostModalProps) {
    const [reason, setReason] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { theme } = useThemeStore();
    const handleSubmit = () => {
        if (!reason.trim()) {
            setError('Пожалуйста, укажите причину отклонения');
            return;
        }
        
        onReject(reason);
        setReason('');
        setError(null);
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
                <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>Отклонить публикацию</h2>
                    <button
                        onClick={onClose}
                        className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition duration-300 ease-in-out`}
                    >
                        <CloseIcon />
                    </button>
                </div>

                {error && (
                    <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'} mb-2`}>
                        Пожалуйста, укажите причину отклонения публикации. Это сообщение будет отправлено автору.
                    </p>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className={`w-full px-4 py-2 rounded-lg border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        rows={4}
                        placeholder="Введите причину отклонения"
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className={`font-bold border border-gray-300  hover:bg-gray-200 px-4 py-2 rounded transition duration-300 ease-in-out ${theme === 'dark' ? 'text-gray-400 hover:text-black hover:bg-gray-200 ' : ''}`}
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="font-bold bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded transition duration-300 ease-in-out"
                    >
                        Отклонить
                    </button>
                </div>
            </Box>
        </Modal>
    );
}