'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import QuickTradePanel from '@/components/QuickTradePanel';

type TradeDrawerContextValue = {
  openBuyDrawer: () => void;
  closeBuyDrawer: () => void;
};

const TradeDrawerContext = createContext<TradeDrawerContextValue | null>(null);

export const useTradeDrawer = () => {
  const context = useContext(TradeDrawerContext);

  if (!context) {
    throw new Error('useTradeDrawer must be used within TradeDrawerProvider');
  }

  return context;
};

const TradeDrawerProvider = ({ children }: { children: React.ReactNode }) => {
  const [buyOpen, setBuyOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const openBuyDrawer = useCallback(() => setBuyOpen(true), []);
  const closeBuyDrawer = useCallback(() => setBuyOpen(false), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setBuyOpen(false);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = buyOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [buyOpen]);

  const value = useMemo(
    () => ({
      openBuyDrawer,
      closeBuyDrawer,
    }),
    [openBuyDrawer, closeBuyDrawer]
  );

  return (
    <TradeDrawerContext.Provider value={value}>
      {children}

      {buyOpen && (
        <div
          className="buy-drawer-overlay"
          onClick={(e) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
              closeBuyDrawer();
            }
          }}
          aria-modal="true"
          role="dialog"
          aria-label="Quick Trade"
        >
          <div ref={drawerRef} className="buy-drawer">
            <div className="buy-drawer-header">
              <span className="buy-drawer-title">Quick Trade</span>
              <button
                className="buy-drawer-close"
                onClick={closeBuyDrawer}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="buy-drawer-body">
              <QuickTradePanel />
            </div>
          </div>
        </div>
      )}
    </TradeDrawerContext.Provider>
  );
};

export default TradeDrawerProvider;
