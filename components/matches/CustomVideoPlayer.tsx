"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";

import { ProgressBar } from "./progressBarUI/ProgressBar";
import VolumeControl from "./progressBarUI/VolumeControl";
import SettingsMenu from "./progressBarUI/SettingsMenu";

import type { CustomVideoPlayerProps } from "@/util/interfaces";
import type { CategoryKey } from "@/util/types";

import { BottomBlur } from "./progressBarUI/BottomBlur";
import { ControlBarLeft } from "./progressBarUI/ControlBarLeft";
import { ControlBarRight } from "./progressBarUI/ControlBarRight";

import { useVideoTime } from "./hooks/useVideoTime";
import { useTagMarks } from "./hooks/useTagMarks";
import { useTagHover } from "./hooks/useTagHover";
import { useTagSkips } from "./hooks/useTagSkips";
import { useAutoSkip } from "./hooks/useAutoSkip";
import { useSyncExternalTime } from "./hooks/useSyncExternalTime";

import { normalizeVideoSections } from "./utils/videoSections";


export default function CustomVideoPlayer({
  src,
  markers,
  durationOverride,
  onTimeUpdate,
  videoSections,
  timeStamp,
  onDeleteTag,
}: CustomVideoPlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lastHoveredTime, setLastHoveredTime] = useState<number>(0);

  const [autoSkipEnabled, setAutoSkipEnabled] = useState(false);
  const [filteredTags, setFilteredTags] = useState<CategoryKey[]>([]);

  // refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);

  // normalize sections safely (no behavior change for valid data)
  const normalizedSections = useMemo(
    () => normalizeVideoSections(videoSections),
    [videoSections]
  );

  // time tracking (loadedmetadata + timeupdate)
  const { currentTime, setCurrentTime, duration, setDuration } = useVideoTime({
    videoRef,
    progressRef,
    durationOverride,
    onTimeUpdate,
  });

  // map DB markers -> UI marks (same logic, isolated)
  const marksWithOffsets = useTagMarks(markers);

  // pointer hover + auto-hover near current time (same logic)
  const { onProgressMouseMove, onProgressMouseLeave } = useTagHover({
    duration,
    marksWithOffsets,
    currentTime,
    lastHoveredTime,
    setLastHoveredTime,
    progressContainerRef,
    setHoveredIndex,
  });

  // previous/next tag skip logic (same clickCount/lastClickTime semantics)
  const { skipToPreviousTag, skipToNextTag } = useTagSkips({
    videoRef,
    marksWithOffsets,
    currentTime,
    setCurrentTime,
  });

  // auto-skip section logic (same algorithm, moved to hook)
  useAutoSkip({
    enabled: autoSkipEnabled,
    videoRef,
    videoSections: normalizedSections,
  });

  // sync external timestamp to actual video currentTime (same logic)
  useSyncExternalTime({
    videoRef,
    progressRef,
    duration,
    timeStamp,
    setCurrentTime,
  });

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;

    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }, []);

  const onSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = videoRef.current;
      if (!v) return;
      const pct = Number(e.target.value) / 100;
      v.currentTime = pct * duration;
    },
    [duration]
  );

  const toggleFullscreen = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;

    if (!document.fullscreenElement) {
      c.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  }, []);

  const handleAutoSkipToggle = useCallback(() => {
    setAutoSkipEnabled((prev) => !prev);
  }, []);

  const handleTagFilterChange = useCallback((tags: CategoryKey[]) => {
    setFilteredTags(tags);
  }, []);

  const controlsBottom = isFullscreen ? "bottom-15" : "bottom-2";

  return (
    <div
      className={
        isFullscreen
          ? "w-full max-w-[700px] mx-auto flex flex-col space-y-4"
          : "w-full mx-auto flex flex-col space-y-4"
      }
    >
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden pt-[56.25%]"
      >
        <video
          ref={videoRef}
          src={src}
          className="absolute inset-0 w-full h-full object-contain z-0"
          preload="metadata"
          controls={false}
          onClick={togglePlay}
        />

        <BottomBlur className="h-16 md:h-20" />

        <ControlBarRight
          controlsBottom={controlsBottom}
          currentTime={currentTime}
          duration={duration}
          onToggleFullscreen={toggleFullscreen}
        >
          <SettingsMenu
            onAutoSkipToggle={handleAutoSkipToggle}
            onTagFilterChange={handleTagFilterChange}
          />
          <VolumeControl videoRef={videoRef} />
        </ControlBarRight>

        <ProgressBar
          duration={duration}
          marks={marksWithOffsets}
          progressRef={progressRef}
          progressContainerRef={progressContainerRef}
          hoveredIndex={hoveredIndex}
          onSeek={onSeek}
          onProgressMouseMove={onProgressMouseMove}
          onProgressMouseLeave={onProgressMouseLeave}
          onDeleteTag={onDeleteTag}
          isFullscreen={isFullscreen}
          videoSections={videoSections} 
          FilteredTags={filteredTags}
        />

        <ControlBarLeft
          controlsBottom={controlsBottom}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
          onPrev={skipToPreviousTag}
          onNext={skipToNextTag}
        />
      </div>
    </div>
  );
}
