import Categories from '@/components/home/Categories';
import CoinOverview from '@/components/home/CoinOverview';
import { CategoriesFallback, CoinOverviewFallback, TrendingCoinsFallback } from '@/components/home/fallback';
import TrendingCoins from '@/components/home/TrendingCoins';
import MarketOverviewBanner from '@/components/MarketOverviewBanner';
import FloatingActionButton from '@/components/FloatingActionButton';
import ComparisonTool from '@/components/ComparisonTool';
import NewsFeed from '@/components/NewsFeed';
import HeroSection from '@/components/HeroSection';
import { Suspense } from 'react';


const page = async () => {

  return (
    <main className='main-container'>
      <Suspense fallback={<div className="h-20 shimmer bg-gray-700/20 rounded-xl"></div>}>
        <MarketOverviewBanner />
      </Suspense>

      <HeroSection />

      <section className='home-grid'>
        <Suspense fallback={<CoinOverviewFallback />}>
          <CoinOverview />
        </Suspense>
        <Suspense fallback={<TrendingCoinsFallback />}>
          <TrendingCoins />
        </Suspense>
      </section>

      <section className="w-full mb-6">
        <ComparisonTool />
      </section>

      <NewsFeed />

      <section className='w-full mt-7 space-y-4'>
        <Suspense fallback={<CategoriesFallback />}>
          <Categories />
        </Suspense>
      </section>

      <FloatingActionButton />
    </main>
  )
}

export default page

