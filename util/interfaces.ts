import { Player } from "@/generated/prisma";

export interface Props {
  activePlayer: Player | null;
  setActivePlayer: (player: Player | null) => void;
}

export interface sidePanelDashboardProps {
  activePlayer: Player | null;
}

export type MatchDataProps = {
  onDataChange: (data: {
    playerOne: User | null
    playerTwo: User | null
    matchType: string
    fieldType: string
    date: string
  }) => void
}

export interface PlayerData {
  id?: number;       
  avatar?: string;
  firstName?: string;
  lastName?: string;
  coaches?: any;   
}

export type UserData = {
  id: number
  firstName?: string
  lastName?: string
  email: string
  avatar?: string
  age?: number,
  dominantHand?: string
}

export const defaultUserData = {
  id: 0,
  firstName: "Jhon",
  lastName: "Doe",
  email: "TeamCovelant@covelant.com",
  avatar: "/images/default-avatar.png",
  age: 21,
  dominantHand: "Right Handed"
}

export interface profile {
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  type: string;
}


export type User = {
  firstName: string | undefined
  lastName: string | undefined
  avatar: any
  id: number
}

export const defaultPlayer1 = {
  id: 1,
  firstName: 'No Player',
  lastName: 'Selected',
  email: 'john.doe@example.com',
  winRate: 0.5,
  avatar: '/images/default-avatar.png',
  coachId: 1,
  age: 25,
  dominantHand: 'right',
  height: 180,
  Tier: 'Beginner',
};


export const defaultPlayer: Player = {
  id: 1010101010101010101010101010,
  firstName: null,
  lastName: null,
  email: '',
  avatar: '/images/default-avatar.png',
  age: null,
  dominantHand: null,
  height: null,
  Tier: null,
  winRate: null,
};

export interface ConnectionSortProps {
  playerCount: number;
  safePlayerData: PlayerData[];
}

export interface UploadVideoProps {
  onVideoUpload: (videoURL: string, videoThumbnail: string) => void;
}

export interface MainTagManagerProps {
  videoId: number;
  timeStamp: number;
  onAddTag: (tag: any) => void;
}