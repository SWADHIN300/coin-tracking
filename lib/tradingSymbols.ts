const TV_OVERRIDES: Record<string, string> = {
  bitcoin: 'BINANCE:BTCUSDT',
  ethereum: 'BINANCE:ETHUSDT',
  solana: 'BINANCE:SOLUSDT',
  binancecoin: 'BINANCE:BNBUSDT',
  ripple: 'BINANCE:XRPUSDT',
  cardano: 'BINANCE:ADAUSDT',
  dogecoin: 'BINANCE:DOGEUSDT',
  'shiba-inu': 'BINANCE:SHIBUSDT',
  polkadot: 'BINANCE:DOTUSDT',
  avalanche: 'BINANCE:AVAXUSDT',
  chainlink: 'BINANCE:LINKUSDT',
  litecoin: 'BINANCE:LTCUSDT',
  uniswap: 'BINANCE:UNIUSDT',
  stellar: 'BINANCE:XLMUSDT',
  'polygon-ecosystem-token': 'BINANCE:POLUSDT',
  toncoin: 'BINANCE:TONUSDT',
  'the-open-network': 'BINANCE:TONUSDT',
};

export const toTradingViewSymbol = (coinId: string) =>
  TV_OVERRIDES[coinId] ?? `BINANCE:${coinId.toUpperCase().replace(/-/g, '')}USDT`;

export const toTickerSymbol = (tradingViewSymbol: string) => {
  const parts = tradingViewSymbol.split(':');
  return parts[1] ?? tradingViewSymbol;
};
