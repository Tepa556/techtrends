"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useThemeStore } from '../lib/ThemeStore';
import { useSession, signOut } from 'next-auth/react';
import AuthModal from './authModal';
import RegModal from './regModal';

            <AuthModal
                isOpen={isAuthModalOpen}
                onCloseAction={() => setIsAuthModalOpen(false)}
                onLoginAction={handleLogin}
                onRegisterAction={handleRegister}
                error={authError}
                onOpenRegisterAction={() => {
                    setIsAuthModalOpen(false);
                    setIsRegModalOpen(true);
                }}
            /> 