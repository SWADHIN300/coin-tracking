import { NextResponse } from 'next/server';

const BASE_URL = process.env.COINGECKO_BASE_URL!;
const API_KEY = process.env.COINGECKO_API_KEY;

export async function GET(request: Request) {
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
      ...(API_KEY ? { 'x-cg-pro-api-key': API_KEY } : {}),
    },
    next: { revalidate: 120 }, // ✅ HARD CACHE
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
