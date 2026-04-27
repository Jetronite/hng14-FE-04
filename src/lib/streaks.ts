export function calculateCurrentStreak(
  completions: string[],
  today?: string
): number {
  if (!completions.length) return 0;

  const referenceDateStr =
    today ?? new Date().toISOString().split('T')[0];

  const uniqueSorted = Array.from(new Set(completions))
    .filter(date => date <= referenceDateStr)
    .sort((a, b) => (a < b ? 1 : -1)); // DESC order

  // must include today, otherwise streak is 0
  if (!uniqueSorted.includes(referenceDateStr)) return 0;

  let streak = 0;
  let current = new Date(referenceDateStr);

  for (const dateStr of uniqueSorted) {
    const expected = current.toISOString().split('T')[0];

    if (dateStr === expected) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else if (dateStr < expected) {
      // gap detected → stop streak
      break;
    }
  }

  return streak;
}