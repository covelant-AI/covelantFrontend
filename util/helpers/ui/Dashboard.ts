export function getDisplayName(value: string, fallback: string) {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : fallback;
}