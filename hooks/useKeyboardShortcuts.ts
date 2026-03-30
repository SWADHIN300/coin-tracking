'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface KeyboardShortcut {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    action: () => void;
    description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            shortcuts.forEach((shortcut) => {
                const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : true;
                const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;

                if (
                    event.key.toLowerCase() === shortcut.key.toLowerCase() &&
                    ctrlMatch &&
                    shiftMatch
                ) {
                    event.preventDefault();
                    shortcut.action();
                }
            });
        },
        [shortcuts]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);
};

export const useGlobalKeyboardShortcuts = () => {
    const router = useRouter();

    const shortcuts: KeyboardShortcut[] = [
        {
            key: 'h',
            action: () => router.push('/'),
            description: 'Go to Home',
        },
        {
            key: 'c',
            action: () => router.push('/coins'),
            description: 'View All Coins',
        },
        {
            key: 'k',
            ctrl: true,
            action: () => {
                // Trigger search modal - would need to be implemented separately
                const searchButton = document.querySelector('[data-search-trigger]') as HTMLElement;
                searchButton?.click();
            },
            description: 'Open Search',
        },
        {
            key: '?',
            shift: true,
            action: () => {
                // Show keyboard shortcuts modal
                console.log('Show shortcuts help');
            },
            description: 'Show Keyboard Shortcuts',
        },
    ];

    useKeyboardShortcuts(shortcuts);
};

export default useKeyboardShortcuts;
