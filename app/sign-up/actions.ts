'use server';

import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { authSetupComplete } from '@/lib/site-config';
import type { AuthFormState } from '@/app/sign-in/actions';

export async function signUpAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  if (!authSetupComplete) {
    return {
      error: 'Auth is not fully configured yet. Add DATABASE_URL and AUTH_SECRET to continue.',
    };
  }

  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString();

  if (!name || !email || !password) {
    return { error: 'Name, email, and password are required.' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters.' };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: 'An account already exists for that email.' };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  return { success: true };
}
