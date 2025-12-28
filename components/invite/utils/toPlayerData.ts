import type { PlayerData } from "@/util/interfaces";

type UnknownRecord = Record<string, unknown>;

function isRecord(v: unknown): v is UnknownRecord {
  return typeof v === "object" && v !== null;
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asNumber(v: unknown, fallback = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

/**
 * SearchUser can return a variety of shapes.
 * We only accept objects that at minimum have a numeric id.
 */
export function isSelectableUser(v: unknown): v is UnknownRecord & { id: number } {
  return isRecord(v) && typeof v.id === "number";
}

export function toPlayerData(user: UnknownRecord & { id: number }): PlayerData {
  return {
    id: user.id,
    avatar: asString(user.avatar, ""),
    age: asNumber(user.age, 0),
    dominantHand: asString(user.dominantHand, ""),
    email: asString(user.email, ""),
    firstName: asString(user.firstName, ""),
    lastName: asString(user.lastName, ""),
  };
}
