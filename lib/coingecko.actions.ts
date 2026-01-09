'use server';

import qs from 'query-string';

type QueryParams = Record<string, string | number | boolean | undefined | null>;

type CoinGeckoErrorBody = {
  error?: string;
};

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;

if (!BASE_URL) throw new Error('Could not get base url');

// In-memory dedupe (per request cycle)  
const pendingRequests = new Map<string, Promise<unknown>>();

export async function fetcher<T>(
  endpoint: string,
  params?: QueryParams,
  revalidate = 120,
  retry = 0
): Promise<T> {
  // ✅ Normalize params for CoinGecko
  const normalizedParams: Record<string, string | number> = {};

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === null || value === undefined) continue;
      normalizedParams[key] =
        typeof value === 'boolean' ? String(value) : value;
    }
  }

  const url = qs.stringifyUrl(
    {
      url: `${BASE_URL}${endpoint}`,
      query: normalizedParams,
    },
    { skipEmptyString: true }
  );

if (pendingRequests.has(url)) {
  return pendingRequests.get(url)! as Promise<T>;
}

  const headers: Record<string, string> = {
    accept: 'application/json',
  };

  // ✅ Attach key ONLY for Pro API
  if (API_KEY && BASE_URL!.includes('pro-api.coingecko.com')) {
    headers['x-cg-pro-api-key'] = API_KEY;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  const request = (async () => {
    try {
      const response = await fetch(url, {
        headers,
        next: { revalidate },
        signal: controller.signal,
      });

      if (response.status === 429 && retry < 2) {
        pendingRequests.delete(url);
        await new Promise((res) => setTimeout(res, 1500));
        return fetcher<T>(endpoint, params, revalidate, retry + 1);
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
    } finally {
      clearTimeout(timeout);
    }
  })();

  pendingRequests.set(url, request);

  try {
    return await request;
  } finally {
    pendingRequests.delete(url);
  }
}
