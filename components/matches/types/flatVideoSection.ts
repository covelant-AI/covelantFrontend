export interface FlatVideoSection {
  id: number;
  matchId: number;
  startIndex: number;
  endIndex: number;
  startTime: number;
  endTime: number;

  summary?: {
    player_won_point?: "top" | "bottom";
    rally_size?: number;
    valid_rally?: boolean;
  };
}
