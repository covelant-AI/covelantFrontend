import React, { MouseEvent, useState, useEffect } from "react";
import ExpandedBubble from "./progressBarUI/ExpandedBubble";
import HoverTooltip from "./progressBarUI/HoverTooltip"; 

export const ProgressBar: React.FC<ProgressBarProps> = ({
  duration,
  marks,
  progressRef,
  progressContainerRef,
  hoveredIndex,
  onSeek,
  onProgressMouseMove,
  onProgressMouseLeave,
  isPlaying,
  togglePlay,
  onDeleteTag,
  currentTime,
  isFullscreen,
}) => {
  const [localMarks, setLocalMarks] = useState(marks);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggleOpen = (i: number | null) => {
    setOpenIndex(i); 
  };

  useEffect(() => {
    setLocalMarks(marks);
  }, [marks]);

  return (
    <div
      className={`flex items-center rounded-xl px-3 py-3 gap-3 bg-gray-100 ${
        isFullscreen ? 'fixed bottom-0 w-full z-50 bg-gray-700 ' : '' 
      }`}>
      {/* Play/Pause Button */}
      <button onClick={togglePlay} className="text-black text-lg">
        {isPlaying ? "❚❚" : "►"}
      </button>

      {/* Progress Bar Container */}
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
          className="w-full h-1 bg-gray-700 rounded-3xl cursor-pointer accent-[#6EB6B3]"
        />

        {/* Diamonds */}
        {localMarks.map((m, i) => (
          <div
            key={m.id}
            onClick={() => {
              if (openIndex !== i) {
                toggleOpen(i); // Only open if it's not already open
              } else {
                toggleOpen(null); // Close the bubble if the same tag is clicked
              }
            }}
            className={`absolute w-[10px] h-[10px] transform rotate-45 rounded-xs border cursor-pointer ${
              openIndex === i
                ? "border-[#6EB6B3] bg-white cursor-pointer"
                : "border-black"
            }`}
            style={{
              left: `calc(${(m.offsetSeconds / duration) * 100 * 0.97}% + 6px)`,
              top: "-14px",
              backgroundColor: openIndex === i ? "#FFF" : m.color,
              transition: "background-color 0.2s, border-color 0.2s",
            }}
          />
        ))}

        {/* HoverTooltip for all tags (no disable condition) */}
        {localMarks.map((m, i) => (
          <HoverTooltip
            key={m.id}
            hoveredIndex={hoveredIndex}
            localMarks={localMarks}
            duration={duration}
            disableHoverTooltip={false}  // Tooltip is always enabled now
          />
        ))}

        {/* ExpandedBubble for tag details */}
        <ExpandedBubble
          openIndex={openIndex}
          localMarks={localMarks}
          duration={duration}
          onDeleteTag={onDeleteTag}
          toggleBubble={toggleOpen}
        />
      </div>

      <div className="text-black text-xs whitespace-nowrap">
        {Math.floor(currentTime / 60)}:
        {String(Math.floor(currentTime % 60)).padStart(2, "0")} /{" "}
        {Math.floor(duration / 60)}:
        {String(Math.floor(duration % 60)).padStart(2, "0")}
      </div>
    </div>
  );
};


/////////////////////////////////////////////////////////////////// PROPS /////////////////////////////////////////////////////////////////////////////////
export interface ProgressBarProps {
  duration: number;
  marks: Array<{
    id: number;
    offsetSeconds: number;
    color: string;
    label: string;
    lablePath: string;
    condition?: string;
    comment: string;
  }>;
  progressRef: React.RefObject<HTMLInputElement>;
  progressContainerRef: React.RefObject<HTMLDivElement>;
  hoveredIndex: number | null;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProgressMouseMove: (e: MouseEvent<HTMLDivElement>) => void;
  onProgressMouseLeave: () => void;
  isPlaying: boolean;
  togglePlay: () => void;
  onDeleteTag: (id: number) => void;
  currentTime:number;
  isFullscreen: boolean;
}
