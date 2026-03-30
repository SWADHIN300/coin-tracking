'use client';

import { useState, useSyncExternalStore } from 'react';
import { Sun, Moon } from 'lucide-react';

const subscribe = () => () => {};

const ThemeToggle = () => {
    const mounted = useSyncExternalStore(subscribe, () => true, () => false);
    const [isDark, setIsDark] = useState(() => {
        if (typeof document !== 'undefined') {
            return document.documentElement.classList.contains('dark');
        }

        return true;
    });

    const toggle = () => {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
    };

    if (!mounted) {
        return <div style={{ width: 52, height: 28, margin: '0 8px', flexShrink: 0 }} />;
    }

    return (
        <button
            className="theme-toggle-btn"
            onClick={toggle}
            data-dark={isDark}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <span className="theme-toggle-track" />

            <span
                className="theme-toggle-thumb"
                style={{ transform: isDark ? 'translateX(0px)' : 'translateX(24px)' }}
            />

            <span className="theme-toggle-icon theme-toggle-sun" style={{ opacity: isDark ? 0 : 1 }}>
                <Sun size={12} strokeWidth={2.5} />
            </span>

            <span className="theme-toggle-icon theme-toggle-moon" style={{ opacity: isDark ? 1 : 0 }}>
                <Moon size={12} strokeWidth={2.5} />
            </span>
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
