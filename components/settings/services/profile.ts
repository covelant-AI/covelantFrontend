import type { ProfileForm } from "../types/types";

type GetUserResponse = {
  error?: unknown;
  data?: Record<string, unknown>;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asNumber(v: unknown, fallback = 0): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  return fallback;
}

export async function fetchUserProfile(email: string): Promise<{ form?: ProfileForm; error?: unknown }> {
  const res = await fetch(`/api/getUser?email=${encodeURIComponent(email)}`, {
    headers: { "Content-Type": "application/json" },
  });

  const json: unknown = await res.json().catch(() => ({}));
  if (!isRecord(json)) return {};

  const data = json as GetUserResponse;
  if (data.error) return { error: data.error };

  const payload = data.data;
  if (!isRecord(payload)) return {};

  const loadedForm: ProfileForm = {
    firstName: asString(payload.firstName, ""),
    lastName: asString(payload.lastName, ""),
    dominantHand: asString(payload.dominantHand, "Right Handed"),
    age: asNumber(payload.age, 0),
    height: asNumber(payload.height, 0),
    email: asString(payload.email, ""),
    avatar: asString(payload.avatar, "/images/default-avatar.png"),
  };

  return { form: loadedForm };
}

export async function updateUserProfile(payload: Record<string, unknown>): Promise<Response> {
  return fetch("/api/updateUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}
