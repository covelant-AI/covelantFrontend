export async function deleteConnection(params: {
  email: string;
  id: number;
  signal?: AbortSignal;
}): Promise<unknown> {
  const res = await fetch(`/api/deleteConnection?email=${encodeURIComponent(params.email)}`, {
    method: "DELETE",
    signal: params.signal,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: params.id }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`deleteConnection failed: ${res.status} ${res.statusText}${txt ? ` — ${txt}` : ""}`);
  }

  // server returns updatedData (players/coaches etc.)
  return res.json().catch(() => ({}));
}
