'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/lib/auth';

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <button
      data-testid="auth-logout-button"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}