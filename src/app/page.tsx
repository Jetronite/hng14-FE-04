'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/shared/SplashScreen';
import { getSession } from '@/lib/storage';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const session = getSession();

      if (session) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }, 1899); // 800ms–2000ms required

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}