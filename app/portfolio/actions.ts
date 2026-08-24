'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/auth';
import prisma from '@/lib/prisma';
import { authSetupComplete } from '@/lib/site-config';

export type PortfolioActionState = {
  error?: string;
  success?: string;
};

const holdingSchema = z.object({
  coinId: z.string().min(1),
  coinName: z.string().min(1),
  coinSymbol: z.string().min(1),
  amount: z.coerce.number().positive(),
  averageCostUsd: z.coerce.number().positive(),
});

const liquiditySchema = z.object({
  coinId: z.string().min(1),
  coinName: z.string().min(1),
  coinSymbol: z.string().min(1),
  side: z.enum(['BID', 'DEMAND']),
  amountUsd: z.coerce.number().positive(),
  targetPriceUsd: z.number().positive().optional(),
});

async function getAuthenticatedUserId() {
  if (!authSetupComplete) {
    return {
      error: 'Add DATABASE_URL and AUTH_SECRET before using saved portfolio features.',
    };
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      error: 'Sign in to save this action.',
    };
  }

  return { userId: session.user.id };
}

export async function upsertPortfolioHoldingAction(
  _: PortfolioActionState,
  formData: FormData
): Promise<PortfolioActionState> {
  const authState = await getAuthenticatedUserId();
  if ('error' in authState) {
    return authState;
  }

  const payload = holdingSchema.safeParse({
    coinId: formData.get('coinId'),
    coinName: formData.get('coinName'),
    coinSymbol: formData.get('coinSymbol'),
    amount: formData.get('amount'),
    averageCostUsd: formData.get('averageCostUsd'),
  });

  if (!payload.success) {
    return {
      error: 'Enter a valid coin, amount, and average cost.',
    };
  }

  const { coinId, coinName, coinSymbol, amount, averageCostUsd } = payload.data;

  await prisma.portfolioHolding.upsert({
    where: {
      userId_coinId: {
        userId: authState.userId,
        coinId,
      },
    },
    update: {
      coinName,
      coinSymbol: coinSymbol.toUpperCase(),
      amount,
      averageCostUsd,
    },
    create: {
      userId: authState.userId,
      coinId,
      coinName,
      coinSymbol: coinSymbol.toUpperCase(),
      amount,
      averageCostUsd,
    },
  });

  revalidatePath('/portfolio');

  return {
    success: `${coinSymbol.toUpperCase()} saved to your portfolio.`,
  };
}

export async function submitLiquidityOrderAction(
  _: PortfolioActionState,
  formData: FormData
): Promise<PortfolioActionState> {
  const authState = await getAuthenticatedUserId();
  if ('error' in authState) {
    return authState;
  }

  const rawTargetPrice = formData.get('targetPriceUsd')?.toString().trim();
  const parsedTargetPrice = rawTargetPrice ? Number(rawTargetPrice) : undefined;
  const invalidTargetPrice =
    rawTargetPrice && (parsedTargetPrice === undefined || !Number.isFinite(parsedTargetPrice) || parsedTargetPrice <= 0);

  if (invalidTargetPrice) {
    return {
      error: 'Enter a valid positive target price or leave it blank.',
    };
  }

  const payload = liquiditySchema.safeParse({
    coinId: formData.get('coinId'),
    coinName: formData.get('coinName'),
    coinSymbol: formData.get('coinSymbol'),
    side: formData.get('side'),
    amountUsd: formData.get('amountUsd'),
    targetPriceUsd: parsedTargetPrice,
  });

  if (!payload.success) {
    return {
      error: 'Enter a valid order side and USD amount before submitting.',
    };
  }

  const { coinId, coinName, coinSymbol, side, amountUsd, targetPriceUsd } = payload.data;

  await prisma.liquidityOrder.create({
    data: {
      userId: authState.userId,
      coinId,
      coinName,
      coinSymbol: coinSymbol.toUpperCase(),
      side,
      amountUsd,
      targetPriceUsd,
    },
  });

  revalidatePath('/portfolio');
  revalidatePath(`/coins/${coinId}`);

  return {
    success: `${side === 'BID' ? 'Bid' : 'Demand'} saved for ${coinSymbol.toUpperCase()}.`,
  };
}
