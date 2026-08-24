import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import Header from '@/components/Header';
import { authSetupComplete } from '@/lib/site-config';

const AppHeader = async () => {
  let sessionUser:
    | {
        id: string;
        name?: string | null;
        email?: string | null;
      }
    | null = null;

  if (authSetupComplete) {
    const session = await getServerSession(authOptions);

    if (session?.user?.id) {
      sessionUser = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      };
    }
  }

  return <Header sessionUser={sessionUser} />;
};

export default AppHeader;
