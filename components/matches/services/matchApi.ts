import * as Sentry from "@sentry/nextjs";
import type { Player, AnalysisStatus, MatchEventData,VideoSection } from "@/util/interfaces";
import type { MatchMeta } from "../types/types";

type GetMatchVideoResponse = {
  success?: boolean;
  data?: {
    id: number;
    date?: string;
    analysisStatus?: AnalysisStatus;
    videoUrl: string;
    playerMatches: Array<{
      player: Player;
      playerTwo: Player;
    }>;
  };
};

type GetMatchSectionsResponse = {
  data?: unknown[];
};

type GetTagsResponse = {
  data?: MatchEventData[];
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function asGetMatchVideoResponse(v: unknown): GetMatchVideoResponse | null {
  return isRecord(v) ? (v as GetMatchVideoResponse) : null;
}

function asGetMatchSectionsResponse(v: unknown): GetMatchSectionsResponse | null {
  return isRecord(v) ? (v as GetMatchSectionsResponse) : null;
}

function asGetTagsResponse(v: unknown): GetTagsResponse | null {
  return isRecord(v) ? (v as GetTagsResponse) : null;
}

export async function fetchMatchMeta(matchId: number): Promise<MatchMeta | null> {
  const vidRes = await fetch(`/api/getMatchVideo?id=${encodeURIComponent(matchId)}`);
  const vidJson: unknown = await vidRes.json().catch(() => null);

  const parsed = asGetMatchVideoResponse(vidJson);
  if (!parsed?.success || !parsed.data) {
    Sentry.captureException(vidJson ?? parsed ?? { reason: "getMatchVideo failed" });
    return null;
  }

  const vid = parsed.data;

  // preserve original indexing behavior (playerMatches[0])
  const pm0 = vid.playerMatches[0];
  const playerOne = pm0?.player;
  const playerTwo = pm0?.playerTwo;

  if (!playerOne || !playerTwo) {
    Sentry.captureException({ reason: "playerMatches[0] missing player/playerTwo", vid });
    return null;
  }

  return {
    id: vid.id,
    date: vid.date ?? null,
    analysisStatus: vid.analysisStatus ?? null,
    videoUrlPath: vid.videoUrl,
    playerOne,
    playerTwo,
  };
}

export async function fetchMatchSections(matchId: number): Promise<VideoSection[]> {
  const res = await fetch(`/api/getMatchSections?id=${encodeURIComponent(matchId)}`);
  const json: unknown = await res.json().catch(() => null);

  const parsed = asGetMatchSectionsResponse(json);
  const raw = parsed?.data;

  // keep original behavior: if data is not an array -> []
  if (!Array.isArray(raw)) return [];

  // no runtime logic change; just typed return
  return raw as VideoSection[];
}

export async function fetchTags(matchId: number): Promise<MatchEventData[]> {
  const res = await fetch(`/api/getTags?id=${encodeURIComponent(matchId)}`);
  const json: unknown = await res.json().catch(() => null);

  const parsed = asGetTagsResponse(json);
  return Array.isArray(parsed?.data) ? parsed!.data! : [];
}

export async function deleteTag(tagId: number): Promise<Response> {
  return fetch("/api/deleteTag", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: tagId }),
  });
}
