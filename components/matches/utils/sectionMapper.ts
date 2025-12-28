import type { VideoSection as InterfaceVideoSection } from "@/util/interfaces";
import type { VideoSection as TimelineVideoSection } from "@/components/matches/types/gameTimelineTypes";

type DbSectionShape = {
  id: number;
  matchId: number;
  startIndex: number;
  startTime: number;
  endIndex: number;
  endTime: number;
  summary?: unknown;
};

type AiSectionShape = {
  id: number;
  matchId?: number;
  start: { index: number; time: number };
  end: { index: number; time: number };
  summary?: unknown;
};

function isDbSectionShape(s: unknown): s is DbSectionShape {
  if (typeof s !== "object" || s === null) return false;
  const o = s as Record<string, unknown>;
  return (
    typeof o.id === "number" &&
    typeof o.startIndex === "number" &&
    typeof o.startTime === "number" &&
    typeof o.endIndex === "number" &&
    typeof o.endTime === "number" &&
    typeof o.matchId === "number"
  );
}

function isAiSectionShape(s: unknown): s is AiSectionShape {
  if (typeof s !== "object" || s === null) return false;
  const o = s as Record<string, unknown>;
  const start = o.start as Record<string, unknown> | undefined;
  const end = o.end as Record<string, unknown> | undefined;

  return (
    typeof o.id === "number" &&
    !!start &&
    typeof start.index === "number" &&
    typeof start.time === "number" &&
    !!end &&
    typeof end.index === "number" &&
    typeof end.time === "number"
  );
}

export function toTimelineVideoSections(
  sections: InterfaceVideoSection[],
  fallbackMatchId: number
): TimelineVideoSection[] {
  return sections
    .map((raw): TimelineVideoSection | null => {
      // ✅ If it already matches DB shape (your example), keep it
      if (isDbSectionShape(raw)) {
        return {
          id: raw.id,
          matchId: raw.matchId,
          startIndex: raw.startIndex,
          startTime: raw.startTime,
          endIndex: raw.endIndex,
          endTime: raw.endTime,
          // pass-through if timeline types include it
          summary: (raw as unknown as { summary?: TimelineVideoSection["summary"] }).summary,
        };
      }

      // ✅ Otherwise support AI nested shape
      if (isAiSectionShape(raw)) {
        return {
          id: raw.id,
          matchId: typeof raw.matchId === "number" ? raw.matchId : fallbackMatchId,
          startIndex: raw.start.index,
          startTime: raw.start.time,
          endIndex: raw.end.index,
          endTime: raw.end.time,
          summary: (raw as unknown as { summary?: TimelineVideoSection["summary"] }).summary,
        };
      }

      return null;
    })
    .filter((s): s is TimelineVideoSection => s !== null);
}
