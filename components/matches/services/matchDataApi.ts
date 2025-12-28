import type { EventRecord, MatchMetric } from "@/util/interfaces";

export type MatchDataResponse = {
  data: {
    ballSpeeds: MatchMetric[];
    playerSpeeds: MatchMetric[];
    strikesEff: MatchMetric[];
    scorePoints: EventRecord[];
  };
};

export async function fetchMatchData(videoId: number): Promise<MatchDataResponse | null> {
  const res = await fetch(`/api/getMatchData?id=${videoId}`);
  if (!res.ok) return null;

  return (await res.json()) as MatchDataResponse;
}
