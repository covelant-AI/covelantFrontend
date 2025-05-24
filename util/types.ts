export type Player = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  winRate: number;
  avatar: string;
  coachId: number;
};

export type Match = {
  id: number
  title: string
  imageUrl: string
}