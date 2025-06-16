"use client";
import React, { useRef, useState, useEffect, useMemo, MouseEvent } from "react";
import { ProgressBar } from "./ProgressBar";
import { CustomVideoPlayerProps, MatchEventData } from "@/util/interfaces";
import { COLOR_MAP, ICON_MAP } from "@/util/default";

export default function CustomVideoPlayer({
  src,
  markers,
  durationOverride,
  onTimeUpdate,
  onDeleteTag,
}: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(durationOverride || 0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 1) Load metadata + time updates
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onLoaded = () => {
      if (!durationOverride) setDuration(v.duration);
    };
    const onTime = () => {
      const t = v.currentTime;
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
    if (v.paused) { v.play(); setIsPlaying(true); }
    else        { v.pause(); setIsPlaying(false); }
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
    if (!document.fullscreenElement)
      c.requestFullscreen().then(() => setIsPlaying(true));
    else document.exitFullscreen().then(() => setIsPlaying(false));
  };

  // 5) Convert DB markers to include `comment`
  const marksWithOffsets = useMemo(() => {
    return (markers as MatchEventData[])
      .map((m) => {
        const offsetSeconds = m.eventTimeSeconds;
        if (typeof offsetSeconds !== "number") return null;

        // title label
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
            label = m.noteType ;
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
          id:number;
          offsetSeconds: number;
          color: string;
          label: string;
          lablePath: string;
          condition: "UNDER_PRESSURE" | "CONFIDENT" | "FOCUSED" | "LOST_FOCUS" | "MOMENTUM_SHIFT" | "CLUTCH_PLAY" | "FATIGUE_SIGNS";
          comment: string;
        } => x !== null
      );
  }, [markers]);

  // 6) Hover detection
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
        className="relative bg-black rounded-t-2xl overflow-hidden pt-[56.25%]"
      >
        <video
          ref={videoRef}
          src={src}
          className="absolute inset-0 w-full h-full object-contain"
          preload="metadata"
          controls={false}
          onClick={togglePlay}
        />
        <div className="absolute top-2 left-3 bg-black bg-opacity-60 px-2 py-1 rounded-xl text-white text-sm font-bold pointer-events-none">
          Covelant Tech
        </div>
        <div
          className="absolute bottom-2 right-3 cursor-pointer bg-black bg-opacity-60 px-2 py-1 rounded"
          onClick={toggleFullscreen}
        >
          <span className="text-white text-lg">⛶</span>
        </div>
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
      />

    </div>
  );
}

