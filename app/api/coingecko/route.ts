import { NextResponse } from 'next/server';

const BASE_URL = process.env.COINGECKO_BASE_URL;
const API_KEY = process.env.COINGECKO_API_KEY;
const API_KEY_HEADER = BASE_URL?.includes('pro-api.coingecko.com')
  ? 'x-cg-pro-api-key'
  : 'x-cg-demo-api-key';

export async function GET(request: Request) {
    if (!BASE_URL) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');

  if (!endpoint) {
    return NextResponse.json(
      { error: 'Missing endpoint' },
      { status: 400 }
    );
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      accept: 'application/json',
      ...(API_KEY ? { [API_KEY_HEADER]: API_KEY } : {}),
    },
    next: { revalidate: 120 }, //  HARD CACHE
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: res.statusText },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
