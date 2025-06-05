"use client";
// /components/CustomVideoPlayer.tsx
import React, { useRef, useState, useEffect } from "react";

interface TimestampMarker {
  /** The real‐world timestamp (ISO string) when this tag was created. */
  timestamp: string;
  /** Optional color for the diamond (any valid CSS color). Defaults to white. */
  color?: string;
}

interface CustomVideoPlayerProps {
  /** The video URL (e.g. from Firebase Storage) */
  src: string;
  /**
   * The real‐world Date/Time when this video began (ISO string).
   * Example: "2025-06-01T14:30:00Z"
   */
  videoStartTime: string;
  /**
   * An array of timestamped tags. Each one has an ISO timestamp and optional color.
   * Example: [{ timestamp: "2025-06-01T14:30:15Z", color: "cyan" }, ...]
   */
  markers: TimestampMarker[];
  /**
   * (Optional) If you already know the video’s total duration in seconds, pass it here.
   * Otherwise, the component will read `videoRef.current.duration` once metadata loads.
   */
  durationOverride?: number;
  /**
   * Callback that receives updates whenever the current playback time changes (in seconds).
   * Parent components can use this to track the video's current time.
   */
  onTimeUpdate?: (currentTime: number) => void;
}

export default function CustomVideoPlayer({
  src,
  videoStartTime,
  markers,
  durationOverride,
  onTimeUpdate,
}: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(durationOverride || 0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // 1) When <video> metadata loads, capture the true duration (unless overridden)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoadedMetadata = () => {
      if (!durationOverride) {
        setDuration(v.duration);
      }
    };
    const onTimeUpdateInternal = () => {
      const newTime = v.currentTime;
      setCurrentTime(newTime);

      // Update the slider position
      if (progressRef.current && duration > 0) {
        progressRef.current.value = ((newTime / duration) * 100).toString();
      }

      // Bubble up to parent
      if (onTimeUpdate) {
        onTimeUpdate(newTime);
      }
    };

    v.addEventListener("loadedmetadata", onLoadedMetadata);
    v.addEventListener("timeupdate", onTimeUpdateInternal);
    return () => {
      v.removeEventListener("loadedmetadata", onLoadedMetadata);
      v.removeEventListener("timeupdate", onTimeUpdateInternal);
    };
  }, [duration, durationOverride, onTimeUpdate]);

  // 2) Toggle play/pause
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

  // 3) Seek when user drags the range‐slider
  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const pct = Number(e.target.value) / 100;
    const newTime = pct * duration;
    v.currentTime = newTime;
    setCurrentTime(newTime);

    // Also notify parent immediately on manual seek
    if (onTimeUpdate) {
      onTimeUpdate(newTime);
    }
  };

  // 4) Fullscreen toggle
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => console.warn(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.warn(err));
      setIsFullscreen(false);
    }
  };

  // 5) Convert each marker’s ISO timestamp → "seconds into the video"
  const marksWithOffsets = React.useMemo(() => {
    const videoStartMs = Date.parse(videoStartTime);
    if (isNaN(videoStartMs)) {
      console.warn("Invalid videoStartTime:", videoStartTime);
      return [];
    }
    return markers
      .map((m) => {
        const markMs = Date.parse(m.timestamp);
        if (isNaN(markMs)) {
          console.warn("Invalid marker timestamp:", m.timestamp);
          return null;
        }
        const offsetSeconds = (markMs - videoStartMs) / 1000;
        return { offsetSeconds, color: m.color || "gray" };
      })
      .filter((x): x is { offsetSeconds: number; color: string } => x !== null);
  }, [videoStartTime, markers]);

  return (
    <div className="max-w-[800px] mx-auto">
      {/* ───── VIDEO FRAME ───── */}
      <div
        ref={containerRef}
        className="relative bg-black rounded-t-2xl overflow-hidden pt-[56.25%]"
      >
        <video
          ref={videoRef}
          src={src}
          className="absolute top-0 left-0 w-full h-full object-contain"
          preload="metadata"
          controls={false}
        />

        {/* Top‐Left Overlay (“#WTT Macao”) */}
        <div className="absolute top-2 left-3 bg-black bg-opacity-60 px-2 py-1 rounded text-white text-sm font-bold pointer-events-none">
          <span>#WTT Macao</span>
        </div>

        {/* Bottom‐Right Fullscreen Icon */}
        <div
          className="absolute bottom-2 right-3 cursor-pointer bg-black bg-opacity-60 px-2 py-1 rounded"
          onClick={toggleFullscreen}
        >
          <span className="text-white text-lg">⛶</span>
        </div>
      </div>

      {/* ───── CONTROL BAR (SEPARATE) ───── */}
      <div className="bg-white bg-opacity-75 rounded-b-2xl flex items-center px-3 py-2 gap-3 relative bg-[#D4EBEA]">
        {/* 1) Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="bg-transparent border-none text-black text-lg cursor-pointer"
        >
          {isPlaying ? "❚❚" : "►"}
        </button>

        {/* 2) Progress Bar + Diamond Markers */}
        <div className="relative flex-1 h-2 flex items-center">
          <input
            type="range"
            ref={progressRef}
            defaultValue={0}
            onChange={onSeek}
            className="w-full h-1 bg-gray-700 rounded outline-none cursor-pointer accent-green-500"
          />

          {/* 3) Diamond markers: place by offsetSeconds/duration */}
          {marksWithOffsets.map((m, i) => {
            if (duration <= 0) return null;
            if (m.offsetSeconds < 0 || m.offsetSeconds > duration) return null;
            const leftPct = (m.offsetSeconds / duration) * 100;
            return (
              <div
                key={i}
                className="absolute w-[12px] h-[12px] transform rotate-45 pointer-events-none rounded-sm border border-black"
                style={{
                  left: `calc(${leftPct}% - 6px)`,
                  top: "-2px",
                  backgroundColor: m.color,
                }}
              />
            );
          })}
        </div>

        {/* 4) Timestamp (e.g. “0:15 / 1:30”) */}
        <div className="text-black text-xs whitespace-nowrap">
          {Math.floor(currentTime / 60)}:
          {String(Math.floor(currentTime % 60)).padStart(2, "0")} /{" "}
          {Math.floor(duration / 60)}:
          {String(Math.floor(duration % 60)).padStart(2, "0")}
        </div>
      </div>

      {/* Inline CSS for styling the range‐thumb */}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          background-color: #D4EBEA;
          border-radius: 50%;
          margin-top: 0px;
        }
        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background-color: #D4EBEA;
          border: none;
          border-radius: 50%;
        }
        input[type="range"]::-moz-range-progress {
          background-color: #22c55e; /* Tailwind green-500 */
        }
        input[type="range"]::-moz-range-track {
          background-color: #D4EBEA; /* Tailwind gray-200-ish */
        }
      `}</style>
    </div>
  );
}


