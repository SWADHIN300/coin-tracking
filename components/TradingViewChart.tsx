'use client';

import { useEffect, useRef, memo } from 'react';

interface TradingViewChartProps {
    symbol?: string;
    theme?: 'dark' | 'light';
    height?: number;
}

const TradingViewChart = memo(({ symbol = 'BINANCE:BTCUSDT', theme = 'dark', height = 500 }: TradingViewChartProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
        script.type = 'text/javascript';
        script.async = true;
        script.innerHTML = JSON.stringify({
            autosize: true,
            symbol,
            interval: '15',
            timezone: 'Etc/UTC',
            theme,
            style: '1',
            locale: 'en',
            allow_symbol_change: true,
            calendar: false,
            support_host: 'https://www.tradingview.com',
            hide_side_toolbar: false,
            details: true,
            hotlist: true,
            show_popup_button: true,
            popup_width: '1000',
            popup_height: '650',
            withdateranges: true,
            hide_volume: false,
            backgroundColor: theme === 'dark' ? 'rgba(15, 23, 39, 1)' : 'rgba(255, 255, 255, 1)',
            gridColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.06)',
        });

        containerRef.current.appendChild(script);
    }, [symbol, theme]);

    return (
        <div className="tv-chart-container" style={{ height }}>
            <div className="tradingview-widget-container" ref={containerRef} style={{ height: '100%', width: '100%' }}>
                <div className="tradingview-widget-container__widget" style={{ height: 'calc(100% - 32px)', width: '100%' }} />
            </div>
        </div>
    );
});

TradingViewChart.displayName = 'TradingViewChart';
export default TradingViewChart;
