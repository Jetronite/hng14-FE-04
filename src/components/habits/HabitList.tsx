'use client';

import { useEffect, useState } from 'react';
import { Habit } from '@/types/habit';
import { getHabits, saveHabits, getSession } from '@/lib/storage';
import HabitForm from './HabitForm';
import HabitCard from './HabitCard';
import { v4 as uuidv4 } from 'uuid';

export default function HabitList() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);

  const session = getSession();

  useEffect(() => {
    const allHabits = getHabits();
    const userHabits = allHabits.filter((h) => h.userId === session?.userId);
    setHabits(userHabits);
  }, [session?.userId]);

  function persist(updated: Habit[]) {
    const allHabits = getHabits();
    const others = allHabits.filter((h) => h.userId !== session?.userId);
    const merged = [...others, ...updated];
    saveHabits(merged);
    setHabits(updated);
  }

  function handleSave(data: Partial<Habit>) {
    if (!session) return;

    if (editing) {
      const updated = habits.map((h) =>
        h.id === editing.id
          ? { ...h, name: data.name!, description: data.description || '' }
          : h
      );
      persist(updated);
      setEditing(null);
      setShowForm(false);
      return;
    }

    const newHabit: Habit = {
      id: uuidv4(),
      userId: session.userId,
      name: data.name!,
      description: data.description || '',
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [],
    };

    persist([...habits, newHabit]);
    setShowForm(false);
  }

  function handleUpdate(updatedHabit: Habit) {
    const updated = habits.map((h) => (h.id === updatedHabit.id ? updatedHabit : h));
    persist(updated);
  }

  function handleDelete(id: string) {
    const updated = habits.filter((h) => h.id !== id);
    persist(updated);
  }

  function handleEditClick(habit: Habit) {
    setEditing(habit);
    setShowForm(true);
  }

  return (
    <div
      className="min-h-screen w-full bg-gray-50 px-4 py-6 md:px-8 md:py-10"
      role="region"
      aria-label="Habits section"
    >
      {/* CREATE BUTTON */}
      <div className="mb-6 md:mb-10 flex justify-center md:justify-between items-center">
        <h2 className="hidden md:block text-xl lg:text-2xl font-semibold text-gray-800">
          Your Habits
        </h2>

        <button
          data-testid="create-habit-button"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          aria-label="Create a new habit"
          className="w-full md:w-auto px-5 py-3 md:py-4 text-sm md:text-base font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Habit
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="mb-8 md:mb-12">
          <HabitForm
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
            initialData={editing}
          />
        </div>
      )}

      {/* EMPTY STATE */}
      {habits.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 md:py-24">
          <p
            data-testid="empty-state"
            className="text-gray-500 text-sm md:text-base"
          >
            No habits yet
          </p>
        </div>
      ) : (
        /* LIST */
        <div className="grid gap-4 md:gap-6 lg:gap-8 grid-cols-1">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 transition hover:shadow-md focus-within:ring-2 focus-within:ring-blue-500"
            >
              <HabitCard
                habit={habit}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onEdit={() => handleEditClick(habit)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}