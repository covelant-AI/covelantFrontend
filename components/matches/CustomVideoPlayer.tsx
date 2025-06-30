"use client";
import React, { useRef, useState, useEffect, useMemo, MouseEvent } from "react";
import { ProgressBar } from "./ProgressBar";
import { CustomVideoPlayerProps, MatchEventData } from "@/util/interfaces";
import { COLOR_MAP, ICON_MAP } from "@/util/default";
import Image from 'next/image';

export default function CustomVideoPlayer({
  src,
  markers,
  durationOverride,
  onTimeUpdate,
  timeStamp,
  onDeleteTag,
}: CustomVideoPlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(durationOverride || 0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lastHoveredTime, setLastHoveredTime] = useState<number>(0);

  // 1) Load metadata + time updates
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
  }, [duration, durationOverride, onTimeUpdate]);

  // 2) Play/pause
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  // 3) Seek
  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const pct = Number(e.target.value) / 100;
    v.currentTime = pct * duration;
  };

  // 4) Fullscreen
  const toggleFullscreen = () => {
    const c = containerRef.current;
    if (!c) return;
    if (!document.fullscreenElement) {
      c.requestFullscreen().then(() => {
        setIsFullscreen(true);
        console.log("Fullscreen enabled");
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        console.log("Fullscreen disabled");
      });
    }
  };

  // 5) Convert DB markers to include `comment`
  const marksWithOffsets = useMemo(() => {
    return (markers as MatchEventData[])
      .map((m) => {
        const offsetSeconds = m.eventTimeSeconds;
        if (typeof offsetSeconds !== "number") return null;

        let label = "";
        switch (m.category) {
          case "MATCH":
            label = m.matchType!;
            break;
          case "TACTIC":
            label = m.tacticType!;
            break;
          case "FOULS":
            label = m.foulType!;
            break;
          case "PHYSICAL":
            label = m.physicalType!;
            break;
          case "NOTE":
            label = m.noteType;
            break;
        }

        return {
          id: m.id,
          offsetSeconds,
          color: COLOR_MAP[m.category] || "#9CA3AF",
          label,
          lablePath: ICON_MAP[m.category] || ICON_MAP.COMMENT,
          condition: m.condition,
          comment: m.comment || "",
        };
      })
      .filter(
        (x): x is {
          id: number;
          offsetSeconds: number;
          color: string;
          label: string;
          lablePath: string;
          condition: "UNDER_PRESSURE" | "CONFIDENT" | "FOCUSED" | "LOST_FOCUS" | "MOMENTUM_SHIFT" | "CLUTCH_PLAY" | "FATIGUE_SIGNS";
          comment: string;
        } => x !== null
      );
  }, [markers]);
// 6) Skip to Previous Tag
const skipToPreviousTag = () => {
  const closestTag = marksWithOffsets
    .filter((m) => m.offsetSeconds < currentTime) // Get tags before current time
    .sort((a, b) => b.offsetSeconds - a.offsetSeconds)[0]; // Get the closest one

  if (closestTag) {
    setCurrentTime(closestTag.offsetSeconds-5);  // Set the video to the previous tag's time
    if (videoRef.current) videoRef.current.currentTime = closestTag.offsetSeconds;
  }
};

// 7) Skip to Next Tag
const skipToNextTag = () => {
  const closestTag = marksWithOffsets
    .filter((m) => m.offsetSeconds > currentTime) // Get tags after current time
    .sort((a, b) => a.offsetSeconds - b.offsetSeconds)[0]; // Get the closest one

  if (closestTag) {
    setCurrentTime(closestTag.offsetSeconds-5);  // Set the video to the next tag's time
    if (videoRef.current) videoRef.current.currentTime = closestTag.offsetSeconds;
  }
};

  // 8) Hover detection
  const onProgressMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!progressContainerRef.current || duration <= 0) {
      setHoveredIndex(null);
      return;
    }
    const rect = progressContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const barW = rect.width;
    let found: number | null = null;
    marksWithOffsets.forEach((m, i) => {
      const x = (m.offsetSeconds / duration) * barW;
      if (Math.abs(mouseX - x) < 8) found = i;
    });
    setHoveredIndex(found);
  };

  const onProgressMouseLeave = () => setHoveredIndex(null);

  return (
    <div className="w-full max-w-[700px] mx-auto flex flex-col space-y-4">
      {/* VIDEO */}
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
        <div
          className={isFullscreen
            ? "absolute bottom-15 right-3 cursor-pointer hover:scale-[1.05] active:scale-[1.01]  bg-opacity-60 px-2 py-1 rounded-lg"
            : "absolute bottom-2 right-3 cursor-pointer hover:scale-[1.05] active:scale-[1.01] bg-opacity-60 px-2 py-1 rounded-lg"}
          onClick={toggleFullscreen}>
          <span className="text-white text-lg hover:scale-[1.15]">
              <Image
                src="/icons/fullscreen.svg"
                alt="Toggle fullscreen"
                width={24}   // Set the desired width
                height={24}  // Set the desired height
                className="text-white text-lg hover:scale-[1.15]"
              />
          </span>
        </div>
        
        {/* Arrows for navigating to the previous/next tag */}
        <div
          className={isFullscreen
            ? "absolute bottom-15 left-3 flex justify-center space-x-1"
            : "absolute bottom-2 left-3 flex justify-center space-x-1"}>
          <button 
            onClick={skipToPreviousTag} 
            className="px-4 py-2  text-white rounded-md hover:scale-[1.1] active:scale-[1.01] cursor-pointer">
            <Image 
              src="/icons/leftSkip.svg" 
              alt="Skip to previous tag" 
              width={24} 
              height={24} 
            />
          </button>
          <button 
            onClick={skipToNextTag} 
            className="px-4 py-2  text-white rounded-md hover:scale-[1.1] active:scale-[1.01] cursor-pointer">
            <Image 
              src="/icons/rightSkip.svg" 
              alt="Skip to next tag" 
              width={24} 
              height={24} 
            />
          </button>
        </div>

        {isFullscreen?
          <ProgressBar
          duration={duration}
          marks={marksWithOffsets}
          progressRef={progressRef}
          progressContainerRef={progressContainerRef}
          hoveredIndex={hoveredIndex}
          onSeek={onSeek}
          onProgressMouseMove={onProgressMouseMove}
          onProgressMouseLeave={onProgressMouseLeave}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          onDeleteTag={onDeleteTag}
          currentTime={currentTime}
          isFullscreen={isFullscreen} />
          : <></> }
        </div>

      {/* VIDEO & TAG CONTROLS */}
      <ProgressBar
        duration={duration}
        marks={marksWithOffsets}
        progressRef={progressRef}
        progressContainerRef={progressContainerRef}
        hoveredIndex={hoveredIndex}
        onSeek={onSeek}
        onProgressMouseMove={onProgressMouseMove}
        onProgressMouseLeave={onProgressMouseLeave}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        onDeleteTag={onDeleteTag}
        currentTime={currentTime}
        isFullscreen={isFullscreen}
      />
    </div>
  );
}
