import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import Image from 'next/image';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Badge } from './ui/badge';
import AnimatedNumber from './AnimatedNumber';
import QuickActionBar from './QuickActionBar';


const CoinHeader = ({
  livePriceChangePercentage24h,
  priceChangePercentage30d,
  name,
  image,
  livePrice,
  priceChange24h,
}: LiveCoinHeaderProps) => {
  const isTrendingUp = livePriceChangePercentage24h > 0;
  const isThirtyDayUp = priceChangePercentage30d > 0;
  const isPriceChangeUp = priceChange24h > 0;

  const stats = [
    {
      label: 'Today',
      value: livePriceChangePercentage24h,
      isUp: isTrendingUp,
      formatter: formatPercentage,
      showIcon: true,
    },
    {
      label: '30 Days',
      value: priceChangePercentage30d,
      isUp: isThirtyDayUp,
      formatter: formatPercentage,
      showIcon: true,
    },
    {
      label: 'Price Change (24h)',
      value: priceChange24h,
      isUp: isPriceChangeUp,
      formatter: formatCurrency,
      showIcon: false,
    },
  ];

  return (
    <div id="coin-header" className="glass-light elevation-2 p-6 rounded-xl">
      <div className="flex items-start justify-between mb-4">
        <h3 className="fade-in-down">{name}</h3>
        <QuickActionBar coinId={name.toLowerCase()} coinName={name} />
      </div>

      <div className="info fade-in">
        <Image
          src={image}
          alt={name}
          width={77}
          height={77}
          className="elevation-1 rounded-full"
        />

        <div className="price-row">
          <h1 className="gradient-text-success">
            <AnimatedNumber
              value={livePrice}
              formatFn={formatCurrency}
              duration={800}
            />
          </h1>
          <Badge className={cn('badge elevation-1', isTrendingUp ? 'badge-up glow-green-sm' : 'badge-down glow-red-sm')}>
            {formatPercentage(livePriceChangePercentage24h)}
            {isTrendingUp ? <TrendingUp /> : <TrendingDown />}
            (24h)
          </Badge>
        </div>
      </div>

      <ul className="stats">
        {stats.map((stat, index) => (
          <li key={stat.label} className="stagger-item" style={{ animationDelay: `${index * 0.1}s` }}>
            <p className="label">{stat.label}</p>

            <div
              className={cn('value color-transition', {
                'text-green-500': stat.isUp,
                'text-red-500': !stat.isUp,
              })}
            >
              <p>{stat.formatter(stat.value)}</p>
              {stat.showIcon &&
                (stat.isUp ? (
                  <TrendingUp width={16} height={16} />
                ) : (
                  <TrendingDown width={16} height={16} />
                ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default CoinHeader;