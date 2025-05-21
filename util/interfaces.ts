import { Player } from "@/generated/prisma";

export interface Props {
  activePlayer: Player | null;
  setActivePlayer: (player: Player | null) => void;
}

export const defaultPlayer= {
      id: 1,
      firstName: 'My First',
      lastName: 'Player',
      email: 'savejhonconnor@covelant.com',
      avatar: '/images/default-avatar.png',
      coachId: 1,
    };