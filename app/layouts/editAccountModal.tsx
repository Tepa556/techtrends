"use client"

import { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

interface User {
    email: string;
    username?: string;
    avatar?: string;
}

interface UserEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
}

export default function EditAccountModal({ isOpen, onClose, user }: UserEditModalProps) {
    const [username, setUsername] = useState(user.username || '');
    const [email, setEmail] = useState(user.email);

    const handleSave = () => {
        // Логика сохранения изменений
        console.log('Сохранение изменений:', { username, email });
        onClose();
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
                <h2>Редактировать профиль</h2>
                <TextField
                    fullWidth
                    label="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    sx={{ mt: 2 }}
                >
                    Сохранить
                </Button>
            </Box>
        </Modal>
    );
}
