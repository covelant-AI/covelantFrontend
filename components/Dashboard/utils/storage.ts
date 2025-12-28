import type { Player } from "@/util/interfaces";

const KEY = "selectedPlayer";

export function readSelectedPlayerFromSession(): Player | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Player;
  } catch {
    return null;
  }
}

export function writeSelectedPlayerToSession(player: Player) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(player));
  } catch {
    // ignore storage failures
  }
}
