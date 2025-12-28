import type { Match, MatchDisplay, Player, PlayerMatch } from "@/util/interfaces";

export function toMatchDisplays(matches: Match[], activePlayer: Player): MatchDisplay[] {
  return matches.map((m) => {
    const selfEntry = m.playerMatches.find(
      (pm: PlayerMatch) => pm.playerId === activePlayer.id
    );

    let opponentName = "Unknown";

    if (selfEntry?.opponent) {
      opponentName = `${selfEntry.opponent.firstName} ${selfEntry.opponent.lastName}`;
    } else if (selfEntry?.playerTwo) {
      opponentName = `${selfEntry.playerTwo.firstName} ${selfEntry.playerTwo.lastName}`;
    }

    return {
      id: m.id,
      title: `${activePlayer.firstName} ${activePlayer.lastName} vs ${opponentName}`,
      imageUrl: m.imageUrl,
      analysisStatus: m.analysisStatus,
    };
  });
}
