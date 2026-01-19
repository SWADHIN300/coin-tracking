export default function LiveDataSkeleton() {
    return (
        <div className="animate-pulse">
            {/* Coin Header Skeleton */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gray-700/50 rounded-full"></div>
                <div className="flex-1">
                    <div className="h-6 bg-gray-700/50 rounded w-48 mb-2"></div>
                    <div className="h-8 bg-gray-700/50 rounded w-36"></div>
                </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-gray-700/50 mb-6"></div>

            {/* Chart Skeleton */}
            <div className="mb-6">
                <div className="h-6 bg-gray-700/50 rounded w-40 mb-4"></div>
                <div className="h-[360px] bg-gray-700/30 rounded-lg"></div>
            </div>

            {/* Separator */}
            <div className="h-px bg-gray-700/50 mb-6"></div>

            {/* Trades Table Skeleton */}
            <div>
                <div className="h-6 bg-gray-700/50 rounded w-40 mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-12 bg-gray-700/30 rounded"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}
