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