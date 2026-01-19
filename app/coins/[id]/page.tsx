import React, { Suspense } from 'react';
import { fetcher, getPools } from '@/lib/coingecko.actions';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import LiveDataWrapper from '@/components/LiveDataWrapper';
import LiveDataSkeleton from '@/components/LiveDataSkeleton';
import Converter from '@/components/Converter';

type NextPageProps = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: NextPageProps) => {
  const { id } = await params;

  // Fetch all data in parallel for better performance
  const [coinData, coinOHLCData] = await Promise.all([
    fetcher<CoinDetailsData>(`/coins/${id}`, {
      dex_pair_format: 'contract_address',
    }),
    fetcher<OHLCData>(`/coins/${id}/ohlc`, {
      vs_currency: 'usd',
      days: 1,
      interval: 'hourly',
      precision: 'full',
    }),
  ]);

  // Handle case where coin data fails to load
  if (!coinData) {
    return (
      <main id="coin-details-page">
        <section className="primary">
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Coin Not Found</h2>
            <p className="text-gray-400 mb-6">
              Unable to load data for this coin. It may not exist or there was an error fetching the data.
            </p>
            <Link href="/coins" className="text-purple-400 hover:text-purple-300">
              ← Back to All Coins
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // Extract platform info for pool fetching
  const platform = coinData.asset_platform_id
    ? coinData.detail_platforms?.[coinData.asset_platform_id]
    : null;
  const network = platform?.geckoterminal_url.split('/')[3] || null;
  const contractAddress = platform?.contract_address || null;

  // Fetch pool with fallback - don't block rendering if it fails
  const pool = await getPools(id, network, contractAddress).catch(() => ({
    id: '',
    address: '',
    name: '',
    network: '',
  }));

  const coinDetails = [
    {
      label: 'Market Cap',
      value: formatCurrency(coinData.market_data.market_cap.usd),
    },
    {
      label: 'Market Cap Rank',
      value: `# ${coinData.market_cap_rank}`,
    },
    {
      label: 'Total Volume',
      value: formatCurrency(coinData.market_data.total_volume.usd),
    },
    {
      label: 'Website',
      value: '-',
      link: coinData.links.homepage[0],
      linkText: 'Homepage',
    },
    {
      label: 'Explorer',
      value: '-',
      link: coinData.links.blockchain_site[0],
      linkText: 'Explorer',
    },
    {
      label: 'Community',
      value: '-',
      link: coinData.links.subreddit_url,
      linkText: 'Community',
    },
  ];

  return (
    <main id="coin-details-page">
      <section className="primary">
        <Suspense fallback={<LiveDataSkeleton />}>
          <LiveDataWrapper coinId={id} poolId={pool.id} coin={coinData} coinOHLCData={coinOHLCData ? [coinOHLCData] : undefined}>
            <h4>Exchange Listings</h4>
          </LiveDataWrapper>
        </Suspense>
      </section>

      <section className="secondary">
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
                    <Link href={link} target="_blank">
                      {linkText || label}
                    </Link>
                    <ArrowUpRight size={16} />
                  </div>
                ) : (
                  <p className="text-base font-medium">{value}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};
export default Page;