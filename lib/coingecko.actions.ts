'use server';

import qs from 'query-string';

type QueryParams = Record<string, string | number | boolean | undefined | null>;

type CoinGeckoErrorBody = {
  error?: string;
};

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error('Could not get base url');

//  simple in-memory dedupe (per request cycle)
const pendingRequests = new Map<string, Promise<any>>();


export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 120
): Promise<T> {
  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}${endpoint}`,
      query: params,
    },
    { skipEmptyString: true, skipNull: true }
  );

  // ✅ DEDUPE: avoid multiple calls to same endpoint
  if (pendingRequests.has(url)) {
    return pendingRequests.get(url)!;
  }

  const headers: Record<string, string> = {
    accept: 'application/json',
  };

  if (API_KEY) {
    headers['x-cg-pro-api-key'] = API_KEY;
  }

  const request = (async () => {
    const response = await fetch(url, {
      headers,
      next: { revalidate },
    });

    // 🚨 HANDLE RATE LIMIT SAFELY
    if (response.status === 429) {
      console.warn('CoinGecko rate limited. Retrying...');
      await new Promise((res) => setTimeout(res, 2000));
      return fetcher<T>(endpoint, params, revalidate);
    }

    if (!response.ok) {
      const errorBody: CoinGeckoErrorBody =
        await response.json().catch(() => ({}));

      throw new Error(
        `API Error: ${response.status}: ${
          errorBody.error || response.statusText
        }`
      );
    }

    return response.json();
  })();

  pendingRequests.set(url, request);

  try {
    return await request;
  } finally {
    pendingRequests.delete(url);
  }
}
