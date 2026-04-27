'use client';

import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { logout } from '@/lib/auth';
import HabitList from '@/components/habits/HabitList';
import { useRouter } from 'next/navigation';
import LogoutButton from '@/components/auth/LogoutButton';


export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div data-testid="dashboard-page" className="p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <LogoutButton />
        </div>
        <HabitList />
      </div>
    </ProtectedRoute>
  );
}