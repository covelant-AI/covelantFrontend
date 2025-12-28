import type { CategoryKey } from "@/util/types";

export const DIAMOND_ANIM_MS = 200;

const COLOR_TO_KEY: Record<string, CategoryKey> = {
  "#FACC15": "Match",
  "#14B8A6": "Tactic",
  "#EF4444": "Fouls",
  "#38BDF8": "Physical",
  "#9CA3AF": "Note",
};

export function colorToKey(color?: string): CategoryKey | undefined {
  if (!color) return undefined;
  const c = color.trim().toUpperCase();
  return COLOR_TO_KEY[c];
}

export function getWrapperClass(isFullscreen: boolean) {
  return isFullscreen
    ? "absolute w-full bottom-1 py-4"
    : "absolute bottom-3 z-2 py-2 left-24 right-40 sm:left-35 sm:right-55";
}
