'use client';

import { useFormStatus } from 'react-dom';

const AuthSubmitButton = ({ label }: { label: string }) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="hero-btn-primary w-full justify-center"
      disabled={pending}
    >
      {pending ? 'Please wait...' : label}
    </button>
  );
};

export default AuthSubmitButton;
