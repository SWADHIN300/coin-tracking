'use client';

import { useEffect, useMemo, useState } from 'react';
import { Filter, Pause, Play, TrendingDown, TrendingUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import DataTable from '@/components/DataTable';
import CoinHeader from '@/components/CoinHeader';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { toTickerSymbol } from '@/lib/tradingSymbols';

type SimulatedTrade = Trade & {
  id: string;
};

const MAX_TRADES = 24;
const DISPLAY_COUNT = 12;

const getAmountRange = (price: number) => {
  if (price >= 10000) return { min: 0.0015, max: 0.08 };
  if (price >= 1000) return { min: 0.01, max: 0.4 };
  if (price >= 100) return { min: 0.08, max: 2.5 };
  if (price >= 1) return { min: 5, max: 250 };
  return { min: 250, max: 25000 };
};

const clampPrice = (price: number) => Math.max(price, 0.00000001);
const randomInRange = (min: number, max: number) => min + Math.random() * (max - min);

const createTrade = ({
  id,
  price,
  amount,
  timestamp,
  bias,
}: {
  id: string;
  price: number;
  amount: number;
  timestamp: number;
  bias: number;
}): SimulatedTrade => {
  const isBuy = Math.random() + bias >= 0.5;

  return {
    id,
    price,
    amount,
    value: price * amount,
    timestamp,
    type: isBuy ? 'b' : 's',
  };
};

const seedTrades = (basePrice: number, change24h: number) => {
  const amountRange = getAmountRange(basePrice);
  const driftBias = Math.max(-0.15, Math.min(0.15, change24h / 100));
  const seeded: SimulatedTrade[] = [];
  let lastPrice = clampPrice(basePrice);

  for (let i = 0; i < MAX_TRADES; i += 1) {
    const volatility = Math.max(0.0008, Math.min(0.012, Math.abs(change24h) / 700));
    const direction = (Math.random() - 0.5) * volatility;
    lastPrice = clampPrice(lastPrice * (1 + direction));

    seeded.push(
      createTrade({
        id: `seed-${i}-${Date.now()}`,
        price: lastPrice,
        amount: randomInRange(amountRange.min, amountRange.max),
        timestamp: Date.now() - i * 7000,
        bias: driftBias,
      })
    );
  }

  return seeded.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));
};

const nextTradeFromPrevious = (
  previous: SimulatedTrade[],
  basePrice: number,
  change24h: number,
  tickerSymbol: string
) => {
  const referencePrice = previous[0]?.price ?? basePrice;
  const amountRange = getAmountRange(referencePrice);
  const volatility = Math.max(0.0008, Math.min(0.009, Math.abs(change24h) / 900));
  const bias = Math.max(-0.15, Math.min(0.15, change24h / 120));
  const priceDelta = (Math.random() - 0.5) * referencePrice * volatility;
  const nextPrice = clampPrice(referencePrice + priceDelta);

  return createTrade({
    id: `${tickerSymbol}-${Date.now()}`,
    price: nextPrice,
    amount: randomInRange(amountRange.min, amountRange.max),
    timestamp: Date.now(),
    bias,
  });
};

