import Link from 'next/link';
import { ExternalLink, TrendingUp, Newspaper, BarChart2 } from 'lucide-react';

const newsItems = [
    {
        title: 'Bitcoin Surges Past $50K as Institutional Interest Grows',
        description:
            'Major financial institutions have announced increased Bitcoin holdings, driving price momentum in the cryptocurrency market.',
        source: 'CryptoNews',
        time: '1h ago',
        type: 'bullish',
        icon: TrendingUp,
        url: 'https://www.coindesk.com/markets',
        emoji: '📈',
    },
    {
        title: 'Ethereum Network Upgrade Completed Successfully',
        description:
            'The latest Ethereum upgrade has improved transaction speeds and reduced gas fees significantly.',
        source: 'ETH Daily',
        time: '2h ago',
        type: 'bullish',
        icon: TrendingUp,
        url: 'https://www.coindesk.com/tech',
        emoji: '📈',
    },
    {
        title: 'Market Analysis: Crypto Volatility Expected This Week',
        description:
            'Analysts predict increased market volatility following recent economic indicators and regulatory news.',
        source: 'Market Watch',
        time: '3h ago',
        type: 'neutral',
        icon: Newspaper,
        url: 'https://www.coindesk.com/markets',
        emoji: '📰',
    },
];

const NewsSection = () => {
    return (
        <section id="news-section">
            <div className="news-header">
                <h2 className="news-title">Latest Crypto News</h2>
                <Link href="https://www.coindesk.com/tag/markets" target="_blank" className="news-view-all">
                    View All →
                </Link>
            </div>

            <div className="news-grid">
                {newsItems.map((item) => (
                    <Link
                        key={item.title}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="news-card"
                    >
                        <div className="news-card-top">
                            <span className="news-emoji">{item.emoji}</span>
                            <div className={`news-type-badge news-type-${item.type}`}>
                                <item.icon size={12} />
                                <span>{item.type === 'bullish' ? 'Bullish' : 'Analysis'}</span>
                            </div>
                        </div>

                        <h3 className="news-card-title">{item.title}</h3>
                        <p className="news-card-desc">{item.description}</p>

                        <div className="news-card-footer">
                            <span className="news-source">{item.source}</span>
                            <span className="news-time">{item.time}</span>
                            <ExternalLink size={13} className="news-external-icon" />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default NewsSection;
