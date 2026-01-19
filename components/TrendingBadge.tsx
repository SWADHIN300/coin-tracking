import React from 'react';
import { TrendingUp, Flame, Sparkles, ShieldCheck } from 'lucide-react';

interface TrendingBadgeProps {
    rank?: number;
    isVerified?: boolean;
    isTrending?: boolean;
    isTopGainer?: boolean;
    className?: string;
}

const TrendingBadge = ({
    rank,
    isVerified,
    isTrending,
    isTopGainer,
    className = ''
}: TrendingBadgeProps) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Top Rank Badge */}
            {rank && rank <= 10 && (
                <div className="badge-premium px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                    <Sparkles size={12} />
                    #{rank}
                </div>
            )}

            {/* Trending Badge */}
            {isTrending && (
                <div className="badge-trending px-2 py-1 rounded text-xs font-bold flex items-center gap-1 fade-in">
                    <Flame size={12} />
                    Hot
                </div>
            )}

            {/* Top Gainer Badge */}
            {isTopGainer && (
                <div className="bg-gradient-success px-2 py-1 rounded text-xs font-bold flex items-center gap-1 text-white elevation-1">
                    <TrendingUp size={12} />
                    Top Gainer
                </div>
            )}

            {/* Verified Badge */}
            {isVerified && (
                <div className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                    <ShieldCheck size={12} />
                    Verified
                </div>
            )}
        </div>
    );
};

export default TrendingBadge;
