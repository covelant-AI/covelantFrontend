import { Player } from "@/generated/prisma";

export interface Props {
  activePlayer: Player | null;
  setActivePlayer: (player: Player | null) => void;
}

export interface sidePanelDashboardProps {
  activePlayer: Player | null;
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