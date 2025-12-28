import type { GameTimelineEditorProps, Player as TimelinePlayer } from "../types/gameTimelineTypes";

export function buildUiPlayers(
  playerOne: GameTimelineEditorProps["playerOne"],
  playerTwo: GameTimelineEditorProps["playerTwo"]
): [TimelinePlayer, TimelinePlayer] {
  return [
    {
      id: playerOne.id,
      name: `${playerOne.firstName} ${playerOne.lastName}`,
      short: playerOne.firstName?.[0] ?? "P1",
      bg: "bg-emerald-500",
      ring: "ring-teal-600",
      avatar: playerOne.avatar,
    },
    {
      id: playerTwo.id,
      name: `${playerTwo.firstName} ${playerTwo.lastName}`,
      short: playerTwo.firstName?.[0] ?? "P2",
      bg: "bg-rose-500",
      ring: "ring-red-300",
      avatar: playerTwo.avatar,
    },
  ];
}