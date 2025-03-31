"use client"

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

interface LogoutConfirmationModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function LogOutModal({ isOpen, onConfirm, onCancel }: LogoutConfirmationModalProps) {
    return (
        <Modal open={isOpen} onClose={onCancel}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 600,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <h2 className='font-bold text-3xl'>Вы действительно хотите выйти?</h2>
                <div className="flex justify-end space-x-2 mt-4 gap-4 text-white">
                    <button  onClick={onConfirm} className='w-20 h-7 rounded-xl bg-red-600 font-bold transition duraction-300 hover:bg-red-700'>
                        Да
                    </button>
                    <button  onClick={onCancel}  className='w-20 h-7 rounded-xl bg-green-600 font-bold transition duraction-300 hover:bg-green-700'>
                        Нет
                    </button>
                </div>
            </Box>
        </Modal>
    );
}
