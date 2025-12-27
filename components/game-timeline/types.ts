// components/game-timeline/types.ts

export interface Player {
  id: number;
  name: string;
  short: string;
  bg: string;
  ring: string;
  avatar?: string; // 👈 add this
}

export type TimelineEvent = {
  id: number;
  playerId: number;
  label?: string;
};


export type DomainPlayer = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  age: number;
  dominantHand: string;
  height: number;
  winRate: number;
  stats: unknown[];
  playerMatchesFirst: unknown[];
  playerMatchesSecond: unknown[];
  coaches: unknown[];
  overallStats: unknown | null;
  scorePoints: unknown[];
  matchMetrics: unknown[];
};

export type PlayerWonPoint = "top" | "bottom" | null;

export type SectionSummary = {
  player_won_point: PlayerWonPoint;
  rally_size: number;
  valid_rally: boolean;
} | null;

export type VideoSection = {
  id: number;
  matchId: number;
  startTime: number;
  endTime: number;
  summary?: SectionSummary; // ✅ updated
};

export interface GameTimelineEditorProps {
  playerOne: DomainPlayer;
  playerTwo: DomainPlayer;
  videoSections: VideoSection[];
  /** bubble up so parent can seek video */
  onSeekVideo?: (timeSeconds: number) => void;
}

export interface TimeInputsProps {
  startTime: string; // "MM:SS"
  endTime: string;   // "MM:SS"
  onStartChange: (value: string) => void;
  onEndChange: (value: string) => void;
  onSave: () => void;        // 🔥 triggers update request
  isSaving?: boolean;        // optional UI state
}