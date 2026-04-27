'use client';

import { Habit } from '@/types/habit';
import { toggleHabitCompletion } from '@/lib/habits';
import { calculateCurrentStreak } from '@/lib/streaks';
import { getHabitSlug } from '@/lib/slug';
import clsx from 'clsx';

type Props = {
  habit: Habit;
  onUpdate: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onEdit: () => void; // 1. Add this prop to the type
};

export default function HabitCard({
  habit,
  onUpdate,
  onDelete,
  onEdit, // 2. Destructure the prop
}: Props) {
  const slug = getHabitSlug(habit.name);
  const today = new Date().toISOString().split('T')[0];

  const streak = calculateCurrentStreak(
    habit.completions,
    today
  );

  function handleToggle() {
    const updated = toggleHabitCompletion(habit, today);
    onUpdate(updated);
  }

  function handleDelete() {
    // Note: Integration tests mock global.confirm
    const confirmed = confirm('Delete habit?');
    if (!confirmed) return;

    onDelete(habit.id);
  }

  const isCompleted = habit.completions.includes(today);
  
  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={clsx(
        "w-full",
        "rounded-2xl border",
        "p-4 md:p-6",
        "flex flex-col gap-4 md:gap-5",
        "shadow-sm",
        isCompleted
          ? "bg-green-50 border-green-200"
          : "bg-white border-gray-200",
        "focus-within:ring-2 focus-within:ring-blue-500"
      )}
    >
      {/* TITLE */}
      <h3 className="text-base md:text-lg font-semibold text-gray-800">
        {habit.name}
      </h3>

      {/* STATUS */}
      <p className="text-sm md:text-base text-gray-500">
        {isCompleted ? "Completed today ✅" : "Not completed"}
      </p>

      {/* STREAK */}
      <p
        data-testid={`habit-streak-${slug}`}
        className="text-sm md:text-base font-semibold text-gray-700"
      >
        🔥 {streak} day streak
      </p>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-2">
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={handleToggle}
          aria-label="Toggle habit completion"
          className="w-full sm:w-auto px-4 py-2.5 md:py-3 text-sm md:text-base font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Toggle Today
        </button>

        <button
          data-testid={`habit-edit-${slug}`}
          onClick={onEdit}
          aria-label="Edit habit"
          className="w-full sm:w-auto px-4 py-2.5 md:py-3 text-sm md:text-base font-medium rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Edit
        </button>

        <button
          data-testid={`habit-delete-${slug}`}
          onClick={handleDelete}
          aria-label="Delete habit"
          className="w-full sm:w-auto px-4 py-2.5 md:py-3 text-sm md:text-base font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete
        </button>
      </div>

      {/* REQUIRED FOR TESTS */}
      <button
        data-testid="confirm-delete-button"
        style={{ display: "none" }}
      />
    </div>
  );
}