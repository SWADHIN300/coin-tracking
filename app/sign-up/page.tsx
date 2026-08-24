import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import AuthShell from '@/components/auth/AuthShell';
import SignUpForm from '@/components/auth/SignUpForm';
import { authSetupComplete, googleAuthEnabled } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

const SignUpPage = async () => {
  if (authSetupComplete) {
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      redirect('/portfolio');
    }
  }

  return (
    <AuthShell
      eyebrow="New Account"
      title="Create your account"
      subtitle="Start a saved portfolio, store liquidity intent in Postgres, and move between live coin screens with one identity."
    >
        <SignUpForm googleEnabled={googleAuthEnabled} />
    </AuthShell>
  );
};

export default SignUpPage;
