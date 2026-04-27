'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/storage';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const session = getSession();

    if (!session) {
      router.replace('/login');
      setAuthorized(false);
    } else {
      setAuthorized(true);
    }
  }, [router]);

  // prevent flicker + test instability
  if (authorized === null) return null;

  return authorized ? <>{children}</> : null;
}