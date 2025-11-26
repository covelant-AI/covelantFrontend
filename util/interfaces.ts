import {Dispatch, ReactNode, SetStateAction } from 'react';
import {
  User as FirebaseUser,
} from 'firebase/auth';

export interface UserData {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  avatar?: string;
  age?: number;
  dominantHand?: string;
}

export interface Profile {
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  type: string;
}

export interface WinOutcome {
  id:number,
  match: Match,
  result: string,
}

export interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

export interface MatchDisplay {   // Displayed matches on Dashboard
  id: number;
  title: string;
  imageUrl: string;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface Props {
  activePlayer: Player | null;
  setActivePlayer: (player: Player | null) => void;
}

export interface SidePanelDashboardProps {
  activePlayer: Player | null;
}

export interface PlayerDataAray {
  player: [PlayerData];
}

export interface UploadVideoProps {
  onVideoUpload: (videoURL: string, videoThumbnail: string) => void;
}

export interface MetricPoint {
  eventTimeSeconds: number;
  value: number;
}

export interface FirebaseError{
  code : string,
  message: string
}

export interface PayloadGraph{
  value: string;
}

export interface AISummaryProps {
  ballSpeeds: MetricPoint[];
  playerSpeeds: MetricPoint[];
  longestRallies: MetricPoint[];
  strikesEff: MetricPoint[];
  eventTime: number;
}

export interface MainTagManagerProps {
  videoId: number;
  timeStamp: number;
  onAddTag: (tag: any) => void;
}

export interface Scorer {
  id: number;
  firstName: string;
  lastName: string;
  avatar?: string;
  type: "PLAYER" | "OPPONENT";
}


export interface EventRecord {
  setNumber: number;
  gamePoint: number;
  matchPoint: number;
  eventTimeSeconds: number;
  scorer: Scorer;
}

export interface TennisScoreBoardProps {
  events: EventRecord[] | { [key: string]: EventRecord };
  eventTime: number;
  rounds?: number[];
  playerTwo?: { avatar?: string; firstName?: string };
  playerOne?: { avatar?: string; firstName?: string };
}

export interface PlayerData {  // use in ListAllThletes
  id: number;
  age: number;
  avatar: string;
  dominantHand: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface MainPerformanceTrackerProps {
  videoId: number;
  playerOne: PlayerData;
  playerTwo: PlayerData;
  matchTime: number;
}

export interface RadialBlurBgProps {
    background: string;
    width: string;
    height: string;
    rotate: string;
    top?: number | string;
    left?: number | string;
    bottom?: number;
    right?: number;
}

export interface MatchEventData {
  id: number;
  matchId: number;
  category: 'MATCH' | 'TACTIC' | 'FOULS' | 'PHYSICAL' | 'NOTE';
  comment: string | null;
  commentText: string | null;
  condition: 'UNDER_PRESSURE' | 'CONFIDENT' | 'FOCUSED' | 'LOST_FOCUS' | 'MOMENTUM_SHIFT' | 'CLUTCH_PLAY' | 'FATIGUE_SIGNS';
  createdAt: string; 
  eventTimeSeconds: number;
  foulType: string | null;
  matchType: string;
  noteType: string;
  physicalType: string | null;
  tacticType: string | null;
}

export interface CustomVideoPlayerProps {
  src: string;
  videoStartTime: string;
  markers: MatchEventData[];
  durationOverride?: number;
  timeStamp?: number; 
  lablePath?: string;
  onTimeUpdate?: (currentTime: number) => void;
  onDeleteTag: (id: number) => void;
  videoSections?: any[];
}


// Enums & Models (from schema)
export enum EventCategory {
  Match    = "Match",
  Tactic   = "Tactic",
  Fouls    = "Fouls",
  Physical = "Physical",
  Note     = "Note",
}

export enum MatchEventType {
  FIRST_SERVE   = "FIRST_SERVE",
  SECOND_SERVE  = "SECOND_SERVE",
  BREAK_POINT   = "BREAK_POINT",
  GAME_POINT    = "GAME_POINT",
  SET_POINT     = "SET_POINT",
  TIEBREAK      = "TIEBREAK",
  START_OF_SET  = "START_OF_SET",
}

export enum TacticEventType {
  SERVE_VOLLEY         = "SERVE_VOLLEY",
  BASELINE_RALLY       = "BASELINE_RALLY",
  DROP_SHOT            = "DROP_SHOT",
  NET_PLAY             = "NET_PLAY",
  CROSS_COURT_RALLY    = "CROSS_COURT_RALLY",
  DOWN_THE_LINE_SHOT   = "DOWN_THE_LINE_SHOT",
  OPPONENT_PULLED_WIDE = "OPPONENT_PULLED_WIDE",
}

export enum FoulsEventType {
  UNFORCED_ERROR    = "UNFORCED_ERROR",
  FORCED_ERROR      = "FORCED_ERROR",
  DOUBLE_FAULT      = "DOUBLE_FAULT",
  FOOT_FAULT        = "FOOT_FAULT",
  NET_TOUCH         = "NET_TOUCH",
  RACKET_VIOLATION  = "RACKET_VIOLATION",
}

export enum PhysicalEventType {
  FATIGUE_SIGN    = "FATIGUE_SIGN",
  SLOW_RECOVERY   = "SLOW_RECOVERY",
  INJURY_CONCERN  = "INJURY_CONCERN",
  GOOD_MOVEMENT   = "GOOD_MOVEMENT",
  POOR_FOOTWORK   = "POOR_FOOTWORK",
}

export enum ConditionType {
  UNDER_PRESSURE  = "UNDER_PRESSURE",
  CONFIDENT       = "CONFIDENT",
  FOCUSED         = "FOCUSED",
  LOST_FOCUS      = "LOST_FOCUS",
  MOMENTUM_SHIFT  = "MOMENTUM_SHIFT",
  CLUTCH_PLAY     = "CLUTCH_PLAY",
  FATIGUE_SIGNS   = "FATIGUE_SIGNS",
}

export enum MetricType {
  BALL_SPEED     = "BALL_SPEED",
  PLAYER_SPEED   = "PLAYER_SPEED",
  LONGEST_RALLY  = "LONGEST_RALLY",
  STRIKES_EFF    = "STRIKES_EFF",
  NOTE           = "NOTE",
}

export interface Player {
  id: number;
  firstName: string 
  lastName: string 
  email: string;
  avatar: string 
  age: number 
  dominantHand: string;
  height: number;
  winRate: number;
  stats: PlayerStat[];
  playerMatchesFirst: PlayerMatch[];
  playerMatchesSecond: PlayerMatch[];
  coaches: Coach[];
  overallStats: OverallStats | null;
  scorePoints: ScorePoint[];
  matchMetrics: MatchMetric[];
}

export interface Coach {
  id: number;
  firstName: string;
  lastName: string;
  avatar: string | null;
  email: string;
  team: string | null;
  age: number | null;
  players: Player[];
}

export type User = Player | Coach;  // used for Athlete and coach selector
export type OpponentSearch = Opponent | Player;

export interface GetOpponentSearch{
  data: Player[],
  message: 'Player and Opponent Data'
}

export interface OpponentSelectorProps {  // used in OpponentSelector
  onSelect: (user: Player) => void
  selected: Player | null
}


export interface GetUsersSearch { // used for player or coach searches
  data: User[]           
  message: 'Player Data' | 'Coach Data'
}

export interface MatchDataProps {
  onDataChange: (data: {
    matchType: string;
    fieldType: string;
    date: string;
    winner: 'playerOne' | 'playerTwo' | null;
  }) => void;
  playerOne: Player;
  playerTwo: Player;
}


export interface PlayerSelectorProps {
  onSelect: Dispatch<SetStateAction<Player | null>>
}


export interface PlayerStat {
  id: number;
  subject: string;
  value: number;
  playerId: number;
  player: Player;
}

export interface OverallStats {
  id: number;
  wins: number;
  losses: number;
  setsWon: number;
  setsLost: number;
  totalMatches: number;
  avgMatchDuration: number;
  playerId: number;
  player: Player;
}

export interface Match {
  id: number;
  videoUrl: string | null;
  imageUrl: string | null;
  type: string | null;
  result: string | null;
  fieldType: string | null;
  status: string | null;
  date: Date;
  videoType: string;
  playerMatches: PlayerMatch[];
  events: MatchEvent[];
  scorePoints: ScorePoint[];
  matchMetrics: MatchMetric[];
}

export interface StatMatch {
  id: number;
  condition: string | null;
}

export interface Opponent {
  id: number;
  firstName: string;
  lastName: string;
  playerMatches: PlayerMatch[];
  scorePoints: ScorePoint[];
}

export interface PlayerMatch {
  id: number;
  matchId: number;
  result: string;
  match: Match;
  playerId: number | null;
  player: Player | null;
  playerTwoId: number | null;
  playerTwo: Player | null;
  opponentId: number | null;
  opponent: Opponent | null;
}

export interface ScorePoint {
  id: number;
  matchId: number;
  match: Match;
  playerId: number | null;
  player: Player | null;
  opponentId: number | null;
  opponent: Opponent | null;
  setNumber: number;
  gamePoint: number;
  matchPoint: number;
  eventTimeSeconds: number;
  createdAt: Date;
}

export interface MatchMetric {
  id: number;
  matchId: number;
  match: Match;
  playerId: number | null;
  player: Player | null;
  metricType: MetricType;
  value: number;
  eventTimeSeconds: number;
  createdAt: Date;
}

export interface MatchEvent {
  id: number;
  matchId: number;
  match: Match;
  category: EventCategory;
  comment: string | null;
  matchType: MatchEventType | null;
  tacticType: TacticEventType | null;
  foulType: FoulsEventType | null;
  physicalType: PhysicalEventType | null;
  commentText: string | null;
  condition: ConditionType | null;
  eventTimeSeconds: number;
  createdAt: Date;
}