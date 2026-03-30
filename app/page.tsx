import Categories from '@/components/home/Categories';
import CoinOverview from '@/components/home/CoinOverview';
import { CategoriesFallback, CoinOverviewFallback, TrendingCoinsFallback } from '@/components/home/fallback';
import TrendingCoins from '@/components/home/TrendingCoins';
import HeroSection from '@/components/home/HeroSection';
import NewsSection from '@/components/home/NewsSection';
import { Suspense } from 'react';


const page = async () => {

  return (
    <main>
      {/* Hero Section */}
      <HeroSection />

      {/* Main content */}
      <div className='main-container'>
        {/* News Section */}
        <NewsSection />

        {/* Coin Overview + Trending Grid */}
        <section className='home-grid'>
          <Suspense fallback={<CoinOverviewFallback />}>
            <CoinOverview />
          </Suspense>
          <Suspense fallback={<TrendingCoinsFallback />}>
            <TrendingCoins />
          </Suspense>
        </section>

        <section className='w-full mt-7 space-y-4'>
          <Suspense fallback={<CategoriesFallback />}>
            <Categories />
          </Suspense>
        </section>
      </div>
    </main>
  )
}

export default page
