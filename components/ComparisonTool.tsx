'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface CoinCompare {
    id: string;
    name: string;
    price: number;
    change24h: number;
    marketCap: number;
}

const ComparisonTool = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [compareCoins, setCompareCoins] = useState<CoinCompare[]>([]);

    // Mock data - in real app, this would come from props or API
    const mockCoins: CoinCompare[] = [
        { id: 'bitcoin', name: 'Bitcoin', price: 45000, change24h: 2.5, marketCap: 880000000000 },
        { id: 'ethereum', name: 'Ethereum', price: 3200, change24h: -1.2, marketCap: 385000000000 },
        { id: 'cardano', name: 'Cardano', price: 0.65, change24h: 5.8, marketCap: 23000000000 },
    ];

    const addCoin = (coin: CoinCompare) => {
        if (compareCoins.length < 3 && !compareCoins.find(c => c.id === coin.id)) {
            setCompareCoins([...compareCoins, coin]);
        }
    };

    const removeCoin = (id: string) => {
        setCompareCoins(compareCoins.filter(c => c.id !== id));
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: price < 1 ? 4 : 2,
        }).format(price);
    };

    const formatMarketCap = (cap: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 2,
        }).format(cap);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="glass elevation-2 px-4 py-2 rounded-lg text-sm font-medium hover:elevation-3 transition-all flex items-center gap-2"
            >
                <Plus size={16} />
                Compare Coins
            </button>
        );
    }

    return (
        <div className="glass elevation-3 rounded-xl p-6 mb-6 fade-in">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Compare Cryptocurrencies</h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-purple-100/70 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Selected Coins */}
            {compareCoins.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {compareCoins.map((coin) => (
                        <div key={coin.id} className="glass-light elevation-1 rounded-lg p-4 relative">
                            <button
                                onClick={() => removeCoin(coin.id)}
                                className="absolute top-2 right-2 text-purple-100/50 hover:text-red-500 transition-colors"
                            >
                                <X size={16} />
                            </button>

                            <h4 className="font-semibold mb-2">{coin.name}</h4>
                            <p className="text-2xl font-bold gradient-text-success mb-1">
                                {formatPrice(coin.price)}
                            </p>
                            <p className={`text-sm ${coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                            </p>
                            <p className="text-xs text-purple-100/70 mt-2">
                                MCap: {formatMarketCap(coin.marketCap)}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Coins */}
            {compareCoins.length < 3 && (
                <div>
                    <p className="text-sm text-purple-100/70 mb-3">
                        Add coins to compare (max 3):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {mockCoins
                            .filter(coin => !compareCoins.find(c => c.id === coin.id))
                            .map((coin) => (
                                <button
                                    key={coin.id}
                                    onClick={() => addCoin(coin)}
                                    className="btn-enhanced px-4 py-2 bg-dark-400 hover:bg-dark-500 rounded-lg text-sm transition-all text-left"
                                >
                                    <div className="font-medium">{coin.name}</div>
                                    <div className="text-xs text-purple-100/70">{formatPrice(coin.price)}</div>
                                </button>
                            ))}
                    </div>
                </div>
            )}

            {compareCoins.length === 0 && (
                <p className="text-center text-purple-100/50 py-8">
                    Select coins above to start comparing
                </p>
            )}
        </div>
    );
};

export default ComparisonTool;
