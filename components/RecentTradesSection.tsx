'use client';

import { useState, useEffect } from 'react';
import DataTable from '@/components/DataTable';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { Play, Pause, Filter, TrendingUp, TrendingDown } from 'lucide-react';

interface RecentTrade {
    id: string;
    price: number;
    amount: number;
    total: number;
    type: 'buy' | 'sell';
    timestamp: number;
}

const SEED_BASE_PRICE = 45120;
const SEED_BASE_TIMESTAMP = Date.UTC(2026, 2, 30, 8, 0, 0);

const generateSeedTrades = () => {
    const mockTrades: RecentTrade[] = [];

    for (let i = 0; i < 20; i++) {
        const price = SEED_BASE_PRICE + ((i % 5) - 2) * 85 + i * 11;
        const amount = 0.018 + ((i * 17) % 21) / 100;
        mockTrades.push({
            id: `seed-trade-${i}`,
            price,
            amount,
            total: price * amount,
            type: i % 3 === 0 ? 'sell' : 'buy',
            timestamp: SEED_BASE_TIMESTAMP - i * 15 * 60 * 1000,
        });
    }

    return mockTrades;
};

let liveTradeCounter = 0;

const generateLiveTrade = (anchorPrice: number) => {
    const price = Math.max(1000, anchorPrice + (Math.random() - 0.5) * 240);
    const amount = 0.01 + Math.random() * 0.45;
    const timestamp = Date.now();

    liveTradeCounter += 1;

    return {
        id: `live-trade-${timestamp}-${liveTradeCounter}`,
        price,
        amount,
        total: price * amount,
        type: Math.random() > 0.5 ? 'buy' : 'sell',
        timestamp,
    } satisfies RecentTrade;
};

