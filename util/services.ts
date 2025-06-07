export function getRandomStatValue(): number {
  return Math.floor(Math.random() * 101); // 0 to 100
}

export function getRandomResult(): "win" | "loss" | "draw" {
  const results = ["win", "loss", "draw"];
  return results[Math.floor(Math.random() * results.length)] as
    | "win"
    | "loss"
    | "draw";
}

export function getRandomType(): "tournament" | "friendly" | "training" | "league" {
  const types = ["tournament", "friendly", "training", "league"];
  return types[
    Math.floor(Math.random() * types.length)
  ] as "tournament" | "friendly" | "training" | "league";
}

export function getRandomCountry(): string {
  const countries = [
    "USA",
    "Japan",
    "Germany",
    "Brazil",
    "Kenya",
    "India",
    "France",
    "Canada",
  ];
  return countries[Math.floor(Math.random() * countries.length)];
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomAvgDuration(): number {
  return parseFloat((Math.random() * (60 - 10) + 10).toFixed(2));
}

export function parseTimeToSeconds(ts: string) {
  const [m, s] = ts.split(":").map((n) => parseInt(n) || 0);
  return m * 60 + s;
};

export function formatSeconds(sec: number): string {
  const total = Math.floor(sec);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
