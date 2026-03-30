import { TrendingUp, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
    return (
        <div className="glass elevation-2 rounded-2xl p-8 md:p-12 mb-8 fade-in relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="text-yellow-500" size={24} />
                    <span className="text-sm font-semibold text-purple-100/70 uppercase tracking-wider">
                        Real-Time Crypto Tracking
                    </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold mb-4 gradient-text">
                    Track Cryptocurrency Prices Live
                </h1>

                <p className="text-purple-100/80 text-lg md:text-xl mb-8 max-w-2xl">
                    Monitor Bitcoin, Ethereum, and thousands of altcoins with real-time data,
                    advanced charts, and comprehensive market analytics.
                </p>

                <div className="flex flex-wrap gap-4">
                    <Link
                        href="/coins"
                        className="btn-enhanced px-6 py-3 bg-gradient-success text-white font-semibold rounded-lg elevation-2 scale-hover flex items-center gap-2"
                    >
                        <TrendingUp size={20} />
                        Explore All Coins
                    </Link>
                    <Link
                        href="/coins/bitcoin"
                        className="btn-enhanced px-6 py-3 glass-dark font-semibold rounded-lg elevation-1 scale-hover flex items-center gap-2"
                    >
                        <Zap size={20} className="text-yellow-500" />
                        View Live Prices
                    </Link>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-purple-100/10">
                    <div>
                        <p className="text-purple-100/50 text-sm mb-1">Tracked Coins</p>
                        <p className="text-2xl font-bold">5,000+</p>
                    </div>
                    <div>
                        <p className="text-purple-100/50 text-sm mb-1">Live Updates</p>
                        <p className="text-2xl font-bold">Real-Time</p>
                    </div>
                    <div>
                        <p className="text-purple-100/50 text-sm mb-1">Markets</p>
                        <p className="text-2xl font-bold">500+</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
