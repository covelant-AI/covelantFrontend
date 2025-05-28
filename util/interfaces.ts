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

export type UserData = {
  id: number
  firstName?: string
  lastName?: string
  email: string
  avatar?: string
  age?: string
  dominantHand?: string
}


export type User = {
  firstName: string | undefined
  lastName: string | undefined
  avatar: any
  id: number
}

export const defaultPlayer= {
      id: 1,
      firstName: 'My First',
      lastName: 'Player',
      email: 'savejhonconnor@covelant.com',
      avatar: '/images/default-avatar.png',
      winRate: 1,
      coachId: 1,
    };

export interface UploadVideoProps {
  onVideoUpload: (videoURL: string, videoThumbnail: string) => void;
}