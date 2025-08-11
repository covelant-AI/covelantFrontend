"use client";
import React, { useRef, useState, useEffect, useMemo, MouseEvent } from "react";
import { ProgressBar } from "./ProgressBar";
import { CustomVideoPlayerProps, MatchEventData } from "@/util/interfaces";
import { COLOR_MAP, ICON_MAP } from "@/util/default";
import Image from 'next/image';
import { 
  formattedMatchEventType, 
  formattedTacticEventType, 
  formattedFoulsEventType, 
  formattedPhysicalEventType, 
  formattedConditionType 
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(durationOverride || 0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [lastClickTime, setLastClickTime] = useState<number>(0);  // Time of last click
  const [clickCount, setClickCount] = useState<number>(0); 
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
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
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
      // Use mappings based on category
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
          label = formattedPhysicalEventType[m.physicalType!] || m.physicalType!;
          break;
        case "NOTE":
          label = m.noteType!;
          break;
      }

      // Map the condition type using formattedConditionType
      const condition = formattedConditionType[m.condition as keyof typeof formattedConditionType] || m.condition;

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

  // 6) Skip to Previous Tag
  const skipToPreviousTag = () => {
    const now = Date.now(); 

    if (now - lastClickTime < 500) { // 500ms buffer time (can be adjusted)
      setClickCount((prev) => prev + 1); 
    } else {
      setClickCount(1); // Reset the click count if the user waits too long
    }

    setLastClickTime(now); 

    const previousTags = marksWithOffsets
      .filter((m) => m.offsetSeconds < currentTime)
      .sort((a, b) => b.offsetSeconds - a.offsetSeconds);

    if (previousTags.length > 0) {
      const skipIndex = Math.min(clickCount, previousTags.length - 1);
      const closestTag = previousTags[skipIndex];

      // Update current time
      setCurrentTime(closestTag.offsetSeconds - 5); 
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

  // 9) detec tag hover when currentTime is close to tag's time
  useEffect(() => {
    const closestMarker = marksWithOffsets.find((m, i) => {
      return Math.abs(m.offsetSeconds - currentTime) < 1; 
    });

    if (closestMarker && currentTime - lastHoveredTime >= 3) {
      const tagIndex = marksWithOffsets.findIndex((m) => m.id === closestMarker.id);
      setHoveredIndex(tagIndex);
      setLastHoveredTime(currentTime); // Set the time of the last hover
      setTimeout(() => setHoveredIndex(null), 5000); 
    }
  }, [currentTime, lastHoveredTime, marksWithOffsets]);


  const onProgressMouseLeave = () => setHoveredIndex(null);

  return (
    <>
    {isFullscreen? 
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
              ? "absolute bottom-15 right-3 cursor-pointer bg-opacity-60 px-2 py-1 rounded-lg"
              : "absolute bottom-2 right-3 cursor-pointer bg-opacity-60 px-2 py-1 rounded-lg"}
              onClick={toggleFullscreen}>
            <span className="text-white text-lg flex flex-row justify-center items-center space-x-2">
              <div className="text-white text-sm">
                {Math.floor(currentTime / 60)}:
                {String(Math.floor(currentTime % 60)).padStart(2, "0")} /{" "}
                {Math.floor(duration / 60)}:
                {String(Math.floor(duration % 60)).padStart(2, "0")}
              </div>
                <Image
                  src="/icons/fullscreen.svg"
                  alt="Toggle fullscreen"
                  width={24}  
                  height={24}  
                  className="text-white text-lg hover:scale-[1.15] active:scale-[1.05] "
                  />
            </span>
          </div>
        
          {/* Arrows for navigating to the previous/next tag */}
          <div
            className="absolute bottom-15 left-3 flex justify-center space-x-1">
            <button onClick={togglePlay} className="text-white p-1 text-2xl hover:scale-[1.1] active:scale-[1.01] cursor-pointer">
              {isPlaying ? "❚❚" : "►"}
            </button>

            <button 
              onClick={skipToPreviousTag} 
              className="text-white rounded-md hover:scale-[1.1] active:scale-[1.01] cursor-pointer">
              <Image 
                src="/icons/leftSkip.svg" 
                alt="Skip to previous tag" 
                width={24} 
                height={24} 
                />
            </button>
            
            <button 
              onClick={skipToNextTag} 
              className="text-white rounded-md hover:scale-[1.1] active:scale-[1.01] cursor-pointer">
              <Image 
                src="/icons/rightSkip.svg" 
                alt="Skip to next tag" 
                width={24} 
                height={24} 
                />
            </button>
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
          onDeleteTag={onDeleteTag}
          isFullscreen={isFullscreen}
          />
          </div>
      </div>
    : ////////////////////////////////////////////////////////////////////////////////////// Minimised screen ///////////////////////////////////////////////////////////////////////////
      <div className="w-full mx-auto flex flex-col space-y-4">
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
            <div className= "absolute bottom-2 right-3 cursor-pointer bg-opacity-60 px-2 py-1 rounded-lg" onClick={toggleFullscreen}>
              <span className="text-white text-lg flex flex-row justify-center items-center space-x-2">
                <div className="text-white text-sm">
                  {Math.floor(currentTime / 60)}:
                  {String(Math.floor(currentTime % 60)).padStart(2, "0")} /{" "}
                  {Math.floor(duration / 60)}:
                  {String(Math.floor(duration % 60)).padStart(2, "0")}
                </div>
                  <Image
                    src="/icons/fullscreen.svg"
                    alt="Toggle fullscreen"
                    width={24}  
                    height={24}  
                    className="text-white text-lg hover:scale-[1.15] active:scale-[1.05] "
                    />
              </span>
            </div>
              
            {/* Arrows for navigating to the previous/next tag */}
            <div
              className= "absolute bottom-2 left-3 flex justify-center space-x-3">
              <button onClick={togglePlay} className="text-white p-1 text-2xl hover:scale-[1.1] active:scale-[1.01] cursor-pointer">
                {isPlaying ? "❚❚" : "►"}
              </button>

              <button 
                onClick={skipToPreviousTag} 
                className="text-white rounded-md hover:scale-[1.1] active:scale-[1.01] cursor-pointer">
                <Image 
                  src="/icons/leftSkip.svg" 
                  alt="Skip to previous tag" 
                  width={24} 
                  height={24} 
                  />
              </button>
              
              <button 
                onClick={skipToNextTag} 
                className="text-white rounded-md hover:scale-[1.1] active:scale-[1.01] cursor-pointer">
                <Image 
                  src="/icons/rightSkip.svg" 
                  alt="Skip to next tag" 
                  width={24} 
                  height={24} 
                  />
              </button>

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
          onDeleteTag={onDeleteTag}
          isFullscreen={isFullscreen}
          />
      </div>
    }
    </>
  );
}
