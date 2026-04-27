'use client';

import { useState } from 'react';
import { login } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = login(email, password);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className={clsx(
          "w-full max-w-sm md:max-w-md lg:max-w-lg",
          "bg-white rounded-2xl shadow-md",
          "p-6 md:p-10",
          "flex flex-col gap-10 md:gap-6"
        )}
        aria-label="Login form"
      >
        <h2 className="text-xl md:text-3xl font-semibold text-gray-800 text-center">
          Login
        </h2>

        {/* EMAIL */}
        <div className="relative">
          <label
            htmlFor="email"
            className="absolute -top-2 left-3 px-1 bg-white text-xs md:text-sm text-gray-500"
          >
            Email
          </label>
          <input
            id="email"
            data-testid="auth-login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            autoComplete="email"
            aria-label="Email"
            className={clsx(
              "w-full mt-2",
              "border rounded-lg",
              "px-4 py-3 md:py-4",
              "text-sm md:text-base",
              "focus:outline-none focus:ring-2 focus:ring-blue-500"
            )}
          />
        </div>

        {/* PASSWORD */}
        <div className="relative">
          <label
            htmlFor="password"
            className="absolute -top-2 left-3 px-1 bg-white text-xs md:text-sm text-gray-500"
          >
            Password
          </label>
          <input
            id="password"
            data-testid="auth-login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            aria-label="Password"
            className={clsx(
              "w-full mt-2",
              "border rounded-lg",
              "px-4 py-3 md:py-4",
              "text-sm md:text-base",
              "focus:outline-none focus:ring-2 focus:ring-blue-500"
            )}
          />
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm md:text-base" role="alert">
            {error}
          </p>
        )}

        {/* BUTTON */}
        <button
          data-testid="auth-login-submit"
          type="submit"
          className={clsx(
            "w-full",
            "py-3 md:py-4",
            "rounded-lg",
            "text-sm md:text-base font-semibold",
            "bg-blue-600 text-white",
            "hover:bg-blue-700",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          )}
        >
          Login
        </button>
      </form>
    </div>
  );
}
