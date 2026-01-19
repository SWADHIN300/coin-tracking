'use client';

import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string;
    change?: number;
    icon?: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    className?: string;
}

const StatCard = ({
    label,
    value,
    change,
    icon,
    trend = 'neutral',
    className = ''
}: StatCardProps) => {
    const trendColors = {
        up: 'text-green-500',
        down: 'text-red-500',
        neutral: 'text-purple-100',
    };

    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Activity;

    return (
        <div className={`glass elevation-1 rounded-xl p-4 scale-hover-sm transition-all ${className}`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-purple-100/70">{label}</span>
                {icon && <div className="text-purple-100/50">{icon}</div>}
            </div>

            <div className="flex items-end justify-between">
                <h3 className={`text-2xl font-bold ${trendColors[trend]}`}>
                    {value}
                </h3>

                {change !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${trendColors[trend]}`}>
                        <TrendIcon size={16} />
                        <span>{Math.abs(change).toFixed(2)}%</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
