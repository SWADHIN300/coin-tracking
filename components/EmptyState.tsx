import React from 'react';
import { FileQuestion, TrendingUp, Search, Inbox } from 'lucide-react';

interface EmptyStateProps {
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    variant?: 'default' | 'search' | 'data' | 'inbox';
    className?: string;
}

const EmptyState = ({
    title,
    description,
    action,
    variant = 'default',
    className = ''
}: EmptyStateProps) => {
    const icons = {
        default: FileQuestion,
        search: Search,
        data: TrendingUp,
        inbox: Inbox,
    };

    const Icon = icons[variant];

    return (
        <div className={`flex flex-col items-center justify-center py-16 px-4 fade-in ${className}`}>
            <div className="bg-dark-400/50 rounded-full p-6 mb-6 animate-pulse">
                <Icon size={48} className="text-purple-100/50" />
            </div>

            <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
            <p className="text-purple-100/70 text-sm text-center max-w-md mb-6">
                {description}
            </p>

            {action && (
                <button
                    onClick={action.onClick}
                    className="btn-enhanced px-6 py-3 bg-gradient-success text-white rounded-lg font-medium elevation-2 hover:elevation-3 transition-all"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
