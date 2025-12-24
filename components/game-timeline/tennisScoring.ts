// components/game-timeline/tennisScoring.ts
import { VideoSection } from "./types";

export type PointWinner = "top" | "bottom";
export type TennisPoint = 0 | 15 | 30 | 40 | "AD";

export type TennisGameScore = {
  top: TennisPoint;
  bottom: TennisPoint;
};

const nextPointMap: Record<0 | 15 | 30, TennisPoint> = {
  0: 15,
  15: 30,
  30: 40,
};

function resetScoreAfterGameWin(
  winner: PointWinner,
  carryFirstPoint: boolean
): TennisGameScore {
  if (!carryFirstPoint) return { top: 0, bottom: 0 };
  return winner === "top" ? { top: 15, bottom: 0 } : { top: 0, bottom: 15 };
}

function awardPointWithMeta(
  score: TennisGameScore,
  winner: PointWinner,
  carryFirstPointOnWin: boolean
): { score: TennisGameScore; gameEnded: boolean } {
  const loser: PointWinner = winner === "top" ? "bottom" : "top";
  const w = score[winner];
  const l = score[loser];

  if (w === "AD") {
    return {
      score: resetScoreAfterGameWin(winner, carryFirstPointOnWin),
      gameEnded: true,
    };
  }

  if (l === "AD") {
    return { score: { top: 40, bottom: 40 }, gameEnded: false };
  }

  if (w === 40 && l === 40) {
    return {
      score:
        winner === "top" ? { top: "AD", bottom: 40 } : { top: 40, bottom: "AD" },
      gameEnded: false,
    };
  }

  if (w === 40 && l !== 40) {
    return {
      score: resetScoreAfterGameWin(winner, carryFirstPointOnWin),
      gameEnded: true,
    };
  }

  if (w === 0 || w === 15 || w === 30) {
    return {
      score: { ...score, [winner]: nextPointMap[w] } as TennisGameScore,
      gameEnded: false,
    };
  }

  return { score, gameEnded: false };
}

/**
 * Scoreboard score at a selected section.
 * ✅ Uses your desired behavior: if a game is won on a section, it becomes 15-0 or 0-15 immediately.
 */
export function computeTennisGameScoreAtSection(
  videoSections: VideoSection[],
  selectedSectionId: number,
  opts?: { defaultWinner?: PointWinner }
): TennisGameScore {
  const defaultWinner: PointWinner = opts?.defaultWinner ?? "top";
  let score: TennisGameScore = { top: 0, bottom: 0 };

  for (const s of videoSections) {
    const winner = (s.summary?.player_won_point ?? defaultWinner) as PointWinner;
    score = awardPointWithMeta(score, winner, true).score;

    if (s.id === selectedSectionId) break;
  }

  return score;
}

// ✅ FIXED: divider IDs are the sections whose DISPLAYED score is 15-0 or 0-15
// i.e., the first point of a game in your UI.
export function computeNewGameStartSectionIds(
  videoSections: VideoSection[],
  opts?: { defaultWinner?: PointWinner }
): Set<number> {
  const defaultWinner: PointWinner = opts?.defaultWinner ?? "top";

  let score: TennisGameScore = { top: 0, bottom: 0 };
  let prevWasFirstPoint = false;

  const newGameStarts = new Set<number>();

  for (const s of videoSections) {
    const winner = (s.summary?.player_won_point ?? defaultWinner) as PointWinner;

    // Use the SAME behavior as your UI scoreboard: carryFirstPointOnWin = true
    const res = awardPointWithMeta(score, winner, true);
    score = res.score;

    const isFirstPointDisplayed =
      (score.top === 15 && score.bottom === 0) ||
      (score.top === 0 && score.bottom === 15);

    // Add divider BEFORE this section if it's the first point of a game (as displayed)
    // Guard prevents accidental double-marking.
    if (isFirstPointDisplayed && !prevWasFirstPoint) {
      newGameStarts.add(s.id);
    }

    prevWasFirstPoint = isFirstPointDisplayed;
  }

  return newGameStarts;
}
