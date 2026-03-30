'use client';

import { useEffect, useRef, useState } from 'react';

const WS_BASE = `${process.env.NEXT_PUBLIC_COINGECKO_WEBSOCKET_URL}?x_cg_pro_api_key=${process.env.NEXT_PUBLIC_COINGECKO_API_KEY}`;

const toNumber = (value: number | string | undefined) => {
  const parsed = typeof value === 'string' ? Number(value) : value;
  return Number.isFinite(parsed) ? Number(parsed) : 0;
};

const toPoolAddress = (poolId: string) => {
  if (!poolId) return null;

  const separatorIndex = poolId.indexOf('_');
  if (separatorIndex === -1) return poolId;

  return `${poolId.slice(0, separatorIndex)}:${poolId.slice(separatorIndex + 1)}`;
};

export const useCoinGeckoWebSocket = ({
  coinId,
  poolId,
  liveInterval,
}: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn => {
  const wsRef = useRef<WebSocket | null>(null);
  const subscribed = useRef(<Set<string>>new Set());

  const [price, setPrice] = useState<ExtendedPriceData | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);

  const [isWsReady, setIsWsReady] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(WS_BASE);
    wsRef.current = ws;

    const send = (payload: Record<string, unknown>) => ws.send(JSON.stringify(payload));

    const handleMessage = (event: MessageEvent) => {
      const msg: WebSocketMessage = JSON.parse(event.data);
      const channelCode = msg.ch ?? msg.c;

      if (msg.type === 'ping') {
        send({ type: 'pong' });
        return;
      }
      if (msg.type === 'confirm_subscription') {
        const identifier = msg.identifier ? JSON.parse(msg.identifier) : null;
        const channel = identifier?.channel;

        if (channel) {
          subscribed.current.add(channel);
        }
      }
      if (channelCode === 'C1') {
        setPrice({
          usd: toNumber(msg.p),
          coin: msg.i,
          price: toNumber(msg.p),
          change24h: toNumber(msg.pp),
          marketCap: toNumber(msg.m),
          volume24h: toNumber(msg.v),
          timestamp: toNumber(msg.t),
        });
      }
      if (channelCode === 'G2') {
        const newTrade: Trade = {
          price: toNumber(msg.pu),
          value: toNumber(msg.vo),
          timestamp: toNumber(msg.t),
          type: msg.ty,
          amount: toNumber(msg.to),
        };

        setTrades((prev) => [newTrade, ...prev].slice(0, 7));
      }
      if (channelCode === 'G3') {
        const timestamp = toNumber(msg.t);

        const candle: OHLCData = [
          timestamp,
          toNumber(msg.o),
          toNumber(msg.h),
          toNumber(msg.l),
          toNumber(msg.c),
        ];

        setOhlcv(candle);
      }
    };

    ws.onopen = () => setIsWsReady(true);

    ws.onmessage = handleMessage;

    ws.onclose = () => setIsWsReady(false);

    ws.onerror = (error) => {
      setIsWsReady(false);
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    if (!isWsReady) return;
    const ws = wsRef.current;
    if (!ws) return;

    const send = (payload: Record<string, unknown>) => ws.send(JSON.stringify(payload));

    const unsubscribeAll = () => {
      subscribed.current.forEach((channel) => {
        send({
          command: 'unsubscribe',
          identifier: JSON.stringify({ channel }),
        });
      });

      subscribed.current.clear();
    };

    const subscribe = (channel: string, data?: Record<string, unknown>) => {
      if (subscribed.current.has(channel)) return;

      send({ command: 'subscribe', identifier: JSON.stringify({ channel }) });

      if (data) {
        send({
          command: 'message',
          identifier: JSON.stringify({ channel }),
          data: JSON.stringify(data),
        });
      }
    };

    queueMicrotask(() => {
      setPrice(null);
      setTrades([]);
      setOhlcv(null);

      unsubscribeAll();

      subscribe('CGSimplePrice', { coin_id: [coinId], action: 'set_tokens' });

      const poolAddress = toPoolAddress(poolId);

      if (poolAddress) {
        subscribe('OnchainTrade', {
          'network_id:pool_addresses': [poolAddress],
          action: 'set_pools',
        });

        subscribe('OnchainOHLCV', {
          'network_id:pool_addresses': [poolAddress],
          interval: liveInterval,
          action: 'set_pools',
        });
      }
    });
  }, [coinId, poolId, isWsReady, liveInterval]);

  return {
    price,
    trades,
    ohlcv,
    isConnected: isWsReady,
  };
};
