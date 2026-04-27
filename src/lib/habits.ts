import { Habit } from '@/types/habit';

export function toggleHabitCompletion(
  habit: Habit,
  date: string
): Habit {
  const exists = habit.completions.includes(date);

  let updatedCompletions: string[];

  if (exists) {
    updatedCompletions = habit.completions.filter(d => d !== date);
  } else {
    updatedCompletions = [...habit.completions, date];
  }

  // Ensure uniqueness
  const unique = Array.from(new Set(updatedCompletions));

  return {
    ...habit,
    completions: unique,
  };
}