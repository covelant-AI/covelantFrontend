export interface Player {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  avatar: string | null;
  age: number | null;
  dominantHand: string | null;
  height: number | null;
  Tier: string | null;
  winRate: number | null;
}

export type Match = {
  id: number
  title: string
  imageUrl: string
}

export type CategoryKey = "Match" | "Tactic" | "Fouls" | "Physical" | "Note";

export const CONDITION_OPTIONS = [
  { value: "", label: "Condition" },
  { value: "UNDER_PRESSURE", label: "Under Pressure" },
  { value: "CONFIDENT", label: "Confident" },
  { value: "FOCUSED", label: "Focused" },
  { value: "LOST_FOCUS", label: "Lost Focus" },
  { value: "MOMENTUM_SHIFT", label: "Momentum Shift" },
  { value: "CLUTCH_PLAY", label: "Clutch Play" },
  { value: "FATIGUE_SIGNS", label: "Fatigue Signs" },
];

// Define subtype options for each category
export const MATCH_TYPES = [
  { value: "FIRST_SERVE", label: "First Serve" },
  { value: "SECOND_SERVE", label: "Second Serve" },
  { value: "BREAK_POINT", label: "Break Point" },
  { value: "GAME_POINT", label: "Game Point" },
  { value: "SET_POINT", label: "Set Point" },
  { value: "TIEBREAK", label: "Tiebreak" },
  { value: "START_OF_SET", label: "Start of Set" },
];

export const TACTIC_TYPES = [
  { value: "SERVE_VOLLEY", label: "Serve & volley" },
  { value: "BASELINE_RALLY", label: "Baseline Rally" },
  { value: "DROP_SHOT", label: "Drop Shot" },
  { value: "NET_PLAY", label: "Net Play" },
  { value: "CROSS_COURT_RALLY", label: "Cross Court Rally" },
  { value: "DOWN_THE_LINE_SHOT", label: "Down the Line Shot" },
  { value: "OPPONENT_PULLED_WIDE", label: "Opponent Pulled Wide" },
];

export const FOULS_TYPES = [
  { value: "UNFORCED_ERROR", label: "Unforced Error" },
  { value: "FORCED_ERROR", label: "Forced Error" },
  { value: "DOUBLE_FAULT", label: "Double Fault" },
  { value: "FOOT_FAULT", label: "Foot Fault" },
  { value: "NET_TOUCH", label: "Net Touch" },
  { value: "RACKET_VIOLATION", label: "Racket Violation" },
];

export const PHYSICAL_TYPES = [
  { value: "FATIGUE_SIGN", label: "Fatigue Sign" },
  { value: "SLOW_RECOVERY", label: "Slow Recovery" },
  { value: "INJURY_CONCERN", label: "Injury Concern" },
  { value: "GOOD_MOVEMENT", label: "Good Movement" },
  { value: "POOR_FOOTWORK", label: "Poor Footwork" },
];
