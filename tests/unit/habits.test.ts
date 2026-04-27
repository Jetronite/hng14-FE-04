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
  it('removes only the specified date when multiple completions exist', () => {
    const habit = {
      ...baseHabit,
      completions: [today, '2026-01-09'],
    };

    const updated = toggleHabitCompletion(habit, today);

    expect(updated.completions).toEqual(['2026-01-09']);
  });
  it('adds a new date to existing completions', () => {
    const habit = {
      ...baseHabit,
      completions: ['2026-01-09'],
    };

    const updated = toggleHabitCompletion(habit, today);

    expect(updated.completions).toContain(today);
    expect(updated.completions.length).toBe(2);
  });
  it('preserves other habit properties', () => {
    const updated = toggleHabitCompletion(baseHabit, today);

    expect(updated.id).toBe(baseHabit.id);
    expect(updated.name).toBe(baseHabit.name);
  });
  it('keeps completions unique after adding', () => {
    const habit = {
      ...baseHabit,
      completions: ['2026-01-09', today],
    };

    const updated = toggleHabitCompletion(habit, today);

    expect(new Set(updated.completions).size).toBe(updated.completions.length);
  });
});