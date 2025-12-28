import type { PlayerData } from "@/util/interfaces";

type ProfileType = "coach" | "player" | string;

type ConnectionResponse = {
  error?: unknown;
  connection?: unknown;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isConnectionResponse(v: unknown): v is ConnectionResponse {
  return isRecord(v);
}

export function normalizeConnections(profileType: ProfileType, json: ConnectionResponse): PlayerData[] {
  const connection = json.connection;

  if (profileType === "coach") {
    return Array.isArray(connection) ? (connection as PlayerData[]) : [];
  }

  // player -> connection[0].coaches
  if (!Array.isArray(connection) || connection.length === 0) return [];
  const first = connection[0];
  if (!isRecord(first)) return [];

  const coaches = first.coaches;
  return Array.isArray(coaches) ? (coaches as PlayerData[]) : [];
}

export async function fetchConnections(params: {
  email: string;
  profileType: ProfileType;
  signal?: AbortSignal;
}): Promise<{ data: PlayerData[]; error?: unknown }> {
  const res = await fetch(`/api/getConnection?email=${encodeURIComponent(params.email)}`, {
    method: "GET",
    signal: params.signal,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      type: params.profileType,
    },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`getConnection failed: ${res.status} ${res.statusText}${txt ? ` — ${txt}` : ""}`);
  }

  const raw: unknown = await res.json();
  if (!isConnectionResponse(raw)) return { data: [] };

  const normalized = normalizeConnections(params.profileType, raw);
  return { data: normalized, error: raw.error };
}
