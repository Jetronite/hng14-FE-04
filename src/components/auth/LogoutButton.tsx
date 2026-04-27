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
      className="
        px-4 py-2 mb-2
        text-sm font-medium
        rounded-lg
        bg-red-600 text-white
        hover:bg-red-700
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
    >
      Logout
    </button>
  );
}