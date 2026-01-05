export async function fetcher<T>(endpoint: string): Promise<T> {
  const res = await fetch(
    `/api/coingecko?endpoint=${endpoint}`,
    { cache: 'force-cache' }
  );

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  return res.json();
}
