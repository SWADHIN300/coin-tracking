import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import AuthShell from '@/components/auth/AuthShell';
import SignInForm from '@/components/auth/SignInForm';
import { authSetupComplete, googleAuthEnabled } from '@/lib/site-config';

export const dynamic = 'force-dynamic';

const SignInPage = async () => {
  if (authSetupComplete) {
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      redirect('/portfolio');
    }
  }

  return (
    <AuthShell
      eyebrow="Secure Access"
      title="Log in to Block-coin"
      subtitle="Connect to your trading workspace with Google or continue with your email and password."
    >
        <SignInForm googleEnabled={googleAuthEnabled} />
    </AuthShell>
  );
};

export default SignInPage;
