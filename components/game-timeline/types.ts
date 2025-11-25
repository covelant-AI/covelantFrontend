export type Player = {
  id: number;
  name: string;
  short: string;
  bg: string;   // Tailwind background class
  ring: string; // Tailwind ring class
};

export type TimelineEvent = {
  id: number;
  playerId: number;
  label?: string;
};
