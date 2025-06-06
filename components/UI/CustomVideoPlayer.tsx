"use client";
// /components/CustomVideoPlayer.tsx
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  MouseEvent,
} from "react";

interface TimestampMarker {
  /** The real‐world timestamp (ISO string) when this tag was created. */
  timestamp: string;
  /** Optional color for the diamond (any valid CSS color). Defaults to gray. */
  color?: string;
  /** Optional label or message to show on hover */
  label?: string;
   /** Optional label or message to show on hover */
  lablePath?:string;
}

interface CustomVideoPlayerProps {
  /** The video URL (e.g. from Firebase Storage) */
  src: string;
  /**
   * The real‐world Date/Time when this video began (ISO string).
   */
  videoStartTime: string;
  /**
   * An array of timestamped tags. Each one has an ISO timestamp, optional color, and optional hover label.
   */
  markers: TimestampMarker[];
  /**
   * (Optional) If you already know the video’s total duration in seconds, pass it here.
   */
  durationOverride?: number;
  /**
   * Callback that receives updates whenever the current playback time changes (in seconds).
   */
  lablePath?: string;
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
  const progressContainerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(durationOverride || 0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
  const marksWithOffsets = useMemo(() => {
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
        return {
          offsetSeconds,
          color: m.color || "gray",
          label: m.label || `Tag at ${Math.floor(offsetSeconds / 60)}:${String(
            Math.floor(offsetSeconds % 60)
          ).padStart(2, "0")}`,
          lablePath: m.lablePath
        };
      })
      .filter(
        (x): x is { offsetSeconds: number; color: string; label: string; lablePath:string } =>
          x !== null
      );
  }, [videoStartTime, markers]);

  // 6) Handle mouse movement over the progress container to detect hover near diamonds
  const onProgressMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!progressContainerRef.current || duration <= 0) {
      setHoveredIndex(null);
      return;
    }
    const rect = progressContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left; // x within progress bar
    const barWidth = rect.width;

    // Check each marker’s left position
    let foundIndex: number | null = null;
    marksWithOffsets.forEach((m, idx) => {
      const leftPx = (m.offsetSeconds / duration) * barWidth;
      // If mouse is within 6px of the diamond’s center
      if (Math.abs(mouseX - leftPx) <= 6) {
        foundIndex = idx;
      }
    });
    setHoveredIndex(foundIndex);
  };

  const onProgressMouseLeave = () => {
    setHoveredIndex(null);
  };

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
        <div
          ref={progressContainerRef}
          className="relative flex-1 h-2 flex items-center"
          onMouseMove={onProgressMouseMove}
          onMouseLeave={onProgressMouseLeave}
        >
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
            return (
              <div
                key={i}
                className="absolute w-[12px] h-[12px] transform rotate-45 rounded-sm border border-black"
                style={{
                  left: `calc(${(m.offsetSeconds / duration) * 100}% - 6px)`,
                  top: "-2px",
                  backgroundColor: m.color,
                }}
                // pointer-events none so video bar remains interactive
                aria-hidden="true"
              />
            );
          })}

          {/* 4) Tooltip */}
          {hoveredIndex !== null && (
            <div
              className="absolute top-7 left-0 transform -translate-x-1/2 bg-white border-2 border-teal-600 rounded-full px-4 py-2 flex items-center space-x-2 shadow-lg"
              style={{
                left: `calc(${
                  (marksWithOffsets[hoveredIndex].offsetSeconds / duration) * 100
                }% - 0px)`,
              }}
            >
              
              {/* Example SVG icon; swap `src` with your dynamic path */}
              <img
                src={marksWithOffsets[hoveredIndex].lablePath}
                alt="icon"
                className="w-4 h-4 flex-shrink-0"
              />

              {/* Label text */}
              <span className="text-sm font-medium text-black">
                {marksWithOffsets[hoveredIndex].label}
              </span>
            </div>
          )}

        </div>

        {/* 5) Timestamp (e.g. “0:15 / 1:30”) */}
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
          background-color: #d4ebea;
          border-radius: 50%;
          margin-top: 0px;
        }
        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background-color: #d4ebea;
          border: none;
          border-radius: 50%;
        }
        input[type="range"]::-moz-range-progress {
          background-color: #22c55e; /* Tailwind green-500 */
        }
        input[type="range"]::-moz-range-track {
          background-color: #d4ebea; /* Tailwind gray-200-ish */
        }
      `}</style>
    </div>
  );
}
