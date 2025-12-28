const KEY = "selectedPlayer";

/** ---------- helpers ---------- */

function safeJsonParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasNumericId(value: unknown): value is { id: number } {
  return isRecord(value) && typeof value.id === "number";
}

function extractIdArray(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value.filter(hasNumericId).map((item) => item.id);
}

/** ---------- main function ---------- */

export function clearSelectedPlayerIfMissing(updatedData: unknown): void {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return;

  const selected = safeJsonParse(raw);
  if (!hasNumericId(selected)) {
    sessionStorage.removeItem(KEY);
    return;
  }

  const selectedId = selected.id;

  if (!isRecord(updatedData)) return;

  const playerIds = extractIdArray(updatedData.players);
  const coachIds = extractIdArray(updatedData.coaches);

  const stillExists = playerIds.includes(selectedId) || coachIds.includes(selectedId);

  if (!stillExists) {
    sessionStorage.removeItem(KEY);
  }
}
