import type { MetricPoint, VideoSection } from "@/util/interfaces";

export function buildRallyCounts(videoSections: VideoSection[] | undefined): MetricPoint[] {
  if (!videoSections?.length) return [];

  return videoSections
    .filter((sec) => typeof sec?.start?.time === "number" && typeof sec?.summary?.rally_size === "number")
    .map((sec) => ({
      eventTimeSeconds: sec.start.time,
      value: sec.summary.rally_size,
    }))
    .sort((a, b) => a.eventTimeSeconds - b.eventTimeSeconds);
}
