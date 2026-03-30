import React, { Suspense } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { fetcher } from '@/lib/coingecko.actions';
import LiveDataWrapper from '@/components/LiveDataWrapper';
import LiveDataSkeleton from '@/components/LiveDataSkeleton';
import TradingViewChart from '@/components/TradingViewChart';
import Converter from '@/components/Converter';
import { toTradingViewSymbol } from '@/lib/tradingSymbols';

type NextPageProps = {
  params: Promise<{ id: string }>;
};

async function CoinLiveSection({ coinId }: { coinId: string }) {
  const coinData = await fetcher<CoinDetailsData>(`/coins/${coinId}`, {
    dex_pair_format: 'contract_address',
  });

  if (!coinData) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Coin Not Found</h2>
        <p className="text-gray-400 mb-6">
          Unable to load data for this coin.
        </p>
        <Link href="/coins" className="text-purple-400 hover:text-purple-300">
          ← Back to All Coins
        </Link>
      </div>
    );
  }

  return (
    <LiveDataWrapper
      key={coinId}
      coinId={coinId}
      tvSymbol={toTradingViewSymbol(coinId)}
      coin={coinData}
      section="header"
    />
  );
}

async function CoinTradesSection({ coinId }: { coinId: string }) {
  const coinData = await fetcher<CoinDetailsData>(`/coins/${coinId}`, {
    dex_pair_format: 'contract_address',
  });

  if (!coinData) return null;

  return (
    <LiveDataWrapper
      key={`${coinId}-trades`}
      coinId={coinId}
      tvSymbol={toTradingViewSymbol(coinId)}
      coin={coinData}
      section="trades"
    />
  );
}

// ─── Async component: coin details sidebar ───────────────────────────────────
async function CoinDetailsSidebar({ coinId }: { coinId: string }) {
  const coinData = await fetcher<CoinDetailsData>(`/coins/${coinId}`, {
    dex_pair_format: 'contract_address',
  });

  if (!coinData) return null;

  const coinDetails = [
    { label: 'Market Cap', value: formatCurrency(coinData.market_data.market_cap.usd) },
    { label: 'Market Cap Rank', value: `# ${coinData.market_cap_rank}` },
    { label: 'Total Volume', value: formatCurrency(coinData.market_data.total_volume.usd) },
    { label: 'Website', value: '-', link: coinData.links.homepage[0], linkText: 'Homepage' },
    { label: 'Explorer', value: '-', link: coinData.links.blockchain_site[0], linkText: 'Explorer' },
    { label: 'Community', value: '-', link: coinData.links.subreddit_url, linkText: 'Community' },
  ];

  return (
    <>
      <Converter
        symbol={coinData.symbol}
        icon={coinData.image.small}
        priceList={coinData.market_data.current_price}
      />

      <div className="details">
        <h4>Coin Details</h4>
        <ul className="details-grid">
          {coinDetails.map(({ label, value, link, linkText }, index) => (
            <li key={index}>
              <p className={label}>{label}</p>
              {link ? (
                <div className="link">
                  <Link href={link} target="_blank">{linkText || label}</Link>
                  <ArrowUpRight size={16} />
                </div>
              ) : (
                <p className="text-base font-medium">{value}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

// ─── Skeleton for the sidebar ────────────────────────────────────────────────
function SidebarSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-6 bg-gray-700/50 rounded w-32 mb-4" />
        <div className="h-32 bg-gray-700/30 rounded-lg" />
      </div>
      <div>
        <div className="h-6 bg-gray-700/50 rounded w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-5 bg-gray-700/50 rounded w-32" />
              <div className="h-5 bg-gray-700/50 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
const Page = async ({ params }: NextPageProps) => {
  const { id } = await params;

  const tvSymbol = toTradingViewSymbol(id);

  return (
    <main id="coin-details-page">
      <section className="primary">
        {/* TradingView chart renders IMMEDIATELY — no API needed */}
        <div className="trend" style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>
            Trend Overview
          </h4>
          <TradingViewChart symbol={tvSymbol} theme="dark" height={520} />
        </div>

        {/* Coin header + live data streams in via Suspense */}
        <Suspense fallback={<LiveDataSkeleton />}>
          <CoinLiveSection coinId={id} />
        </Suspense>
      </section>

      {/* Sidebar streams in independently */}
      <section className="secondary">
        <Suspense fallback={<SidebarSkeleton />}>
          <CoinDetailsSidebar coinId={id} />
        </Suspense>
      </section>

      <section className="full-width">
        <Suspense fallback={<LiveDataSkeleton />}>
          <CoinTradesSection coinId={id} />
        </Suspense>
      </section>
    </main>
  );
};

export default Page;
