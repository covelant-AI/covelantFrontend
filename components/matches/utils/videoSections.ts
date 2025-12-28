export type VideoSectionLite = {
  startTime: number;
  endTime: number;
};

function isVideoSectionLite(x: unknown): x is VideoSectionLite {
  if (typeof x !== "object" || x === null) return false;
  const r = x as Record<string, unknown>;
  return typeof r.startTime === "number" && typeof r.endTime === "number";
}

// Your interface currently says videoSections?: any[]
// We *do not change that file*, but we normalize safely here (no new any)
export function normalizeVideoSections(input: unknown): VideoSectionLite[] {
  if (!Array.isArray(input)) return [];
  return input.filter(isVideoSectionLite);
}
