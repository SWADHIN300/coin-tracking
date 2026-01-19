import React from 'react';
import { fetcher } from '@/lib/coingecko.actions';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MarketOverviewBanner = async () => {
    let globalData;

    try {
        globalData = await fetcher<GlobalData>('/global');
    } catch (error) {
        console.error('Error fetching global data:', error);
        return null; // Hide banner if data fails to load
    }

    if (!globalData) return null;

    const stats = [
        {
            label: 'Market Cap',
            value: formatCurrency(globalData.data.total_market_cap.usd),
            change: globalData.data.market_cap_change_percentage_24h_usd,
            icon: globalData.data.market_cap_change_percentage_24h_usd > 0 ? TrendingUp : TrendingDown,
        },
        {
            label: '24h Volume',
            value: formatCurrency(globalData.data.total_volume.usd),
        },
        {
            label: 'BTC Dominance',
            value: `${globalData.data.market_cap_percentage.btc.toFixed(1)}%`,
        },
        {
            label: 'Active Cryptos',
            value: globalData.data.active_cryptocurrencies.toLocaleString(),
        },
    ];

    return (
        <div className="w-full fade-in-down">
            <div className="glass elevation-1 rounded-xl p-4 md:p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={stat.label}
                            className="stagger-item flex flex-col gap-2"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <p className="text-purple-100/70 text-xs md:text-sm font-medium whitespace-nowrap">{stat.label}</p>
                            <div className="flex flex-col gap-1">
                                <span className="text-white text-base md:text-xl font-bold truncate" title={stat.value}>
                                    {stat.value}
                                </span>
                                {stat.change !== undefined && (
                                    <span
                                        className={`flex items-center gap-1 text-xs font-medium ${stat.change > 0 ? 'text-green-500' : 'text-red-500'
                                            }`}
                                    >
                                        {formatPercentage(stat.change)}
                                        {stat.icon && <stat.icon size={14} />}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MarketOverviewBanner;
