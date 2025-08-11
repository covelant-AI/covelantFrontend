"use client";
import React, { useRef, useState, useEffect, useMemo, MouseEvent } from "react";
import { ProgressBar } from "./ProgressBar";
import VolumeControl from "./progressBarUI/VolumeControl";
import SettingsMenu from "./progressBarUI/SettingsMenu";
import { CustomVideoPlayerProps, MatchEventData } from "@/util/interfaces";
import { COLOR_MAP, ICON_MAP } from "@/util/default";
import Image from "next/image";
import {
  formattedMatchEventType,
  formattedTacticEventType,
  formattedFoulsEventType,
  formattedPhysicalEventType,
  formattedConditionType,
} from "@/util/services";

export default function CustomVideoPlayer({
  src,
  markers,
  durationOverride,
  onTimeUpdate,
  timeStamp,
  onDeleteTag,
}: CustomVideoPlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(durationOverride || 0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [clickCount, setClickCount] = useState<number>(0);
  const [lastHoveredTime, setLastHoveredTime] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);

  /* ========= Helpers ========= */
  const mmss = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const BottomBlur: React.FC<{ className?: string }> = ({ className = "" }) => (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 ${className}`}
    >
      {/* Blurred + darkened layer; mask makes it fade to 0 at the top */}
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm md:backdrop-blur"
        style={{
          WebkitMaskImage:
            "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskImage:
            "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          maskRepeat: "no-repeat",
          maskSize: "100% 100%",
        }}
      />
    </div>
  );

  /* ========= Effects ========= */
  // 1) Load metadata + time updates (kept same logic)
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

  /* ========= Actions (same logic) ========= */
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

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const pct = Number(e.target.value) / 100;
    v.currentTime = pct * duration;
  };

  const toggleFullscreen = () => {
    const c = containerRef.current;
    if (!c) return;
    if (!document.fullscreenElement) {
      c.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  // 5) Convert DB markers (unchanged logic, wrapped for clarity)
  const marksWithOffsets = useMemo(() => {
    return (markers as MatchEventData[])
      .map((m) => {
        const offsetSeconds = m.eventTimeSeconds;
        if (typeof offsetSeconds !== "number") return null;

        let label = "";
        switch (m.category) {
          case "MATCH":
            label = formattedMatchEventType[m.matchType!] || m.matchType!;
            break;
          case "TACTIC":
            label = formattedTacticEventType[m.tacticType!] || m.tacticType!;
            break;
          case "FOULS":
            label = formattedFoulsEventType[m.foulType!] || m.foulType!;
            break;
          case "PHYSICAL":
            label =
              formattedPhysicalEventType[m.physicalType!] || m.physicalType!;
            break;
          case "NOTE":
            label = m.noteType!;
            break;
        }

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
        };
      })
      .filter(
        (x): x is {
          id: number;
          offsetSeconds: number;
          color: string;
          label: string;
          lablePath: string;
          condition: string;
          comment: string;
        } => x !== null
      );
  }, [markers]);

  // Pre-sorted copies (readability + small perf)
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
    if (now - lastClickTime < 500) setClickCount((p) => p + 1);
    else setClickCount(1);
    setLastClickTime(now);

    const previousTags = marksDesc.filter((m) => m.offsetSeconds < currentTime);
    if (previousTags.length > 0) {
      const skipIndex = Math.min(clickCount, previousTags.length - 1);
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

  const onProgressMouseMove = (e: MouseEvent<HTMLDivElement>) => {
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
  };

  // 9) Auto-hover near currentTime (unchanged logic)
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
  }, [currentTime, lastHoveredTime, marksWithOffsets]);

  const onProgressMouseLeave = () => setHoveredIndex(null);

  /* ========= Render (single branch; classes vary) ========= */
  const controlsBottom = isFullscreen ? "bottom-15" : "bottom-2";

  return (
    <div className={isFullscreen ? "w-full max-w-[700px] mx-auto flex flex-col space-y-4" : "w-full mx-auto flex flex-col space-y-4"}>
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

        {/* Blur/gradient overlay with fade-to-0 */}
        <BottomBlur className="h-16 md:h-20" />

        {/* Time / Fullscreen */}
        <div
          className={`absolute ${controlsBottom} right-3 cursor-pointer bg-opacity-60 px-2 py-1 rounded-lg z-20`}
        >
          <span className="text-white text-lg flex flex-row justify-center items-center space-x-2">
            <div className="text-white text-sm">
              {mmss(currentTime)} / {mmss(duration)}
            </div>

              <SettingsMenu />
              <VolumeControl videoRef={videoRef} />

            <Image
              src="/icons/fullscreen.svg"
              alt="Toggle fullscreen"
              width={24}
              height={24}
              className="text-white text-lg hover:scale-[1.15] active:scale-[1.05]"
              onClick={toggleFullscreen}
            />
          </span>
        </div>

        {/* Progress bar (unchanged logic) */}
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
        />

        {/* Left controls */}
        <div
          className={`absolute ${controlsBottom} left-3 flex justify-center space-x-3 z-20`}
        >
          <button
            onClick={togglePlay}
            className="text-white p-1 text-2xl hover:scale-[1.1] active:scale-[1.01] cursor-pointer"
          >
            {isPlaying ? "❚❚" : "►"}
          </button>
          <button
            onClick={skipToPreviousTag}
            className="text-white rounded-md hover:scale-[1.1] active:scale-[1.01] cursor-pointer"
          >
            <Image
              src="/icons/leftSkip.svg"
              alt="Skip to previous tag"
              width={24}
              height={24}
            />
          </button>
          <button
            onClick={skipToNextTag}
            className="text-white rounded-md hover:scale-[1.1] active:scale-[1.01] cursor-pointer"
          >
            <Image
              src="/icons/rightSkip.svg"
              alt="Skip to next tag"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
