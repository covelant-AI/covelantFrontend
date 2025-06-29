import React from "react";
import Image from "next/image";

interface HoverTooltipProps {
  hoveredIndex: number | null;
  localMarks: Array<{
    id: number;
    offsetSeconds: number;
    label: string;
    lablePath: string;
    condition?: string;
    comment: string;
  }>;
  duration: number;
  disableHoverTooltip: boolean; // New prop to disable tooltip
}

const HoverTooltip: React.FC<HoverTooltipProps> = ({
  hoveredIndex,
  localMarks,
  duration,
  disableHoverTooltip, 
}) => {
  if (disableHoverTooltip || hoveredIndex === null || !localMarks[hoveredIndex]) return null;

  const mark = localMarks[hoveredIndex];

  return (
    <div
      onMouseMove={(e) => e.stopPropagation()}
      className="absolute -top-15 left-0 transform -translate-x-1/2 bg-white border-2 border-teal-600 rounded-full px-4 py-2 flex items-center space-x-2 shadow-lg"
      style={{
        left: `calc(${(mark.offsetSeconds / duration) * 100}% - 0px)`,
      }}
    >
      <Image
        src={mark.lablePath}
        alt=""
        width={16}
        height={16}
        className="flex-shrink-0"
      />
      <span className="text-sm font-medium text-black">{mark.label}</span>
    </div>
  );
};

export default HoverTooltip;

