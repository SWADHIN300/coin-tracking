'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SearchModal } from './SearchModal';
import ThemeToggle from './ThemeToggle';
import { TrendingUp } from 'lucide-react';
import { useTradeDrawer } from './TradeDrawerProvider';

const Header = () => {
    const pathname = usePathname();
    const { openBuyDrawer } = useTradeDrawer();

    return (
        <header>
            <div className="main-container inner">
                <Link href="/">
                    <Image src="/logo.svg" alt="logo" width={132} height={32} loading="eager" />
                </Link>

                <nav>
                    <Link
                        href="/"
                        className={cn('nav-link', {
                            'is-active': pathname === '/',
                            'is-home': true,
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
