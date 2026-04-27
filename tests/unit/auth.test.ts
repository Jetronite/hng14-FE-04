import { describe, it, expect, beforeEach } from 'vitest';
import { signup, login, logout } from '@/lib/auth';
import { getSession } from '@/lib/storage';

describe('auth flow', () => { // Using the exact name from the contract
  beforeEach(() => {
    localStorage.clear();
  });

  it('submits the signup form and creates a session', () => {
    const result = signup('test@test.com', 'password123');
    
    expect(result.success).toBe(true);
    const session = getSession();
    expect(session?.email).toBe('test@test.com');
  });

  it('shows an error for duplicate signup email', () => {
    signup('test@test.com', 'password123');
    const result = signup('test@test.com', 'different-pass');
    
    expect(result.success).toBe(false);
    // Section 11 Requirement: "User already exists"
    expect(result.error).toBe('User already exists');
  });

  it('submits the login form and stores the active session', () => {
    signup('user@test.com', 'pass');
    logout(); // Start from a logged-out state
    
    const result = login('user@test.com', 'pass');
    expect(result.success).toBe(true);
    expect(getSession()?.email).toBe('user@test.com');
  });

  it('shows an error for invalid login credentials', () => {
    signup('user@test.com', 'pass');
    const result = login('user@test.com', 'wrong-pass');
    
    expect(result.success).toBe(false);
    // Section 11 Requirement: "Invalid email or password"
    expect(result.error).toBe('Invalid email or password');
  });

  it('logs out and removes the session', () => {
    signup('user@test.com', 'pass');
    expect(getSession()).not.toBeNull();
    
    logout();
    
    // Section 11 Requirement: "remove the session from localStorage"
    expect(getSession()).toBeNull();
  });
});