export async function sendInvite(params: { email: string; player: unknown }): Promise<Response> {
  return fetch("/api/addPlayer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player: params.player, email: params.email }),
  });
}
