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
        </button>
    );
};

export default ThemeToggle;
