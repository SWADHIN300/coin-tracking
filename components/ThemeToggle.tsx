'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Check for saved theme preference or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setIsDark(savedTheme === 'dark');
        document.documentElement.classList.toggle('light-theme', savedTheme === 'light');
    }, []);

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark';
        setIsDark(!isDark);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('light-theme', newTheme === 'light');
    };

    return (
        <button
            onClick={toggleTheme}
            className="btn-enhanced p-2.5 rounded-lg bg-dark-400 hover:bg-dark-500 transition-all scale-hover-sm glass elevation-1"
            aria-label="Toggle theme"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? (
                <Sun size={20} className="text-yellow-400" />
            ) : (
                <Moon size={20} className="text-purple-400" />
            )}
        </button>
    );
};

export default ThemeToggle;
