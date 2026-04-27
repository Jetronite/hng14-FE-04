import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '@/lib/streaks';

/* MENTOR_TRACE_STAGE3_HABIT_A91 */
describe('calculateCurrentStreak', () => {
  const today = '2026-01-10';
  const yesterday = '2026-01-09';
  const twoDaysAgo = '2026-01-08';

  it('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([], today)).toBe(0);
  });

  it('returns 0 when today is not completed', () => {
    expect(calculateCurrentStreak([yesterday], today)).toBe(0);
  });

  it('returns 0 when all dates are in the future', () => {
    expect(
      calculateCurrentStreak(['2026-01-11', '2026-01-12'], '2026-01-10')
    ).toBe(0);
  });

  it('returns the correct streak for consecutive completed days', () => {
    expect(
      calculateCurrentStreak([today, yesterday, twoDaysAgo], today)
    ).toBe(3);
  });

  it('returns 1 when only today is completed', () => {
    expect(
      calculateCurrentStreak(['2026-01-10'], '2026-01-10')
    ).toBe(1);
  });

  it('ignores duplicate completion dates', () => {
    expect(
      calculateCurrentStreak([today, today, yesterday], today)
    ).toBe(2);
  });

  it('ignores future dates relative to today', () => {
    const future = '2026-01-11';
    expect(
      calculateCurrentStreak([future, today, yesterday], today)
    ).toBe(2);
  });

  it('breaks the streak when a calendar day is missing', () => {
    expect(
      calculateCurrentStreak([today, twoDaysAgo], today)
    ).toBe(1);
  });

  it('handles unordered dates correctly', () => {
    expect(
      calculateCurrentStreak(
        ['2026-01-08', '2026-01-10', '2026-01-09'],
        '2026-01-10'
      )
    ).toBe(3);
  });

  it('stops streak at first gap even if earlier dates exist', () => {
    expect(
      calculateCurrentStreak(
        ['2026-01-10', '2026-01-09', '2026-01-07'],
        '2026-01-10'
      )
    ).toBe(2);
  });
});
