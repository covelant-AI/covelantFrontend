"use client";
import React, { useRef, useState, useEffect, useMemo, MouseEvent} from "react";
import {CustomVideoPlayerProps, MatchEventData} from "@/util/interfaces"
import {COLOR_MAP,ICON_MAP} from "@/util/default"
import Image from "next/image"

export default function CustomVideoPlayer({
  src,
  markers,
  durationOverride,
  onTimeUpdate,
}: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(durationOverride || 0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 1) Load metadata + time updates
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onLoaded = () => { if (!durationOverride) setDuration(v.duration); };
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
    if (!document.fullscreenElement) c.requestFullscreen().then(() => setIsPlaying(true));
    else document.exitFullscreen().then(() => setIsPlaying(false));
  };


  // 5) Convert DB markers to { offsetSeconds, color, label, lablePath }
  const marksWithOffsets = useMemo(() => {
    return (markers as MatchEventData[])
      .map((m) => {
        const offsetSeconds = m.eventTimeSeconds;
        if (typeof offsetSeconds !== "number") return null;

        // 2) label = the subtype or, for comments, the comment text
        let label = "";
        switch (m.category) {
          case "MATCH":    label = m.matchType!; break;
          case "TACTIC":   label = m.tacticType!; break;
          case "FOULS":    label = m.foulType!; break;
          case "PHYSICAL": label = m.physicalType!; break;
          case "COMMENT":  label = m.commentText || m.comment || ""; break;
        }

        return {
          offsetSeconds,
          color: COLOR_MAP[m.category] || "#9CA3AF",
          label,
          lablePath: ICON_MAP[m.category] || ICON_MAP.COMMENT,
        };
      })
      .filter((x): x is {
        offsetSeconds: number;
        color: string;
        label: string;
        lablePath: string;
      } => x !== null);
  }, [markers]);

  // 6) Hover detection
  const onProgressMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!progressContainerRef.current || duration <= 0) { setHoveredIndex(null); return; }
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
      <div ref={containerRef} className="relative bg-black rounded-t-2xl overflow-hidden pt-[56.25%]">
        <video ref={videoRef} src={src} className="absolute inset-0 w-full h-full object-contain" preload="metadata" controls={false} />
        <div className="absolute top-2 left-3 bg-black bg-opacity-60 px-2 py-1 rounded text-white text-sm font-bold pointer-events-none">#WTT Macao</div>
        <div className="absolute bottom-2 right-3 cursor-pointer bg-black bg-opacity-60 px-2 py-1 rounded" onClick={toggleFullscreen}>
          <span className="text-white text-lg">⛶</span>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="bg-white rounded-b-2xl flex items-center px-3 py-2 gap-3 bg-[#D4EBEA]">
        <button onClick={togglePlay} className="text-black text-lg">
          {isPlaying ? "❚❚" : "►"}
        </button>

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

          {/* Diamonds */}
          {marksWithOffsets.map((m, i) => (
            <div
              key={i}
              className="absolute w-[12px] h-[12px] transform rotate-45 rounded-sm border border-black"
              style={{
                left: `calc(${(m.offsetSeconds / duration) * 100}% - 6px)`,
                top: "-2px",
                backgroundColor: m.color,
                maskSize: "cover",
                WebkitMaskSize: "cover",
              }}
              aria-hidden
            />
          ))}

          {/* Tooltip */}
          {hoveredIndex !== null && (
            <div
              className="absolute top-7 left-0 transform -translate-x-1/2 bg-white border-2 border-teal-600 rounded-full px-4 py-2 flex items-center space-x-2 shadow-lg"
              style={{
                left: `calc(${(marksWithOffsets[hoveredIndex].offsetSeconds / duration) * 100}% - 0px)`,
              }}
            >
              <Image
                src={marksWithOffsets[hoveredIndex].lablePath}
                alt=""
                width={16} 
                height={16} 
                className="flex-shrink-0"
              />
              <span className="text-sm font-medium text-black">
                {marksWithOffsets[hoveredIndex].label}
              </span>
            </div>
          )}
        </div>

        <div className="text-black text-xs whitespace-nowrap">
          {Math.floor(currentTime / 60)}:
          {String(Math.floor(currentTime % 60)).padStart(2, "0")} /{" "}
          {Math.floor(duration / 60)}:
          {String(Math.floor(duration % 60)).padStart(2, "0")}
        </div>
      </div>
    </div>
    
  );
}

