'use client';

import { useState } from 'react';
import { signup } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function SignupForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = signup(email, password);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push('/dashboard');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4"
    >
      <h2 className="text-xl font-semibold">Sign Up</h2>

      <input
        data-testid="auth-signup-email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
      />

      <input
        data-testid="auth-signup-password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2"
      />

      {error && <p className="text-red-500">{error}</p>}

      <button
        data-testid="auth-signup-submit"
        type="submit"
        className="bg-black text-white p-2"
      >
        Sign Up
      </button>
    </form>
  );
}