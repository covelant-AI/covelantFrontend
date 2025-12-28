"use client";

import { useEffect } from "react";

type UseSyncExternalTimeArgs = {
  videoRef: React.RefObject<HTMLVideoElement>;
  progressRef: React.RefObject<HTMLInputElement>;
  duration: number;
  timeStamp?: number;
  setCurrentTime: (t: number) => void;
};

export function useSyncExternalTime({
  videoRef,
  progressRef,
  duration,
  timeStamp,
  setCurrentTime,
}: UseSyncExternalTimeArgs) {
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (typeof timeStamp !== "number") return;
    if (duration <= 0) return;

    if (Math.abs(v.currentTime - timeStamp) < 0.25) return;

    v.currentTime = timeStamp;
    setCurrentTime(timeStamp);

    if (progressRef.current) {
      progressRef.current.value = ((timeStamp / duration) * 100).toString();
    }
  }, [timeStamp, duration, progressRef, setCurrentTime, videoRef]);
}
