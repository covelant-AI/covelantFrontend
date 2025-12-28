// components/matches/services/gameTimelineApi.ts
export type UpdateSectionPayload = {
  id: number;
  startTime: number;
  endTime: number;
};

export type UpdateSectionResponse = {
  success: boolean;
};

function isUpdateSectionResponse(value: unknown): value is UpdateSectionResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    (value as { success?: unknown }).success === true
  );
}

export async function updateSectionTime(payload: UpdateSectionPayload): Promise<boolean> {
  const res = await fetch("/api/updateSections", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: unknown = await res.json().catch(() => null);
  return isUpdateSectionResponse(data);
}
