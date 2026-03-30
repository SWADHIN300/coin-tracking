import React from 'react';
import { Info, ExternalLink } from 'lucide-react';

interface InfoCardProps {
    title: string;
    description: string;
    link?: {
        url: string;
        text: string;
    };
    icon?: React.ReactNode;
    variant?: 'info' | 'success' | 'warning';
    className?: string;
}

const InfoCard = ({
    title,
    description,
    link,
    icon,
    variant = 'info',
    className = ''
}: InfoCardProps) => {
    const variants = {
        info: 'glass elevation-2 border-blue-500/20',
        success: 'glass elevation-2 border-green-500/20',
        warning: 'glass elevation-2 border-yellow-500/20',
    };

    const iconColors = {
        info: 'text-blue-400',
        success: 'text-green-400',
        warning: 'text-yellow-400',
    };

    return (
        <div className={`${variants[variant]} rounded-xl p-5 fade-in ${className}`}>
            <div className="flex items-start gap-4">
                <div className={`${iconColors[variant]} mt-1`}>
                    {icon || <Info size={24} />}
                </div>

                <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-2">{title}</h4>
                    <p className="text-purple-100 text-sm leading-relaxed mb-3">
                        {description}
                    </p>

                    {link && (
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            {link.text}
                            <ExternalLink size={14} />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InfoCard;
