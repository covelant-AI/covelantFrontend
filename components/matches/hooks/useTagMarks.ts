"use client";

import { useMemo } from "react";
import type { MatchEventData } from "@/util/interfaces";
import { COLOR_MAP, ICON_MAP } from "@/util/default";
import {
  formattedMatchEventType,
  formattedTacticEventType,
  formattedFoulsEventType,
  formattedPhysicalEventType,
  formattedConditionType,
} from "@/util/services";

export type UIMark = {
  id: number;
  offsetSeconds: number;
  color: string;
  label: string;
  lablePath: string;
  condition: string;
  comment: string;
};

function toLabel(m: MatchEventData): string {
  switch (m.category) {
    case "MATCH":
      return formattedMatchEventType[m.matchType!] || m.matchType!;
    case "TACTIC":
      return formattedTacticEventType[m.tacticType!] || m.tacticType!;
    case "FOULS":
      return formattedFoulsEventType[m.foulType!] || m.foulType!;
    case "PHYSICAL":
      return formattedPhysicalEventType[m.physicalType!] || m.physicalType!;
    case "NOTE":
      return m.noteType!;
  }
}

export function useTagMarks(markers: MatchEventData[]) {
  return useMemo(() => {
    return markers
      .map((m) => {
        const offsetSeconds = m.eventTimeSeconds;
        if (typeof offsetSeconds !== "number") return null;

        const label = toLabel(m);

        const condition =
          formattedConditionType[
            m.condition as keyof typeof formattedConditionType
          ] || m.condition;

        return {
          id: m.id,
          offsetSeconds,
          color: COLOR_MAP[m.category] || "#9CA3AF",
          label,
          lablePath: ICON_MAP[m.category] || ICON_MAP.COMMENT,
          condition,
          comment: m.comment || "",
        } satisfies UIMark;
      })
      .filter((x): x is UIMark => x !== null);
  }, [markers]);
}
