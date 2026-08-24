'use client';

import { useActionState, useMemo, useState } from 'react';
import { PlusCircle, Wallet2 } from 'lucide-react';
import { upsertPortfolioHoldingAction, type PortfolioActionState } from '@/app/portfolio/actions';

type PortfolioCoinOption = {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
};

const initialState: PortfolioActionState = {};

const PortfolioHoldingForm = ({ coins }: { coins: PortfolioCoinOption[] }) => {
  const [state, formAction, pending] = useActionState(upsertPortfolioHoldingAction, initialState);
  const [selectedCoinId, setSelectedCoinId] = useState(coins[0]?.id ?? '');

  const selectedCoin = useMemo(
    () => coins.find((coin) => coin.id === selectedCoinId) ?? coins[0],
    [coins, selectedCoinId]
  );

  return (
    <div className="qt-panel h-full">
      <div className="qt-header">
        <h3 className="qt-title">
          <PlusCircle size={18} className="qt-title-icon" />
          Add Portfolio Holding
        </h3>
        <span className="qt-badge">
          <Wallet2 size={12} />
          Saved to Postgres
        </span>
      </div>

      <p className="mb-6 text-sm leading-6 text-purple-100/70">
        Save a position with the amount you hold and your average entry price. Re-submit the same coin any time to update it.
      </p>

      {!coins.length ? (
        <div className="rounded-2xl border border-dashed border-white/12 bg-white/[0.02] p-5 text-sm leading-6 text-purple-100/60">
          Market options are temporarily unavailable right now. Refresh once CoinGecko data is back and you’ll be able to save holdings here.
        </div>
      ) : (
        <form action={formAction} className="space-y-4">
          <div className="qt-input-group">
            <label className="qt-label">Coin</label>
            <div className="qt-input-wrapper">
              <select
                name="coinId"
                className="qt-input"
                value={selectedCoinId}
                onChange={(event) => setSelectedCoinId(event.target.value)}
                required
              >
                {coins.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol.toUpperCase()}) · ${coin.current_price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="qt-input-group">
              <label className="qt-label">Amount Held</label>
              <div className="qt-input-wrapper">
                <input className="qt-input" type="number" step="0.00000001" min="0" name="amount" placeholder="0.2500" required />
              </div>
            </div>

            <div className="qt-input-group">
              <label className="qt-label">Average Cost (USD)</label>
              <div className="qt-input-wrapper">
                <input className="qt-input" type="number" step="0.01" min="0" name="averageCostUsd" placeholder="67250.00" required />
              </div>
            </div>
          </div>

          <input type="hidden" name="coinName" value={selectedCoin?.name ?? ''} />
          <input type="hidden" name="coinSymbol" value={selectedCoin?.symbol ?? ''} />

          {state.error && <p className="text-sm text-red-400">{state.error}</p>}
          {state.success && <p className="text-sm text-green-400">{state.success}</p>}

          <button
            type="submit"
            disabled={pending}
            className="hero-btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? 'Saving Holding...' : 'Save Holding'}
          </button>
        </form>
      )}
    </div>
  );
};

export default PortfolioHoldingForm;
