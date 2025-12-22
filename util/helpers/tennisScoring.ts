// components/game-timeline/tennisScoring.ts

export type ScoreToken = "0" | "15" | "30" | "40" | "Ad" | "-" | "W" | "L";

export interface ScoreState {
  score1: ScoreToken;
  score2: ScoreToken;
  prevScore1: ScoreToken | null;
  prevScore2: ScoreToken | null;
}

export const numericToToken = (n: number): ScoreToken => {
  if (n === 0) return "0";
  if (n === 15) return "15";
  if (n === 30) return "30";
  if (n === 40) return "40";
  return "0";
};

export const hasWinLoss = (s1: ScoreToken, s2: ScoreToken): boolean =>
  s1 === "W" || s1 === "L" || s2 === "W" || s2 === "L";

export const bothForty = (s1: ScoreToken, s2: ScoreToken): boolean =>
  s1 === "40" && s2 === "40";

export const nextBasic = (s: ScoreToken): ScoreToken => {
  switch (s) {
    case "0":
      return "15";
    case "15":
      return "30";
    case "30":
      return "40";
    case "40":
      return "W"; // only used when the other side is not 40
    default:
      return s;
  }
};

export const prevBasic = (s: ScoreToken): ScoreToken => {
  switch (s) {
    case "40":
      return "30";
    case "30":
      return "15";
    case "15":
      return "0";
    case "0":
    default:
      return "0";
  }
};

export const applyUp = (
  state: ScoreState,
  playerIndex: 1 | 2
): ScoreState => {
  let { score1, score2, prevScore1, prevScore2 } = state;

  const self = playerIndex === 1 ? score1 : score2;
  const other = playerIndex === 1 ? score2 : score1;

  // Deuce (40–40) → Advantage
  if (bothForty(score1, score2)) {
    if (playerIndex === 1) {
      score1 = "Ad";
      score2 = "-";
    } else {
      score1 = "-";
      score2 = "Ad";
    }
    return { score1, score2, prevScore1, prevScore2 };
  }

  // Ad → Win / Lose (store previous full state)
  if (self === "Ad") {
    prevScore1 = score1;
    prevScore2 = score2;

    if (playerIndex === 1) {
      score1 = "W";
      score2 = "L";
    } else {
      score1 = "L";
      score2 = "W";
    }
    return { score1, score2, prevScore1, prevScore2 };
  }

  // "-" → back to 40–40
  if (self === "-") {
    score1 = "40";
    score2 = "40";
    return { score1, score2, prevScore1, prevScore2 };
  }

  // Normal 40 when other < 40 → game won (store previous state)
  if (self === "40" && other !== "40") {
    prevScore1 = score1;
    prevScore2 = score2;

    if (playerIndex === 1) {
      score1 = "W";
      score2 = "L";
    } else {
      score1 = "L";
      score2 = "W";
    }
    return { score1, score2, prevScore1, prevScore2 };
  }

  // Normal increment 0 → 15 → 30 → 40
  const next = nextBasic(self);
  if (playerIndex === 1) score1 = next;
  else score2 = next;

  return { score1, score2, prevScore1, prevScore2 };
};

export const applyDown = (
  state: ScoreState,
  playerIndex: 1 | 2
): ScoreState => {
  let { score1, score2, prevScore1, prevScore2 } = state;

  const self = playerIndex === 1 ? score1 : score2;
  const other = playerIndex === 1 ? score2 : score1;

  // If we are currently in W/L, revert to previous state if known
  if (hasWinLoss(score1, score2)) {
    if (prevScore1 !== null && prevScore2 !== null) {
      score1 = prevScore1;
      score2 = prevScore2;
    } else {
      // fallback if no previous scores saved
      score1 = "40";
      score2 = "40";
    }
    return { score1, score2, prevScore1: null, prevScore2: null };
  }

  // Ad ↓ or "-" ↓ → back to 40–40
  if (self === "Ad" || self === "-") {
    score1 = "40";
    score2 = "40";
    return { score1, score2, prevScore1, prevScore2 };
  }

  // Normal decrement: 40 → 30 → 15 → 0
  const prev = prevBasic(self);
  if (playerIndex === 1) score1 = prev;
  else score2 = prev;

  // In Ad/- situations the "other" might be "-" or "Ad"; we leave it as-is.
  if (other === "-" || other === "Ad") {
    // no extra changes needed
  }

  return { score1, score2, prevScore1, prevScore2 };
};
