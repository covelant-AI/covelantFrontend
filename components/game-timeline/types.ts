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

/** VideoSection type based on your example */
export type VideoSection = {
  id: number;
  matchId: number;
  startIndex: number;
  endIndex: number;
  startTime: number; // seconds
  endTime: number; 
  summary: {
    player_won_point: "top" | "bottom";
  }  // seconds
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