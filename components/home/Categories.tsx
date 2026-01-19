import { fetcher } from '@/lib/coingecko.actions'
import React from 'react'
import DataTable from '../DataTable';
import Image from 'next/image';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';

const Categories = async () => {
  let categories;

  try {
    categories = await fetcher<Category[]>('/coins/categories');
  } catch (error) {
    console.error('Error fetching categories:', error);
    return (
      <div id="categories" className='custom-scrollbar'>
        <h4>Top Categories</h4>
        <p className="text-purple-100/70 text-sm mt-4">Unable to load categories data. Please try again later.</p>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div id="categories" className='custom-scrollbar'>
        <h4>Top Categories</h4>
        <p className="text-purple-100/70 text-sm mt-4">No categories available at this time.</p>
      </div>
    );
  }

  const columns: DataTableColumn<Category>[] = [
    {
      header: 'category', cellClassName: 'category-cell', cell: (category) =>
        category.name
    }, {
      header: 'Top Gainer',
      cellClassName: 'top-gainers-cell',
      cell: (category) =>
        category.top_3_coins.map((coin) => (
          <Image src={coin} alt={coin} key={coin} width={28} height={28} />
        )),
    }, {
      header: '24hr Change',
      cellClassName: 'change-header-cell',
      cell: (category) => {
        const isTrendingUp = category.market_cap_change_24h > 0;

        return (
          <div className={cn('change-cell000', isTrendingUp ? 'text-green-500' : 'text-red-500')}>
            <p className="flex items-center">
              {formatPercentage(category.market_cap_change_24h)}
              {isTrendingUp ? (
                <TrendingUp width={16} height={16} />
              ) : (
                <TrendingDown width={16} height={16} />
              )}
            </p>
          </div>
        );
      },
    },
    {
      header: 'Market Cap',
      cellClassName: 'market-cap-cell',
      cell: (category) => formatCurrency(category.market_cap)
    }, {
      header: '24hr Volume',
      cellClassName: 'volume-cell',
      cell: (category) => formatCurrency(category.volume_24h)
    },
  ]

  return (
    <div id="categories" className='custom-scrollbar'>
      <h4>Top Categories</h4>

      <DataTable columns={columns}
        data={categories?.slice(0, 10) ?? []}
        rowKey={(_, index) => index}
        tableClassName='mt-3' />

    </div>
  )
}

export default Categories
