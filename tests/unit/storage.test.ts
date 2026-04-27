import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  getUsers, 
  saveUsers, 
  getSession, 
  setSession, 
  clearSession, 
  getHabits, 
  saveHabits 
} from '@/lib/storage';
import { STORAGE_KEYS } from '@/lib/constants';
import { User, Session } from '@/types/auth';
import { Habit } from '@/types/habit';

describe('storage utility', () => {
  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'password123',
    createdAt: new Date().toISOString(),
  };

  const mockHabit: Habit = {
    id: 'h1',
    userId: '1',
    name: 'Test Habit',
    description: 'Desc',
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    completions: [],
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('handles user storage (get/save)', () => {
    saveUsers([mockUser]);
    const users = getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe(mockUser.email);
  });

  it('handles session storage (get/set/clear)', () => {
    const session: Session = { userId: '1', email: 'test@example.com' };
    
    setSession(session);
    expect(getSession()).toEqual(session);
    
    clearSession();
    expect(getSession()).toBeNull();
  });

  it('handles habit storage (get/save)', () => {
    saveHabits([mockHabit]);
    const habits = getHabits();
    expect(habits).toHaveLength(1);
    expect(habits[0].name).toBe('Test Habit');
  });

  it('returns fallback values when localStorage is empty', () => {
    expect(getUsers()).toEqual([]);
    expect(getSession()).toBeNull();
    expect(getHabits()).toEqual([]);
  });

  it('recovers gracefully from malformed JSON (line 11 catch block)', () => {
    localStorage.setItem(STORAGE_KEYS.USERS, 'invalid-json-{');
    // This triggers the try/catch in safeParse (Line 11)
    expect(getUsers()).toEqual([]);
  });
});