const LiveDataWrapper = ({ coinId, tvSymbol, coin, section = 'full' }: LiveDataProps) => {
  const tickerSymbol = useMemo(() => toTickerSymbol(tvSymbol), [tvSymbol]);
  const basePrice = coin.market_data.current_price.usd;
  const change24h = coin.market_data.price_change_percentage_24h_in_currency.usd;
  const amountPrecision = basePrice >= 1 ? 4 : 8;

  const [trades, setTrades] = useState<SimulatedTrade[]>(() => seedTrades(basePrice, change24h));
  const [isPaused, setIsPaused] = useState(false);
  const [filter, setFilter] = useState<'all' | 'b' | 's'>('all');
  const [sortBy, setSortBy] = useState<'time' | 'price' | 'amount'>('time');

  useEffect(() => {
    if (isPaused) return;

    const interval = window.setInterval(() => {
      setTrades((prev) => {
        const nextTrade = nextTradeFromPrevious(prev, basePrice, change24h, tickerSymbol);
        return [nextTrade, ...prev].slice(0, MAX_TRADES);
      });
    }, 2500);

    return () => window.clearInterval(interval);
  }, [isPaused, basePrice, change24h, tickerSymbol]);

  const latestTradePrice = trades[0]?.price ?? basePrice;

  const filteredTrades = trades.filter((trade) => (filter === 'all' ? true : trade.type === filter));

  const sortedTrades = [...filteredTrades].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return (b.price ?? 0) - (a.price ?? 0);
      case 'amount':
        return (b.amount ?? 0) - (a.amount ?? 0);
      case 'time':
      default:
        return (b.timestamp ?? 0) - (a.timestamp ?? 0);
    }
  });

  const displayTrades = sortedTrades.slice(0, DISPLAY_COUNT);

  const buyTrades = trades.filter((trade) => trade.type === 'b');
  const sellTrades = trades.filter((trade) => trade.type === 's');
  const buyVolume = buyTrades.reduce((sum, trade) => sum + (trade.value ?? 0), 0);
  const sellVolume = sellTrades.reduce((sum, trade) => sum + (trade.value ?? 0), 0);

  const tradeColumns: DataTableColumn<SimulatedTrade>[] = [
    {
      header: 'Price',
      cellClassName: 'price-cell',
      cell: (trade) => (
        <span className="font-mono font-semibold">
          {trade.price ? formatCurrency(trade.price) : '-'}
        </span>
      ),
    },
    {
      header: 'Amount',
      cellClassName: 'amount-cell',
      cell: (trade) => (
        <span className="font-mono">
          {trade.amount?.toFixed(amountPrecision) ?? '-'} {coin.symbol.toUpperCase()}
        </span>
      ),
    },
    {
      header: 'Value',
      cellClassName: 'value-cell',
      cell: (trade) => (
        <span className="font-mono">
          {trade.value ? formatCurrency(trade.value) : '-'}
        </span>
      ),
    },
    {
      header: 'Buy/Sell',
      cellClassName: 'type-cell',
      cell: (trade) => (
        <span className={trade.type === 'b' ? 'font-semibold text-green-500' : 'font-semibold text-red-500'}>
          {trade.type === 'b' ? '▲ Buy' : '▼ Sell'}
        </span>
      ),
    },
    {
      header: 'Time',
      cellClassName: 'time-cell',
      cell: (trade) => (
        <span className="text-xs text-purple-100/70">
          {trade.timestamp ? timeAgo(trade.timestamp) : '-'}
        </span>
      ),
    },
  ];

  return (
    <section id="live-data-wrapper">
      {section !== 'trades' && (
        <>
          <CoinHeader
            name={coin.name}
            image={coin.image.large}
            livePrice={latestTradePrice}
            livePriceChangePercentage24h={change24h}
            priceChangePercentage30d={coin.market_data.price_change_percentage_30d_in_currency.usd}
            priceChange24h={coin.market_data.price_change_24h_in_currency.usd}
          />

          {section === 'full' && <Separator className="divider" />}
        </>
      )}

      {section !== 'header' && (
        <div className="glass elevation-2 rounded-xl p-6 mt-6 fade-in">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <div>
              <h4 className="text-xl font-semibold flex items-center gap-2">
                Recent Trades
                {!isPaused && <div className="live-indicator" />}
              </h4>
              <p className="text-xs text-purple-100/50 mt-1">
                {tickerSymbol} market tape {isPaused ? 'paused' : 'updates every 2.5 seconds'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPaused((value) => !value)}
                className="btn-enhanced px-3 py-2 glass-dark rounded-lg elevation-1 scale-hover-sm flex items-center gap-2 text-sm"
                title={isPaused ? 'Resume updates' : 'Pause updates'}
              >
                {isPaused ? <Play size={16} /> : <Pause size={16} />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
            </div>
          </div>

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

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <div className="flex items-center gap-1 text-sm">
              <Filter size={14} className="text-purple-100/70" />
              <span className="text-purple-100/70">Filter:</span>
            </div>

            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                filter === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-dark-400 text-purple-100/70 hover:bg-dark-500'
              }`}
            >
              All
            </button>

            <button
              type="button"
              onClick={() => setFilter('b')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                filter === 'b'
                  ? 'bg-green-600 text-white'
                  : 'bg-dark-400 text-purple-100/70 hover:bg-dark-500'
              }`}
            >
              Buy Only
            </button>

            <button
              type="button"
              onClick={() => setFilter('s')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                filter === 's'
                  ? 'bg-red-600 text-white'
                  : 'bg-dark-400 text-purple-100/70 hover:bg-dark-500'
              }`}
            >
              Sell Only
            </button>

            <div className="border-l border-purple-100/10 pl-2 ml-2 flex items-center gap-2">
              <span className="text-purple-100/70 text-xs">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'time' | 'price' | 'amount')}
                className="px-2 py-1 bg-dark-400 rounded text-xs border border-purple-100/10 focus:border-purple-500 outline-none transition-colors"
              >
                <option value="time">Time</option>
                <option value="price">Price</option>
                <option value="amount">Amount</option>
              </select>
            </div>
          </div>

          <DataTable
            columns={tradeColumns}
            data={displayTrades}
            rowKey={(trade) => trade.id}
            tableClassName="trades-table"
          />

          <p className="text-xs text-purple-100/50 mt-4 text-center">
            Showing {displayTrades.length} of {filteredTrades.length} trades
            {filter !== 'all' && ` (${filter === 'b' ? 'buy' : 'sell'})`}
          </p>
        </div>
      )}
    </section>
  );
};

export default LiveDataWrapper;
