import { ProfileType, ApiPayload, ConnectionItem, isRecord } from '@/util/types/heroSection/ConnectionBoxTypes';
/**
 * Convert whatever the API returns into the array the UI needs.
 * - coach: expects `connection` to be an array of players
 * - player: expects `connection[0].coaches` to be an array of coaches
 */
export function normalizeConnectionToItems(profileType: ProfileType, payload: ApiPayload): ConnectionItem[] {
  const c = payload.connection;

  // coach => connection is array of players
  if (profileType === 'coach') {
    return Array.isArray(c) ? (c as ConnectionItem[]) : [];
  }

  // player => connection[0].coaches is array
  if (!Array.isArray(c) || c.length === 0) return [];
  const first = c[0];

  if (!isRecord(first)) return [];
  const coaches = first.coaches;

  return Array.isArray(coaches) ? (coaches as ConnectionItem[]) : [];
}

export async function fetchConnections(params: {
  email: string;
  profileType: ProfileType;
  signal: AbortSignal;
}): Promise<ApiPayload> {
  const res = await fetch(`/api/getConnection?email=${encodeURIComponent(params.email)}`, {
    method: 'GET',
    signal: params.signal,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      type: params.profileType,
    },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`getConnection failed: ${res.status} ${res.statusText}${txt ? ` — ${txt}` : ''}`);
  }

  const json: unknown = await res.json();
  return isRecord(json) ? (json as ApiPayload) : {};
}