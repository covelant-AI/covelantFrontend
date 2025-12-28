import type {
  Player as AppPlayer,
  PlayerData,
  MatchEventData,
  AnalysisStatus,
  VideoSection as AppVideoSection,
} from "@/util/interfaces";

/**
 * Game Timeline UI types (local)
 */
export type TimelinePlayer = {
  id: number;
  name: string;
  short: string;
  bg: string;
  ring: string;
  avatar?: string;
};

/**
 * Game Timeline section type (DB/timeline shape)
 */
export type TimelineSection = {
  id: number; // ✅ required (fixes the editor mismatch)
  matchId?: number;
  startIndex: number;
  endIndex: number;
  startTime: number;
  endTime: number;
};

export type GameTimelineEditorProps = {
  playerOne: PlayerData;
  playerTwo: PlayerData;
  videoSections: TimelineSection[];
  onSeekVideo?: (timeSeconds: number) => void;
};

/**
 * Matches page types (use App types)
 */
export type MatchMeta = {
  id: number;
  date: string | null;
  analysisStatus: AnalysisStatus | null;
  videoUrlPath: string; // firebase storage path
  playerOne: AppPlayer; // ✅ uses util/interfaces Player
  playerTwo: AppPlayer; // ✅ uses util/interfaces Player
};

export type MatchPageState = {
  loading: boolean;

  videoUrl: string | null;
  videoStart: string | null;
  videoId: number;

  currentVideoTime: number;

  playerOne: AppPlayer;
  playerTwo: AppPlayer;

  markers: MatchEventData[];
  videoSections: AppVideoSection[]; // ✅ uses util/interfaces VideoSection
  mode: boolean;

  analysisStatus: AnalysisStatus | null;
};
