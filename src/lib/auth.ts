import { v4 as uuidv4 } from 'uuid';
import { User, Session } from '@/types/auth';
import {
  getUsers,
  saveUsers,
  getSession,
  setSession,
  clearSession,
} from './storage';

export function signup(email: string, password: string): {
  success: boolean;
  error: string | null;
} {
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  if (!trimmedEmail || !trimmedPassword) {
    return {
      success: false,
      error: 'Email and password are required',
    };
  }

  const users = getUsers();

  const existingUser = users.find(
    (user) => user.email === trimmedEmail
  );

  if (existingUser) {
    return {
      success: false,
      error: 'User already exists',
    };
  }

  const newUser: User = {
    id: uuidv4(),
    email: trimmedEmail,
    password: trimmedPassword,
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);

  const session: Session = {
    userId: newUser.id,
    email: newUser.email,
  };

  setSession(session);

  return {
    success: true,
    error: null,
  };
}

export function login(email: string, password: string): {
  success: boolean;
  error: string | null;
} {
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  const users = getUsers();

  const user = users.find(
    (u) =>
      u.email === trimmedEmail &&
      u.password === trimmedPassword
  );

  if (!user) {
    return {
      success: false,
      error: 'Invalid email or password',
    };
  }

  const session: Session = {
    userId: user.id,
    email: user.email,
  };

  setSession(session);

  return {
    success: true,
    error: null,
  };
}

export function logout(): void {
  clearSession();
}