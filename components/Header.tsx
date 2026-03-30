'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SearchModal } from './SearchModal';
import ThemeToggle from './ThemeToggle';
import { TrendingUp } from 'lucide-react';
import { useTradeDrawer } from './TradeDrawerProvider';
import { useEffect, useState } from 'react';

const Header = () => {
  const pathname = usePathname();
  const { openBuyDrawer } = useTradeDrawer();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      'sticky top-0 z-50 transition-all duration-300',
      isScrolled ? 'glass-dark elevation-3 backdrop-blur-xl' : 'bg-transparent'
    )}>
      <div className='main-container inner'>
        <Link href="/" className="scale-hover-sm transition-transform">
          <Image src="/logo.svg" alt="logo" width={132} height={32} loading="eager" />
        </Link>

        <nav>
          <Link 
            href="/" 
            className={cn('nav-link', {
              'is-active': pathname === '/',
              'is-home': true
            })}
          >
            Home
          </Link>
          <SearchModal initialTrendingCoins={[]} />
          <Link 
            href="/coins" 
            className={cn('nav-link', {
              'is-active': pathname === '/coins' || pathname?.startsWith('/coins/'),
            })}
          >
            All Coins
          </Link>
          <button
            className="buy-btn"
            onClick={openBuyDrawer}
            aria-label="Open Buy Panel"
          >
            <TrendingUp size={15} />
            Buy
          </button>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;

