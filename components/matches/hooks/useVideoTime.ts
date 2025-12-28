"use client";

import { useEffect, useState } from "react";

type UseVideoTimeArgs = {
  videoRef: React.RefObject<HTMLVideoElement>;
  progressRef: React.RefObject<HTMLInputElement>;
  durationOverride?: number;
  onTimeUpdate?: (currentTime: number) => void;
};

export function useVideoTime({
  videoRef,
  progressRef,
  durationOverride,
  onTimeUpdate,
}: UseVideoTimeArgs) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationOverride || 0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoaded = () => {
      if (!durationOverride) setDuration(v.duration);
    };

    const onTime = () => {
      const t = v.currentTime;
      setCurrentTime(t);

      if (progressRef.current && duration > 0) {
        progressRef.current.value = ((t / duration) * 100).toString();
      }

      onTimeUpdate?.(t);
    };

    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("timeupdate", onTime);

    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("timeupdate", onTime);
    };
  }, [duration, durationOverride, onTimeUpdate, progressRef, videoRef]);

  return { currentTime, setCurrentTime, duration, setDuration };
}
