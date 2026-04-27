export function getHabitSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // collapse spaces → single hyphen
    .replace(/[^a-z0-9-]/g, '');    // remove invalid chars
}