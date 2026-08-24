import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type AuthShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const AuthShell = ({ eyebrow, title, subtitle, children }: AuthShellProps) => {
  return (
    <main className="auth-screen">
      <div className="auth-shell">
        <Link href="/" className="auth-back">
          <ArrowLeft size={18} />
          Home
        </Link>

        <section className="auth-card">
          <p className="auth-eyebrow">{eyebrow}</p>
          <h1 className="auth-title">{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
          {children}
        </section>
      </div>
    </main>
  );
};

export default AuthShell;
