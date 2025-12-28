import type { Match } from "@/util/interfaces";

type MatchesResponse = {
  matches?: unknown;
  error?: unknown;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

export async function fetchMatchesForPlayer(playerId: string | number, signal?: AbortSignal): Promise<Match[]> {
  const res = await fetch(`/api/getMatches?playerId=${encodeURIComponent(String(playerId))}`, {
    method: "GET",
    signal,
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`getMatches failed: ${res.status} ${res.statusText}${txt ? ` — ${txt}` : ""}`);
  }

  const json: unknown = await res.json();
  if (!isRecord(json)) return [];

  const data = json as MatchesResponse;

  return Array.isArray(data.matches) ? (data.matches as Match[]) : [];
}
