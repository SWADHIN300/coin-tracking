'use client';

import React, { useState } from 'react';
import { ChevronUp, Plus, TrendingUp, Star, Share2 } from 'lucide-react';

const FloatingActionButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const actions = [
        { icon: TrendingUp, label: 'View Trending', onClick: () => console.log('Trending') },
        { icon: Star, label: 'My Favorites', onClick: () => console.log('Favorites') },
        { icon: Share2, label: 'Share App', onClick: () => console.log('Share') },
    ];

    return (
        <>
            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-24 right-6 z-40 p-3 bg-dark-400 text-white rounded-full elevation-3 hover:elevation-4 transition-all scale-hover fade-in"
                    aria-label="Scroll to top"
                >
                    <ChevronUp size={24} />
                </button>
            )}

            {/* Floating Action Menu */}
            <div className="fixed bottom-6 right-6 z-50">
                {/* Action Items */}
                {isOpen && (
                    <div className="absolute bottom-16 right-0 flex flex-col gap-3 mb-3 fade-in-up">
                        {actions.map((action, index) => (
                            <button
                                key={action.label}
                                onClick={() => {
                                    action.onClick();
                                    setIsOpen(false);
                                }}
                                className="flex items-center gap-3 glass elevation-2 hover:elevation-3 px-4 py-3 rounded-full transition-all scale-hover-sm group"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <span className="text-sm font-medium text-purple-100 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {action.label}
                                </span>
                                <div className="bg-gradient-primary p-2 rounded-full">
                                    <action.icon size={20} className="text-white" />
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Main FAB */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-4 bg-gradient-success text-white rounded-full elevation-4 hover:elevation-5 transition-all ${isOpen ? 'rotate-45' : ''
                        } scale-hover`}
                    aria-label="Quick actions"
                >
                    <Plus size={28} className="transition-transform" />
                </button>
            </div>
        </>
    );
};

export default FloatingActionButton;
