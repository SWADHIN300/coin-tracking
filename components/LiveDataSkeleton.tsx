export default function LiveDataSkeleton() {
    return (
        <div className="fade-in">
            {/* Coin Header Skeleton */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gray-700/50 rounded-full shimmer"></div>
                <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-700/50 rounded w-48 shimmer"></div>
                    <div className="h-8 bg-gray-700/50 rounded w-36 shimmer"></div>
                </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-purple-600/50 to-transparent mb-6"></div>

            {/* Chart Skeleton */}
            <div className="mb-6 stagger-item">
                <div className="h-6 bg-gray-700/50 rounded w-40 mb-4 shimmer"></div>
                <div className="h-[360px] bg-gradient-to-br from-gray-700/20 to-gray-700/40 rounded-lg shimmer elevation-1"></div>
            </div>

            {/* Separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-purple-600/50 to-transparent mb-6"></div>

            {/* Trades Table Skeleton */}
            <div className="stagger-item" style={{ animationDelay: '0.1s' }}>
                <div className="h-6 bg-gray-700/50 rounded w-40 mb-4 shimmer"></div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="h-12 bg-gray-700/30 rounded shimmer"
                            style={{ animationDelay: `${i * 0.05}s` }}
                        ></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
