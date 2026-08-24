import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { BarChart3, Database, Layers3, Wallet } from 'lucide-react';
import { authOptions } from '@/auth';
import prisma from '@/lib/prisma';
import { fetcher } from '@/lib/coingecko.actions';
import { authSetupComplete } from '@/lib/site-config';
import PortfolioHoldingForm from '@/components/portfolio/PortfolioHoldingForm';
import LiquidityPoolBoard from '@/components/portfolio/LiquidityPoolBoard';

const defaultCoins = ['bitcoin', 'ethereum', 'solana', 'binancecoin', 'ripple', 'cardano'];

export const dynamic = 'force-dynamic';

const PortfolioPage = async () => {
  if (!authSetupComplete) {
    return (
      <main className="main-container py-12">
        <div className="rounded-[32px] border border-amber-500/20 bg-amber-500/10 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
          <div className="hero-badge mb-4 w-fit">
            <span className="hero-badge-dot" />
            Setup Required
          </div>
          <h1 className="text-4xl font-semibold text-white md:text-5xl">Enable auth and Postgres to unlock the portfolio workspace.</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-amber-50/90">
            Add `DATABASE_URL` and `AUTH_SECRET`, then run `npx prisma db push`. Google sign-in also needs `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`.
          </p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5 font-mono text-sm text-purple-100/80">
            <p>DATABASE_URL=postgresql://postgres:postgres@localhost:5432/block_coin</p>
            <p>AUTH_SECRET=your_long_random_secret</p>
            <p>AUTH_GOOGLE_ID=...</p>
            <p>AUTH_GOOGLE_SECRET=...</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/sign-up" className="hero-btn-primary">
              Create Account Page
            </Link>
            <Link href="/coins" className="hero-btn-secondary">
              Browse Coins
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const [holdings, orders] = await Promise.all([
    prisma.portfolioHolding.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.liquidityOrder.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
  ]);

  const trackedCoinIds = Array.from(new Set([...holdings.map((holding) => holding.coinId), ...defaultCoins]));
  const marketCoins =
    (await fetcher<CoinMarketData[]>(
      '/coins/markets',
      {
        vs_currency: 'usd',
        ids: trackedCoinIds.join(','),
        order: 'market_cap_desc',
        sparkline: false,
        price_change_percentage: '24h',
        per_page: trackedCoinIds.length,
        page: 1,
      },
      60
    )) ?? [];

  const marketMap = new Map(marketCoins.map((coin) => [coin.id, coin]));

  const enrichedHoldings = holdings.map((holding) => {
    const market = marketMap.get(holding.coinId);
    const currentPrice = market?.current_price ?? holding.averageCostUsd;
    const currentValue = holding.amount * currentPrice;
    const investedValue = holding.amount * holding.averageCostUsd;

    return {
      ...holding,
      image: market?.image ?? '',
      currentPrice,
      currentValue,
      investedValue,
      pnl: currentValue - investedValue,
      pnlPercent: investedValue > 0 ? ((currentValue - investedValue) / investedValue) * 100 : 0,
    };
  });

  const portfolioValue = enrichedHoldings.reduce((sum, holding) => sum + holding.currentValue, 0);
  const investedCapital = enrichedHoldings.reduce((sum, holding) => sum + holding.investedValue, 0);
  const openPnl = portfolioValue - investedCapital;

  return (
    <main className="main-container space-y-8 py-10">
      <section className="rounded-[32px] border border-white/8 bg-[radial-gradient(circle_at_top_left,rgba(118,218,68,0.16),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-8 shadow-[0_24px_100px_rgba(0,0,0,0.38)]">
        <div className="hero-badge mb-4 w-fit">
          <span className="hero-badge-dot" />
          Portfolio Hub
        </div>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-white md:text-5xl">
              Welcome back, {session.user.name?.split(' ')[0] || 'Trader'}.
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-purple-100/70">
               control surface for holdings, live coin liquidity, and saved bid or demand intent.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.24em] text-purple-100/55">Portfolio Value</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {portfolioValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.24em] text-purple-100/55">Invested</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {investedCapital.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.24em] text-purple-100/55">Open P/L</p>
              <p className={`mt-2 text-2xl font-semibold ${openPnl >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {openPnl.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <PortfolioHoldingForm
          coins={marketCoins.map((coin) => ({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            current_price: coin.current_price,
          }))}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[28px] border border-white/8 bg-dark-500/80 p-5">
            <div className="inline-flex rounded-2xl border border-green-500/20 bg-green-500/10 p-3 text-green-300">
              <Wallet size={18} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-white">Saved Holdings</h2>
            <p className="mt-2 text-sm text-purple-100/65">{holdings.length} tracked positions</p>
          </div>
          <div className="rounded-[28px] border border-white/8 bg-dark-500/80 p-5">
            <div className="inline-flex rounded-2xl border border-green-500/20 bg-green-500/10 p-3 text-green-300">
              <Layers3 size={18} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-white">Liquidity Orders</h2>
            <p className="mt-2 text-sm text-purple-100/65">{orders.length} recent bid or demand entries</p>
          </div>
          <div className="rounded-[28px] border border-white/8 bg-dark-500/80 p-5">
            <div className="inline-flex rounded-2xl border border-green-500/20 bg-green-500/10 p-3 text-green-300">
              <Database size={18} />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-white">Database</h2>
            <p className="mt-2 text-sm text-purple-100/65">Postgres with Prisma + NextAuth session storage</p>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/8 bg-dark-500/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.3)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white">Your Holdings</h2>
            <p className="mt-2 text-sm text-purple-100/65">Live marked values based on the latest market snapshot returned by CoinGecko.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-xs text-purple-100/70">
            <BarChart3 size={12} className="text-green-400" />
            Mark-to-market
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-purple-100/80">
            <thead>
              <tr className="border-b border-white/8 text-xs uppercase tracking-[0.24em] text-purple-100/45">
                <th className="pb-3 pr-4">Asset</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 pr-4">Avg Cost</th>
                <th className="pb-3 pr-4">Spot</th>
                <th className="pb-3 pr-4">Value</th>
                <th className="pb-3">P/L</th>
              </tr>
            </thead>
            <tbody>
              {enrichedHoldings.length ? (
                enrichedHoldings.map((holding) => (
                  <tr key={holding.id} className="border-b border-white/6">
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        {holding.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={holding.image} alt={holding.coinName} className="h-9 w-9 rounded-full border border-white/10" />
                        ) : (
                          <div className="h-9 w-9 rounded-full border border-white/10 bg-white/[0.04]" />
                        )}
                        <div>
                          <p className="font-semibold text-white">{holding.coinName}</p>
                          <p className="text-xs uppercase tracking-[0.22em] text-purple-100/55">{holding.coinSymbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">{holding.amount.toLocaleString('en-US', { maximumFractionDigits: 8 })}</td>
                    <td className="py-4 pr-4">
                      {holding.averageCostUsd.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </td>
                    <td className="py-4 pr-4">
                      {holding.currentPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </td>
                    <td className="py-4 pr-4">
                      {holding.currentValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </td>
                    <td className={`py-4 ${holding.pnl >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                      {holding.pnl.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}{' '}
                      <span className="text-xs">({holding.pnlPercent.toFixed(2)}%)</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-6 text-purple-100/55" colSpan={6}>
                    No holdings saved yet. Use the form above to add your first position.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <LiquidityPoolBoard
        initialCoins={marketCoins.map((coin) => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          image: coin.image,
          current_price: coin.current_price,
          market_cap: coin.market_cap,
          total_volume: coin.total_volume,
          price_change_percentage_24h: coin.price_change_percentage_24h,
        }))}
        orders={orders.map((order) => ({
          id: order.id,
          coinId: order.coinId,
          coinSymbol: order.coinSymbol,
          side: order.side,
          amountUsd: order.amountUsd,
          targetPriceUsd: order.targetPriceUsd,
          createdAt: order.createdAt.toISOString(),
        }))}
      />
    </main>
  );
};

export default PortfolioPage;
