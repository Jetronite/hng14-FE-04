export function calculateCurrentStreak(
  completions: string[],
  today?: string
): number {
  if (!completions.length) return 0;

  // Normalize "today" to YYYY-MM-DD
  const referenceDateStr = today ?? new Date().toISOString().split('T')[0];
  
  // 1. Unique and Sort descending (Latest date first)
  const sorted = Array.from(new Set(completions)).sort((a, b) => (b > a ? 1 : -1));

  // 2. If the user hasn't completed the habit today, the streak is 0
  if (!sorted.includes(referenceDateStr)) return 0;

  let streak = 0;
  // Use a string-based "cursor" to avoid Timezone/DST math issues
  let cursor = new Date(referenceDateStr);

  for (const dateStr of sorted) {
    const cursorStr = cursor.toISOString().split('T')[0];

    if (dateStr === cursorStr) {
      // It's the expected date!
      streak++;
      // Move cursor back exactly one day
      cursor.setDate(cursor.getDate() - 1);
    } else if (dateStr > cursorStr) {
      // This handles cases where dates might be in the future relative to cursor
      continue; 
    } else {
      // Gap found (dateStr < cursorStr)
      break;
    }
  }

  return streak;
}