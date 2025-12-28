import * as Sentry from "@sentry/nextjs";
import type { Player } from "@/util/interfaces";

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

export async function fetchConnectedPlayers(email: string, signal?: AbortSignal): Promise<Player[]> {
  const res = await fetch(`/api/getConnection?email=${encodeURIComponent(email)}`, {
    method: "GET",
    signal,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`getConnection failed: ${res.status} ${res.statusText}${txt ? ` — ${txt}` : ""}`);
  }

  const json: unknown = await res.json();
  if (!isConnectionResponse(json)) return [];

  if (json.error) Sentry.captureException(json.error);

  // We expect `connection` to be an array of Player objects.
  // We do NOT cast to PlayerDataAray here; we only need the list of Player.
  return Array.isArray(json.connection) ? (json.connection as Player[]) : [];
}
