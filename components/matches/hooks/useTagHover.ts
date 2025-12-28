"use client";

import { useCallback, useEffect } from "react";
import type { UIMark } from "./useTagMarks";

type UseTagHoverArgs = {
  duration: number;
  marksWithOffsets: UIMark[];
  currentTime: number;

  lastHoveredTime: number;
  setLastHoveredTime: (t: number) => void;

  progressContainerRef: React.RefObject<HTMLDivElement>;
  setHoveredIndex: (idx: number | null) => void;
};

export function useTagHover({
  duration,
  marksWithOffsets,
  currentTime,
  lastHoveredTime,
  setLastHoveredTime,
  progressContainerRef,
  setHoveredIndex,
}: UseTagHoverArgs) {
  const onProgressMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressContainerRef.current || duration <= 0) {
        setHoveredIndex(null);
        return;
      }

      const rect = progressContainerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const barW = rect.width;

      let found: number | null = null;
      for (let i = 0; i < marksWithOffsets.length; i++) {
        const m = marksWithOffsets[i];
        const x = (m.offsetSeconds / duration) * barW;
        if (Math.abs(mouseX - x) < 8) {
          found = i;
          break;
        }
      }
      setHoveredIndex(found);
    },
    [duration, marksWithOffsets, progressContainerRef, setHoveredIndex]
  );

  const onProgressMouseLeave = useCallback(() => setHoveredIndex(null), [setHoveredIndex]);

  // Auto-hover near currentTime (same logic)
  useEffect(() => {
    const closest = marksWithOffsets.find(
      (m) => Math.abs(m.offsetSeconds - currentTime) < 1
    );

    if (closest && currentTime - lastHoveredTime >= 3) {
      const tagIndex = marksWithOffsets.findIndex((m) => m.id === closest.id);
      setHoveredIndex(tagIndex);
      setLastHoveredTime(currentTime);

      const id = setTimeout(() => setHoveredIndex(null), 5000);
      return () => clearTimeout(id);
    }
  }, [
    currentTime,
    lastHoveredTime,
    marksWithOffsets,
    setHoveredIndex,
    setLastHoveredTime,
  ]);

  return { onProgressMouseMove, onProgressMouseLeave };
}
