import { describe, it, expect } from 'vitest';
import { toggleHabitCompletion } from '@/lib/habits';
import { Habit } from '@/types/habit';

describe('toggleHabitCompletion', () => {
  const baseHabit: Habit = {
    id: '1',
    userId: 'user-1',
    name: 'Drink Water',
    description: '',
    frequency: 'daily',
    createdAt: '2026-01-01',
    completions: [],
  };

  const today = '2026-01-10';

  it('adds a completion date when the date is not present', () => {
    const updated = toggleHabitCompletion(baseHabit, today);
    expect(updated.completions).toContain(today);
  });

  it('removes a completion date when the date already exists', () => {
    const habitWithDate = {
      ...baseHabit,
      completions: [today],
    };

    const updated = toggleHabitCompletion(habitWithDate, today);
    expect(updated.completions).not.toContain(today);
  });

  it('does not mutate the original habit object', () => {
    const original = { ...baseHabit };
    toggleHabitCompletion(original, today);

    expect(original.completions).toEqual([]);
  });

  it('does not return duplicate completion dates', () => {
    const habitWithDuplicates = {
      ...baseHabit,
      completions: [today, today],
    };

    const updated = toggleHabitCompletion(habitWithDuplicates, today);
    expect(updated.completions.length).toBeLessThanOrEqual(1);
  });
});