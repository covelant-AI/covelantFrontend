"use client";

import { useMemo, useRef } from "react";
import type { UIMark } from "./useTagMarks";

type UseTagSkipsArgs = {
  videoRef: React.RefObject<HTMLVideoElement>;
  marksWithOffsets: UIMark[];
  currentTime: number;
  setCurrentTime: (t: number) => void;
};

export function useTagSkips({
  videoRef,
  marksWithOffsets,
  currentTime,
  setCurrentTime,
}: UseTagSkipsArgs) {
  const lastClickTime = useRef<number>(0);
  const clickCount = useRef<number>(0);

  const marksAsc = useMemo(
    () => [...marksWithOffsets].sort((a, b) => a.offsetSeconds - b.offsetSeconds),
    [marksWithOffsets]
  );
  const marksDesc = useMemo(
    () => [...marksWithOffsets].sort((a, b) => b.offsetSeconds - a.offsetSeconds),
    [marksWithOffsets]
  );

  const skipToPreviousTag = () => {
    const now = Date.now();
    if (now - lastClickTime.current < 500) clickCount.current += 1;
    else clickCount.current = 1;
    lastClickTime.current = now;

    const previousTags = marksDesc.filter((m) => m.offsetSeconds < currentTime);
    if (previousTags.length > 0) {
      const skipIndex = Math.min(clickCount.current, previousTags.length - 1);
      const closest = previousTags[skipIndex];

      setCurrentTime(closest.offsetSeconds - 5);
      if (videoRef.current) videoRef.current.currentTime = closest.offsetSeconds;
    }
  };

  const skipToNextTag = () => {
    const next = marksAsc.find((m) => m.offsetSeconds > currentTime);
    if (next) {
      setCurrentTime(next.offsetSeconds - 5);
      if (videoRef.current) videoRef.current.currentTime = next.offsetSeconds;
    }
  };

  return { skipToPreviousTag, skipToNextTag };
}
