'use client';
"use client"

import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SearchModal } from './SearchModal'
import ThemeToggle from './ThemeToggle'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SearchModal } from './SearchModal';
import ThemeToggle from './ThemeToggle';
import { LogOut, TrendingUp, UserCircle2 } from 'lucide-react';
import { useTradeDrawer } from './TradeDrawerProvider';
import { signOut } from 'next-auth/react';

type HeaderProps = {
    sessionUser?: {
        id: string;
        name?: string | null;
        email?: string | null;
    } | null;
};

const Header = ({ sessionUser = null }: HeaderProps) => {
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

                    <Link
                        href="/portfolio"
                        className={cn('nav-link', {
                            'is-active': pathname === '/portfolio',
                        })}
                    >
                        Portfolio
                    </Link>

                    <button
                        type="button"
                        className="buy-btn"
                        onClick={openBuyDrawer}
                        aria-label="Open Buy Panel"
                    >
                        <TrendingUp size={15} />
                        Buy
                    </button>

                    {sessionUser ? (
                        <>
                            <div className="hidden lg:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-purple-100">
                                <UserCircle2 size={14} className="text-green-400" />
                                <span className="max-w-32 truncate">
                                    {sessionUser.name || sessionUser.email || 'Trader'}
                                </span>
                            </div>
                            <button
                                type="button"
                                className="hero-btn-secondary !px-4 !py-2 !text-sm"
                                onClick={() => signOut({ callbackUrl: '/' })}
                            >
                                <LogOut size={14} />
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/sign-in"
                                className={cn('nav-link max-md:hidden', {
                                    'is-active': pathname === '/sign-in',
                                })}
                            >
                                Sign In
                            </Link>
                            <Link href="/sign-up" className="hero-btn-secondary !px-4 !py-2 !text-sm">
                                Sign Up
                            </Link>
                        </>
                    )}

                    <ThemeToggle />
                </nav>
            </div>
        </header>
    );
};

export default Header;
  const pathname = usePathname();
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

        <nav >
          <Link href='/' className={cn('nav-link', {
            'is-active': pathname === '/',
            'is-home': true
          })}>Home</Link>
          <SearchModal initialTrendingCoins={[]} />
          <Link href="/coins" className={cn('nav-link', {
            'is-active': pathname === '/coins'
          })}>All Coins</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}

export default Header
