'use server';

import qs from 'query-string';

type QueryParams = Record<string, string | number | boolean | undefined>;

const BASE_URL = process.env.COINGECKO_BASE_URL!;
const API_KEY = process.env.COINGECKO_API_KEY;

// Prevent duplicate in-flight requests
const pendingRequests = new Map<string, Promise<unknown>>();
// Add searchCoins function for SearchModal
export async function searchCoins(query: string): Promise<SearchCoin[]> {
  if (!query) return [];
  // Example endpoint, adjust as needed for your API
  const data = await fetcher<any>(`/search?query=${encodeURIComponent(query)}`);
  // Map/transform as needed to SearchCoin[]
  if (!data || !data.coins) return [];
  return data.coins.map((coin: any) => ({
    id: coin.id,
    name: coin.name,
    symbol: coin.symbol,
    market_cap_rank: coin.market_cap_rank ?? null,
    thumb: coin.thumb,
    large: coin.large,
    data: {
      price: coin.price,
      price_change_percentage_24h: coin.price_change_percentage_24h ?? 0,
    },
  }));
}

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 120,
  retry = 0
): Promise<T> {
  //  Normalize params (CoinGecko safe)
  const normalizedParams: Record<string, string | number> = {};

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === null || value === undefined) continue;
      normalizedParams[key] =
        typeof value === 'boolean' ? String(value) : value;
    }
  }

  //  Build URL
  const url = qs.stringifyUrl({
    url: `${BASE_URL}${endpoint}`,
    query: normalizedParams,
  });

  // Deduplicate identical requests
    if (pendingRequests.has(url)) {
      return pendingRequests.get(url)! as Promise<T>;
    }

  const request = (async () => {
    try {
      const headers: HeadersInit = {
        accept: 'application/json',
      };

      if (API_KEY && BASE_URL.includes('pro-api.coingecko.com')) {
        headers['x-cg-pro-api-key'] = API_KEY;
      }

      const response = await fetch(url, {
        headers,
        next: { revalidate }, //  ISR caching
      });

      //  Handle rate limit safely (NO crash)
      if (response.status === 429) {
        console.warn('CoinGecko rate limited (429)');
        return null as T;
      }

      //  Handle other API errors
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(
          `API Error ${response.status}: ${
            errorBody?.error || response.statusText
          }`
        );
      }

      return response.json() as Promise<T>;
    } catch (error) {
      // 6️ Optional retry (1 retry max)
      if (retry < 1) {
        await new Promise(res => setTimeout(res, 1000));
        return fetcher<T>(endpoint, params, revalidate, retry + 1);
      }

      console.error('Fetcher failed:', error);
      return null as T;
    } finally {
      pendingRequests.delete(url);
    }
  })();

  pendingRequests.set(url, request);
  return request;
}

export async function getPools(
  id: string,
  network?: string | null,
  contractAddress?: string | null
): Promise<PoolData> {
  const fallback: PoolData = {
    id: "",
    address: "",
    name: "",
    network: "",
  };

  if (network && contractAddress) {
    const poolData = await fetcher<{ data: PoolData[] }>(
      `/onchain/networks/${network}/tokens/${contractAddress}/pools`
    );

    return poolData?.data?.[0] ?? fallback;
  }

  try {
    const poolData = await fetcher<{ data: PoolData[] }>(
      "/onchain/search/pools",
      { query: id }
    );

    return poolData.data?.[0] ?? fallback;
  } catch {
    return fallback;
  }
}