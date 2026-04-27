import { User, Session } from '@/types/auth';
import { Habit } from '@/types/habit';
import { STORAGE_KEYS } from './constants';

// ==============================
// SAFE JSON HELPERS (PRIVATE)
// ==============================

function safeParse<T>(value: string | null, fallback: T): T {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function safeStringify(value: unknown): string {
  return JSON.stringify(value);
}

// ==============================
// USERS
// ==============================

export function getUsers(): User[] {
  const raw = localStorage.getItem(STORAGE_KEYS.USERS);
  return safeParse<User[]>(raw, []);
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(
    STORAGE_KEYS.USERS,
    safeStringify(users)
  );
}

// ==============================
// SESSION
// ==============================

export function getSession(): Session | null {
  const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
  return safeParse<Session | null>(raw, null);
}

export function setSession(session: Session): void {
  localStorage.setItem(
    STORAGE_KEYS.SESSION,
    safeStringify(session)
  );
}

export function clearSession(): void {
  localStorage.setItem(
    STORAGE_KEYS.SESSION,
    safeStringify(null)
  );
}

// ==============================
// HABITS
// ==============================

export function getHabits(): Habit[] {
  const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
  return safeParse<Habit[]>(raw, []);
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(
    STORAGE_KEYS.HABITS,
    safeStringify(habits)
  );
}