'use client';

import { useEffect, useState } from 'react';

interface StatusIndicatorsProps {
    isConnected?: boolean;
    lastUpdated?: Date | number | null;
    showLiveIndicator?: boolean;
    className?: string;
}

const StatusIndicators = ({
    isConnected = true,
    lastUpdated = null,
    showLiveIndicator = false,
    className = ''
}: StatusIndicatorsProps) => {
    const [timeAgo, setTimeAgo] = useState('');

    useEffect(() => {
        if (!lastUpdated) return;

        const updateTimeAgo = () => {
            const now = Date.now();
            const timestamp = typeof lastUpdated === 'number' ? lastUpdated : lastUpdated.getTime();
            const diff = now - timestamp;

            if (diff < 1000) {
                setTimeAgo('just now');
            } else if (diff < 60000) {
                setTimeAgo(`${Math.floor(diff / 1000)}s ago`);
            } else if (diff < 3600000) {
                setTimeAgo(`${Math.floor(diff / 60000)}m ago`);
            } else {
                setTimeAgo(`${Math.floor(diff / 3600000)}h ago`);
            }
        };

        updateTimeAgo();
        const interval = setInterval(updateTimeAgo, 1000);

        return () => clearInterval(interval);
    }, [lastUpdated]);

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Live Indicator */}
            {showLiveIndicator && (
                <div className="flex items-center gap-2">
                    <div className="live-indicator"></div>
                    <span className="text-xs font-medium text-green-500">Live</span>
                </div>
            )}

            {/* Connection Status */}
            <div className="flex items-center gap-2">
                <div
                    className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'
                        } ${isConnected ? 'pulse-glow' : ''}`}
                ></div>
                <span className="text-xs text-purple-100">
                    {isConnected ? 'Connected' : 'Disconnected'}
                </span>
            </div>

            {/* Last Updated */}
            {lastUpdated && timeAgo && (
                <span className="text-xs text-purple-100/70">
                    Updated {timeAgo}
                </span>
            )}
        </div>
    );
};

export default StatusIndicators;
