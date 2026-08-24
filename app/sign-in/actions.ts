'use server';

import { authSetupComplete } from '@/lib/site-config';

export type AuthFormState = {
  error?: string;
  success?: boolean;
};

export async function signInAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  if (!authSetupComplete) {
    return {
      error: 'Auth is not fully configured yet. Add DATABASE_URL and AUTH_SECRET to continue.',
    };
  }

  const email = formData.get('email')?.toString().trim().toLowerCase();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  return { success: true };
}
