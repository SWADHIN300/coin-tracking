import React from 'react';
import { fetcher } from '@/lib/coingecko.actions';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';
import { CoinOverviewFallback } from './fallback';
import CandlestickChart from '@/components/CandlestickChart';

const CoinOverview = async () => {
  let coin: CoinDetailsData | null = null;
  let coinOHLCData: OHLCData[] | null = null;

  try {
    const [fetchedCoin, fetchedOHLCData] = await Promise.all([
      fetcher<CoinDetailsData>('/coins/bitcoin'),
      fetcher<OHLCData[]>('/coins/bitcoin/ohlc', {
        vs_currency: 'usd',
        days: 1,
      }),
    ]);

    coin = fetchedCoin;
    coinOHLCData = fetchedOHLCData;
  } catch (error) {
    console.error('Error fetching coin overview:', error);
    return <CoinOverviewFallback />;
  }

  if (!coin) return <CoinOverviewFallback />;

  return (
    <div id="coin-overview" className="glass elevation-2 scale-hover-sm transition-all duration-300">
      <CandlestickChart data={coinOHLCData} coinId='bitcoin' liveInterval='1m'>
        <div className="header pt-2 fade-in-down">
          <Image src={coin.image.large} alt={coin.name} width={56} height={56} className="elevation-1 rounded-full" />
          <div className="info">
            <p className="text-purple-100">
              {coin.name} / {(coin.symbol || '').toUpperCase()}
            </p>
            <h1 className="gradient-text-success">{formatCurrency(coin.market_data.current_price.usd)}</h1>
          </div>
        </div>
      </CandlestickChart>
    </div>
  );
};

export default CoinOverview;