'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpDown,
  Wallet,
  ShieldCheck,
  Zap,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  ChevronDown,
  Clock,
  Info,
} from 'lucide-react';

type OrderType = 'market' | 'limit' | 'stop';
type OrderSide = 'buy' | 'sell';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  icon: string;
}

const COINS: Coin[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', icon: '◎' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', icon: '♦' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', icon: '✕' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', icon: '₳' },
];

const FALLBACK_PRICES: Record<string, number> = {
  bitcoin: 85000,
  ethereum: 4200,
  solana: 185,
  binancecoin: 640,
  ripple: 0.72,
  cardano: 0.81,
};

const SIMULATED_BALANCE = 10000;

interface OrderConfirmation {
  side: OrderSide;
  coin: Coin;
  amount: string;
  usdValue: string;
  type: OrderType;
  limitPrice?: string;
}

const QuickTradePanel = () => {
  const [side, setSide] = useState<OrderSide>('buy');
  const [orderType, setOrderType] = useState<OrderType>('market');
  const [selectedCoin, setSelectedCoin] = useState<Coin>(COINS[0]);
  const [amount, setAmount] = useState('');
  const [usdValue, setUsdValue] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [showCoinSelect, setShowCoinSelect] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<OrderConfirmation | null>(null);
  const [livePrices, setLivePrices] = useState<Record<string, number>>(FALLBACK_PRICES);
  const [validationMessage, setValidationMessage] = useState('');
  const coinSelectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const ids = COINS.map((coin) => coin.id).join(',');
        const endpoint = encodeURIComponent(
          `/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
        );
        const res = await fetch(`/api/coingecko?endpoint=${endpoint}`);

        if (!res.ok) return;

        const data = await res.json();
        const prices = { ...FALLBACK_PRICES };

        COINS.forEach((coin) => {
          if (typeof data?.[coin.id]?.usd === 'number' && data[coin.id].usd > 0) {
            prices[coin.id] = data[coin.id].usd;
          }
        });

        setLivePrices(prices);
      } catch {
        setLivePrices((current) =>
          Object.keys(current).length > 0 ? current : FALLBACK_PRICES
        );
      }
    };

    fetchPrices();
    const interval = window.setInterval(fetchPrices, 30000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (coinSelectRef.current && !coinSelectRef.current.contains(e.target as Node)) {
        setShowCoinSelect(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentPrice = livePrices[selectedCoin.id] ?? FALLBACK_PRICES[selectedCoin.id] ?? 0;

  const syncFromAmount = (rawAmount: string) => {
    setValidationMessage('');
    setAmount(rawAmount);

    if (!rawAmount || !currentPrice) {
      setUsdValue('');
      return;
    }

    const parsedAmount = Number(rawAmount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setUsdValue('');
      return;
    }

    setUsdValue((parsedAmount * currentPrice).toFixed(2));
  };

  const syncFromUsd = (rawUsd: string) => {
    setValidationMessage('');
    setUsdValue(rawUsd);

    if (!rawUsd || !currentPrice) {
      setAmount('');
      return;
    }

    const parsedUsd = Number(rawUsd);
    if (Number.isNaN(parsedUsd) || parsedUsd <= 0) {
      setAmount('');
      return;
    }

    setAmount((parsedUsd / currentPrice).toFixed(8));
  };

  const quickFills = [25, 50, 75, 100];

  const orderSummary = useMemo(() => {
    const resolvedAmount = amount || (usdValue && currentPrice ? (Number(usdValue) / currentPrice).toFixed(8) : '');
    const resolvedUsd = usdValue || (amount && currentPrice ? (Number(amount) * currentPrice).toFixed(2) : '');

    return {
      amount: resolvedAmount,
      usdValue: resolvedUsd,
    };
  }, [amount, usdValue, currentPrice]);

  const handleSubmit = () => {
    const parsedAmount = Number(orderSummary.amount);
    const parsedUsd = Number(orderSummary.usdValue);

    if (!currentPrice) {
      setValidationMessage('Live price is unavailable right now. Please try again in a moment.');
      return;
    }

    if (!orderSummary.amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setValidationMessage('Enter a valid amount to continue.');
      return;
    }

    if (!orderSummary.usdValue || Number.isNaN(parsedUsd) || parsedUsd <= 0) {
      setValidationMessage('Enter a valid order total to continue.');
      return;
    }

    if (side === 'buy' && parsedUsd > SIMULATED_BALANCE) {
      setValidationMessage('This simulated account balance is $10,000. Reduce the order size.');
      return;
    }

    if (orderType !== 'market') {
      const parsedLimit = Number(limitPrice);
      if (!limitPrice || Number.isNaN(parsedLimit) || parsedLimit <= 0) {
        setValidationMessage(`Enter a valid ${orderType} price to continue.`);
        return;
      }
    }

    setValidationMessage('');
    setShowConfirm(true);
  };

  const confirmOrder = () => {
    setOrderPlaced({
      side,
      coin: selectedCoin,
      amount: orderSummary.amount,
      usdValue: orderSummary.usdValue,
      type: orderType,
      limitPrice: orderType === 'market' ? undefined : limitPrice,
    });

    setShowConfirm(false);
    setAmount('');
    setUsdValue('');
    setLimitPrice('');

    window.setTimeout(() => setOrderPlaced(null), 4000);
  };

  const formatNum = (value: number) =>
    value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: value >= 1 ? 2 : 6,
    });

  return (
    <div className="qt-panel">
      <div className="qt-header">
        <h3 className="qt-title">
          <Zap size={18} className="qt-title-icon" />
          Quick Trade
        </h3>
        <span className="qt-badge">
          <ShieldCheck size={12} /> Simulated
        </span>
      </div>

      <div className="qt-side-toggle">
        <button
          type="button"
          className={`qt-side-btn qt-side-btn--buy ${side === 'buy' ? 'qt-side-btn--active' : ''}`}
          onClick={() => {
            setValidationMessage('');
            setSide('buy');
          }}
        >
          <TrendingUp size={14} /> Buy
        </button>
        <button
          type="button"
          className={`qt-side-btn qt-side-btn--sell ${side === 'sell' ? 'qt-side-btn--active' : ''}`}
          onClick={() => {
            setValidationMessage('');
            setSide('sell');
          }}
        >
          <TrendingDown size={14} /> Sell
        </button>
      </div>

      <div className="qt-coin-selector" ref={coinSelectRef}>
        <button
          type="button"
          className="qt-coin-btn"
          onClick={() => setShowCoinSelect((value) => !value)}
        >
          <span className="qt-coin-icon">{selectedCoin.icon}</span>
          <span className="qt-coin-info">
            <span className="qt-coin-symbol">{selectedCoin.symbol}</span>
            <span className="qt-coin-name">{selectedCoin.name}</span>
          </span>
          <ChevronDown size={16} className={`qt-chevron ${showCoinSelect ? 'qt-chevron--open' : ''}`} />
        </button>

        {showCoinSelect && (
          <div className="qt-coin-dropdown">
            {COINS.map((coin) => (
              <button
                type="button"
                key={coin.id}
                className={`qt-coin-option ${selectedCoin.id === coin.id ? 'qt-coin-option--active' : ''}`}
                onClick={() => {
                  setValidationMessage('');
                  setSelectedCoin(coin);
                  setShowCoinSelect(false);
                  setAmount('');
                  setUsdValue('');
                  setLimitPrice('');
                }}
              >
                <span className="qt-coin-icon">{coin.icon}</span>
                <span className="qt-coin-symbol">{coin.symbol}</span>
                <span className="qt-coin-name">{coin.name}</span>
                <span className="qt-coin-price">{formatNum(livePrices[coin.id] ?? FALLBACK_PRICES[coin.id])}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="qt-live-price">
        <span className="qt-live-label">Live Price</span>
        <span className="qt-live-value">{formatNum(currentPrice)}</span>
      </div>

      <div className="qt-order-tabs">
        {(['market', 'limit', 'stop'] as OrderType[]).map((type) => (
          <button
            type="button"
            key={type}
            className={`qt-tab ${orderType === type ? 'qt-tab--active' : ''}`}
            onClick={() => {
              setValidationMessage('');
              setOrderType(type);
            }}
          >
            {type === 'market' && <Zap size={12} />}
            {type === 'limit' && <Clock size={12} />}
            {type === 'stop' && <ShieldCheck size={12} />}
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {orderType !== 'market' && (
        <div className="qt-input-group">
          <label className="qt-label">
            {orderType === 'limit' ? 'Limit Price' : 'Stop Price'} (USD)
            <span className="qt-info-tip" title="The price at which your order will execute">
              <Info size={12} />
            </span>
          </label>
          <div className="qt-input-wrapper">
            <span className="qt-input-prefix">$</span>
            <input
              type="number"
              className="qt-input"
              placeholder={currentPrice ? currentPrice.toFixed(2) : '0.00'}
              value={limitPrice}
              onChange={(e) => {
                setValidationMessage('');
                setLimitPrice(e.target.value);
              }}
            />
          </div>
        </div>
      )}

      <div className="qt-input-group">
        <label className="qt-label">Amount ({selectedCoin.symbol})</label>
        <div className="qt-input-wrapper">
          <span className="qt-input-prefix">{selectedCoin.icon}</span>
          <input
            type="number"
            className="qt-input"
            placeholder="0.00000000"
            value={amount}
            onChange={(e) => syncFromAmount(e.target.value)}
          />
        </div>
      </div>

      <div className="qt-swap-row">
        <button
          type="button"
          className="qt-swap-btn"
          onClick={() => {
            if (amount) {
              syncFromUsd(orderSummary.usdValue);
            } else if (usdValue) {
              syncFromAmount(orderSummary.amount);
            }
          }}
          title="Recalculate order values"
        >
          <ArrowUpDown size={14} />
        </button>
      </div>

      <div className="qt-input-group">
        <label className="qt-label">Total (USD)</label>
        <div className="qt-input-wrapper">
          <span className="qt-input-prefix">$</span>
          <input
            type="number"
            className="qt-input"
            placeholder="0.00"
            value={usdValue}
            onChange={(e) => syncFromUsd(e.target.value)}
          />
        </div>
      </div>

      <div className="qt-quickfill">
        {quickFills.map((pct) => (
          <button
            type="button"
            key={pct}
            className="qt-quickfill-btn"
            onClick={() => syncFromUsd(((SIMULATED_BALANCE * pct) / 100).toFixed(2))}
          >
            {pct}%
          </button>
        ))}
      </div>

      <div className="qt-balance">
        <Wallet size={13} />
        <span>Balance: {formatNum(SIMULATED_BALANCE)}</span>
      </div>

      {validationMessage && (
        <p className="text-sm text-red-400 mb-3">{validationMessage}</p>
      )}

      <button
        type="button"
        className={`qt-submit qt-submit--${side}`}
        onClick={handleSubmit}
      >
        {side === 'buy' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        {side === 'buy' ? 'Buy' : 'Sell'} {selectedCoin.symbol}
      </button>

      {showConfirm && (
        <div className="qt-overlay">
          <div className="qt-confirm-card">
            <h4>Confirm {side === 'buy' ? 'Buy' : 'Sell'} Order</h4>
            <div className="qt-confirm-details">
              <div className="qt-confirm-row">
                <span>Asset</span>
                <span>
                  {selectedCoin.icon} {selectedCoin.name}
                </span>
              </div>
              <div className="qt-confirm-row">
                <span>Type</span>
                <span>{orderType.charAt(0).toUpperCase() + orderType.slice(1)}</span>
              </div>
              <div className="qt-confirm-row">
                <span>Amount</span>
                <span>
                  {Number(orderSummary.amount).toFixed(6)} {selectedCoin.symbol}
                </span>
              </div>
              <div className="qt-confirm-row qt-confirm-row--total">
                <span>Total</span>
                <span>${Number(orderSummary.usdValue).toFixed(2)}</span>
              </div>
              {orderType !== 'market' && limitPrice && (
                <div className="qt-confirm-row">
                  <span>{orderType === 'limit' ? 'Limit' : 'Stop'} Price</span>
                  <span>${Number(limitPrice).toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="qt-confirm-actions">
              <button type="button" className="qt-confirm-cancel" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button
                type="button"
                className={`qt-confirm-ok qt-confirm-ok--${side}`}
                onClick={confirmOrder}
              >
                Confirm {side === 'buy' ? 'Buy' : 'Sell'}
              </button>
            </div>
          </div>
        </div>
      )}

      {orderPlaced && (
        <div className={`qt-toast qt-toast--${orderPlaced.side}`}>
          <CheckCircle2 size={18} />
          <div>
            <p className="qt-toast-title">Order Placed!</p>
            <p className="qt-toast-detail">
              {orderPlaced.side === 'buy' ? 'Bought' : 'Sold'} {Number(orderPlaced.amount).toFixed(6)}{' '}
              {orderPlaced.coin.symbol} for ${Number(orderPlaced.usdValue).toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickTradePanel;
