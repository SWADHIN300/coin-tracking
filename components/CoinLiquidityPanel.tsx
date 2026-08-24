'use client';

import Link from 'next/link';
import { useActionState, useEffect, useMemo, useState } from 'react';
import { Activity, Layers3, ShieldCheck, Waves } from 'lucide-react';
import { submitLiquidityOrderAction, type PortfolioActionState } from '@/app/portfolio/actions';

type UserLiquidityOrder = {
  id: string;
  side: 'BID' | 'DEMAND';
  amountUsd: number;
  targetPriceUsd: number | null;
  createdAt: string;
};

type CoinLiquidityPanelProps = {
  coinId: string;
  coinName: string;
  coinSymbol: string;
  currentPriceUsd: number;
  volumeUsd: number;
  marketCapUsd: number;
  setupComplete: boolean;
  isAuthenticated: boolean;
  userOrders: UserLiquidityOrder[];
};

const initialState: PortfolioActionState = {};

const formatCurrency = (value: number) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 1 ? 2 : 6,
  });

const CoinLiquidityPanel = ({
  coinId,
  coinName,
  coinSymbol,
  currentPriceUsd,
  volumeUsd,
  marketCapUsd,
  setupComplete,
  isAuthenticated,
  userOrders,
}: CoinLiquidityPanelProps) => {
  const [state, formAction, pending] = useActionState(submitLiquidityOrderAction, initialState);
  const [side, setSide] = useState<'BID' | 'DEMAND'>('BID');
  const [price, setPrice] = useState(currentPriceUsd);

  useEffect(() => {
    const endpoint = encodeURIComponent(
      `/coins/markets?vs_currency=usd&ids=${coinId}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`
    );

    const refreshPrice = async () => {
      try {
        const response = await fetch(`/api/coingecko?endpoint=${endpoint}`);
        if (!response.ok) {
          return;
        }

        const data = await response.json();
        const nextPrice = data?.[0]?.current_price;

        if (typeof nextPrice === 'number' && nextPrice > 0) {
          setPrice(nextPrice);
        }
      } catch {
        // Preserve the initial snapshot when refresh fails.
      }
    };

    const timer = window.setInterval(refreshPrice, 20000);
    return () => window.clearInterval(timer);
  }, [coinId]);

  const poolMetrics = useMemo(() => {
    const indicativeDepth = volumeUsd * 0.28 + marketCapUsd * 0.0003;
    const bestBid = price * 0.992;
    const bestDemand = price * 1.008;

    return {
      indicativeDepth,
      bestBid,
      bestDemand,
    };
  }, [marketCapUsd, price, volumeUsd]);

  return (
    <section
      id="liquidity-pool"
      className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="hero-badge mb-3 w-fit">
            <span className="hero-badge-dot" />
            Coin Liquidity Pool
          </div>
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Place a {coinSymbol.toUpperCase()} bid or demand from the live coin screen.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-purple-100/70">
            The market snapshot updates from CoinGecko every 20 seconds while your order intent is saved in Postgres for your account.
          </p>
        </div>

        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-right">
          <p className="text-xs uppercase tracking-[0.28em] text-green-300/80">Live Spot</p>
          <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(price)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/8 bg-black/25 p-4">
          <p className="text-xs uppercase tracking-[0.26em] text-purple-100/55">Best Bid</p>
          <p className="mt-2 text-xl font-semibold text-white">{formatCurrency(poolMetrics.bestBid)}</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-black/25 p-4">
          <p className="text-xs uppercase tracking-[0.26em] text-purple-100/55">Best Demand</p>
          <p className="mt-2 text-xl font-semibold text-white">{formatCurrency(poolMetrics.bestDemand)}</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-black/25 p-4">
          <p className="text-xs uppercase tracking-[0.26em] text-purple-100/55">24h Volume</p>
          <p className="mt-2 text-xl font-semibold text-white">{formatCurrency(volumeUsd)}</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-black/25 p-4">
          <p className="text-xs uppercase tracking-[0.26em] text-purple-100/55">Indicative Depth</p>
          <p className="mt-2 text-xl font-semibold text-white">{formatCurrency(poolMetrics.indicativeDepth)}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[24px] border border-white/8 bg-black/20 p-5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-white">Submit Liquidity Intent</h3>
            <span className="qt-badge">
              <ShieldCheck size={12} />
              Stored per user
            </span>
          </div>

          {!setupComplete ? (
            <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
              Add `DATABASE_URL` and `AUTH_SECRET` before saved portfolio and liquidity actions can be used.
            </div>
          ) : !isAuthenticated ? (
            <div className="mt-5 rounded-2xl border border-white/8 bg-white/[0.03] p-5">
              <p className="text-sm leading-6 text-purple-100/75">
                Sign in to save a bid or demand for {coinName}. Your orders will appear in your portfolio dashboard and under this coin.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/sign-in" className="hero-btn-primary !px-5 !py-3">
                  Sign In
                </Link>
                <Link href="/sign-up" className="hero-btn-secondary !px-5 !py-3">
                  Create Account
                </Link>
              </div>
            </div>
          ) : (
            <form action={formAction} className="mt-5 space-y-4">
              <input type="hidden" name="coinId" value={coinId} />
              <input type="hidden" name="coinName" value={coinName} />
              <input type="hidden" name="coinSymbol" value={coinSymbol} />
              <input type="hidden" name="side" value={side} />

              <div className="qt-side-toggle">
                <button
                  type="button"
                  className={`qt-side-btn qt-side-btn--buy ${side === 'BID' ? 'qt-side-btn--active' : ''}`}
                  onClick={() => setSide('BID')}
                >
                  <Layers3 size={14} />
                  Bid
                </button>
                <button
                  type="button"
                  className={`qt-side-btn qt-side-btn--sell ${side === 'DEMAND' ? 'qt-side-btn--active' : ''}`}
                  onClick={() => setSide('DEMAND')}
                >
                  <Waves size={14} />
                  Demand
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="qt-input-group">
                  <label className="qt-label">Order Size (USD)</label>
                  <div className="qt-input-wrapper">
                    <input className="qt-input" type="number" name="amountUsd" min="0" step="0.01" placeholder="5000" required />
                  </div>
                </div>

                <div className="qt-input-group">
                  <label className="qt-label">Target Price (optional)</label>
                  <div className="qt-input-wrapper">
                    <input className="qt-input" type="number" name="targetPriceUsd" min="0" step="0.01" placeholder={price.toFixed(2)} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm leading-6 text-purple-100/70">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 text-green-300">
                    <Activity size={14} />
                    {side === 'BID' ? 'Aggressive buy-side interest' : 'Seller-side demand signal'}
                  </span>
                  <span>Linked to live spot {formatCurrency(price)}</span>
                </div>
              </div>

              {state.error && <p className="text-sm text-red-400">{state.error}</p>}
              {state.success && <p className="text-sm text-green-400">{state.success}</p>}

              <button
                type="submit"
                disabled={pending}
                className="hero-btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? 'Saving Order...' : `Save ${side === 'BID' ? 'Bid' : 'Demand'}`}
              </button>
            </form>
          )}
        </div>

        <div className="rounded-[24px] border border-white/8 bg-black/20 p-5">
          <h3 className="text-lg font-semibold text-white">Your Recent {coinSymbol.toUpperCase()} Orders</h3>
          <p className="mt-2 text-sm text-purple-100/65">Saved per account so you can revisit intent while checking the live chart and trades.</p>

          <div className="mt-5 space-y-3">
            {userOrders.length ? (
              userOrders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        order.side === 'BID'
                          ? 'bg-green-500/15 text-green-300'
                          : 'bg-blue-500/15 text-blue-300'
                      }`}
                    >
                      {order.side}
                    </span>
                    <span className="text-xs text-purple-100/50">{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-white">{formatCurrency(order.amountUsd)}</p>
                  <p className="mt-1 text-sm text-purple-100/65">
                    Target {order.targetPriceUsd ? formatCurrency(order.targetPriceUsd) : 'Market-linked'}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/12 bg-white/[0.02] p-5 text-sm leading-6 text-purple-100/60">
                No saved {coinSymbol.toUpperCase()} liquidity orders yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoinLiquidityPanel;
