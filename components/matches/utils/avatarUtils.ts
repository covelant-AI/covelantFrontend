// components/game-timeline/utils/avatarUtils.ts
import type { Player } from "../types/gameTimelineTypes";

export function getPlayerInitials(player: Player): string {
  const short = player.short?.trim();
  if (short) return short;

  const firstChar = player.name?.trim()?.charAt(0);
  return firstChar ? firstChar.toUpperCase() : "?";
}

export function getPlayerAltText(player: Player): string {
  const name = player.name?.trim();
  return name ? `${name} avatar` : "Player avatar";
}

export function getAvatarSrc(player: Player): string | null {
  const src = player.avatar?.trim();
  return src ? src : null;
}
