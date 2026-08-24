'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { Chrome, Eye, EyeOff, Github, LayoutGrid, Orbit } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SignInForm = ({ googleEnabled }: { googleEnabled: boolean }) => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError('');
    setForgotMessage('');

    const response = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: '/portfolio',
    });

    setPending(false);

    if (response?.error) {
      setError('Invalid email or password.');
      return;
    }

    router.push(response?.url || '/portfolio');
    router.refresh();
  };

  return (
    <div className="auth-form-wrap">
      <div className="auth-provider-grid">
        <button
          type="button"
          onClick={() => googleEnabled && signIn('google', { callbackUrl: '/portfolio' })}
          className={`auth-provider-btn ${googleEnabled ? 'auth-provider-btn--live' : 'auth-provider-btn--disabled'}`}
          disabled={!googleEnabled}
        >
          <span className="auth-provider-left">
            <Chrome size={18} />
            Google
          </span>
          {googleEnabled ? <span className="auth-provider-badge">Live</span> : <span className="auth-provider-hint">Setup</span>}
        </button>

        <button type="button" className="auth-provider-btn auth-provider-btn--disabled" disabled>
          <span className="auth-provider-left">
            <Github size={18} />
            GitHub
          </span>
          <span className="auth-provider-hint">Soon</span>
        </button>

        <button type="button" className="auth-provider-btn auth-provider-btn--disabled" disabled>
          <span className="auth-provider-left">
            <LayoutGrid size={18} />
            Microsoft
          </span>
          <span className="auth-provider-hint">Soon</span>
        </button>

        <button type="button" className="auth-provider-btn auth-provider-btn--disabled" disabled>
          <span className="auth-provider-left">
            <Orbit size={18} />
            Hasura
          </span>
          <span className="auth-provider-hint">Soon</span>
        </button>
      </div>

      <div className="auth-divider">
        <span>Or continue with</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="auth-field">
          <label className="auth-label" htmlFor="email">
            Email
          </label>
          <div className="auth-input-shell">
            <input
              id="email"
              className="auth-input"
              type="email"
              name="email"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </div>

        <div className="auth-field">
          <div className="auth-field-row">
            <label className="auth-label" htmlFor="password">
              Password
            </label>
            <button
              type="button"
              className="auth-inline-link"
              onClick={() => setForgotMessage('Password reset flow is coming soon.')}
            >
              Forgot Password?
            </button>
          </div>

          <div className="auth-input-shell">
            <input
              id="password"
              className="auth-input"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className="auth-input-action"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {(error || forgotMessage) && (
          <p className={`text-sm ${error ? 'text-red-400' : 'text-purple-100/65'}`}>
            {error || forgotMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="auth-submit disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="auth-bottom-copy">
        New to Block-coin?{' '}
        <Link href="/sign-up" className="auth-bottom-link">
          Sign up for an account
        </Link>
      </p>
    </div>
  );
};

export default SignInForm;
