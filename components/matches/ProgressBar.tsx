import React, { MouseEvent, useState, useEffect, useMemo } from "react";
import ExpandedBubble from "./progressBarUI/ExpandedBubble";
import WhiteBar from "./progressBarUI/WhiteBar";
import {CategoryKey } from "@/util/types";
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
  onDeleteTag,
  isFullscreen,
  videoSections,
  FilteredTags,
}) => {
  const [localMarks, setLocalMarks] = useState(marks);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const activeTags = (FilteredTags ?? []) as CategoryKey[];
  const [diamondPresence, setDiamondPresence] = useState<DiamondPresence>({});
  const toggleOpen = (i: number | null) => {
    setOpenIndex(i); 
  };

  const COLOR_TO_KEY: Record<string, CategoryKey> = {
  "#FACC15": "Match",
  "#14B8A6": "Tactic",
  "#EF4444": "Fouls",
  "#38BDF8": "Physical",
  "#9CA3AF": "Note",
};

  const colorToKey = (color?: string): CategoryKey | undefined => {
  if (!color) return undefined;
  const c = color.trim().toUpperCase();
  return COLOR_TO_KEY[c];
  };

  const DIAMOND_ANIM_MS = 200;

  type PresenceState = "enter" | "present" | "exit";
  type DiamondPresence = Record<string, { mark: any; state: PresenceState }>;


  useEffect(() => {
    setLocalMarks(marks);
    console.log("Marks updated:", marks);
  }, [marks]);

  const renderMarks = useMemo(() => {
    if (!activeTags.length) return localMarks; 
    const set = new Set<CategoryKey>(activeTags);
    return localMarks.filter((m) => {
      const key = colorToKey(m.color);
      return key ? set.has(key) : false;
    });
  }, [localMarks, activeTags]);

  // Keep items around briefly to animate exit; animate new ones on enter
  useEffect(() => {
    setDiamondPresence((prev) => {
      const next: DiamondPresence = { ...prev };
      const nextIds = new Set(renderMarks.map((m: any) => String(m.id)));

      // Mark removed items as exiting
      Object.keys(prev).forEach((id) => {
        if (!nextIds.has(id) && prev[id].state !== "exit") {
          next[id] = { ...prev[id], state: "exit" };
          // remove after fade-out completes
          setTimeout(() => {
            setDiamondPresence((curr) => {
              const copy = { ...curr };
              if (copy[id]?.state === "exit") delete copy[id];
              return copy;
            });
          }, DIAMOND_ANIM_MS);
        }
      });

      // Add or update current items
      renderMarks.forEach((m: any) => {
        const id = String(m.id);
        if (!prev[id]) {
          // brand new → start at 'enter', then promote to 'present' on next frame
          next[id] = { mark: m, state: "enter" };
          requestAnimationFrame(() => {
            setDiamondPresence((curr) => {
              const item = curr[id];
              if (item && item.state === "enter") {
                return { ...curr, [id]: { ...item, state: "present" } };
              }
              return curr;
            });
          });
        } else {
          // keep latest mark data; preserve state (unless it was exiting and reappears)
          const wasExiting = prev[id].state === "exit";
          next[id] = { mark: m, state: wasExiting ? "present" : prev[id].state };
        }
      });

      return next;
    });
  }, [renderMarks]);



  return (
    <div
      className={isFullscreen? `absolute w-full bottom-1 py-4`: `absolute bottom-3 z-2 py-2
              left-24 right-40 sm:left-35 sm:right-55`}>

      {/* Progress Bar Container */}
      <div
        ref={progressContainerRef}
        className="relative flex-1 h-4 flex items-center"
        onMouseMove={onProgressMouseMove}
        onMouseLeave={onProgressMouseLeave}
      >
        <input
          type="range"
          ref={progressRef}
          defaultValue={0}
          onChange={onSeek}
          className="w-full h-[10] rounded-6xl cursor-pointer accent-[#6EB6B3] range-sm"
        />

        {/* Render each red bar */}
        {videoSections?.map((section, index) => (
          <WhiteBar
            key={index}
            section={section}
            duration={duration}
            progressContainerRef={progressContainerRef}
          />
        ))}

        {/* Diamonds with fade-in/out */}
        {Object.values(diamondPresence).map(({ mark: m, state }) => {
          // align clicks with your existing openIndex working over renderMarks
          const idxInFiltered = renderMarks.findIndex((x: any) => x.id === m.id);
          const isOpen = openIndex === idxInFiltered;
        
          return (
            <div
              key={m.id}
              onClick={() => {
                if (idxInFiltered < 0 || state !== "present") return; // ignore while exiting
                if (openIndex !== idxInFiltered) { setOpenIndex(idxInFiltered); }
                else { setOpenIndex(null); }
              }}
              className={`absolute w-[10px] h-[10px] transform rotate-45 rounded-xs border cursor-pointer
                          transition-all duration-200 ease-out
                          ${isOpen ? "border-[#6EB6B3] bg-white scale-[1.3]" : "border-gray-600"}
                          ${state === "present" ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-0.5"}
                          ${state === "exit" ? "pointer-events-none" : ""}`}
              style={{
                left: `calc(${(m.offsetSeconds / duration) * 100 * 0.98}% + 3px)`,
                top: "-14px",
                backgroundColor: isOpen ? "#FFF" : m.color,
              }}
            />
          );
        })}

        {/* HoverTooltip for all tags (no disable condition) */}
        {renderMarks.map((m, i) => (
          <HoverTooltip
            key={m.id}
            hoveredIndex={hoveredIndex}
            localMarks={renderMarks}
            duration={duration}
            disableHoverTooltip={false}
          />
        ))}


        {/* ExpandedBubble for tag details */}
        <ExpandedBubble
          openIndex={openIndex}
          localMarks={renderMarks}
          duration={duration}
          onDeleteTag={onDeleteTag}
          toggleBubble={setOpenIndex}
          isFullscreen={isFullscreen}
        />

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
  onDeleteTag: (id: number) => void;
  isFullscreen: boolean;
  videoSections?: any[];
  FilteredTags?: string[]; 
}
