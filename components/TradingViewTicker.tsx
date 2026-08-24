'use client';

import { useEffect, useRef, memo } from 'react';

const TradingViewTicker = memo(() => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof document === 'undefined' || !containerRef.current) return;
        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
        script.type = 'text/javascript';
        script.async = true;
        script.innerHTML = JSON.stringify({
            symbols: [
                { proName: 'BINANCE:BTCUSDT', title: 'Bitcoin' },
                { proName: 'BINANCE:ETHUSDT', title: 'Ethereum' },
                { proName: 'BINANCE:SOLUSDT', title: 'Solana' },
                { proName: 'BINANCE:BNBUSDT', title: 'BNB' },
                { proName: 'BINANCE:XRPUSDT', title: 'XRP' },
                { proName: 'BINANCE:ADAUSDT', title: 'Cardano' },
                { proName: 'BINANCE:DOGEUSDT', title: 'Dogecoin' },
                { proName: 'BINANCE:DOTUSDT', title: 'Polkadot' },
                { proName: 'BINANCE:AVAXUSDT', title: 'Avalanche' },
                { proName: 'BINANCE:MATICUSDT', title: 'Polygon' },
            ],
            showSymbolLogo: true,
            isTransparent: true,
            displayMode: 'adaptive',
            colorTheme: 'dark',
            locale: 'en',
        });

        containerRef.current.appendChild(script);
    }, []);

    return (
        <div className="tv-ticker-container">
            <div className="tradingview-widget-container" ref={containerRef}>
                <div className="tradingview-widget-container__widget" />
            </div>
        </div>
    );
});

TradingViewTicker.displayName = 'TradingViewTicker';
export default TradingViewTicker;
