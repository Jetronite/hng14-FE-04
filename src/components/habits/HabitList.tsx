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
    <div>
      <button
        data-testid="create-habit-button"
        onClick={() => {
          setEditing(null);
          setShowForm(true);
        }}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Create Habit
      </button>

      {showForm && (
        <HabitForm
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          initialData={editing}
        />
      )}

      {habits.length === 0 ? (
        <p data-testid="empty-state">No habits yet</p>
      ) : (
        <div className="space-y-4">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onEdit={() => handleEditClick(habit)}
            />
          ))}
        </div>
      )}
    </div>
  );
}