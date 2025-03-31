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
                    width: 300,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <h2>Вы действительно хотите выйти?</h2>
                <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="contained" color="primary" onClick={onConfirm}>
                        Да
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={onCancel}>
                        Нет
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}
