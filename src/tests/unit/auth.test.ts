import { describe, it, expect, beforeEach } from 'vitest';
import { signup, login, logout } from '@/lib/auth';

describe('Auth Logic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should create a user and a session on signup', () => {
    const result = signup('test@test.com', 'password123');
    
    expect(result.success).toBe(true);
    expect(localStorage.getItem('habit-tracker-session')).toContain('test@test.com');
  });

  it('should prevent duplicate signups', () => {
    signup('test@test.com', 'password123');
    const result = signup('test@test.com', 'different-pass');
    
    expect(result.success).toBe(false);
    expect(result.error).toBe('User already exists');
  });

  it('should login an existing user', () => {
    signup('user@test.com', 'pass');
    localStorage.removeItem('habit-tracker-session'); // simulate being logged out
    
    const result = login('user@test.com', 'pass');
    expect(result.success).toBe(true);
  });
});