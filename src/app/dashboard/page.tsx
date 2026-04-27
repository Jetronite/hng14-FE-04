'use client';

import ProtectedRoute from '@/components/shared/ProtectedRoute';
import HabitList from '@/components/habits/HabitList';
import LogoutButton from '@/components/auth/LogoutButton';


export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div data-testid="dashboard-page" className="p-4 min-h-screen px-4 py-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <LogoutButton />
        </div>
        <HabitList />
      </div>
    </ProtectedRoute>
  );
}