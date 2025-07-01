export function getRandomStatValue(): number {
  return Math.floor(Math.random() * 101); // 0 to 100
}

export function getRandomResult(): "win" | "loss" | "draw" {
  const results = ["win", "loss", "draw"];
  return results[Math.floor(Math.random() * results.length)] as
    | "win"
    | "loss"
    | "draw";
}

export function getRandomType(): "tournament" | "friendly" | "training" | "league" {
  const types = ["tournament", "friendly", "training", "league"];
  return types[
    Math.floor(Math.random() * types.length)
  ] as "tournament" | "friendly" | "training" | "league";
}

export function getRandomCountry(): string {
  const countries = [
    "USA",
    "Japan",
    "Germany",
    "Brazil",
    "Kenya",
    "India",
    "France",
    "Canada",
  ];
  return countries[Math.floor(Math.random() * countries.length)];
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomAvgDuration(): number {
  return parseFloat((Math.random() * (60 - 10) + 10).toFixed(2));
}

export function parseTimeToSeconds(ts: string) {
  const [m, s] = ts.split(":").map((n) => parseInt(n) || 0);
  return m * 60 + s;
};

export function formatSeconds(sec: number): string {
  const total = Math.floor(sec);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function resetMouseLoading(){
  document.body.style.cursor = 'default';
  const button = document.querySelector('button[type="submit"]');
  if (button) (button as HTMLButtonElement).style.cursor = 'pointer';
}

export const formattedMatchEventType = {
  FIRST_SERVE: "First Serve",
  SECOND_SERVE: "Second Serve",
  BREAK_POINT: "Break Point",
  GAME_POINT: "Game Point",
  SET_POINT: "Set Point",
  TIEBREAK: "Tiebreak",
  START_OF_SET: "Start of Set",
};

export const formattedTacticEventType = {
  SERVE_VOLLEY: "Serve Volley",
  BASELINE_RALLY: "Baseline Rally",
  DROP_SHOT: "Drop Shot",
  NET_PLAY: "Net Play",
  CROSS_COURT_RALLY: "Cross Court Rally",
  DOWN_THE_LINE_SHOT: "Down the Line Shot",
  OPPONENT_PULLED_WIDE: "Opponent Pulled Wide",
  RETURN: "Return",
};

export const formattedFoulsEventType = {
  UNFORCED_ERROR: "Unforced Error",
  FORCED_ERROR: "Forced Error",
  DOUBLE_FAULT: "Double Fault",
  FOOT_FAULT: "Foot Fault",
  NET_TOUCH: "Net Touch",
  RACKET_VIOLATION: "Racket Violation",
};

export const formattedPhysicalEventType = {
  FATIGUE_SIGN: "Fatigue Sign",
  SLOW_RECOVERY: "Slow Recovery",
  INJURY_CONCERN: "Injury Concern",
  GOOD_MOVEMENT: "Good Movement",
  POOR_FOOTWORK: "Poor Footwork",
};

export const formattedConditionType = {
  UNDER_PRESSURE: "Under Pressure",
  CONFIDENT: "Confident",
  FOCUSED: "Focused",
  LOST_FOCUS: "Lost Focus",
  MOMENTUM_SHIFT: "Momentum Shift",
  CLUTCH_PLAY: "Clutch Play",
  FATIGUE_SIGNS: "Fatigue Signs",
};



