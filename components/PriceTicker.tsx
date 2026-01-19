'use client';

import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

interface PriceTickerProps {
    prices: Array<{
        symbol: string;
        price: number;
        change: number;
    }>;
    className?: string;
}

const PriceTicker = ({ prices, className = '' }: PriceTickerProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => setIsVisible(true), 100);
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`glass-dark elevation-2 rounded-lg px-4 py-3 overflow-hidden ${className}`}>
            <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-yellow-500" />
                <span className="text-sm font-semibold">Live Prices</span>
            </div>

            <div className={`flex gap-6 overflow-x-auto no-scrollbar transition-opacity ${isVisible ? 'opacity-100' : 'opacity-50'}`}>
                {prices.map((item) => (
                    <div key={item.symbol} className="flex items-center gap-2 whitespace-nowrap">
                        <span className="text-sm font-medium text-purple-100/70">{item.symbol}</span>
                        <span className="text-sm font-bold">${item.price.toLocaleString()}</span>
                        <span className={`text-xs ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PriceTicker;
