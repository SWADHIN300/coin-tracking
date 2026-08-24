'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Activity, ArrowUpRight, CircleDollarSign, Landmark, RefreshCcw } from 'lucide-react';

type LiquidityCoin = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
};

type LiquidityOrder = {
  id: string;
  coinId: string;
  coinSymbol: string;
  side: 'BID' | 'DEMAND';
  amountUsd: number;
  targetPriceUsd: number | null;
  createdAt: string;
};

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 1 ? 2 : 6,
  });

const LiquidityPoolBoard = ({
  initialCoins,
  orders,
}: {
  initialCoins: LiquidityCoin[];
  orders: LiquidityOrder[];
}) => {
  const [coins, setCoins] = useState(initialCoins);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  const coinIds = useMemo(() => coins.map((coin) => coin.id).join(','), [coins]);

  useEffect(() => {
    if (!coinIds) {
      return;
    }

    const endpoint = encodeURIComponent(
      `/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`
    );

    const refresh = async () => {
      try {
        const response = await fetch(`/api/coingecko?endpoint=${endpoint}`);
        if (!response.ok) {
          return;
        }

        const latest = (await response.json()) as LiquidityCoin[];
        setCoins(latest);
        setLastRefresh(Date.now());
      } catch {
        // Keep the previous snapshot if the refresh fails.
      }
    };

    const timer = window.setInterval(refresh, 20000);
    return () => window.clearInterval(timer);
  }, [coinIds]);

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/8 bg-dark-500/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="hero-badge mb-3 w-fit">
              <span className="hero-badge-dot" />
              Live Liquidity Board
            </div>
            <h2 className="text-2xl font-semibold text-white md:text-3xl">Watch real-time pool conditions for the coins you care about.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-purple-100/70">
              This board refreshes from CoinGecko market data every 20 seconds and links directly into each coin’s bid or demand panel.
            </p>
          </div>

          <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            <div className="flex items-center gap-2">
              <RefreshCcw size={14} />
              <span>Updated {new Date(lastRefresh).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {coins.map((coin) => {
            const indicativeDepth = coin.total_volume * 0.32 + coin.market_cap * 0.0002;

            return (
              <article
                key={coin.id}
                className="rounded-[24px] border border-white/6 bg-black/30 p-5 transition hover:border-green-500/20 hover:bg-black/40"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={coin.image} alt={coin.name} className="h-11 w-11 rounded-full border border-white/10 bg-black/40" />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{coin.name}</h3>
                      <p className="text-sm uppercase tracking-[0.24em] text-purple-100/60">{coin.symbol}</p>
                    </div>
                  </div>

                  <div
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      coin.price_change_percentage_24h >= 0
                        ? 'bg-green-500/15 text-green-300'
                        : 'bg-red-500/15 text-red-300'
                    }`}
                  >
                    {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-purple-100/55">Spot</p>
                    <p className="mt-2 text-lg font-semibold text-white">{formatCurrency(coin.current_price)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-purple-100/55">24h Volume</p>
                    <p className="mt-2 text-lg font-semibold text-white">{formatCurrency(coin.total_volume)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/6 bg-white/[0.03] p-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-purple-100/55">Pool Depth</p>
                    <p className="mt-2 text-lg font-semibold text-white">{formatCurrency(indicativeDepth)}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-purple-100/70">
                    <CircleDollarSign size={12} className="text-green-400" />
                    Market Cap {formatCurrency(coin.market_cap)}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-purple-100/70">
                    <Landmark size={12} className="text-green-400" />
                    Bid/Demand ready
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-2 text-xs text-purple-100/70">
                    <Activity size={12} className="text-green-400" />
                    Live board
                  </div>
                </div>

                <Link
                  href={`/coins/${coin.id}#liquidity-pool`}
                  className="hero-btn-secondary mt-5 inline-flex !px-5 !py-3"
                >
                  Open {coin.symbol.toUpperCase()} Liquidity
                  <ArrowUpRight size={16} />
                </Link>
              </article>
            );
          })}
        </div>
      </div>

      <div className="rounded-[28px] border border-white/8 bg-dark-500/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
        <h3 className="text-xl font-semibold text-white">Recent Saved Orders</h3>
        <p className="mt-2 text-sm text-purple-100/65">Your latest bid and demand intent saved from coin pages.</p>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-purple-100/80">
            <thead>
              <tr className="border-b border-white/8 text-xs uppercase tracking-[0.24em] text-purple-100/45">
                <th className="pb-3 pr-4">Coin</th>
                <th className="pb-3 pr-4">Side</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 pr-4">Target</th>
                <th className="pb-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.length ? (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/6">
                    <td className="py-4 pr-4 font-semibold text-white">{order.coinSymbol.toUpperCase()}</td>
                    <td className="py-4 pr-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          order.side === 'BID'
                            ? 'bg-green-500/15 text-green-300'
                            : 'bg-blue-500/15 text-blue-300'
                        }`}
                      >
                        {order.side}
                      </span>
                    </td>
                    <td className="py-4 pr-4">{formatCurrency(order.amountUsd)}</td>
                    <td className="py-4 pr-4">{order.targetPriceUsd ? formatCurrency(order.targetPriceUsd) : 'Market-linked'}</td>
                    <td className="py-4">{new Date(order.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-6 text-purple-100/55" colSpan={5}>
                    No saved orders yet. Open any coin page and place a bid or demand to start building your book.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LiquidityPoolBoard;