const RecentTradesWidget = () => {
    const [trades, setTrades] = useState<RecentTrade[]>(() => generateSeedTrades());
    const [isPaused, setIsPaused] = useState(false);
    const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all');
    const [sortBy, setSortBy] = useState<'time' | 'price' | 'amount'>('time');

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setTrades(prev => {
                const anchorPrice = prev[0]?.price ?? SEED_BASE_PRICE;
                const newTrade = generateLiveTrade(anchorPrice);
                return [newTrade, ...prev.slice(0, 19)];
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [isPaused]);

    // Filter trades
    const filteredTrades = trades.filter(trade => {
        if (filter === 'all') return true;
        return trade.type === filter;
    });

    // Sort trades
    const sortedTrades = [...filteredTrades].sort((a, b) => {
        switch (sortBy) {
            case 'price':
                return b.price - a.price;
            case 'amount':
                return b.amount - a.amount;
            case 'time':
            default:
                return b.timestamp - a.timestamp;
        }
    });

    const displayTrades = sortedTrades.slice(0, 10);

    // Calculate statistics
    const buyTrades = trades.filter(t => t.type === 'buy');
    const sellTrades = trades.filter(t => t.type === 'sell');
    const buyVolume = buyTrades.reduce((sum, t) => sum + t.total, 0);
    const sellVolume = sellTrades.reduce((sum, t) => sum + t.total, 0);

    const columns: DataTableColumn<RecentTrade>[] = [
        {
            header: 'Price',
            cellClassName: 'price-cell',
            cell: (trade) => (
                <span className="font-mono font-semibold">
                    {formatCurrency(trade.price)}
                </span>
            ),
        },
        {
            header: 'Amount',
            cellClassName: 'amount-cell',
            cell: (trade) => (
                <span className="font-mono">
                    {trade.amount.toFixed(4)} BTC
                </span>
            ),
        },
        {
            header: 'Total',
            cellClassName: 'value-cell',
            cell: (trade) => (
                <span className="font-mono">
                    {formatCurrency(trade.total)}
                </span>
            ),
        },
        {
            header: 'Type',
            cellClassName: 'type-cell',
            cell: (trade) => (
                <span className={`font-semibold ${trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                    {trade.type === 'buy' ? '▲ Buy' : '▼ Sell'}
                </span>
            ),
        },
        {
            header: 'Time',
            cellClassName: 'time-cell',
            cell: (trade) => (
                <span className="text-purple-100/70 text-xs">
                    {timeAgo(trade.timestamp)}
                </span>
            ),
        },
    ];

    return (
        <div className="glass elevation-2 rounded-xl p-6 mt-6  fade-in">
            {/* Header with Controls */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                <div>
                    <h4 className="text-xl font-semibold flex items-center gap-2">
                        Recent Trades
                        {!isPaused && <div className="live-indicator"></div>}
                    </h4>
                    <p className="text-xs text-purple-100/50 mt-1">
                        {isPaused ? 'Paused' : 'Updates every 3 seconds'}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Pause/Resume Button */}
                    <button
                        onClick={() => setIsPaused(!isPaused)}
                        className="btn-enhanced px-3 py-2 glass-dark rounded-lg elevation-1 scale-hover-sm flex items-center gap-2 text-sm"
                        title={isPaused ? 'Resume updates' : 'Pause updates'}
                    >
                        {isPaused ? <Play size={16} /> : <Pause size={16} />}
                        {isPaused ? 'Resume' : 'Pause'}
                    </button>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 glass-light rounded-lg">
                <div>
                    <p className="text-xs text-purple-100/50 mb-1">Total Trades</p>
                    <p className="text-lg font-bold">{trades.length}</p>
                </div>
                <div>
                    <p className="text-xs text-purple-100/50 mb-1 flex items-center gap-1">
                        <TrendingUp size={12} className="text-green-500" />
                        Buy Volume
                    </p>
                    <p className="text-lg font-bold text-green-500">{formatCurrency(buyVolume)}</p>
                </div>
                <div>
                    <p className="text-xs text-purple-100/50 mb-1 flex items-center gap-1">
                        <TrendingDown size={12} className="text-red-500" />
                        Sell Volume
                    </p>
                    <p className="text-lg font-bold text-red-500">{formatCurrency(sellVolume)}</p>
                </div>
                <div>
                    <p className="text-xs text-purple-100/50 mb-1">Buy/Sell Ratio</p>
                    <p className="text-lg font-bold">
                        {buyTrades.length}/{sellTrades.length}
                    </p>
                </div>
            </div>

            {/* Filters and Sort */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
                <div className="flex items-center gap-1 text-sm">
                    <Filter size={14} className="text-purple-100/70" />
                    <span className="text-purple-100/70">Filter:</span>
                </div>
                <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${filter === 'all' ? 'bg-purple-600 text-white' : 'bg-dark-400 text-purple-100/70 hover:bg-dark-500'
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('buy')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${filter === 'buy' ? 'bg-green-600 text-white' : 'bg-dark-400 text-purple-100/70 hover:bg-dark-500'
                        }`}
                >
                    Buy Only
                </button>
                <button
                    onClick={() => setFilter('sell')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${filter === 'sell' ? 'bg-red-600 text-white' : 'bg-dark-400 text-purple-100/70 hover:bg-dark-500'
                        }`}
                >
                    Sell Only
                </button>

                <div className="border-l border-purple-100/10 pl-2 ml-2 flex items-center gap-2">
                    <span className="text-purple-100/70 text-xs">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-2 py-1 bg-dark-400 rounded text-xs border border-purple-100/10 focus:border-purple-500 outline-none transition-colors"
                    >
                        <option value="time">Time</option>
                        <option value="price">Price</option>
                        <option value="amount">Amount</option>
                    </select>
                </div>
            </div>

            {/* Trades Table */}
            <DataTable
                columns={columns}
                data={displayTrades}
                rowKey={(trade) => trade.id}
                tableClassName="trades-table"
            />

            <p className="text-xs text-purple-100/50 mt-4 text-center">
                Showing {displayTrades.length} of {filteredTrades.length} trades
                {filter !== 'all' && ` (${filter})`}
            </p>
        </div>
    );
};

export default RecentTradesWidget;
