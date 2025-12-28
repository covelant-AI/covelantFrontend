import type { MatchEventData } from "@/util/interfaces";

export function appendTag(prev: MatchEventData[], newTag: MatchEventData): MatchEventData[] {
  return [...prev, newTag];
}

export function removeTagById(prev: MatchEventData[], id: number): MatchEventData[] {
  return prev.filter((m) => m.id !== id);
}
