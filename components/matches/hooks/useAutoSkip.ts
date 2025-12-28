"use client";

import { useEffect } from "react";
import type { VideoSectionLite } from "../utils/videoSections";

type UseAutoSkipArgs = {
  enabled: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  videoSections: VideoSectionLite[];
};

export function useAutoSkip({ enabled, videoRef, videoSections }: UseAutoSkipArgs) {
  useEffect(() => {
    if (!enabled) return;

    let isSkipping = false;

    const skipToNextSection = () => {
      if (isSkipping) return;
      isSkipping = true;

      const v = videoRef.current;
      if (!v) return;

      const nextSection = videoSections.find((section) => section.startTime > v.currentTime);
      if (nextSection) v.currentTime = nextSection.startTime;

      setTimeout(() => {
        isSkipping = false;
      }, 100);
    };

    const handleTimeUpdate = () => {
      const v = videoRef.current;
      if (!v) return;

      const currentTime = v.currentTime;

      const currentSection = videoSections.find(
        (section) => currentTime >= section.startTime && currentTime <= section.endTime
      );

      if (currentSection) {
        if (currentTime >= currentSection.endTime) skipToNextSection();
      } else {
        skipToNextSection();
      }
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        video.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [enabled, videoRef, videoSections]);
}
