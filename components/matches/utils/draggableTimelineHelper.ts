import type { Player, VideoSection, TimelineEvent } from "../types/gameTimelineTypes";

export interface DraggableTimelineProps {
  videoSections: VideoSection[];
  players: [Player, Player];
  title?: string;
  onSectionSelect?: (sectionId: number) => void;
}

export function getWinnerPlayerId(
  section: VideoSection,
  playerOneId: number,
  playerTwoId: number
): number {
  const won = section.summary?.player_won_point ?? null;
  if (won === "top") return playerOneId;
  if (won === "bottom") return playerTwoId;
  return playerOneId; // same fallback you had
}

export function toEvents(videoSections: VideoSection[], players: [Player, Player]): TimelineEvent[] {
  const [p1, p2] = players;
  return videoSections.map((section) => ({
    id: section.id,
    playerId: getWinnerPlayerId(section, p1.id, p2.id),
  }));
}

export function getPlayerById(players: [Player, Player], id: number): Player | undefined {
  return players.find((p) => p.id === id);
}