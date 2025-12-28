"use client";

import React, { useEffect, useMemo, useState } from "react";

import ExpandedBubble from "./ExpandedBubble";
import WhiteBar from "./WhiteBar";
import HoverTooltip from "./HoverTooltip";

import type { CategoryKey } from "@/util/types";
import type { Mark, ProgressBarProps } from "../types/progressBarTypes";

import { colorToKey, getWrapperClass } from "../utils/progressBarHelper";
import { useDiamondPresence } from "../hooks/useDiamondPresence";

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
  const [localMarks, setLocalMarks] = useState<Mark[]>(marks);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const activeTags = (FilteredTags ?? []) as CategoryKey[];

  // Keep localMarks synced with marks (same behavior)
  useEffect(() => {
    setLocalMarks(marks);
    console.log("Marks updated:", marks);
  }, [marks]);

  // Filter marks based on selected categories (same behavior)
  const renderMarks = useMemo(() => {
    if (!activeTags.length) return localMarks;

    const set = new Set<CategoryKey>(activeTags);
    return localMarks.filter((m) => {
      const key = colorToKey(m.color);
      return key ? set.has(key) : false;
    });
  }, [localMarks, activeTags]);

  const diamondPresence = useDiamondPresence(renderMarks);
  const sections = videoSections ?? [];

  return (
    <div className={getWrapperClass(isFullscreen)}>
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

        {/* Render each white bar (unchanged) */}
        {sections.map((section, index) => (
          <WhiteBar
            key={index}
            section={section}
            duration={duration}
            progressContainerRef={progressContainerRef}
          />
        ))}

        {/* Diamonds with fade-in/out (same behavior) */}
        {Object.values(diamondPresence).map(({ mark: m, state }) => {
          const idxInFiltered = renderMarks.findIndex((x) => x.id === m.id);
          const isOpen = openIndex === idxInFiltered;

          const leftPct =
            duration > 0 ? (m.offsetSeconds / duration) * 100 * 0.98 : 0;

          return (
            <div
              key={m.id}
              onClick={() => {
                if (idxInFiltered < 0 || state !== "present") return;
                setOpenIndex((prev) => (prev !== idxInFiltered ? idxInFiltered : null));
              }}
              className={`absolute w-[10px] h-[10px] transform rotate-45 rounded-xs border cursor-pointer
                transition-all duration-200 ease-out
                ${isOpen ? "border-[#6EB6B3] bg-white scale-[1.3]" : "border-gray-600"}
                ${
                  state === "present"
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 translate-y-0.5"
                }
                ${state === "exit" ? "pointer-events-none" : ""}`}
              style={{
                left: `calc(${leftPct}% + 3px)`,
                top: "-14px",
                backgroundColor: isOpen ? "#FFF" : m.color,
              }}
            />
          );
        })}

        {/* HoverTooltip for all tags (same behavior) */}
        {renderMarks.map((m) => (
          <HoverTooltip
            key={m.id}
            hoveredIndex={hoveredIndex}
            localMarks={renderMarks}
            duration={duration}
            disableHoverTooltip={false}
          />
        ))}

        {/* ExpandedBubble for tag details (same behavior) */}
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

