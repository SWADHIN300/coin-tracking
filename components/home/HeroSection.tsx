'use client';

import Link from 'next/link';
import { ArrowRight, BarChart2, Globe, TrendingUp, Zap } from 'lucide-react';
import { useTradeDrawer } from '@/components/TradeDrawerProvider';

const stats = [
    { value: '5,000+', label: 'Tracked Coins', icon: BarChart2 },
    { value: 'Real-Time', label: 'Live Updates', icon: Zap },
    { value: '500+', label: 'Markets', icon: Globe },
];

const HeroSection = () => {
    const { openBuyDrawer } = useTradeDrawer();

    return (
        <section id="hero-section">
            {/* Animated background orbs */}
            <div className="hero-orb hero-orb-1" />
            <div className="hero-orb hero-orb-2" />
            <div className="hero-orb hero-orb-3" />

            <div className="hero-content">
                <div className="hero-badge">
                    <span className="hero-badge-dot" />
                    Live Crypto Tracking
                </div>

                <h1 className="hero-heading">
                    Track Cryptocurrency
                    <span className="hero-heading-gradient"> Prices Live</span>
                </h1>

                <p className="hero-subtext">
                    Monitor Bitcoin, Ethereum, and thousands of altcoins with real-time data,
                    advanced charts, and comprehensive market analytics.
                </p>

                <div className="hero-cta-group">
                    <Link href="/coins" className="hero-btn-primary">
                        Explore All Coins
                        <ArrowRight size={18} />
                    </Link>
                    <button type="button" className="hero-btn-secondary" onClick={openBuyDrawer}>
                        <TrendingUp size={18} />
                        Buy Crypto
                    </button>
                </div>

                <ul className="hero-stats">
                    {stats.map(({ value, label, icon: Icon }) => (
                        <li key={label} className="hero-stat-item">
                            <div className="hero-stat-icon">
                                <Icon size={18} />
                            </div>
                            <div>
                                <p className="hero-stat-value">{value}</p>
                                <p className="hero-stat-label">{label}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default HeroSection;
