'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

interface QuickActionBarProps {
    coinId: string;
    coinName: string;
    className?: string;
}

const QuickActionBar = ({ coinId, coinName, className = '' }: QuickActionBarProps) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [showCopied, setShowCopied] = useState(false);

    const handleFavorite = () => {
        setIsFavorite(!isFavorite);
        // TODO: Persist to localStorage or backend
    };

    const handleShare = async () => {
        const url = `${window.location.origin}/coins/${coinId}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${coinName} - Crypto Tracker`,
                    url: url,
                });
            } catch (err) {
                // User cancelled or error
                copyToClipboard(url);
            }
        } else {
            copyToClipboard(url);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Favorite Button */}
            <button
                onClick={handleFavorite}
                className={`btn-enhanced p-2 rounded-lg transition-all ${isFavorite
                        ? 'bg-yellow-500/20 text-yellow-500 glow-yellow'
                        : 'bg-dark-400 text-purple-100 hover:bg-dark-500'
                    }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
                <Star
                    size={18}
                    fill={isFavorite ? 'currentColor' : 'none'}
                    className="transition-all"
                />
            </button>

            {/* Share Button */}
            <button
                onClick={handleShare}
                className="btn-enhanced p-2 rounded-lg bg-dark-400 text-purple-100 hover:bg-dark-500 transition-all relative"
                title="Share"
            >
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>

                {/* Copied Notification */}
                {showCopied && (
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap fade-in">
                        Link copied!
                    </span>
                )}
            </button>
        </div>
    );
};

export default QuickActionBar;
