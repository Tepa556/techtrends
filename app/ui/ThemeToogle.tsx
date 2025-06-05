"use client";

import { useEffect } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useThemeStore } from '../lib/ThemeStore';

export default function ThemeToogle() {
    const { theme, setTheme } = useThemeStore();
    
    useEffect(() => {
        console.log(theme);
    }, [theme]);
    
    return (
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} h-10 w-10`}>
            {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </button>
    );
}




