'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { Chrome, Eye, EyeOff, Github, LayoutGrid, Orbit } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { AuthFormState } from '@/app/sign-in/actions';
import { signUpAction } from '@/app/sign-up/actions';

const initialState: AuthFormState = {};

const SignUpForm = ({ googleEnabled }: { googleEnabled: boolean }) => {
  const router = useRouter();
  const [state, setState] = useState<AuthFormState>(initialState);
  const [pending, setPending] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setState(initialState);

    const formData = new FormData();
    formData.set('name', name);
    formData.set('email', email);
    formData.set('password', password);

    const result = await signUpAction(initialState, formData);

    if (result.error) {
      setState(result);
      setPending(false);
      return;
    }

    const signInResult = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: '/portfolio',
    });

    setPending(false);

    if (signInResult?.error) {
      setState({ error: 'Account created, but automatic sign-in failed. Please sign in manually.' });
      return;
    }

    router.push(signInResult?.url || '/portfolio');
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
          <label className="auth-label" htmlFor="name">
            Name
          </label>
          <div className="auth-input-shell">
            <input
              id="name"
              className="auth-input"
              type="text"
              name="name"
              placeholder="Enter your full name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
        </div>

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
            <span className="auth-inline-link auth-inline-link--static">
              At least 8 characters
            </span>
          </div>

          <div className="auth-input-shell">
            <input
              id="password"
              className="auth-input"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter a unique password"
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

        {state.error && <p className="text-sm text-red-400">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="auth-submit disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <p className="auth-bottom-copy">
        Already have an account?{' '}
        <Link href="/sign-in" className="auth-bottom-link">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default SignUpForm;
