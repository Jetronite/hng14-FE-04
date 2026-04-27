import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import HabitList from '@/components/habits/HabitList';
import { signup } from '@/lib/auth';
import { getHabits } from '@/lib/storage';
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe('habit form', () => {
  beforeEach(() => {
    localStorage.clear();
    signup('user@test.com', '1234');
  });

  it('shows a validation error when habit name is empty', () => {
    render(<HabitList />);

    fireEvent.click(screen.getByTestId('create-habit-button'));

    fireEvent.click(screen.getByTestId('habit-save-button'));

    expect(screen.getByText('Habit name is required')).toBeInTheDocument();
  });

  it('creates a new habit and renders it in the list', () => {
    render(<HabitList />);

    fireEvent.click(screen.getByTestId('create-habit-button'));

    fireEvent.change(screen.getByTestId('habit-name-input'), {
      target: { value: 'Drink Water' },
    });

    fireEvent.change(screen.getByTestId('habit-description-input'), {
      target: { value: 'Stay hydrated' },
    });

    fireEvent.click(screen.getByTestId('habit-save-button'));

    const habits = getHabits();

    expect(habits.length).toBe(1);
    expect(habits[0].name).toBe('Drink Water');
  });

  it('edits an existing habit and preserves immutable fields', () => {
    render(<HabitList />);

    // create
    fireEvent.click(screen.getByTestId('create-habit-button'));

    fireEvent.change(screen.getByTestId('habit-name-input'), {
      target: { value: 'Run' },
    });

    fireEvent.click(screen.getByTestId('habit-save-button'));

    const before = getHabits()[0];

    // simulate edit mode via UI trigger (depends on your edit button wiring)
    fireEvent.click(
      screen.getByTestId(`habit-edit-${before.name.toLowerCase()}`)
    );

    fireEvent.change(screen.getByTestId('habit-name-input'), {
      target: { value: 'Run Fast' },
    });

    fireEvent.click(screen.getByTestId('habit-save-button'));

    const updated = getHabits()[0];

    expect(updated.id).toBe(before.id);
    expect(updated.createdAt).toBe(before.createdAt);
    expect(updated.userId).toBe(before.userId);
  });

  it('deletes a habit only after explicit confirmation', () => {
    render(<HabitList />);

    fireEvent.click(screen.getByTestId('create-habit-button'));

    fireEvent.change(screen.getByTestId('habit-name-input'), {
      target: { value: 'Meditate' },
    });

    fireEvent.click(screen.getByTestId('habit-save-button'));

    const habit = getHabits()[0];

    // mock confirm
    global.confirm = () => true;

    fireEvent.click(
      screen.getByTestId(`habit-delete-${habit.name.toLowerCase()}`)
    );

    expect(getHabits().length).toBe(0);
  });

  it('toggles completion and updates the streak display', () => {
    render(<HabitList />);

    fireEvent.click(screen.getByTestId('create-habit-button'));

    fireEvent.change(screen.getByTestId('habit-name-input'), {
      target: { value: 'Read' },
    });

    fireEvent.click(screen.getByTestId('habit-save-button'));

    const habit = getHabits()[0];

    const slug = habit.name.toLowerCase();

    fireEvent.click(
      screen.getByTestId(`habit-complete-${slug}`)
    );

    const streakEl = screen.getByTestId(`habit-streak-${slug}`);

    expect(streakEl.textContent).toContain('1');
  });
});