import { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface RejectPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReject: (reason: string) => void;
}

export default function RejectPostModal({ isOpen, onClose, onReject }: RejectPostModalProps) {
    const [reason, setReason] = useState('');
    const [error, setError] = useState<string | null>(null);

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
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Отклонить публикацию</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition duration-300 ease-in-out"
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
                    <p className="text-gray-700 mb-2">
                        Пожалуйста, укажите причину отклонения публикации. Это сообщение будет отправлено автору.
                    </p>
                    <TextField
                        label="Причина отклонения"
                        multiline
                        rows={4}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        fullWidth
                        variant="outlined"
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{ borderRadius: '4px' }}
                    >
                        Отмена
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleSubmit}
                        sx={{ borderRadius: '4px' }}
                    >
                        Отклонить
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}