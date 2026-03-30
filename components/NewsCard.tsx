import { ExternalLink, TrendingUp, Clock } from 'lucide-react';
import Image from 'next/image';

interface NewsCardProps {
    title: string;
    description: string;
    imageUrl?: string;
    source: string;
    publishedAt: string;
    url: string;
    sentiment?: 'positive' | 'negative' | 'neutral';
    className?: string;
}

const NewsCard = ({
    title,
    description,
    imageUrl,
    source,
    publishedAt,
    url,
    sentiment = 'neutral',
    className = '',
}: NewsCardProps) => {
    const sentimentColors = {
        positive: 'border-green-500/30 bg-green-500/5',
        negative: 'border-red-500/30 bg-red-500/5',
        neutral: 'border-purple-100/10',
    };

    const sentimentIcons = {
        positive: '📈',
        negative: '📉',
        neutral: '📰',
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`glass elevation-1 hover:elevation-3 rounded-xl overflow-hidden transition-all scale-hover-sm border ${sentimentColors[sentiment]} ${className}`}
        >
            <div className="flex gap-4 p-4">
                {/* Image */}
                {imageUrl && (
                    <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden elevation-1">
                        <Image
                            src={imageUrl}
                            alt={title}
                            width={96}
                            height={96}
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-sm md:text-base line-clamp-2 flex-1">
                            {title}
                        </h3>
                        <span className="text-lg flex-shrink-0">{sentimentIcons[sentiment]}</span>
                    </div>

                    <p className="text-sm text-purple-100/70 line-clamp-2 mb-3">
                        {description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-purple-100/50">
                        <span className="font-medium">{source}</span>
                        <div className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatTimeAgo(publishedAt)}
                        </div>
                        <ExternalLink size={12} />
                    </div>
                </div>
            </div>
        </a>
    );
};

export default NewsCard;
