import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SignupForm from '@/components/auth/SignupForm';
import LoginForm from '@/components/auth/LoginForm';
import { vi } from 'vitest';
import { signup } from '@/lib/auth';


import { getSession, clearSession } from '@/lib/storage';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe('auth flow', () => {
  beforeEach(() => {
    localStorage.clear();
    clearSession();
  });

  it('submits the signup form and creates a session', () => {
    render(<SignupForm />);

    fireEvent.change(screen.getByTestId('auth-signup-email'), {
      target: { value: 'test@mail.com' },
    });

    fireEvent.change(screen.getByTestId('auth-signup-password'), {
      target: { value: '1234' },
    });

    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    const session = getSession();

    expect(session).toBeTruthy();
    expect(session?.email).toBe('test@mail.com');
  });

  it('shows an error for duplicate signup email', () => {
    // seed user
    signup('test@mail.com', '1234');

    render(<SignupForm />);

    fireEvent.change(screen.getByTestId('auth-signup-email'), {
      target: { value: 'test@mail.com' },
    });

    fireEvent.change(screen.getByTestId('auth-signup-password'), {
      target: { value: '1234' },
    });

    fireEvent.click(screen.getByTestId('auth-signup-submit'));

    expect(screen.getByText('User already exists')).toBeInTheDocument();
  });

  it('submits the login form and stores the active session', () => {
    signup('login@test.com', 'pass');

    render(<LoginForm />);

    fireEvent.change(screen.getByTestId('auth-login-email'), {
      target: { value: 'login@test.com' },
    });

    fireEvent.change(screen.getByTestId('auth-login-password'), {
      target: { value: 'pass' },
    });

    fireEvent.click(screen.getByTestId('auth-login-submit'));

    const session = getSession();

    expect(session).toBeTruthy();
    expect(session?.email).toBe('login@test.com');
  });

  it('shows an error for invalid login credentials', () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByTestId('auth-login-email'), {
      target: { value: 'wrong@test.com' },
    });

    fireEvent.change(screen.getByTestId('auth-login-password'), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByTestId('auth-login-submit'));

    expect(
      screen.getByText('Invalid email or password')
    ).toBeInTheDocument();
  });
});