'use client';

import NewsCard from './NewsCard';
import Link from 'next/link';

const NewsFeed = () => {
    // Mock data - in real app, this would come from an API
    const mockNews = [
        {
            title: 'Bitcoin Surges Past $50K as Institutional Interest Grows',
            description: 'Major financial institutions have announced increased Bitcoin holdings, driving price momentum in the cryptocurrency market.',
            imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=200&h=200&fit=crop',
            source: 'CryptoNews',
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.coindesk.com/markets',
            sentiment: 'positive' as const,
        },
        {
            title: 'Ethereum Network Upgrade Completed Successfully',
            description: 'The latest Ethereum upgrade has improved transaction speeds and reduced gas fees significantly.',
            imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&h=200&fit=crop',
            source: 'ETH Daily',
            publishedAt: new Date(Date.now() - 7200000).toISOString(),
            url: 'https://www.coindesk.com/tech',
            sentiment: 'positive' as const,
        },
        {
            title: 'Market Analysis: Crypto Volatility Expected This Week',
            description: 'Analysts predict increased market volatility following recent economic indicators and regulatory news.',
            imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200&h=200&fit=crop',
            source: 'Market Watch',
            publishedAt: new Date(Date.now() - 10800000).toISOString(),
            url: 'https://www.coindesk.com/markets',
            sentiment: 'neutral' as const,
        },
    ];

    return (
        <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Latest Crypto News</h2>
                <Link
                    href="https://www.coindesk.com/tag/markets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-100/70 hover:text-white transition-colors"
                >
                    View All →
                </Link>
            </div>

            <div className="grid gap-4">
                {mockNews.map((news, index) => (
                    <div key={index} className="stagger-item" style={{ animationDelay: `${index * 0.1}s` }}>
                        <NewsCard {...news} className="fade-in" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NewsFeed;
