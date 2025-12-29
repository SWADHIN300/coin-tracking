import CoinOverview from '@/components/home/CoinOverview';
import TrendingCoins from '@/components/home/TrendingCoins';
import React, { Suspense } from 'react';


const page = async () => {
  
  return (
    <main className='main-container'>
      <section className='home-grid'>
        <Suspense fallback={<div>Loading Overview...</div>}>
         <CoinOverview />
        </Suspense>
         <Suspense fallback={<div>Loading Trending...</div>}>
           <TrendingCoins />
         </Suspense>
      </section>

      <section className='w-full mt-7 space-y-4'>
         <p>Categories</p>
      </section>
    </main>
  )
}

export default page
